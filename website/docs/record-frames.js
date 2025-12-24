const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function recordFrames() {
    const FPS = 60;
    const DURATION = 47; // 초
    const TOTAL_FRAMES = FPS * DURATION;
    const WIDTH = 1080;
    const HEIGHT = 1920;

    const framesDir = path.join(__dirname, 'frames');

    // frames 폴더 생성
    if (!fs.existsSync(framesDir)) {
        fs.mkdirSync(framesDir);
    } else {
        // 기존 프레임 삭제
        const files = fs.readdirSync(framesDir);
        for (const file of files) {
            fs.unlinkSync(path.join(framesDir, file));
        }
    }

    console.log('🎬 프레임 단위 캡처 시작');
    console.log(`📐 해상도: ${WIDTH}x${HEIGHT}`);
    console.log(`🎞️ FPS: ${FPS}`);
    console.log(`⏱️ 길이: ${DURATION}초`);
    console.log(`📸 총 프레임: ${TOTAL_FRAMES}`);
    console.log('');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: WIDTH, height: HEIGHT },
        deviceScaleFactor: 2 // 레티나 품질
    });

    const page = await context.newPage();

    const filePath = path.join(__dirname, 'meta-ad-story.html');

    // 애니메이션을 수동 제어하기 위해 record 모드 없이 로드
    await page.goto(`file:///${filePath.replace(/\\/g, '/')}`);

    // 컨트롤 패널 숨기기
    await page.evaluate(() => {
        document.querySelector('.control-panel').style.display = 'none';
    });

    // 애니메이션 시작
    await page.evaluate(() => {
        window.playAnimation();
    });

    console.log('📸 프레임 캡처 중...');

    const frameInterval = 1000 / FPS; // 각 프레임 간격 (ms)

    for (let i = 0; i < TOTAL_FRAMES; i++) {
        const frameNum = String(i).padStart(5, '0');
        const framePath = path.join(framesDir, `frame_${frameNum}.png`);

        await page.screenshot({
            path: framePath,
            type: 'png'
        });

        // 다음 프레임 시간까지 대기
        await page.waitForTimeout(frameInterval);

        // 진행률 표시 (10% 단위)
        if (i % Math.floor(TOTAL_FRAMES / 10) === 0) {
            const progress = Math.floor((i / TOTAL_FRAMES) * 100);
            console.log(`  ${progress}% 완료 (${i}/${TOTAL_FRAMES} 프레임)`);
        }
    }

    console.log('  100% 완료!');
    await browser.close();

    console.log('');
    console.log('✅ 프레임 캡처 완료!');
    console.log(`📁 저장 위치: ${framesDir}`);
    console.log('');
    console.log('🎥 MP4 변환 명령어:');
    console.log(`cd "${framesDir}" && ffmpeg -framerate 60 -i frame_%05d.png -c:v libx264 -preset slow -crf 10 -pix_fmt yuv420p "../meta-ad-v1-ultra.mp4"`);
}

recordFrames().catch(console.error);
