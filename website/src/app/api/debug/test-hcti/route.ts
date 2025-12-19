/**
 * htmlcsstoimage API 직접 테스트용 디버그 엔드포인트
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const HCTI_API_USER_ID = process.env.HCTI_API_USER_ID;
  const HCTI_API_KEY = process.env.HCTI_API_KEY;

  if (!HCTI_API_USER_ID || !HCTI_API_KEY) {
    return NextResponse.json({
      success: false,
      error: 'HCTI 환경변수 미설정',
      HCTI_API_USER_ID: HCTI_API_USER_ID ? '설정됨' : '없음',
      HCTI_API_KEY: HCTI_API_KEY ? '설정됨' : '없음',
    });
  }

  // 간단한 테스트 HTML
  const testHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          width: 400px;
          height: 300px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: sans-serif;
          color: white;
        }
        h1 { font-size: 24px; }
      </style>
    </head>
    <body>
      <h1>HCTI 테스트 ${new Date().toISOString()}</h1>
    </body>
    </html>
  `;

  try {
    console.log('🔍 HCTI API 테스트 시작...');
    console.log('User ID 길이:', HCTI_API_USER_ID.length);
    console.log('API Key 길이:', HCTI_API_KEY.length);

    const authString = Buffer.from(`${HCTI_API_USER_ID}:${HCTI_API_KEY}`).toString('base64');
    console.log('Auth 헤더 생성 완료');

    const response = await fetch('https://hcti.io/v1/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`,
      },
      body: JSON.stringify({
        html: testHtml,
        css: '',
        viewport_width: 400,
        viewport_height: 300,
      }),
    });

    console.log('HCTI 응답 상태:', response.status, response.statusText);

    const responseText = await response.text();
    console.log('HCTI 응답 본문:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      return NextResponse.json({
        success: false,
        error: 'JSON 파싱 실패',
        status: response.status,
        statusText: response.statusText,
        responseText: responseText.substring(0, 500),
      });
    }

    if (result.url) {
      return NextResponse.json({
        success: true,
        imageUrl: result.url,
        message: 'htmlcsstoimage API 정상 작동',
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'URL 없음',
        response: result,
        status: response.status,
      });
    }

  } catch (error) {
    console.error('HCTI 테스트 오류:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
