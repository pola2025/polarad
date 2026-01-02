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

// 이미지 생성 에러 유형
export type ImageGenerationErrorType =
  | 'SAFETY_FILTER'      // 안전 필터에 의한 거부
  | 'RATE_LIMIT'         // API 호출 제한
  | 'TIMEOUT'            // 타임아웃
  | 'NO_IMAGE_DATA'      // 이미지 데이터 없음
  | 'API_ERROR'          // API 에러
  | 'UNKNOWN';           // 알 수 없는 에러

interface ImageGenerationError {
  type: ImageGenerationErrorType;
  message: string;
  shouldRetry: boolean;
  retryDelay?: number;  // ms
}

/**
 * Gemini 이미지 생성 에러 분석
 */
export function analyzeImageError(result: unknown, response?: Response): ImageGenerationError {
  // API 응답 에러 체크
  if (response && !response.ok) {
    if (response.status === 429) {
      return {
        type: 'RATE_LIMIT',
        message: 'API rate limit exceeded',
        shouldRetry: true,
        retryDelay: 30000,  // 30초 대기
      };
    }
    if (response.status >= 500) {
      return {
        type: 'API_ERROR',
        message: `Server error: ${response.status}`,
        shouldRetry: true,
        retryDelay: 5000,
      };
    }
    return {
      type: 'API_ERROR',
      message: `API error: ${response.status}`,
      shouldRetry: false,
    };
  }

  // 응답 결과 분석
  const resultObj = result as {
    candidates?: Array<{
      finishReason?: string;
      content?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string } }> };
    }>;
    error?: { message?: string; code?: number };
  };

  // 안전 필터 체크
  if (resultObj?.candidates?.[0]?.finishReason === 'SAFETY') {
    return {
      type: 'SAFETY_FILTER',
      message: 'Content blocked by safety filter',
      shouldRetry: true,  // 다른 프롬프트로 재시도
      retryDelay: 1000,
    };
  }

  // 이미지 데이터 없음
  const imageData = resultObj?.candidates?.[0]?.content?.parts?.find(
    (p) => p.inlineData?.mimeType?.startsWith('image/')
  );
  if (!imageData?.inlineData?.data) {
    return {
      type: 'NO_IMAGE_DATA',
      message: 'No image data in response',
      shouldRetry: true,
      retryDelay: 2000,
    };
  }

  // API 에러
  if (resultObj?.error) {
    return {
      type: 'API_ERROR',
      message: resultObj.error.message || 'Unknown API error',
      shouldRetry: resultObj.error.code === 503 || resultObj.error.code === 429,
      retryDelay: 5000,
    };
  }

  return {
    type: 'UNKNOWN',
    message: 'Unknown error',
    shouldRetry: true,
    retryDelay: 2000,
  };
}

/**
 * 이미지 생성 API 호출 (타임아웃 포함)
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = 60000
): Promise<Response> {
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

interface ImageRetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  timeout?: number;
  onRetry?: (attempt: number, error: ImageGenerationError) => void;
  getAlternativePrompt?: (attempt: number) => string | null;
}

/**
 * 이미지 생성 전용 재시도 래퍼
 * - 지수 백오프 적용
 * - 에러 유형별 처리
 * - 프롬프트 단순화 전략 지원
 * - 타임아웃 설정
 */
export async function withImageGenerationRetry<T>(
  fn: (attempt: number) => Promise<{ response: Response; result: T }>,
  options: ImageRetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 5,
    baseDelay = 2000,
    maxDelay = 30000,
    onRetry,
  } = options;

  let lastError: ImageGenerationError | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const { response, result } = await fn(attempt);

      // 응답 분석
      const error = analyzeImageError(result, response);

      // 이미지 데이터가 있으면 성공
      const resultObj = result as {
        candidates?: Array<{
          content?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string } }> };
        }>;
      };
      const imageData = resultObj?.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData?.mimeType?.startsWith('image/')
      );

      if (imageData?.inlineData?.data) {
        return result;
      }

      // 에러 처리
      lastError = error;

      if (!error.shouldRetry) {
        console.log(`[ImageGen] 재시도 불가 에러: ${error.type} - ${error.message}`);
        throw new Error(`Image generation failed: ${error.message}`);
      }

      if (attempt < maxRetries - 1) {
        const delay = Math.min(
          error.retryDelay || baseDelay * Math.pow(2, attempt),
          maxDelay
        );
        console.log(`[ImageGen] 재시도 ${attempt + 1}/${maxRetries}: ${error.type} - ${delay}ms 후 재시도`);

        if (onRetry) {
          onRetry(attempt, error);
        }

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      // AbortError (타임아웃)
      if (error instanceof Error && error.name === 'AbortError') {
        lastError = {
          type: 'TIMEOUT',
          message: 'Request timed out',
          shouldRetry: true,
          retryDelay: 5000,
        };
        console.log(`[ImageGen] 타임아웃 발생, 재시도 ${attempt + 1}/${maxRetries}`);
      } else {
        lastError = {
          type: 'UNKNOWN',
          message: error instanceof Error ? error.message : String(error),
          shouldRetry: true,
          retryDelay: 2000,
        };
        console.log(`[ImageGen] 에러 발생: ${lastError.message}, 재시도 ${attempt + 1}/${maxRetries}`);
      }

      if (attempt < maxRetries - 1) {
        const delay = Math.min(
          lastError.retryDelay || baseDelay * Math.pow(2, attempt),
          maxDelay
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Image generation failed after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
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

// ============================================
// 이미지 생성 통계 시스템
// ============================================

interface ImageGenerationStats {
  date: string;  // YYYY-MM-DD
  totalAttempts: number;
  successCount: number;
  failureCount: number;
  fallbackUsed: number;
  errorsByType: Record<ImageGenerationErrorType, number>;
  avgRetries: number;
  totalRetries: number;
  successfulGenerations: number;
  rateLimitHits: number;
  safetyFilterHits: number;
}

interface GenerationRecord {
  timestamp: Date;
  title: string;
  success: boolean;
  retries: number;
  finalSafetyLevel: 'normal' | 'safe' | 'minimal' | 'fallback';
  errorType?: ImageGenerationErrorType;
  durationMs: number;
}

// Vercel 서버리스에서는 메모리 내 통계 (요청 간 유지 안됨)
// 대신 Airtable이나 KV에 저장하는 것이 이상적이지만,
// 우선 요청 내 통계 + 텔레그램 알림으로 구현
const sessionStats: GenerationRecord[] = [];

/**
 * 이미지 생성 결과 기록
 */
export function recordImageGeneration(record: GenerationRecord): void {
  sessionStats.push(record);
  console.log(`[Stats] 이미지 생성 기록: ${record.success ? '✅ 성공' : '❌ 실패'} (${record.retries}회 재시도, ${record.durationMs}ms)`);
}

/**
 * 일별 통계 요약 생성
 */
export function generateDailyStats(records: GenerationRecord[]): ImageGenerationStats {
  const today = new Date().toISOString().split('T')[0];

  const errorsByType: Record<ImageGenerationErrorType, number> = {
    SAFETY_FILTER: 0,
    RATE_LIMIT: 0,
    TIMEOUT: 0,
    NO_IMAGE_DATA: 0,
    API_ERROR: 0,
    UNKNOWN: 0,
  };

  let totalRetries = 0;
  let successfulGenerations = 0;
  let fallbackUsed = 0;

  for (const record of records) {
    totalRetries += record.retries;

    if (record.success) {
      successfulGenerations++;
    }

    if (record.finalSafetyLevel === 'fallback') {
      fallbackUsed++;
    }

    if (record.errorType) {
      errorsByType[record.errorType]++;
    }
  }

  return {
    date: today,
    totalAttempts: records.length,
    successCount: records.filter(r => r.success).length,
    failureCount: records.filter(r => !r.success).length,
    fallbackUsed,
    errorsByType,
    avgRetries: records.length > 0 ? totalRetries / records.length : 0,
    totalRetries,
    successfulGenerations,
    rateLimitHits: errorsByType.RATE_LIMIT,
    safetyFilterHits: errorsByType.SAFETY_FILTER,
  };
}

/**
 * 이미지 생성 완료 시 통계 알림 (성공/실패 무관)
 */
export function notifyImageGenerationComplete(
  title: string,
  success: boolean,
  retries: number,
  safetyLevel: 'normal' | 'safe' | 'minimal' | 'fallback',
  durationMs: number,
  errorStats?: Record<ImageGenerationErrorType, number>
): void {
  const statusEmoji = success ? '✅' : '⚠️';
  const levelLabel = {
    normal: '일반',
    safe: '안전',
    minimal: '최소',
    fallback: '기본이미지',
  }[safetyLevel];

  // 에러 통계 문자열
  let errorSummary = '';
  if (errorStats) {
    const errors = Object.entries(errorStats)
      .filter(([, count]) => count > 0)
      .map(([type, count]) => `${type}: ${count}`)
      .join(', ');
    if (errors) {
      errorSummary = `\n🔍 에러: ${errors}`;
    }
  }

  const message = `${statusEmoji} *이미지 생성 완료*

📝 제목: ${title.slice(0, 30)}...
🎯 결과: ${success ? '성공' : '실패 (기본이미지 사용)'}
🔄 재시도: ${retries}회
📊 안전레벨: ${levelLabel}
⏱ 소요시간: ${(durationMs / 1000).toFixed(1)}초${errorSummary}`;

  console.log(`[Stats] ${statusEmoji} ${title.slice(0, 30)}... - ${retries}회 재시도, ${safetyLevel}`);

  // 실패하거나 3회 이상 재시도한 경우에만 알림
  if (!success || retries >= 3) {
    sendTelegramAlert(message);
  }
}

/**
 * Rate Limit 연속 발생 추적기
 */
export class RateLimitTracker {
  private consecutiveHits: number = 0;
  private lastHitTime: Date | null = null;
  private readonly resetWindowMs: number = 60000; // 1분 내 연속 발생 추적

  /**
   * Rate Limit 발생 기록
   * @returns 연속 발생 횟수
   */
  recordHit(): number {
    const now = new Date();

    // 1분 이상 지났으면 리셋
    if (this.lastHitTime && (now.getTime() - this.lastHitTime.getTime()) > this.resetWindowMs) {
      this.consecutiveHits = 0;
    }

    this.consecutiveHits++;
    this.lastHitTime = now;

    console.log(`[RateLimit] 연속 ${this.consecutiveHits}회 발생`);
    return this.consecutiveHits;
  }

  /**
   * 성공 시 리셋
   */
  reset(): void {
    this.consecutiveHits = 0;
    this.lastHitTime = null;
  }

  /**
   * 연속 발생 횟수 조회
   */
  getConsecutiveHits(): number {
    return this.consecutiveHits;
  }

  /**
   * 권장 대기 시간 계산 (연속 발생 횟수에 따라)
   * - 1회: 30초
   * - 2회: 60초
   * - 3회 이상: 5분
   */
  getRecommendedDelay(): number {
    if (this.consecutiveHits >= 3) {
      return 5 * 60 * 1000; // 5분
    }
    if (this.consecutiveHits >= 2) {
      return 60 * 1000; // 1분
    }
    return 30 * 1000; // 30초
  }
}

// 싱글톤 인스턴스
export const rateLimitTracker = new RateLimitTracker();

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
