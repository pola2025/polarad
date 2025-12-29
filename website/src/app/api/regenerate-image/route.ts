/**
 * 이미지 재생성 API (R2 업로드 + Airtable 자동 업데이트)
 * POST /api/regenerate-image
 * Body: { slug: string, title: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import {
  generateUniqueVariation,
  buildImagePrompt,
  saveUsedCombo,
} from '@/lib/image-variation';
import { uploadImageToR2, isR2Configured } from '@/lib/r2-storage';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || '뉴스레터';

// Airtable에서 slug로 레코드 찾기
async function findRecordBySlug(slug: string): Promise<string | null> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) return null;

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?filterByFormula={slug}="${slug}"`,
      { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.records?.[0]?.id || null;
  } catch {
    return null;
  }
}

// Airtable thumbnailUrl 업데이트
async function updateAirtableThumbnail(recordId: string, thumbnailUrl: string): Promise<boolean> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) return false;

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}/${recordId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields: { thumbnailUrl } }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { slug, title } = await request.json();

    if (!slug || !title) {
      return NextResponse.json({ error: 'slug and title are required' }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    if (!isR2Configured()) {
      return NextResponse.json({ error: 'R2 not configured' }, { status: 500 });
    }

    const MAX_RETRIES = 5;
    const startTime = Date.now();
    const timestamp = Date.now();

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        // 유니크한 베리에이션 생성
        const variation = await generateUniqueVariation();
        const prompt = buildImagePrompt(title, variation);

        console.log(`🖼️ [${slug}] 이미지 재생성 시도 ${attempt + 1}/${MAX_RETRIES}`);
        console.log(`   인원: ${variation.people}`);
        console.log(`   장소: ${variation.location}`);
        console.log(`   활동: ${variation.activity}`);

        // 지수 백오프 대기 (첫 시도 제외)
        if (attempt > 0) {
          const baseDelay = 2000;
          const delay = Math.min(baseDelay * Math.pow(1.5, attempt - 1), 15000);
          console.log(`   ⏳ ${Math.round(delay / 1000)}초 대기 후 재시도...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseModalities: ['image', 'text'] }
            })
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`[이미지] Gemini API 에러 ${res.status}:`, errorText);
          continue;
        }

        const result = await res.json();

        // 안전 필터 체크
        if (result.candidates?.[0]?.finishReason === 'SAFETY') {
          console.error(`[이미지] 안전 필터에 의해 거부됨`);
          continue;
        }

        const imageData = result.candidates?.[0]?.content?.parts?.find(
          (p: { inlineData?: { mimeType?: string; data?: string } }) =>
            p.inlineData?.mimeType?.startsWith('image/')
        );

        if (imageData?.inlineData?.data) {
          const imageBuffer = Buffer.from(imageData.inlineData.data, 'base64');
          const webpBuffer = await sharp(imageBuffer)
            .resize(1200, 630, { fit: 'cover' })
            .webp({ quality: 80 })
            .toBuffer();

          // 사용된 조합 저장
          await saveUsedCombo(variation);

          // R2에 업로드
          const filename = `${slug}-${timestamp}.webp`;
          console.log(`☁️ R2 업로드 중: ${filename}`);
          const r2Url = await uploadImageToR2(webpBuffer, filename, 'marketing-news');
          console.log(`✅ R2 업로드 완료: ${r2Url}`);

          // Airtable 자동 업데이트
          let airtableUpdated = false;
          const recordId = await findRecordBySlug(slug);
          if (recordId) {
            airtableUpdated = await updateAirtableThumbnail(recordId, r2Url);
            if (airtableUpdated) {
              console.log(`✅ Airtable thumbnailUrl 업데이트 완료`);
            } else {
              console.log(`⚠️ Airtable 업데이트 실패`);
            }
          } else {
            console.log(`⚠️ Airtable 레코드를 찾을 수 없음: ${slug}`);
          }

          const durationMs = Date.now() - startTime;
          console.log(`✅ [${slug}] 이미지 재생성 완료 (시도 ${attempt + 1}회, ${durationMs}ms)`);

          return NextResponse.json({
            success: true,
            slug,
            path: r2Url,
            airtableUpdated,
            attempts: attempt + 1,
            durationMs,
            variation: {
              people: variation.people,
              location: variation.location,
              activity: variation.activity,
            }
          });
        } else {
          console.error(`[이미지] 이미지 데이터 없음 (시도 ${attempt + 1})`);
        }

      } catch (error) {
        console.error(`이미지 재생성 실패 (시도 ${attempt + 1}):`, error);
      }
    }

    // 모든 시도 실패
    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      error: 'Image generation failed after retries',
      attempts: MAX_RETRIES,
      durationMs
    }, { status: 500 });

  } catch (error) {
    console.error('Regenerate image error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
