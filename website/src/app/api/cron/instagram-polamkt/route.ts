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
import { logErrorToSlack, logSuccessToSlack } from '@/lib/slack-logger';

const CRON_SECRET = process.env.CRON_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = '-1003280236380';

// 단계별 추적을 위한 타입
type CronStep = 'init' | 'gemini' | 'template' | 'capture' | 'cloudinary' | 'instagram' | 'complete';

// 타임아웃이 있는 fetch 래퍼
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 30000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Instagram API (polamkt 전용 계정 - 환경변수)
const INSTAGRAM_ACCESS_TOKEN = process.env.POLAMKT_INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_ACCOUNT_ID = process.env.POLAMKT_INSTAGRAM_ACCOUNT_ID || '17841479557116437';
const GRAPH_API_VERSION = 'v21.0';
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

// html2canvas를 사용한 HTML → 이미지 변환 서비스 URL
// 실제 운영 시에는 browserless.io 또는 자체 서버 필요
const SCREENSHOT_SERVICE_URL = process.env.SCREENSHOT_SERVICE_URL;

// 환경변수 상태 확인 함수
function getEnvStatus(): Record<string, string> {
  return {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '✅' : '❌',
    HCTI_API_USER_ID: process.env.HCTI_API_USER_ID ? '✅' : '❌',
    HCTI_API_KEY: process.env.HCTI_API_KEY ? '✅' : '❌',
    CLOUDINARY: process.env.CLOUDINARY_CLOUD_NAME ? '✅' : '❌',
    INSTAGRAM_TOKEN: INSTAGRAM_ACCESS_TOKEN ? '✅' : '❌',
    TELEGRAM: TELEGRAM_BOT_TOKEN ? '✅' : '❌',
  };
}

// 텔레그램 알림
async function sendTelegramNotification(
  type: 'success' | 'error' | 'warning',
  data: {
    title?: string;
    instagramUrl?: string;
    errorMessage?: string;
    errorStack?: string;
    templateType?: string;
    failedStep?: CronStep;
    lastSuccessStep?: CronStep;
    duration?: number;
    stepDurations?: Record<string, number>;
    envStatus?: Record<string, string>;
    additionalInfo?: string;
  }
): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) return;

  const stepNames: Record<CronStep, string> = {
    init: '초기화',
    gemini: 'Gemini 콘텐츠 생성',
    template: 'HTML 템플릿 적용',
    capture: '이미지 캡처 (HCTI)',
    cloudinary: 'Cloudinary 업로드',
    instagram: 'Instagram 게시',
    complete: '완료',
  };

  let message: string;

  if (type === 'success') {
    const durationInfo = data.duration ? `\n⏱️ *소요시간:* ${(data.duration / 1000).toFixed(1)}초` : '';
    message = `📸 *polamkt Instagram 자동 게시 완료*

📝 *템플릿:* ${data.templateType}
🔗 *Instagram:* [게시글 보기](${data.instagramUrl})${durationInfo}

✅ 폴라애드 컨텐츠가 성공적으로 게시되었습니다!`;
  } else if (type === 'warning') {
    message = `⚠️ *polamkt Instagram 경고*

${data.additionalInfo || ''}

ℹ️ 작업은 계속 진행됩니다.`;
  } else {
    // 에러 메시지 구성
    const failedStepInfo = data.failedStep 
      ? `\n\n📍 *실패 단계:* ${stepNames[data.failedStep]}`
      : '';
    
    const lastSuccessInfo = data.lastSuccessStep && data.lastSuccessStep !== 'init'
      ? `\n✅ *마지막 성공:* ${stepNames[data.lastSuccessStep]}`
      : '';
    
    // 단계별 소요시간 (완료된 것만)
    const durationInfo = data.stepDurations 
      ? `\n\n⏱️ *단계별 소요시간:*\n${Object.entries(data.stepDurations)
          .filter(([k]) => k !== 'total')
          .map(([k, v]) => `  ${k}: ${(v / 1000).toFixed(1)}초`)
          .join('\n')}`
      : '';

    // 환경변수 상태 (에러 시에만)
    const envInfo = data.envStatus
      ? `\n\n🔧 *환경변수:*\n${Object.entries(data.envStatus).map(([k, v]) => `  ${k}: ${v}`).join('\n')}`
      : '';

    // 에러 스택 (첫 줄만)
    const stackInfo = data.errorStack
      ? `\n\n📋 *스택:* \`${data.errorStack.split('\n')[0].slice(0, 80)}\``
      : '';

    message = `❌ *polamkt Instagram 자동 게시 실패*
${failedStepInfo}${lastSuccessInfo}

⚠️ *오류:* ${data.errorMessage}${stackInfo}${durationInfo}${envInfo}

💡 *수동 실행:* polarad.co.kr/api/cron/instagram-polamkt?force=true`;
  }

  try {
    console.log(`📨 텔레그램 알림 발송 중... (${type})`);
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: false
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ 텔레그램 알림 실패:', response.status, errorData);
    } else {
      console.log('✅ 텔레그램 알림 발송 완료');
    }
  } catch (error) {
    console.error('❌ 텔레그램 알림 오류:', error);
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
    console.log('❌ 인증 실패 - CRON_SECRET 불일치');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 단계별 추적
  let currentStep: CronStep = 'init';
  const stepDurations: Record<string, number> = {};
  const startTime = Date.now();
  let stepStartTime = startTime;

  const trackStep = (step: CronStep) => {
    const now = Date.now();
    if (currentStep !== 'init') {
      stepDurations[currentStep] = now - stepStartTime;
    }
    currentStep = step;
    stepStartTime = now;
    console.log(`\n${'='.repeat(50)}\n[${step.toUpperCase()}] 시작 - 경과: ${((now - startTime) / 1000).toFixed(1)}초\n${'='.repeat(50)}`);
  };

  try {
    console.log('\n🚀 ========================================');
    console.log('📸 polamkt Instagram 자동 게시 시작');
    console.log(`⏰ 시작 시간: ${new Date().toISOString()}`);
    console.log(`🔧 Force Run: ${forceRun}`);
    console.log('========================================\n');

    // 환경변수 체크
    console.log('📋 환경변수 상태:');
    console.log(`  - GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅ 설정됨' : '❌ 없음'}`);
    console.log(`  - HCTI_API_USER_ID: ${process.env.HCTI_API_USER_ID ? '✅ 설정됨' : '❌ 없음'}`);
    console.log(`  - HCTI_API_KEY: ${process.env.HCTI_API_KEY ? '✅ 설정됨' : '❌ 없음'}`);
    console.log(`  - CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME ? '✅ 설정됨' : '❌ 없음'}`);
    console.log(`  - POLAMKT_INSTAGRAM_ACCESS_TOKEN: ${INSTAGRAM_ACCESS_TOKEN ? '✅ 설정됨 (' + INSTAGRAM_ACCESS_TOKEN.slice(0, 10) + '...)' : '❌ 없음'}`);
    console.log(`  - TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN ? '✅ 설정됨' : '❌ 없음'}`);

    // 1. Gemini로 컨텐츠 생성
    trackStep('gemini');
    console.log('🤖 Gemini로 컨텐츠 생성 중...');
    const content = await generateInstagramContent();
    console.log(`✅ 컨텐츠 생성 완료: ${content.templateType}`);
    console.log(`   - 캡션 길이: ${content.caption.length}자`);
    console.log(`   - 해시태그: ${content.hashtags.length}개`);

    // 2. HTML 템플릿 적용
    trackStep('template');
    console.log('🎨 HTML 템플릿 적용 중...');
    const html = generateTemplateHtml(content.templateType, content.templateData);
    console.log(`✅ HTML 템플릿 적용 완료 (${html.length}자)`);

    // 3. HTML → 이미지 캡쳐
    trackStep('capture');
    console.log('📷 이미지 캡쳐 중...');
    const imageBuffer = await captureHtmlToImage(html);

    if (!imageBuffer) {
      throw new Error('이미지 캡쳐 실패: 사용 가능한 스크린샷 서비스가 없습니다');
    }
    console.log(`✅ 이미지 캡쳐 완료 (${(imageBuffer.length / 1024).toFixed(1)}KB)`);

    // 4. Cloudinary 업로드
    trackStep('cloudinary');
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

    // 5. 캡션 + 해시태그 조합 (Instagram 2,200자 제한 적용)
    const INSTAGRAM_CAPTION_LIMIT = 2200;
    const separator = '\n\n.\n.\n.\n\n';
    const hashtagsStr = content.hashtags.join(' ');
    const reservedLength = separator.length + hashtagsStr.length;
    const maxCaptionLength = INSTAGRAM_CAPTION_LIMIT - reservedLength - 10; // 여유 10자

    // 캡션이 너무 길면 자르기
    let trimmedCaption = content.caption;
    if (trimmedCaption.length > maxCaptionLength) {
      console.log(`⚠️ 캡션 길이 초과: ${trimmedCaption.length}자 → ${maxCaptionLength}자로 자름`);
      // 문장 단위로 자르기 시도
      trimmedCaption = trimmedCaption.slice(0, maxCaptionLength);
      const lastNewline = trimmedCaption.lastIndexOf('\n');
      if (lastNewline > maxCaptionLength * 0.8) {
        trimmedCaption = trimmedCaption.slice(0, lastNewline);
      }
    }

    const fullCaption = `${trimmedCaption}${separator}${hashtagsStr}`;
    console.log(`📝 최종 캡션 길이: ${fullCaption.length}자 (제한: ${INSTAGRAM_CAPTION_LIMIT}자)`);

    // 6. Instagram 게시
    trackStep('instagram');
    console.log('📤 Instagram 게시 중...');
    const publishResult = await publishToInstagram(uploadResult.url, fullCaption);

    if (!publishResult.success) {
      throw new Error(`Instagram 게시 실패: ${publishResult.error}`);
    }
    console.log(`✅ Instagram 게시 완료: ${publishResult.permalink}`);

    // 완료
    trackStep('complete');
    const totalDuration = Date.now() - startTime;
    stepDurations['total'] = totalDuration;

    console.log('\n🎉 ========================================');
    console.log('✅ 전체 작업 완료!');
    console.log(`⏱️ 총 소요시간: ${(totalDuration / 1000).toFixed(1)}초`);
    console.log('단계별 소요시간:');
    Object.entries(stepDurations).forEach(([step, duration]) => {
      console.log(`  - ${step}: ${(duration / 1000).toFixed(1)}초`);
    });
    console.log('========================================\n');

    // 7. 텔레그램 + Slack 알림
    await Promise.all([
      sendTelegramNotification('success', {
        templateType: content.templateType,
        instagramUrl: publishResult.permalink,
        duration: totalDuration,
      }),
      logSuccessToSlack(
        '/api/cron/instagram-polamkt',
        `템플릿: ${content.templateType}\n${publishResult.permalink}`,
        totalDuration
      ),
    ]);

    return NextResponse.json({
      success: true,
      templateType: content.templateType,
      cloudinaryUrl: uploadResult.url,
      instagram: {
        postId: publishResult.postId,
        permalink: publishResult.permalink,
      },
      duration: totalDuration,
      stepDurations,
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    stepDurations[currentStep] = Date.now() - stepStartTime;
    stepDurations['total'] = totalDuration;

    // 마지막 성공 단계 계산
    const stepOrder: CronStep[] = ['init', 'gemini', 'template', 'capture', 'cloudinary', 'instagram', 'complete'];
    const failedIndex = stepOrder.indexOf(currentStep);
    const lastSuccessStep = failedIndex > 0 ? stepOrder[failedIndex - 1] : 'init';

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error('\n❌ ========================================');
    console.error(`❌ 에러 발생! (단계: ${currentStep})`);
    console.error(`✅ 마지막 성공 단계: ${lastSuccessStep}`);
    console.error(`⏱️ 실패까지 소요시간: ${(totalDuration / 1000).toFixed(1)}초`);
    console.error('에러 메시지:', errorMessage);
    if (errorStack) {
      console.error('스택 트레이스:', errorStack);
    }
    console.error('========================================\n');

    // 상세 에러 정보와 함께 텔레그램 + Slack 알림
    await Promise.all([
      sendTelegramNotification('error', {
        errorMessage,
        errorStack,
        failedStep: currentStep,
        lastSuccessStep,
        stepDurations,
        envStatus: getEnvStatus(),
      }),
      logErrorToSlack({
        source: '/api/cron/instagram-polamkt',
        errorMessage,
        errorStack,
        step: currentStep,
        lastSuccessStep,
        duration: totalDuration,
        envStatus: getEnvStatus(),
        additionalData: { stepDurations },
      }),
    ]);

    return NextResponse.json({
      error: 'Instagram posting failed',
      message: errorMessage,
      failedStep: currentStep,
      lastSuccessStep,
      stepDurations,
      envStatus: getEnvStatus(),
    }, { status: 500 });
  }
}

export const runtime = 'nodejs';
export const maxDuration = 120; // 120초 타임아웃 (Pro 플랜)
