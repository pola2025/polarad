/**
 * Cloudinary API 직접 테스트용 디버그 엔드포인트
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
  const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

  // 환경변수 상태 확인
  const envStatus = {
    CLOUDINARY_CLOUD_NAME: CLOUDINARY_CLOUD_NAME ? {
      value: CLOUDINARY_CLOUD_NAME,
      length: CLOUDINARY_CLOUD_NAME.length,
    } : '없음',
    CLOUDINARY_API_KEY: CLOUDINARY_API_KEY ? {
      preview: CLOUDINARY_API_KEY.substring(0, 6) + '...',
      length: CLOUDINARY_API_KEY.length,
    } : '없음',
    CLOUDINARY_API_SECRET: CLOUDINARY_API_SECRET ? {
      preview: CLOUDINARY_API_SECRET.substring(0, 6) + '...',
      length: CLOUDINARY_API_SECRET.length,
    } : '없음',
  };

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return NextResponse.json({
      success: false,
      error: 'Cloudinary 환경변수 미설정',
      envStatus,
    });
  }

  // 간단한 테스트 이미지 (1x1 투명 PNG)
  const testBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'test';

    // 서명 생성
    const params: Record<string, string> = {
      folder,
      timestamp: timestamp.toString(),
    };

    const sortedKeys = Object.keys(params).sort();
    const paramString = sortedKeys
      .map((key) => `${key}=${params[key]}`)
      .join('&');
    const stringToSign = paramString + CLOUDINARY_API_SECRET;

    // SHA-1 해시 생성
    const encoder = new TextEncoder();
    const data = encoder.encode(stringToSign);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    console.log('Cloudinary 테스트:', {
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      timestamp,
      signature: signature.substring(0, 10) + '...',
    });

    // FormData 생성
    const formData = new FormData();
    formData.append('file', testBase64);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', folder);

    // Cloudinary 업로드 API 호출
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    if (result.error) {
      return NextResponse.json({
        success: false,
        error: result.error.message,
        fullError: result.error,
        envStatus,
        debug: {
          url: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          timestamp,
        },
      });
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      message: 'Cloudinary API 정상 작동',
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      envStatus,
    });
  }
}
