const { chromium } = require('playwright');
const path = require('path');

async function open4K() {
    console.log('🖥️ 4K 브라우저 열기...');
    console.log('');
    console.log('📌 녹화 방법:');
    console.log('1. Win + G 눌러서 게임바 열기');
    console.log('2. ⏺ 녹화 버튼 클릭');
    console.log('3. 브라우저에서 자동 재생 시작됨');
    console.log('4. 끝나면 ■ 중지');
    console.log('');
    console.log('⏳ 5초 후 자동 재생됩니다...');

    const browser = await chromium.launch({
        headless: false,
        args: [
            '--start-maximized',
            '--window-size=2160,3840',
            '--disable-infobars',
            '--kiosk'
        ]
    });

    const context = await browser.newContext({
        viewport: { width: 2160, height: 3840 },
        deviceScaleFactor: 2
    });

    const page = await context.newPage();

    const filePath = path.join(__dirname, 'meta-ad-story.html');
    await page.goto(`file:///${filePath.replace(/\\/g, '/')}?record=true&4k=true`);

    // 5초 대기 (녹화 준비 시간)
    await page.waitForTimeout(5000);

    console.log('🎬 재생 시작!');

    // 광고 시간 + 여유
    await page.waitForTimeout(50000);

    console.log('✅ 재생 완료! 녹화 중지해주세요.');

    // 브라우저 열어둠
    await page.waitForTimeout(5000);

    await browser.close();
}

open4K().catch(console.error);
