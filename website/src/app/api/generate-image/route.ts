import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { title, filename } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    // 타이틀 기반 프롬프트 생성
    const imagePrompt = `Create a 1024x1024 professional marketing blog thumbnail image for an article titled: "${title}".
Style requirements:
- Modern, clean, minimalist design
- Professional B2B marketing aesthetic
- Primary colors: Deep blue (#1E3A8A) and orange (#F59E0B) accents
- Light/white background
- Abstract geometric shapes or relevant icons
- NO TEXT in the image
- Suitable for a Korean digital marketing agency blog`;

    // Gemini 3 Pro Image Preview API 호출
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: imagePrompt }]
            }
          ],
          generationConfig: {
            responseModalities: ['image', 'text']
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      return NextResponse.json({ error: 'Image generation failed', details: error }, { status: 500 });
    }

    const result = await response.json();

    // 이미지 데이터 추출
    const imageData = result.candidates?.[0]?.content?.parts?.find(
      (part: { inlineData?: { mimeType: string; data: string } }) => part.inlineData?.mimeType?.startsWith('image/')
    );

    if (!imageData?.inlineData?.data) {
      return NextResponse.json({ error: 'No image generated', result }, { status: 500 });
    }

    // 파일로 저장
    const finalFilename = filename || `${Date.now()}.png`;
    const imagePath = path.join(process.cwd(), 'public', 'images', 'marketing-news', finalFilename);
    const imageBuffer = Buffer.from(imageData.inlineData.data, 'base64');

    // 디렉토리 생성
    await fs.mkdir(path.dirname(imagePath), { recursive: true });
    await fs.writeFile(imagePath, imageBuffer);

    return NextResponse.json({
      success: true,
      path: `/images/marketing-news/${finalFilename}`,
      message: 'Image generated and saved successfully'
    });

  } catch (error) {
    console.error('Generate image error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
