/**
 * API 에러 핸들러
 * - 모든 API route에서 사용 가능한 에러 래퍼
 * - Slack + 텔레그램 동시 알림
 * - 자동 에러 추적 및 로깅
 */

import { NextResponse } from 'next/server';
import { logErrorToSlack, ErrorLogData } from './slack-logger';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = '-1003280236380'; // polarad 기본 채팅방

export interface ApiContext {
  source: string;           // API 경로
  step?: string;            // 현재 단계
  lastSuccessStep?: string; // 마지막 성공 단계
  startTime?: number;       // 시작 시간
  stepDurations?: Record<string, number>;
  envStatus?: Record<string, string>;
  additionalData?: Record<string, unknown>;
}

/**
 * 텔레그램 알림 전송 (기존 호환)
 */
async function sendTelegramAlert(message: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) return;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });
  } catch (error) {
    console.error('❌ 텔레그램 알림 전송 오류:', error);
  }
}

/**
 * 에러 발생 시 Slack + 텔레그램 동시 알림
 */
export async function reportError(
  error: Error | unknown,
  context: ApiContext
): Promise<void> {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  const duration = context.startTime ? Date.now() - context.startTime : undefined;

  console.error(`\n❌ [${context.source}] 에러 발생`);
  console.error(`   단계: ${context.step || 'unknown'}`);
  console.error(`   메시지: ${errorMessage}`);
  if (errorStack) {
    console.error(`   스택:\n${errorStack}`);
  }

  // 1. Slack 로그 전송
  const slackData: ErrorLogData = {
    source: context.source,
    errorMessage,
    errorStack,
    step: context.step,
    lastSuccessStep: context.lastSuccessStep,
    duration,
    envStatus: context.envStatus,
    additionalData: context.additionalData,
  };

  const slackResult = await logErrorToSlack(slackData);

  // 2. 텔레그램 알림 (간략하게)
  const kstTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  const telegramMessage = `❌ *에러 발생*

📍 *소스:* \`${context.source}\`
${context.step ? `📌 *실패 단계:* ${context.step}` : ''}
${context.lastSuccessStep ? `✅ *마지막 성공:* ${context.lastSuccessStep}` : ''}

⚠️ *오류:* ${errorMessage.slice(0, 200)}

⏰ ${kstTime}
${slackResult.success ? '📝 상세 로그: Slack #polarad-errors' : ''}`;

  await sendTelegramAlert(telegramMessage);
}

/**
 * API Route 래퍼 - try/catch 자동 처리
 */
export function withErrorHandler<T extends unknown[]>(
  source: string,
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    const startTime = Date.now();
    
    try {
      return await handler(...args);
    } catch (error) {
      await reportError(error, {
        source,
        startTime,
      });

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: errorMessage,
          source,
        },
        { status: 500 }
      );
    }
  };
}

/**
 * 단계별 추적이 가능한 API Context 생성
 */
export function createApiContext(source: string): {
  context: ApiContext;
  trackStep: (step: string) => void;
  reportError: (error: Error | unknown) => Promise<void>;
} {
  const context: ApiContext = {
    source,
    startTime: Date.now(),
    stepDurations: {},
  };

  let stepStartTime = Date.now();

  const trackStep = (step: string) => {
    const now = Date.now();
    if (context.step) {
      context.stepDurations![context.step] = now - stepStartTime;
      context.lastSuccessStep = context.step;
    }
    context.step = step;
    stepStartTime = now;
    console.log(`\n[${source}] 📍 ${step} 시작...`);
  };

  const reportErrorFn = async (error: Error | unknown) => {
    if (context.step) {
      context.stepDurations![context.step] = Date.now() - stepStartTime;
    }
    await reportError(error, context);
  };

  return { context, trackStep, reportError: reportErrorFn };
}

/**
 * 환경변수 상태 체크 유틸리티
 */
export function checkEnvVars(vars: string[]): Record<string, string> {
  const status: Record<string, string> = {};
  for (const varName of vars) {
    status[varName] = process.env[varName] ? '✅' : '❌';
  }
  return status;
}
