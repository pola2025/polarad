/**
 * Instagram 컨텐츠 생성 테스트 API
 * 실제 게시 없이 이미지와 캡션만 미리보기
 */

import { NextResponse } from 'next/server';
import { generateInstagramContent } from '@/lib/instagram-content-generator';
import { generateTemplateHtml } from '@/lib/instagram-templates';

export async function GET() {
  try {
    console.log('🧪 Instagram 컨텐츠 테스트 시작...');

    // 1. Gemini로 컨텐츠 생성
    console.log('🤖 Gemini로 컨텐츠 생성 중...');
    const content = await generateInstagramContent();
    console.log(`✅ 컨텐츠 생성 완료: ${content.templateType}`);

    // 2. HTML 템플릿 적용
    console.log('🎨 HTML 템플릿 적용 중...');
    const html = generateTemplateHtml(content.templateType, content.templateData);
    console.log('✅ HTML 템플릿 적용 완료');

    // 3. 캡션 + 해시태그 조합
    const fullCaption = `${content.caption}

.
.
.

${content.hashtags.join(' ')}`;

    // HTML 미리보기 페이지 생성
    const previewHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>Instagram 컨텐츠 테스트</title>
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Pretendard', sans-serif; 
      background: #1a1a2e; 
      color: #fff;
      padding: 40px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    h1 {
      font-size: 28px;
      margin-bottom: 10px;
      color: #60a5fa;
    }
    .meta {
      color: #94a3b8;
      margin-bottom: 30px;
      font-size: 14px;
    }
    .preview-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }
    .image-section h2, .caption-section h2 {
      font-size: 18px;
      margin-bottom: 16px;
      color: #94a3b8;
    }
    .image-frame {
      background: #0f0f1a;
      border: 1px solid #333;
      border-radius: 12px;
      overflow: hidden;
    }
    .image-frame iframe {
      width: 540px;
      height: 675px;
      border: none;
      transform-origin: top left;
      transform: scale(0.5);
    }
    .caption-box {
      background: #0f0f1a;
      border: 1px solid #333;
      border-radius: 12px;
      padding: 24px;
      white-space: pre-wrap;
      font-size: 14px;
      line-height: 1.8;
      max-height: 700px;
      overflow-y: auto;
    }
    .hashtags {
      color: #60a5fa;
    }
    .template-data {
      margin-top: 40px;
      padding: 24px;
      background: #0f0f1a;
      border: 1px solid #333;
      border-radius: 12px;
    }
    .template-data h2 {
      font-size: 18px;
      margin-bottom: 16px;
      color: #94a3b8;
    }
    .template-data pre {
      font-size: 12px;
      color: #cbd5e1;
      overflow-x: auto;
    }
    .stats {
      display: flex;
      gap: 20px;
      margin-top: 20px;
    }
    .stat {
      background: #1e293b;
      padding: 12px 20px;
      border-radius: 8px;
    }
    .stat-label { font-size: 12px; color: #64748b; }
    .stat-value { font-size: 18px; font-weight: 600; color: #fff; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📸 Instagram 컨텐츠 테스트</h1>
    <div class="meta">
      템플릿 타입: <strong>${content.templateType}</strong> | 
      생성 시간: ${new Date().toLocaleString('ko-KR')}
    </div>
    
    <div class="stats">
      <div class="stat">
        <div class="stat-label">캡션 길이</div>
        <div class="stat-value">${content.caption.length}자</div>
      </div>
      <div class="stat">
        <div class="stat-label">해시태그</div>
        <div class="stat-value">${content.hashtags.length}개</div>
      </div>
    </div>
    
    <div class="preview-grid" style="margin-top: 30px;">
      <div class="image-section">
        <h2>🖼️ 이미지 미리보기 (50% 축소)</h2>
        <div class="image-frame">
          <iframe srcdoc="${html.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}"></iframe>
        </div>
      </div>
      
      <div class="caption-section">
        <h2>📝 캡션</h2>
        <div class="caption-box">${fullCaption.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      </div>
    </div>
    
    <div class="template-data">
      <h2>🔧 템플릿 데이터 (Gemini 생성)</h2>
      <pre>${JSON.stringify(content.templateData, null, 2)}</pre>
    </div>
  </div>
  
  <script>
    // iframe 내용 수정 (escape된 HTML 복원)
    const iframe = document.querySelector('iframe');
    const htmlContent = \`${html.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
    iframe.srcdoc = htmlContent;
  </script>
</body>
</html>`;

    return new NextResponse(previewHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('❌ 테스트 에러:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({
      error: 'Test failed',
      message: errorMessage,
    }, { status: 500 });
  }
}

export const runtime = 'nodejs';
export const maxDuration = 60;
