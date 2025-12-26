/**
 * Instagram 이미지 재생성 API
 * 특정 콘텐츠 데이터로 이미지만 재생성하여 Instagram에 게시
 */

import { NextResponse } from 'next/server';
import { generateTemplateHtml, TemplateData, TemplateType } from '@/lib/instagram-templates';
import { uploadToCloudinary } from '@/lib/cloudinary';

const CRON_SECRET = process.env.CRON_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = '-1003280236380';

// Instagram API (polamkt 전용 계정)
const INSTAGRAM_ACCESS_TOKEN = process.env.POLAMKT_INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_ACCOUNT_ID = process.env.POLAMKT_INSTAGRAM_ACCOUNT_ID || '17841479557116437';
const GRAPH_API_VERSION = 'v21.0';
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

// htmlcsstoimage.com API
async function captureHtmlToImage(html: string): Promise<Buffer | null> {
  const HCTI_API_USER_ID = process.env.HCTI_API_USER_ID;
  const HCTI_API_KEY = process.env.HCTI_API_KEY;

  if (!HCTI_API_USER_ID || !HCTI_API_KEY) {
    console.error('❌ HCTI 환경변수 미설정');
    return null;
  }

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
      console.log('📥 이미지 다운로드 중:', result.url);
      const imageResponse = await fetch(result.url);
      const arrayBuffer = await imageResponse.arrayBuffer();
      console.log('✅ 이미지 다운로드 완료, 크기:', arrayBuffer.byteLength);
      return Buffer.from(arrayBuffer);
    }
  } catch (error) {
    console.error('htmlcsstoimage 실패:', error);
  }

  return null;
}

// Instagram 게시
async function publishToInstagram(
  imageUrl: string,
  caption: string
): Promise<{ success: boolean; postId?: string; permalink?: string; error?: string }> {
  try {
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
      return { success: false, error: containerResult.error.message };
    }

    const containerId = containerResult.id;
    console.log(`✅ 컨테이너 생성 완료: ${containerId}`);

    // 컨테이너 상태 확인
    await waitForContainerReady(containerId);

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
      return { success: false, error: publishResult.error.message };
    }

    const postId = publishResult.id;
    console.log(`✅ Instagram 게시 완료: ${postId}`);

    const permalink = await getPostPermalink(postId);

    return { success: true, postId, permalink };
  } catch (error) {
    console.error('Instagram 게시 오류:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

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

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  throw new Error('미디어 처리 타임아웃');
}

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

// 텔레그램 알림
async function sendTelegramNotification(
  type: 'success' | 'error',
  data: { templateType?: string; instagramUrl?: string; errorMessage?: string }
): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) return;

  let message: string;

  if (type === 'success') {
    message = `📸 *polamkt Instagram 이미지 재생성 완료*

📝 *템플릿:* ${data.templateType}
🔗 *Instagram:* [게시글 보기](${data.instagramUrl})

✅ 이미지가 수정되어 재게시되었습니다!`;
  } else {
    message = `❌ *polamkt Instagram 이미지 재생성 실패*

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

export async function POST(request: Request) {
  // Cron 인증 확인
  const authHeader = request.headers.get('authorization');
  const url = new URL(request.url);
  const forceRun = url.searchParams.get('force') === 'true';

  if (!forceRun && CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 필수 필드 확인
    const { templateType, templateData, caption, hashtags } = body as {
      templateType: TemplateType;
      templateData: TemplateData;
      caption: string;
      hashtags: string[];
    };

    if (!templateType || !templateData || !caption) {
      return NextResponse.json({
        error: 'Missing required fields: templateType, templateData, caption'
      }, { status: 400 });
    }

    console.log('📸 이미지 재생성 시작...');
    console.log(`📝 템플릿 타입: ${templateType}`);

    // 1. HTML 템플릿 생성
    console.log('🎨 HTML 템플릿 적용 중...');
    const html = generateTemplateHtml(templateType, templateData);

    // 2. HTML → 이미지 캡쳐
    console.log('📷 이미지 캡쳐 중...');
    const imageBuffer = await captureHtmlToImage(html);

    if (!imageBuffer) {
      throw new Error('이미지 캡쳐 실패');
    }

    // 3. Cloudinary 업로드
    console.log('☁️ Cloudinary 업로드 중...');
    const timestamp = Date.now();
    const publicId = `polamkt-${templateType}-regenerated-${timestamp}`;

    const uploadResult = await uploadToCloudinary(
      `data:image/png;base64,${imageBuffer.toString('base64')}`,
      'instagram/polamkt',
      publicId
    );

    if (!uploadResult.success || !uploadResult.url) {
      throw new Error(`Cloudinary 업로드 실패: ${uploadResult.error}`);
    }
    console.log(`✅ Cloudinary 업로드 완료: ${uploadResult.url}`);

    // 4. 캡션 + 해시태그 조합
    const fullCaption = `${caption}

.
.
.

${hashtags.join(' ')}`;

    // 5. Instagram 게시
    console.log('📤 Instagram 게시 중...');
    const publishResult = await publishToInstagram(uploadResult.url, fullCaption);

    if (!publishResult.success) {
      throw new Error(`Instagram 게시 실패: ${publishResult.error}`);
    }

    // 6. 텔레그램 알림
    await sendTelegramNotification('success', {
      templateType,
      instagramUrl: publishResult.permalink,
    });

    return NextResponse.json({
      success: true,
      templateType,
      cloudinaryUrl: uploadResult.url,
      instagram: {
        postId: publishResult.postId,
        permalink: publishResult.permalink,
      },
    });

  } catch (error) {
    console.error('❌ 에러:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    await sendTelegramNotification('error', { errorMessage });

    return NextResponse.json({
      error: 'Image regeneration failed',
      message: errorMessage,
    }, { status: 500 });
  }
}

export const runtime = 'nodejs';
export const maxDuration = 60;
