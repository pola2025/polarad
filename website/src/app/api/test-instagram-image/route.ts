/**
 * Instagram 이미지 생성 테스트 API
 * 실제 이미지 파일을 생성하고 반환
 */

import { NextResponse } from 'next/server';
import { generateInstagramContent } from '@/lib/instagram-content-generator';
import { generateTemplateHtml } from '@/lib/instagram-templates';
import { writeFile } from 'fs/promises';
import path from 'path';

const HCTI_API_USER_ID = process.env.HCTI_API_USER_ID;
const HCTI_API_KEY = process.env.HCTI_API_KEY;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const templateType = url.searchParams.get('type') || 'random';

  try {
    console.log('🧪 Instagram 이미지 생성 테스트 시작...');

    // 1. Gemini로 컨텐츠 생성
    console.log('🤖 Gemini로 컨텐츠 생성 중...');
    const content = await generateInstagramContent();
    console.log(`✅ 컨텐츠 생성 완료: ${content.templateType}`);

    // 2. HTML 템플릿 적용
    console.log('🎨 HTML 템플릿 적용 중...');
    const html = generateTemplateHtml(content.templateType, content.templateData);

    // 3. HCTI로 이미지 캡처
    if (!HCTI_API_USER_ID || !HCTI_API_KEY) {
      return NextResponse.json({
        error: 'HCTI 환경변수 미설정',
        message: 'HCTI_API_USER_ID, HCTI_API_KEY 필요',
      }, { status: 500 });
    }

    console.log('📸 htmlcsstoimage API 호출 중...');
    const response = await fetch('https://hcti.io/v1/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${HCTI_API_USER_ID}:${HCTI_API_KEY}`).toString('base64'),
      },
      body: JSON.stringify({
        html,
        css: '',
        google_fonts: 'Pretendard',
        viewport_width: 1080,
        viewport_height: 1350,
      }),
    });

    const result = await response.json();
    console.log('📸 HCTI 응답:', result);

    if (!result.url) {
      return NextResponse.json({
        error: 'HCTI 이미지 생성 실패',
        result,
      }, { status: 500 });
    }

    // 4. 이미지 다운로드
    console.log('📥 이미지 다운로드 중:', result.url);
    const imageResponse = await fetch(result.url);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // 5. 파일로 저장
    const timestamp = Date.now();
    const filename = `instagram-test-${content.templateType}-${timestamp}.png`;
    const filepath = path.join(process.cwd(), 'docs', filename);
    
    await writeFile(filepath, imageBuffer);
    console.log(`✅ 이미지 저장 완료: ${filepath}`);

    // 6. 캡션도 저장
    const fullCaption = `${content.caption}\n\n.\n.\n.\n\n${content.hashtags.join(' ')}`;
    const captionFilename = `instagram-test-${content.templateType}-${timestamp}-caption.txt`;
    const captionPath = path.join(process.cwd(), 'docs', captionFilename);
    await writeFile(captionPath, fullCaption, 'utf-8');

    return NextResponse.json({
      success: true,
      templateType: content.templateType,
      image: {
        url: result.url,
        localPath: filepath,
        filename,
      },
      caption: {
        localPath: captionPath,
        filename: captionFilename,
        length: content.caption.length,
      },
      hashtags: content.hashtags,
      templateData: content.templateData,
    });

  } catch (error) {
    console.error('❌ 테스트 에러:', error);
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export const runtime = 'nodejs';
export const maxDuration = 60;
