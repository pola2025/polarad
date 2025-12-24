const { exec } = require('child_process');
const path = require('path');

const htmlPath = path.join(__dirname, 'meta-ad-story.html').replace(/\\/g, '/');
const outputPath = path.join(__dirname, 'frames').replace(/\\/g, '/');

// timesnap으로 프레임 캡처 (가상 시간 - 끊김 없음) - 4K
const command = `npx timesnap "file:///${htmlPath}?record=true&4k=true" --viewport=2160,3840 --fps=60 --duration=47 --output-directory="${outputPath}" --output-pattern="frame_%05d.png" --start-delay=1000`;

console.log('🎬 Timesnap 프레임 캡처 시작 (가상 시간 - 끊김 0%)');
console.log('📐 해상도: 2160x3840 (4K)');
console.log('🎞️ FPS: 60');
console.log('⏱️ 길이: 47초');
console.log('📸 총 프레임: 2820');
console.log('');
console.log('⏳ 캡처 진행 중... (약 5-10분 소요)');
console.log('');

const child = exec(command, { cwd: __dirname, maxBuffer: 50 * 1024 * 1024 });

child.stdout.on('data', (data) => {
    process.stdout.write(data);
});

child.stderr.on('data', (data) => {
    process.stderr.write(data);
});

child.on('close', (code) => {
    if (code === 0) {
        console.log('');
        console.log('✅ 프레임 캡처 완료!');
        console.log('');
        console.log('🎥 이제 ffmpeg로 MP4 변환:');
        console.log(`cd "${outputPath}" && ffmpeg -framerate 60 -i frame_%05d.png -c:v libx264 -preset slow -crf 10 -pix_fmt yuv420p "../meta-ad-v1-4k-ultra.mp4" -y`);
    } else {
        console.log(`❌ 오류 발생 (코드: ${code})`);
    }
});
