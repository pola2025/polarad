/**
 * 유틸리티 함수 모음
 * - 재시도 전략
 * - JSON 파싱
 * - 알림 시스템
 */

// ============================================
// 재시도 전략 (Retry Strategies)
// ============================================

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}

/**
 * Gemini API 호출 재시도 래퍼
 */
export async function withGeminiRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000 } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.log(`[Gemini] 재시도 ${attempt + 1}/${maxRetries}: ${lastError.message}`);

      if (attempt < maxRetries - 1) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('All retries failed');
}

/**
 * Airtable API 호출 재시도 래퍼
 */
export async function withAirtableRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 500, maxDelay = 5000 } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.log(`[Airtable] 재시도 ${attempt + 1}/${maxRetries}: ${lastError.message}`);

      if (attempt < maxRetries - 1) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('All retries failed');
}

/**
 * GitHub API 호출 재시도 래퍼
 */
export async function withGitHubRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000 } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.log(`[GitHub] 재시도 ${attempt + 1}/${maxRetries}: ${lastError.message}`);

      if (attempt < maxRetries - 1) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('All retries failed');
}

// ============================================
// JSON 파싱 (수동 타입 검증)
// ============================================

// 중복 체크 결과 타입
interface DuplicateCheckResult {
  isDuplicate: boolean;
  similarTo?: string;
  reason?: string;
}

interface ParseResult<T> {
  success: boolean;
  data: T;
  error?: string;
  rawText?: string;
}

/**
 * 중복 체크 응답 파싱
 */
export function parseDuplicateCheck(text: string): ParseResult<DuplicateCheckResult> {
  try {
    // JSON 추출
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      return {
        success: false,
        data: { isDuplicate: false },
        error: 'No JSON found',
        rawText: text,
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // 수동 검증
    if (typeof parsed.isDuplicate !== 'boolean') {
      return {
        success: false,
        data: { isDuplicate: false },
        error: 'isDuplicate must be boolean',
        rawText: text,
      };
    }

    return {
      success: true,
      data: {
        isDuplicate: parsed.isDuplicate,
        similarTo: parsed.similarTo || undefined,
        reason: parsed.reason || undefined,
      },
    };
  } catch (error) {
    return {
      success: false,
      data: { isDuplicate: false },
      error: error instanceof Error ? error.message : 'Parse error',
      rawText: text,
    };
  }
}

// SEO 키워드 결과 타입
interface SEOKeywordsResult {
  primary: string;
  secondary: string[];
  lsi: string[];
  questions: string[];
  searchIntent: '정보형' | '거래형' | '탐색형';
  seoTitle?: string;
  metaDescription?: string;
}

/**
 * SEO 키워드 응답 파싱
 */
export function parseSEOKeywords(text: string): ParseResult<SEOKeywordsResult> {
  const defaultData: SEOKeywordsResult = {
    primary: '',
    secondary: [],
    lsi: [],
    questions: [],
    searchIntent: '정보형',
  };

  try {
    // JSON 추출
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        success: false,
        data: defaultData,
        error: 'No JSON found',
        rawText: text,
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // 수동 검증 및 기본값 적용
    const result: SEOKeywordsResult = {
      primary: typeof parsed.primary === 'string' ? parsed.primary : '',
      secondary: Array.isArray(parsed.secondary) ? parsed.secondary.filter((s: unknown) => typeof s === 'string') : [],
      lsi: Array.isArray(parsed.lsi) ? parsed.lsi.filter((s: unknown) => typeof s === 'string') : [],
      questions: Array.isArray(parsed.questions) ? parsed.questions.filter((s: unknown) => typeof s === 'string') : [],
      searchIntent: ['정보형', '거래형', '탐색형'].includes(parsed.searchIntent) ? parsed.searchIntent : '정보형',
      seoTitle: typeof parsed.seoTitle === 'string' ? parsed.seoTitle : undefined,
      metaDescription: typeof parsed.metaDescription === 'string' ? parsed.metaDescription : undefined,
    };

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      data: defaultData,
      error: error instanceof Error ? error.message : 'Parse error',
      rawText: text,
    };
  }
}

// ============================================
// 실패 추적 (Failure Tracker)
// ============================================

interface FailureRecord {
  type: string;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

/**
 * 실패 추적기
 */
export class FailureTracker {
  private failures: FailureRecord[] = [];
  private readonly maxRecords: number;

  constructor(maxRecords = 100) {
    this.maxRecords = maxRecords;
  }

  record(type: string, message: string, context?: Record<string, unknown>): void {
    this.failures.push({
      type,
      message,
      timestamp: new Date(),
      context,
    });

    // 오래된 기록 정리
    if (this.failures.length > this.maxRecords) {
      this.failures = this.failures.slice(-this.maxRecords);
    }
  }

  getRecent(count = 10): FailureRecord[] {
    return this.failures.slice(-count);
  }

  getByType(type: string): FailureRecord[] {
    return this.failures.filter(f => f.type === type);
  }

  clear(): void {
    this.failures = [];
  }
}

// ============================================
// 알림 시스템 (Notifications)
// ============================================

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ERROR_CHAT_ID = '-1003280236380'; // 에러 알림 채널

async function sendTelegramAlert(message: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.log('[Alert] Telegram 미설정:', message);
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_ERROR_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
  } catch (error) {
    console.error('[Alert] 텔레그램 전송 실패:', error);
  }
}

/**
 * 이미지 생성 실패 알림
 */
export function notifyImageGenerationFailed(
  title: string,
  attempts: number,
  lastError?: string
): void {
  const message = `⚠️ *이미지 생성 실패*

📝 제목: ${title}
🔄 시도: ${attempts}회
❌ 오류: ${lastError || '알 수 없음'}

기본 이미지로 대체됩니다.`;

  console.log('[Alert] 이미지 생성 실패:', title);
  sendTelegramAlert(message);
}

/**
 * JSON 파싱 실패 알림
 */
export function notifyJSONParseFailed(
  context: string,
  rawText: string,
  error: string
): void {
  const truncatedText = rawText.length > 200 ? rawText.slice(0, 200) + '...' : rawText;

  const message = `⚠️ *JSON 파싱 실패*

📍 컨텍스트: ${context}
❌ 오류: ${error}
📄 원본: \`${truncatedText}\`

기본값으로 처리됩니다.`;

  console.log(`[Alert] JSON 파싱 실패 (${context}):`, error);
  sendTelegramAlert(message);
}

/**
 * 품질 검사 실패 알림
 */
export function notifyQualityCheckFailed(
  title: string,
  score: number,
  issues: string[]
): void {
  const issueList = issues.slice(0, 5).map(i => `• ${i}`).join('\n');

  const message = `⚠️ *품질 검사 미달*

📝 제목: ${title}
📊 점수: ${score}/100
❌ 이슈:
${issueList}

발행은 진행되지만 검토가 필요합니다.`;

  console.log('[Alert] 품질 검사 미달:', title, score);
  sendTelegramAlert(message);
}
