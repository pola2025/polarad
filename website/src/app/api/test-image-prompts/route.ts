/**
 * 테스트 API: 이미지 프롬프트 다양화 테스트
 *
 * GET /api/test-image-prompts
 * - variation 시스템으로 1장 생성
 * - 1200x630 WebP, 10-30KB 목표 압축
 * - R2 marketing-news/ 폴더에 업로드
 * - JSON 응답: { url, sizeKB, variation, prompt }
 *
 * ⚠️ 이미지 생성 모델: gemini-3-pro-image-preview (변경 금지)
 */

import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { uploadImageToR2, isR2Configured } from '@/lib/r2-storage';
import {
  generateUniqueVariation,
  buildImagePrompt,
  saveUsedCombo,
} from '@/lib/image-variation';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_TIMEOUT = 45000;

export async function GET() {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY 미설정' }, { status: 500 });
  }

  if (!isR2Configured()) {
    return NextResponse.json({ error: 'R2 설정 미완료' }, { status: 500 });
  }

  try {
    // 1. 유니크 베리에이션 생성
    const variation = await generateUniqueVariation();
    const prompt = buildImagePrompt('', variation);

    console.log('🎲 베리에이션:', JSON.stringify(variation, null, 2));
    console.log('📝 프롬프트:', prompt);

    // 2. Gemini로 이미지 생성
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ['image', 'text'] },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: `Gemini API error ${res.status}`, details: errorText },
        { status: 502 }
      );
    }

    const result = await res.json();

    // 안전 필터 체크
    if (result.candidates?.[0]?.finishReason === 'SAFETY') {
      return NextResponse.json(
        { error: 'SAFETY_FILTER', variation, prompt },
        { status: 422 }
      );
    }

    const imageData = result.candidates?.[0]?.content?.parts?.find(
      (p: { inlineData?: { mimeType?: string; data?: string } }) =>
        p.inlineData?.mimeType?.startsWith('image/')
    );

    if (!imageData?.inlineData?.data) {
      return NextResponse.json(
        { error: 'NO_IMAGE_DATA', variation, prompt },
        { status: 502 }
      );
    }

    // 3. 1200x630 WebP 압축 (목표: 30KB 이하)
    const imageBuffer = Buffer.from(imageData.inlineData.data, 'base64');
    const TARGET_KB = 30;
    let quality = 75;
    let finalBuffer = await sharp(imageBuffer)
      .resize(1200, 630, { fit: 'cover' })
      .webp({ quality })
      .toBuffer();

    // 목표 초과 시 quality를 낮춰가며 재압축 (최소 quality 20)
    while (finalBuffer.length / 1024 > TARGET_KB && quality > 20) {
      quality -= 15;
      finalBuffer = await sharp(imageBuffer)
        .resize(1200, 630, { fit: 'cover' })
        .webp({ quality })
        .toBuffer();
    }

    const finalSizeKB = +(finalBuffer.length / 1024).toFixed(1);

    // 4. R2 업로드
    const timestamp = Date.now();
    const filename = `test-variation-${timestamp}.webp`;
    const r2Url = await uploadImageToR2(finalBuffer, filename, 'marketing-news');

    // 5. 사용 조합 기록
    await saveUsedCombo(variation);

    return NextResponse.json({
      url: r2Url,
      sizeKB: finalSizeKB,
      variation,
      prompt,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'TIMEOUT' }, { status: 504 });
    }

    console.error('테스트 이미지 생성 실패:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
