const { chromium } = require('playwright');
const path = require('path');

async function recordAd() {
    console.log('🎬 광고 녹화 시작 (고화질 60fps)...');

    const browser = await chromium.launch({
        headless: false,
        args: [
            '--disable-gpu-vsync',
            '--disable-frame-rate-limit'
        ]
    });

    const context = await browser.newContext({
        viewport: { width: 1080, height: 1920 },
        deviceScaleFactor: 1,
        recordVideo: {
            dir: path.join(__dirname),
            size: { width: 1080, height: 1920 }
        },
        bypassCSP: true
    });

    const page = await context.newPage();

    // GPU 가속 CSS 애니메이션을 위한 설정
    await page.addInitScript(() => {
        // 애니메이션 부드럽게
        document.documentElement.style.setProperty('--animation-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');
    });

    // 녹화 모드로 페이지 열기
    const filePath = path.join(__dirname, 'meta-ad-story.html');
    await page.goto(`file:///${filePath.replace(/\\/g, '/')}?record=true`, {
        waitUntil: 'networkidle'
    });

    // 페이지 완전 로드 대기
    await page.waitForTimeout(2000);

    console.log('⏳ 광고 재생 중... (48초 대기)');

    // 광고 재생 시간 + 여유 시간
    await page.waitForTimeout(48000);

    console.log('✅ 녹화 완료!');

    await context.close();
    await browser.close();

    console.log('📁 영상 저장 위치:', __dirname);
}

recordAd().catch(console.error);
