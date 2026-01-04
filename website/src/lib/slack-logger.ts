/**
 * Slack 에러 로깅 유틸리티
 * - Vercel API 에러를 Slack 채널에 기록
 * - 스레드로 관련 에러 그룹화
 * - 에러 히스토리 조회 가능
 */

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_ERROR_CHANNEL_ID = process.env.SLACK_ERROR_CHANNEL_ID || 'C0A715YKZED';

export interface ErrorLogData {
  // 기본 정보
  source: string;           // API 경로 (예: /api/cron/instagram-polamkt)
  errorMessage: string;     // 에러 메시지
  errorStack?: string;      // 스택 트레이스
  
  // 컨텍스트
  step?: string;            // 실패 단계
  lastSuccessStep?: string; // 마지막 성공 단계
  duration?: number;        // 소요 시간 (ms)
  
  // 환경 정보
  envStatus?: Record<string, string>;  // 환경변수 상태
  requestInfo?: {
    method?: string;
    url?: string;
    userAgent?: string;
    ip?: string;
  };
  
  // 추가 데이터
  additionalData?: Record<string, unknown>;
}

interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
  elements?: Array<{
    type: string;
    text?: string | { type: string; text: string; emoji?: boolean };
    action_id?: string;
    url?: string;
  }>;
  fields?: Array<{
    type: string;
    text: string;
  }>;
}

/**
 * Slack에 에러 로그 전송
 */
export async function logErrorToSlack(data: ErrorLogData): Promise<{ success: boolean; threadTs?: string; error?: string }> {
  if (!SLACK_BOT_TOKEN) {
    console.warn('⚠️ SLACK_BOT_TOKEN 미설정 - Slack 로깅 스킵');
    return { success: false, error: 'SLACK_BOT_TOKEN not configured' };
  }

  const timestamp = new Date().toISOString();
  const kstTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  // 메인 메시지 블록 구성
  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `❌ 에러 발생: ${data.source}`,
        emoji: true,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*시간:*\n${kstTime}`,
        },
        {
          type: 'mrkdwn',
          text: `*소스:*\n\`${data.source}\``,
        },
      ],
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*에러 메시지:*\n\`\`\`${data.errorMessage}\`\`\``,
      },
    },
  ];

  // 단계 정보 추가
  if (data.step || data.lastSuccessStep) {
    blocks.push({
      type: 'section',
      fields: [
        ...(data.step ? [{
          type: 'mrkdwn',
          text: `*실패 단계:*\n${data.step}`,
        }] : []),
        ...(data.lastSuccessStep ? [{
          type: 'mrkdwn',
          text: `*마지막 성공:*\n${data.lastSuccessStep}`,
        }] : []),
        ...(data.duration ? [{
          type: 'mrkdwn',
          text: `*소요 시간:*\n${(data.duration / 1000).toFixed(1)}초`,
        }] : []),
      ],
    });
  }

  // 환경변수 상태 추가
  if (data.envStatus && Object.keys(data.envStatus).length > 0) {
    const envText = Object.entries(data.envStatus)
      .map(([key, value]) => `${value} ${key}`)
      .join('\n');
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*환경변수 상태:*\n\`\`\`${envText}\`\`\``,
      },
    });
  }

  // 구분선
  blocks.push({ type: 'divider' });

  // 액션 버튼
  blocks.push({
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: '🔄 수동 실행',
          emoji: true,
        },
        action_id: 'manual_retry',
        url: `https://polarad.co.kr${data.source}?force=true`,
      },
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: '📋 Vercel 로그',
          emoji: true,
        },
        action_id: 'view_logs',
        url: 'https://vercel.com/pola2025/polarad/logs',
      },
    ],
  });

  try {
    // 메인 메시지 전송
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
      },
      body: JSON.stringify({
        channel: SLACK_ERROR_CHANNEL_ID,
        blocks,
        text: `❌ 에러: ${data.source} - ${data.errorMessage}`, // 폴백 텍스트
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('❌ Slack 메시지 전송 실패:', result.error);
      return { success: false, error: result.error };
    }

    const threadTs = result.ts;
    console.log(`✅ Slack 에러 로그 전송 완료 (thread: ${threadTs})`);

    // 스택 트레이스는 스레드에 별도 전송
    if (data.errorStack) {
      await sendThreadMessage(threadTs, `*📋 스택 트레이스:*\n\`\`\`${data.errorStack.slice(0, 2500)}\`\`\``);
    }

    // 추가 데이터도 스레드에 전송
    if (data.additionalData && Object.keys(data.additionalData).length > 0) {
      await sendThreadMessage(threadTs, `*📊 추가 데이터:*\n\`\`\`${JSON.stringify(data.additionalData, null, 2).slice(0, 2500)}\`\`\``);
    }

    return { success: true, threadTs };

  } catch (error) {
    console.error('❌ Slack 에러 로그 전송 오류:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * 스레드에 메시지 추가
 */
async function sendThreadMessage(threadTs: string, text: string): Promise<void> {
  if (!SLACK_BOT_TOKEN) return;

  try {
    await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
      },
      body: JSON.stringify({
        channel: SLACK_ERROR_CHANNEL_ID,
        thread_ts: threadTs,
        text,
      }),
    });
  } catch (error) {
    console.error('❌ Slack 스레드 메시지 전송 오류:', error);
  }
}

/**
 * 최근 에러 로그 조회 (채널 히스토리)
 */
export async function getRecentErrors(limit: number = 20): Promise<{ success: boolean; errors?: unknown[]; error?: string }> {
  if (!SLACK_BOT_TOKEN) {
    return { success: false, error: 'SLACK_BOT_TOKEN not configured' };
  }

  try {
    const response = await fetch(
      `https://slack.com/api/conversations.history?channel=${SLACK_ERROR_CHANNEL_ID}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
        },
      }
    );

    const result = await response.json();

    if (!result.ok) {
      return { success: false, error: result.error };
    }

    // 에러 메시지만 필터링 (❌로 시작하는 것)
    const errorMessages = result.messages?.filter((msg: { text?: string }) => 
      msg.text?.includes('에러') || msg.text?.includes('❌')
    ) || [];

    return { success: true, errors: errorMessages };

  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * 성공 알림 전송 (선택적)
 */
export async function logSuccessToSlack(source: string, message: string, duration?: number): Promise<void> {
  if (!SLACK_BOT_TOKEN) return;

  const kstTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  const durationText = duration ? ` (${(duration / 1000).toFixed(1)}초)` : '';

  try {
    await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
      },
      body: JSON.stringify({
        channel: SLACK_ERROR_CHANNEL_ID,
        text: `✅ *${source}* 성공${durationText}\n${message}\n_${kstTime}_`,
      }),
    });
  } catch (error) {
    console.error('❌ Slack 성공 알림 전송 오류:', error);
  }
}
