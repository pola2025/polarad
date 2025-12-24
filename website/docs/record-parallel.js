const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// 설정
const TOTAL_DURATION = 47;
const FPS = 30; // 30fps로 줄여서 속도 2배
const WIDTH = 1080;
const HEIGHT = 1920;
const SEGMENTS = 4; // 4개 병렬 처리

const htmlPath = path.join(__dirname, 'meta-ad-story.html').replace(/\\/g, '/');
const framesDir = path.join(__dirname, 'frames');

// frames 폴더 초기화
if (!fs.existsSync(framesDir)) {
    fs.mkdirSync(framesDir);
} else {
    const files = fs.readdirSync(framesDir);
    for (const file of files) {
        if (file.endsWith('.png')) {
            fs.unlinkSync(path.join(framesDir, file));
        }
    }
}

console.log('🚀 병렬 프레임 캡처 시작');
console.log(`📐 해상도: ${WIDTH}x${HEIGHT}`);
console.log(`🎞️ FPS: ${FPS}`);
console.log(`⏱️ 길이: ${TOTAL_DURATION}초`);
console.log(`🔄 병렬 처리: ${SEGMENTS}개 동시 실행`);
console.log(`📸 총 프레임: ${TOTAL_DURATION * FPS}`);
console.log('');

const segmentDuration = Math.ceil(TOTAL_DURATION / SEGMENTS);
let completed = 0;
const startTime = Date.now();

for (let i = 0; i < SEGMENTS; i++) {
    const startSec = i * segmentDuration;
    const duration = Math.min(segmentDuration, TOTAL_DURATION - startSec);
    const startFrame = startSec * FPS;
    const outputDir = path.join(framesDir, `seg${i}`).replace(/\\/g, '/');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const command = `npx timesnap "file:///${htmlPath}?record=true" --viewport=${WIDTH},${HEIGHT} --fps=${FPS} --start=${startSec} --duration=${duration} --output-directory="${outputDir}" --output-pattern="frame_%05d.jpg" --screenshot-type=jpeg --screenshot-quality=95 --quiet`;

    console.log(`🎬 세그먼트 ${i + 1}/${SEGMENTS} 시작 (${startSec}초 ~ ${startSec + duration}초)`);

    const child = exec(command, { cwd: __dirname, maxBuffer: 100 * 1024 * 1024 });

    child.on('close', (code) => {
        completed++;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`✅ 세그먼트 ${i + 1} 완료 (${completed}/${SEGMENTS}) - ${elapsed}초 경과`);

        if (completed === SEGMENTS) {
            console.log('');
            console.log('🔗 프레임 병합 중...');
            mergeFrames();
        }
    });

    child.on('error', (err) => {
        console.error(`❌ 세그먼트 ${i + 1} 오류:`, err);
    });
}

function mergeFrames() {
    let frameNum = 1;

    for (let seg = 0; seg < SEGMENTS; seg++) {
        const segDir = path.join(framesDir, `seg${seg}`);
        const files = fs.readdirSync(segDir).filter(f => f.endsWith('.jpg')).sort();

        for (const file of files) {
            const src = path.join(segDir, file);
            const dst = path.join(framesDir, `frame_${String(frameNum).padStart(5, '0')}.jpg`);
            fs.renameSync(src, dst);
            frameNum++;
        }

        // 세그먼트 폴더 삭제
        fs.rmdirSync(segDir);
    }

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ 총 ${frameNum - 1}개 프레임 병합 완료!`);
    console.log(`⏱️ 총 소요 시간: ${totalTime}초`);
    console.log('');
    console.log('🎥 MP4 변환 중...');

    // 자동으로 ffmpeg 실행
    const ffmpegCmd = `ffmpeg -framerate ${FPS} -i "${framesDir.replace(/\\/g, '/')}/frame_%05d.jpg" -c:v libx264 -preset fast -crf 15 -pix_fmt yuv420p "${path.join(__dirname, 'meta-ad-v1-ultra.mp4').replace(/\\/g, '/')}" -y`;

    exec(ffmpegCmd, (err, stdout, stderr) => {
        if (err) {
            console.error('❌ ffmpeg 오류:', err);
            return;
        }
        console.log('🎉 MP4 변환 완료!');
        console.log(`📁 파일: ${path.join(__dirname, 'meta-ad-v1-ultra.mp4')}`);
    });
}
