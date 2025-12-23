/**
 * Vercel Cron Job: polamkt Instagram 자동 게시
 * 스케줄: 매일 오후 12시 (KST)
 *
 * 1. Gemini로 컨텐츠 생성
 * 2. HTML 템플릿 적용
 * 3. 이미지 캡쳐 (외부 서비스 또는 html2canvas)
 * 4. Cloudinary 업로드
 * 5. Instagram 게시
 */

import { NextResponse } from 'next/server';
import { generateInstagramContent } from '@/lib/instagram-content-generator';
import { generateTemplateHtml } from '@/lib/instagram-templates';
import { uploadToCloudinary } from '@/lib/cloudinary';

const CRON_SECRET = process.env.CRON_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = '-1003280236380';

// Instagram API (폴라애드 계정)
const INSTAGRAM_ACCESS_TOKEN = 'EAAfTImZCqPSQBQD3XFpcA1wGECplqeFbqtdZB0nL0AZCb5HFzWgOrJpeefCw0L3Otk32gxrDwiZAP3LZA558C6ggTVxVHau4ovsuWI3HC1Rk4emZAujYqORLsOo3ZB9DZB1IPzQAJZBUREZB5fp7If7WsI92ZAxOMJYBeop1sVOO5ZC3p9Yj5ncGQNZBrrC9O542DgQUHjwZDZD';
const INSTAGRAM_ACCOUNT_ID = '17841479557116437'; // polamkt Instagram
const GRAPH_API_VERSION = 'v21.0';
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

// html2canvas를 사용한 HTML → 이미지 변환 서비스 URL
// 실제 운영 시에는 browserless.io 또는 자체 서버 필요
const SCREENSHOT_SERVICE_URL = process.env.SCREENSHOT_SERVICE_URL;

// 텔레그램 알림
async function sendTelegramNotification(
  type: 'success' | 'error',
  data: {
    title?: string;
    instagramUrl?: string;
    errorMessage?: string;
    templateType?: string;
  }
): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) return;

  let message: string;

  if (type === 'success') {
    message = `📸 *polamkt Instagram 자동 게시 완료*

📝 *템플릿:* ${data.templateType}
🔗 *Instagram:* [게시글 보기](${data.instagramUrl})

✅ 폴라애드 컨텐츠가 성공적으로 게시되었습니다!`;
  } else {
    message = `❌ *polamkt Instagram 자동 게시 실패*

⚠️ *오류:* ${data.errorMessage}

🔧 수동 확인이 필요합니다.`;
  }

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: false
      })
    });
  } catch (error) {
    console.error('텔레그램 알림 오류:', error);
  }
}

// HTML을 이미지로 캡쳐 (여러 방법 시도)
async function captureHtmlToImage(html: string): Promise<Buffer | null> {
  // 디버깅: 환경변수 확인
  console.log('🔍 환경변수 확인:', {
    HCTI_API_USER_ID: process.env.HCTI_API_USER_ID ? '설정됨' : '없음',
    HCTI_API_KEY: process.env.HCTI_API_KEY ? '설정됨' : '없음',
    SCREENSHOT_SERVICE_URL: SCREENSHOT_SERVICE_URL ? '설정됨' : '없음',
  });

  // 방법 1: 외부 스크린샷 서비스 사용
  if (SCREENSHOT_SERVICE_URL) {
    try {
      const response = await fetch(SCREENSHOT_SERVICE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html,
          width: 1080,
          height: 1350,
          type: 'png',
        }),
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }
    } catch (error) {
      console.error('외부 스크린샷 서비스 실패:', error);
    }
  }

  // 방법 2: htmlcsstoimage.com API 사용 (무료 플랜 있음)
  const HCTI_API_USER_ID = process.env.HCTI_API_USER_ID;
  const HCTI_API_KEY = process.env.HCTI_API_KEY;

  console.log('🔍 HCTI 환경변수 상세:', {
    userIdLength: HCTI_API_USER_ID?.length,
    keyLength: HCTI_API_KEY?.length
  });

  if (HCTI_API_USER_ID && HCTI_API_KEY) {
    try {
      console.log('📸 htmlcsstoimage API 호출 시작...');
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
      console.log('📸 htmlcsstoimage 응답:', result);

      if (result.url) {
        // 이미지 URL에서 다운로드
        console.log('📥 이미지 다운로드 중:', result.url);
        const imageResponse = await fetch(result.url);
        const arrayBuffer = await imageResponse.arrayBuffer();
        console.log('✅ 이미지 다운로드 완료, 크기:', arrayBuffer.byteLength);
        return Buffer.from(arrayBuffer);
      } else {
        console.error('❌ htmlcsstoimage URL 없음:', result);
      }
    } catch (error) {
      console.error('htmlcsstoimage 실패:', error);
    }
  } else {
    console.log('⚠️ HCTI 환경변수 미설정, 건너뜀');
  }

  // 방법 3: screenshotone.com API 사용
  const SCREENSHOTONE_API_KEY = process.env.SCREENSHOTONE_API_KEY;

  if (SCREENSHOTONE_API_KEY) {
    try {
      // HTML을 base64로 인코딩
      const htmlBase64 = Buffer.from(html).toString('base64');

      const params = new URLSearchParams({
        access_key: SCREENSHOTONE_API_KEY,
        html: htmlBase64,
        viewport_width: '1080',
        viewport_height: '1350',
        format: 'png',
        full_page: 'false',
      });

      const response = await fetch(`https://api.screenshotone.com/take?${params}`);

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }
    } catch (error) {
      console.error('screenshotone 실패:', error);
    }
  }

  console.error('❌ 이미지 캡쳐 실패: 사용 가능한 서비스 없음');
  return null;
}

// Instagram 게시
async function publishToInstagram(
  imageUrl: string,
  caption: string
): Promise<{ success: boolean; postId?: string; permalink?: string; error?: string }> {
  try {
    // 1단계: 미디어 컨테이너 생성
    console.log('📸 Instagram 미디어 컨테이너 생성 중...');

    const containerResponse = await fetch(
      `${GRAPH_API_BASE}/${INSTAGRAM_ACCOUNT_ID}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption,
          access_token: INSTAGRAM_ACCESS_TOKEN,
        }),
      }
    );

    const containerResult = await containerResponse.json();

    if (containerResult.error) {
      console.error('미디어 컨테이너 생성 실패:', containerResult.error);
      return {
        success: false,
        error: containerResult.error.message || 'Container creation failed',
      };
    }

    const containerId = containerResult.id;
    console.log(`✅ 컨테이너 생성 완료: ${containerId}`);

    // 컨테이너 상태 확인 (처리 완료 대기)
    await waitForContainerReady(containerId);

    // 2단계: 게시글 발행
    console.log('📤 Instagram 게시글 발행 중...');

    const publishResponse = await fetch(
      `${GRAPH_API_BASE}/${INSTAGRAM_ACCOUNT_ID}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: INSTAGRAM_ACCESS_TOKEN,
        }),
      }
    );

    const publishResult = await publishResponse.json();

    if (publishResult.error) {
      console.error('게시글 발행 실패:', publishResult.error);
      return {
        success: false,
        error: publishResult.error.message || 'Publish failed',
      };
    }

    const postId = publishResult.id;
    console.log(`✅ Instagram 게시 완료: ${postId}`);

    // 퍼머링크 가져오기
    const permalink = await getPostPermalink(postId);

    return {
      success: true,
      postId,
      permalink,
    };

  } catch (error) {
    console.error('Instagram 게시 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 컨테이너 준비 대기
async function waitForContainerReady(containerId: string, maxAttempts = 10): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    const statusResponse = await fetch(
      `${GRAPH_API_BASE}/${containerId}?fields=status_code&access_token=${INSTAGRAM_ACCESS_TOKEN}`
    );

    const statusResult = await statusResponse.json();

    if (statusResult.status_code === 'FINISHED') {
      return true;
    }

    if (statusResult.status_code === 'ERROR') {
      throw new Error('미디어 처리 실패');
    }

    // 2초 대기 후 재시도
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  throw new Error('미디어 처리 타임아웃');
}

// 퍼머링크 가져오기
async function getPostPermalink(postId: string): Promise<string | undefined> {
  try {
    const response = await fetch(
      `${GRAPH_API_BASE}/${postId}?fields=permalink&access_token=${INSTAGRAM_ACCESS_TOKEN}`
    );

    const result = await response.json();
    return result.permalink;
  } catch {
    return undefined;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const forceRun = url.searchParams.get('force') === 'true';

  // Cron 인증 확인
  const authHeader = request.headers.get('authorization');
  if (!forceRun && CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('📸 polamkt Instagram 자동 게시 시작...');

    // 1. Gemini로 컨텐츠 생성
    console.log('🤖 Gemini로 컨텐츠 생성 중...');
    const content = await generateInstagramContent();
    console.log(`✅ 컨텐츠 생성 완료: ${content.templateType}`);

    // 2. HTML 템플릿 적용
    console.log('🎨 HTML 템플릿 적용 중...');
    const html = generateTemplateHtml(content.templateType, content.templateData);
    console.log('✅ HTML 템플릿 적용 완료');

    // 3. HTML → 이미지 캡쳐
    console.log('📷 이미지 캡쳐 중...');
    const imageBuffer = await captureHtmlToImage(html);

    if (!imageBuffer) {
      throw new Error('이미지 캡쳐 실패: 사용 가능한 스크린샷 서비스가 없습니다');
    }
    console.log('✅ 이미지 캡쳐 완료');

    // 4. Cloudinary 업로드
    console.log('☁️ Cloudinary 업로드 중...');
    const timestamp = Date.now();
    const publicId = `polamkt-${content.templateType}-${timestamp}`;

    const uploadResult = await uploadToCloudinary(
      `data:image/png;base64,${imageBuffer.toString('base64')}`,
      'instagram/polamkt',
      publicId
    );

    if (!uploadResult.success || !uploadResult.url) {
      throw new Error(`Cloudinary 업로드 실패: ${uploadResult.error}`);
    }
    console.log(`✅ Cloudinary 업로드 완료: ${uploadResult.url}`);

    // 5. 캡션 + 해시태그 조합
    const fullCaption = `${content.caption}

.
.
.

${content.hashtags.join(' ')}`;

    // 6. Instagram 게시
    console.log('📤 Instagram 게시 중...');
    const publishResult = await publishToInstagram(uploadResult.url, fullCaption);

    if (!publishResult.success) {
      throw new Error(`Instagram 게시 실패: ${publishResult.error}`);
    }
    console.log(`✅ Instagram 게시 완료: ${publishResult.permalink}`);

    // 7. 텔레그램 알림
    await sendTelegramNotification('success', {
      templateType: content.templateType,
      instagramUrl: publishResult.permalink,
    });

    return NextResponse.json({
      success: true,
      templateType: content.templateType,
      cloudinaryUrl: uploadResult.url,
      instagram: {
        postId: publishResult.postId,
        permalink: publishResult.permalink,
      },
    });

  } catch (error) {
    console.error('❌ 에러:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    await sendTelegramNotification('error', {
      errorMessage,
    });

    return NextResponse.json({
      error: 'Instagram posting failed',
      message: errorMessage,
    }, { status: 500 });
  }
}

export const runtime = 'nodejs';
export const maxDuration = 60; // 60초 타임아웃
