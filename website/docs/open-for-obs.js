const { chromium } = require('playwright');
const path = require('path');

async function openForOBS() {
    console.log('🖥️ OBS 녹화용 브라우저 열기...');
    console.log('');
    console.log('📐 해상도: 1080x1920');
    console.log('');

    const browser = await chromium.launch({
        headless: false,
        args: [
            '--window-position=0,0'
        ]
    });

    const context = await browser.newContext({
        viewport: { width: 1080, height: 1920 },
        deviceScaleFactor: 1
    });

    const page = await context.newPage();

    const filePath = path.join(__dirname, 'meta-ad-story.html');
    await page.goto(`file:///${filePath.replace(/\\/g, '/')}?record=true`);

    console.log('✅ 브라우저 창이 열렸습니다!');
    console.log('');
    console.log('📌 OBS 설정:');
    console.log('1. 소스 → + → 윈도우 캡처');
    console.log('2. "폴라애드 Meta 광고" 창 선택');
    console.log('3. 녹화 시작!');
    console.log('');
    console.log('⏳ 5초 후 자동 재생됩니다...');

    // 브라우저 닫지 않고 유지
    await new Promise(() => {});
}

openForOBS().catch(console.error);
