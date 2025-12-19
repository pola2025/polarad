/**
 * 환경변수 상태 확인용 디버그 엔드포인트
 * 민감 정보는 표시하지 않고 설정 여부만 확인
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const envStatus = {
    // HTML to Image 서비스
    HCTI_API_USER_ID: process.env.HCTI_API_USER_ID ? {
      status: '설정됨',
      length: process.env.HCTI_API_USER_ID.length,
      preview: process.env.HCTI_API_USER_ID.substring(0, 4) + '...'
    } : '없음',
    HCTI_API_KEY: process.env.HCTI_API_KEY ? {
      status: '설정됨',
      length: process.env.HCTI_API_KEY.length,
      preview: process.env.HCTI_API_KEY.substring(0, 4) + '...'
    } : '없음',

    // 대체 스크린샷 서비스
    SCREENSHOT_SERVICE_URL: process.env.SCREENSHOT_SERVICE_URL ? '설정됨' : '없음',
    SCREENSHOTONE_API_KEY: process.env.SCREENSHOTONE_API_KEY ? '설정됨' : '없음',

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? '설정됨' : '없음',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? '설정됨' : '없음',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '설정됨' : '없음',

    // Gemini
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '설정됨' : '없음',

    // Telegram
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? '설정됨' : '없음',

    // Cron
    CRON_SECRET: process.env.CRON_SECRET ? '설정됨' : '없음',
  };

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    envStatus,
    recommendation: !process.env.HCTI_API_USER_ID || !process.env.HCTI_API_KEY
      ? 'HCTI_API_USER_ID와 HCTI_API_KEY를 Vercel 환경변수에 설정해주세요.'
      : '모든 필수 환경변수가 설정되어 있습니다.'
  });
}
