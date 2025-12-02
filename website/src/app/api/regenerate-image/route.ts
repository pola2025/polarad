/**
 * 이미지 재생성 API
 * POST /api/regenerate-image
 * Body: { slug: string, title: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import {
  generateUniqueVariation,
  buildImagePrompt,
  saveUsedCombo,
  checkImageDuplicate,
} from '@/lib/image-variation';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { slug, title } = await request.json();

    if (!slug || !title) {
      return NextResponse.json({ error: 'slug and title are required' }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const MAX_RETRIES = 3;
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'marketing-news');

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      // 유니크한 베리에이션 생성
      const variation = await generateUniqueVariation();
      const prompt = buildImagePrompt(title, variation);

      console.log(`🖼️ [${slug}] 이미지 재생성 시도 ${attempt + 1}/${MAX_RETRIES}`);
      console.log(`   인원: ${variation.people}`);
      console.log(`   장소: ${variation.location}`);
      console.log(`   활동: ${variation.activity}`);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ['image', 'text'] }
          })
        }
      );

      const result = await res.json();
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

        // 중복 검사 (현재 파일 제외)
        const currentFile = `${slug}.webp`;
        const files = await fs.readdir(imagesDir);
        const otherFiles = files.filter(f => f !== currentFile && /\.(webp|png|jpg)$/i.test(f));

        let isDuplicate = false;
        for (const file of otherFiles) {
          const existingBuffer = await fs.readFile(path.join(imagesDir, file));
          // 간단한 크기 비교로 중복 체크
          if (Math.abs(existingBuffer.length - webpBuffer.length) < 1000) {
            isDuplicate = true;
            break;
          }
        }

        if (isDuplicate) {
          console.log(`⚠️ 중복 가능성 감지, 재시도...`);
          continue;
        }

        // 파일 저장
        const imagePath = path.join(imagesDir, `${slug}.webp`);
        await fs.writeFile(imagePath, webpBuffer);

        // 사용된 조합 저장
        await saveUsedCombo(variation);

        console.log(`✅ [${slug}] 이미지 재생성 완료`);

        return NextResponse.json({
          success: true,
          slug,
          path: `/images/marketing-news/${slug}.webp`,
          variation: {
            people: variation.people,
            location: variation.location,
            activity: variation.activity,
          }
        });
      }
    }

    return NextResponse.json({ error: 'Image generation failed after retries' }, { status: 500 });

  } catch (error) {
    console.error('Regenerate image error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
