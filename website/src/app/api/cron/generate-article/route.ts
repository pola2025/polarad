// @ts-nocheck
/**
 * Vercel Cron Job: 자동 마케팅 뉴스 글 생성
 * ⚠️ 현재 비활성화됨 (2026-03-13) - 상품 콘텐츠만 운영
 * 스케줄: 월/수/금/일 오전 9시 (KST)
 *
 * ⚠️ GEMINI 모델 절대규칙 (변경 금지) ⚠️
 * ─────────────────────────────────────────
 * | 용도           | 모델                          |
 * |----------------|-------------------------------|
 * | 주제/SEO/중복  | gemini-3-flash-preview        |
 * | 콘텐츠 생성    | gemini-3.1-pro-preview          |
 * | 이미지 생성    | gemini-3.1-flash-image-preview  |
 * ─────────────────────────────────────────
 * ❌ Gemini 2.x 버전 사용 절대 금지
 * ❌ 모델명 임의 변경 금지
 */

import { NextResponse } from "next/server";
import sharp from "sharp";
import { uploadImageToR2, isR2Configured } from "@/lib/r2-storage";
import {
  CATEGORIES as ALL_CATEGORIES,
  type ArticleCategory,
} from "@/lib/marketing-news";
import {
  parseDuplicateCheck,
  parseSEOKeywords,
  withGeminiRetry,
  withAirtableRetry,
  FailureTracker,
  notifyImageGenerationFailed,
  notifyJSONParseFailed,
  notifyQualityCheckFailed,
} from "@/lib/utils/index";
import {
  validateContent as validateContentQuality,
  formatValidationSummary,
  generateRegenerationFeedback,
} from "@/lib/content-validator";
import { checkTitleDuplicate } from "@/lib/content-similarity";
import {
  buildContentPromptV2,
  validateContentV2,
  type CategoryKey as V2CategoryKey,
} from "@/lib/prompt-templates/v2-content-builder";
import { getUnusedTopic } from "@/lib/marketing-news/topic-archive";
import {
  generateUniqueVariation,
  buildImagePrompt,
  saveUsedCombo,
} from "@/lib/image-variation";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const CRON_SECRET = process.env.CRON_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = "-1003280236380"; // 마케팅 소식 알림 채널

// 자동 생성에서 사용하는 카테고리 (types.ts의 CATEGORIES 하위 집합)
type CategoryKey =
  | "meta-ads"
  | "instagram-reels"
  | "threads"
  | "faq"
  | "ai-tips"
  | "ai-news";

// 콘텐츠에서 사용할 연도 (현재 연도 사용)
function getContentYear(): string {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  // 현재 연도 사용
  return String(kstDate.getUTCFullYear());
}
const CURRENT_YEAR = getContentYear(); // 2026

// 요일별 카테고리 매핑 (0=일, 1=월, 2=화, ...)
const DAY_CATEGORY_MAP: Record<number, CategoryKey> = {
  0: "faq", // 일요일
  1: "meta-ads", // 월요일
  2: "ai-news", // 화요일
  3: "instagram-reels", // 수요일
  5: "threads", // 금요일
  6: "ai-tips", // 토요일
};

// 다음 작성 일정 계산 (월/화/수/금/토/일)
function getNextScheduleDate(): {
  date: string;
  dayName: string;
  category: string;
} {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);

  const scheduleDays = [0, 1, 2, 3, 5, 6]; // 일, 월, 화, 수, 금, 토
  const dayNames: Record<number, string> = {
    0: "일요일",
    1: "월요일",
    2: "화요일",
    3: "수요일",
    5: "금요일",
    6: "토요일",
  };

  let currentDay = kstDate.getUTCDay();
  let daysToAdd = 1;

  // 다음 실행 요일 찾기
  for (let i = 1; i <= 7; i++) {
    const nextDay = (currentDay + i) % 7;
    if (scheduleDays.includes(nextDay)) {
      daysToAdd = i;
      currentDay = nextDay;
      break;
    }
  }

  const nextDate = new Date(
    kstDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000,
  );
  const dateStr = `${nextDate.getUTCMonth() + 1}월 ${nextDate.getUTCDate()}일`;

  return {
    date: dateStr,
    dayName: dayNames[currentDay] || "",
    category: ALL_CATEGORIES[DAY_CATEGORY_MAP[currentDay]]?.label || "",
  };
}

// 텔레그램 알림 전송
async function sendTelegramNotification(
  type: "success" | "error",
  data: {
    title?: string;
    slug?: string;
    category?: string;
    errorMessage?: string;
    step?: string; // 실패 단계 (예: '주제 생성', '콘텐츠 생성', '이미지 생성')
  },
): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.log("⚠️ TELEGRAM_BOT_TOKEN 미설정 - 알림 스킵");
    return;
  }

  const nextSchedule = getNextScheduleDate();
  let message: string;

  const scheduleInfo = `📆 *작성 일정 (매주 오전 9시)*
• 월: Meta 광고
• 화: AI 뉴스
• 수: 인스타그램 릴스
• 금: 쓰레드
• 토: AI 활용 팁
• 일: FAQ`;

  if (type === "success") {
    const articleUrl = `https://polarad.co.kr/marketing-news/${data.slug}`;

    message = `✅ *마케팅 소식 자동 작성 완료*

📝 *제목:* ${data.title}
📁 *카테고리:* ${data.category}
🔗 *링크:* [바로가기](${articleUrl})
📸 *Instagram:* 09:30 자동 게시 예정

📅 *다음 작성:* ${nextSchedule.date} (${nextSchedule.dayName}) - ${nextSchedule.category}

${scheduleInfo}`;
  } else {
    const stepInfo = data.step ? `\n📍 *실패 단계:* ${data.step}` : "";
    const categoryInfo = data.category
      ? `\n📁 *카테고리:* ${data.category}`
      : "";

    message = `❌ *마케팅 소식 자동 작성 실패*
${categoryInfo}${stepInfo}

⚠️ *오류:*
\`\`\`
${data.errorMessage?.slice(0, 500) || "Unknown error"}
\`\`\`

📅 *다음 작성:* ${nextSchedule.date} (${nextSchedule.dayName}) - ${nextSchedule.category}

${scheduleInfo}

🔧 Vercel 로그를 확인해주세요.`;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
          disable_web_page_preview: false,
        }),
      },
    );

    if (!res.ok) {
      const error = await res.text();
      console.error("텔레그램 알림 실패:", error);
    } else {
      console.log("📨 텔레그램 알림 전송 완료");
    }
  } catch (error) {
    console.error("텔레그램 알림 오류:", error);
  }
}

function generateSlug(title: string): string {
  const map: Record<string, string> = {
    // SNS 플랫폼
    페이스북: "facebook",
    인스타그램: "instagram",
    구글: "google",
    메타: "meta",
    릴스: "reels",
    쓰레드: "threads",
    스토리: "story",
    피드: "feed",
    틱톡: "tiktok",
    유튜브: "youtube",
    // 마케팅 용어
    광고: "ads",
    마케팅: "marketing",
    트렌드: "trends",
    전략: "strategy",
    가이드: "guide",
    방법: "how-to",
    최적화: "optimization",
    예산: "budget",
    성과: "performance",
    차단: "blocked",
    복구: "recover",
    오류: "error",
    안됨: "not-working",
    리타게팅: "retargeting",
    타겟팅: "targeting",
    캠페인: "campaign",
    광고비: "ad-spend",
    클릭: "click",
    전환: "conversion",
    노출: "impression",
    도달: "reach",
    해시태그: "hashtag",
    알고리즘: "algorithm",
    팔로워: "follower",
    데드존: "deadzone",
    사이즈: "size",
    콘텐츠: "content",
    계정: "account",
    인게이지먼트: "engagement",
    // AI 관련
    인공지능: "ai",
    챗봇: "chatbot",
    자동화: "automation",
    생산성: "productivity",
    도구: "tools",
    플러그인: "plugin",
    모델: "model",
    업데이트: "update",
    출시: "release",
    기능: "features",
    사용법: "usage",
    설치: "install",
    설정: "setup",
    활용: "tips",
    추천: "recommend",
    비교: "comparison",
    분석: "analysis",
    정리: "summary",
    // 일반
    완벽: "complete",
    필수: "essential",
    최신: "latest",
    새로운: "new",
    영상: "video",
    편집: "edit",
    앱: "app",
  };

  let slug = title.toLowerCase();

  // 한글을 영어로 변환 (가장 긴 매핑부터 적용)
  const sortedEntries = Object.entries(map).sort(
    (a, b) => b[0].length - a[0].length,
  );
  for (const [kr, en] of sortedEntries) {
    slug = slug.replace(new RegExp(kr, "g"), en);
  }

  // 남은 한글 제거 및 정리
  slug = slug
    .replace(/[가-힣]+/g, "") // 남은 한글 제거
    .replace(/[^a-z0-9]+/g, "-") // 특수문자 → 하이픈
    .replace(/^-|-$/g, "") // 앞뒤 하이픈 제거
    .replace(/-+/g, "-") // 연속 하이픈 → 단일 하이픈
    .slice(0, 50);

  // 슬러그가 너무 짧으면 타임스탬프 추가
  if (slug.length < 5) {
    const timestamp = Date.now().toString(36); // 짧은 고유 ID
    slug = slug ? `${slug}-${timestamp}` : `article-${timestamp}`;
  }

  return slug;
}

// Airtable에서 슬러그 존재 여부 확인
async function checkSlugExists(slug: string): Promise<boolean> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    return false;
  }

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME!)}?filterByFormula={slug}='${slug}'&maxRecords=1`,
      { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } },
    );

    const result = await res.json();
    return (result.records?.length || 0) > 0;
  } catch (error) {
    console.error("슬러그 중복 체크 실패:", error);
    return false; // 에러 시 중복 아닌 것으로 처리 (진행 허용)
  }
}

// 오늘 이미 해당 카테고리 글이 생성되었는지 확인 (중복 실행 방지)
async function checkTodayArticleExists(
  category: string,
  today: string,
): Promise<{ exists: boolean; title?: string }> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    return { exists: false };
  }

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME!)}?filterByFormula=AND({date}='${today}',{category}='${category}')&maxRecords=1&fields[]=title`,
      { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } },
    );

    const result = await res.json();
    if (result.records?.length > 0) {
      return {
        exists: true,
        title: result.records[0].fields?.title,
      };
    }
    return { exists: false };
  } catch (error) {
    console.error("오늘 글 존재 여부 확인 실패:", error);
    return { exists: false }; // 에러 시 진행 허용
  }
}

// 유니크한 슬러그 보장 (중복 시 suffix 추가)
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let suffix = 2;
  const MAX_ATTEMPTS = 10;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const exists = await checkSlugExists(slug);

    if (!exists) {
      if (attempt > 0) {
        console.log(`✅ 유니크 슬러그 확보: ${slug} (${attempt}회 시도)`);
      }
      return slug;
    }

    console.log(`⚠️ 슬러그 중복 발견: ${slug}`);

    // suffix 추가 (-2, -3, ... 또는 타임스탬프)
    if (suffix <= 5) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    } else {
      // 5회 이상 중복 시 타임스탬프 사용
      const timestamp = Date.now().toString(36);
      slug = `${baseSlug}-${timestamp}`;
    }
  }

  // 최종 fallback: 타임스탬프 추가
  const finalTimestamp = Date.now().toString(36);
  console.log(
    `⚠️ 슬러그 중복 ${MAX_ATTEMPTS}회 초과, 타임스탬프 사용: ${baseSlug}-${finalTimestamp}`,
  );
  return `${baseSlug}-${finalTimestamp}`;
}

// 기존 글 제목 가져오기 (중복 방지용)
async function getExistingTitles(category: string): Promise<string[]> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    return [];
  }

  try {
    // 최근 30일 내 해당 카테고리 글 제목 가져오기
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filterDate = thirtyDaysAgo.toISOString().split("T")[0];

    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME!)}?filterByFormula=AND(IS_AFTER({date},'${filterDate}'),{category}='${category}')&fields[]=title`,
      { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } },
    );

    const result = await res.json();
    return (
      result.records
        ?.map((r: { fields: { title: string } }) => r.fields.title)
        .filter(Boolean) || []
    );
  } catch (error) {
    console.error("기존 글 제목 조회 실패:", error);
    return [];
  }
}

// AI 카테고리 여부 확인
function isAICategory(category: CategoryKey): boolean {
  return category === "ai-news" || category === "ai-tips";
}

// AI가 주제 자동 생성 (피드백 기반 재시도 지원)
async function generateTopic(
  category: CategoryKey,
  existingTitles: string[] = [],
  previousFeedback?: string,
): Promise<string> {
  const categoryLabel = ALL_CATEGORIES[category].label;

  // 기존 글 제목 목록 (중복 방지용)
  const existingTitlesText =
    existingTitles.length > 0
      ? `\n\n**[중복 방지 - 아래 제목들과 유사한 주제는 절대 피하세요]**:\n${existingTitles.map((t, i) => `${i + 1}. ${t}`).join("\n")}`
      : "";

  // 이전 시도 실패 피드백
  const feedbackText = previousFeedback
    ? `\n\n**[⚠️ 이전 시도 실패 - 반드시 수정하세요]**:\n${previousFeedback}\n위 문제를 해결한 새로운 제목을 생성하세요.`
    : "";

  // 필수 키워드 명시 (검증과 동기화)
  const requiredKeywordsInfo: Record<
    CategoryKey,
    { keywords: string[]; examples: string[] }
  > = {
    "meta-ads": {
      keywords: [
        "메타",
        "Meta",
        "페이스북",
        "Facebook",
        "인스타그램",
        "Instagram",
        "광고",
        "마케팅",
        "쓰레드",
        "Threads",
      ],
      examples: [
        "인스타그램 광고 최적화",
        "메타 광고 예산 설정",
        "페이스북 마케팅 전략",
      ],
    },
    "instagram-reels": {
      keywords: [
        "인스타그램",
        "Instagram",
        "릴스",
        "Reels",
        "영상",
        "콘텐츠",
        "알고리즘",
      ],
      examples: [
        "인스타그램 릴스 만드는 법",
        "릴스 알고리즘 공략",
        "인스타 릴스 조회수",
      ],
    },
    threads: {
      keywords: [
        "쓰레드",
        "Threads",
        "메타",
        "Meta",
        "팔로워",
        "콘텐츠",
        "SNS",
      ],
      examples: ["쓰레드 팔로워 늘리기", "메타 쓰레드 활용법", "쓰레드 마케팅"],
    },
    faq: {
      keywords: [
        "메타",
        "Meta",
        "페이스북",
        "Facebook",
        "인스타그램",
        "Instagram",
        "광고",
        "계정",
        "차단",
        "복구",
        "오류",
        "문제",
        "쓰레드",
        "Threads",
      ],
      examples: [
        "인스타그램 계정 정지 해제",
        "페이스북 광고 거부 해결",
        "메타 비즈니스 오류",
      ],
    },
    "ai-tips": {
      keywords: [
        "AI",
        "인공지능",
        "ChatGPT",
        "Claude",
        "Gemini",
        "MCP",
        "Cursor",
        "자동화",
        "생산성",
        "플러그인",
      ],
      examples: ["ChatGPT 활용법", "Claude MCP 설정", "AI 자동화 도구"],
    },
    "ai-news": {
      keywords: [
        "AI",
        "인공지능",
        "ChatGPT",
        "Claude",
        "Gemini",
        "GPT",
        "OpenAI",
        "Anthropic",
        "Google",
        "출시",
        "업데이트",
        "발표",
        "Llama",
        "Mistral",
      ],
      examples: [
        "ChatGPT 새 기능 출시",
        "Claude 업데이트 정리",
        "OpenAI GPT-5 발표",
      ],
    },
  };

  const categoryInfo = requiredKeywordsInfo[category];
  const mandatoryKeywordNote = `
**[🚨 필수 조건 - 반드시 준수]**:
제목에 다음 키워드 중 **최소 1개 이상 반드시 포함**:
${categoryInfo.keywords.map((k) => `"${k}"`).join(", ")}

올바른 제목 예시: ${categoryInfo.examples.join(", ")}
`;

  const topicPrompts: Record<CategoryKey, string> = {
    "meta-ads": `Meta(페이스북/인스타그램) 광고 또는 인스타그램 활용 관련 블로그 주제를 1개 제안하세요.
${mandatoryKeywordNote}
**[중요 제외 사항]**: 틱톡(TikTok) 관련 내용은 절대 포함하지 마세요. Meta 플랫폼(페이스북, 인스타그램, 쓰레드)만 다룹니다.

**[SEO 키워드 전략 - 필수 적용]**:
- 네이버/구글에서 실제 검색량이 높은 롱테일 키워드 타겟팅
- 제목 형식: "[메인키워드] + [구체적 수식어] + [연도/숫자]"
- 검색 의도 반영: 정보형("~방법", "~하는 법"), 비교형("~vs~"), 리스트형("~가지", "TOP~")

**주제 범위 (아래 중 하나 선택)**:
1. Meta 광고 운영: 광고 세팅, 예산 최적화, 타겟팅, 성과 분석
2. 인스타그램 콘텐츠: 릴스 만드는 법, 피드 구성, 스토리 활용
3. 인스타그램 기본 팁: 릴스 데드존 확인, 콘텐츠 사이즈 가이드, 해시태그 전략
4. 계정 운영: 팔로워 늘리기, 인게이지먼트 높이기, 알고리즘 이해
5. 비즈니스 활용: 인스타그램 쇼핑, 프로페셔널 계정 설정
6. 쓰레드(Threads) 활용: 쓰레드 시작하기, 인스타그램 연동, 콘텐츠 전략, 팔로워 확보

**검색 최적화 제목 예시**:
- "인스타그램 릴스 만드는 법 ${CURRENT_YEAR} 완벽 가이드 (초보자용)"
- "인스타그램 릴스 데드존 위치 확인 방법 총정리"
- "페이스북 광고 예산 설정 방법 - 소액으로 시작하기"
- "인스타그램 해시태그 추천 ${CURRENT_YEAR} (업종별 정리)"
- "쓰레드 팔로워 늘리는 법 7가지 전략"`,

    "instagram-reels": `인스타그램 릴스 관련 블로그 주제를 1개 제안하세요.
${mandatoryKeywordNote}
**[중요 제외 사항]**: 틱톡(TikTok) 관련 내용은 절대 포함하지 마세요. 인스타그램 릴스만 다룹니다.

**[SEO 키워드 전략 - 필수 적용]**:
- 네이버/구글에서 실제 검색량이 높은 롱테일 키워드 타겟팅
- 제목 형식: "[메인키워드] + [구체적 수식어] + [연도/숫자]"
- 검색 의도 반영: 정보형("~방법", "~하는 법"), 비교형("~vs~"), 리스트형("~가지")

**주제 범위 (아래 중 하나 선택)**:
1. 릴스 제작: 릴스 만드는 법, 편집 앱 추천, 트랜지션, 효과음
2. 릴스 알고리즘: 조회수 올리는 법, 추천 알고리즘, 최적 업로드 시간
3. 릴스 트렌드: 인기 음악, 트렌드 챌린지, 바이럴 포맷
4. 릴스 수익화: 보너스 프로그램, 브랜드 협찬, 인플루언서 성장
5. 릴스 사이즈/스펙: 최적 비율, 해상도, 길이 제한

**검색 최적화 제목 예시**:
- "인스타그램 릴스 만드는 법 ${CURRENT_YEAR} 완벽 가이드"
- "릴스 조회수 올리는 방법 7가지 (알고리즘 공략)"
- "인스타 릴스 편집 앱 추천 TOP 5 - 무료/유료 비교"
- "릴스 최적 업로드 시간 ${CURRENT_YEAR} 완전 정리"
- "인스타그램 릴스 트렌드 음악 찾는 법"`,

    threads: `Meta 쓰레드(Threads) 관련 블로그 주제를 1개 제안하세요.
${mandatoryKeywordNote}
**[중요 제외 사항]**: 틱톡(TikTok) 관련 내용은 절대 포함하지 마세요. Meta 쓰레드만 다룹니다.
**[중요 시점]**: ${CURRENT_YEAR}년 현재 기준 최신 정보를 다룹니다. 쓰레드는 이미 MAU 4억+의 주류 플랫폼이므로 "시작하기" 같은 초보 가이드보다 실전 활용/최신 기능 중심으로 작성합니다.

**[SEO 키워드 전략 - 필수 적용]**:
- 네이버/구글에서 실제 검색량이 높은 롱테일 키워드 타겟팅
- 제목 형식: "[메인키워드] + [구체적 수식어] + [연도/숫자]"
- 검색 의도 반영: 정보형("~방법", "~하는 법"), 비교형("~vs~"), 리스트형("~가지")

**주제 범위 (아래 중 하나 선택)**:
1. 쓰레드 광고: ${CURRENT_YEAR} 글로벌 확대된 Threads 광고 활용법, 광고 설정, 타겟팅, 성과 측정
2. 쓰레드 알고리즘 ${CURRENT_YEAR}: Reply Depth 기반 노출, 해시태그 비권장 대응, 시리즈(연재) 활용
3. 쓰레드 DM/커뮤니티: DM 마케팅 전략, 그룹 채팅(50명), 커뮤니티 기능 활용
4. 쓰레드 자동화/API: API 자동 발행, 웹훅 알림, 인사이트 분석, 폴(투표) 활용
5. 쓰레드 검색 노출: 키워드 검색 최적화, "From: username" 검색, 클릭 메트릭 활용
6. 쓰레드 크로스 플랫폼: 인스타 스토리 크로스포스팅, 독립 계정 운영, 프로필 링크(5개) 전략
7. 쓰레드 콘텐츠 전략: Ghost Posts(24시간 자동삭제), 스포일러 태그, GIF 활용, 투표 인게이지먼트
8. 쓰레드 비즈니스 성장: 브랜드 계정 운영, 팔로워 늘리기, 인게이지먼트 극대화

**검색 최적화 제목 예시**:
- "쓰레드 광고 시작하기 ${CURRENT_YEAR} 완벽 가이드 (설정부터 성과 분석까지)"
- "쓰레드 알고리즘 ${CURRENT_YEAR} - Reply Depth로 노출 늘리는 법"
- "쓰레드 DM 마케팅 전략 - 고객과 직접 소통하는 방법"
- "쓰레드 API 자동화 가이드 - 자동 발행부터 인사이트 분석까지"
- "쓰레드 검색 노출 최적화 ${CURRENT_YEAR} (키워드 전략)"
- "인스타그램↔쓰레드 크로스포스팅 완벽 가이드"
- "쓰레드 투표(Polls) 활용법 - 인게이지먼트 3배 높이는 전략"
- "쓰레드 vs X(트위터) ${CURRENT_YEAR} 최신 비교 (광고·DM·검색)"`,

    faq: `Meta 플랫폼(페이스북, 인스타그램, 쓰레드) 또는 Meta 광고 사용 중 겪는 문제 해결 관련 블로그 주제를 1개 제안하세요.
${mandatoryKeywordNote}
**[추가 조건]**:
1. Meta 플랫폼(페이스북, 인스타그램, 쓰레드) 또는 Meta 광고 관련 문제만 다룹니다
2. 건강, 영양, 음식, 의료, 여행 등 마케팅과 무관한 주제는 절대 금지

**[중요 제외 사항]**: 틱톡(TikTok) 관련 내용은 절대 포함하지 마세요.

**[SEO 키워드 전략]**:
- 제목 형식: "[플랫폼명] + [문제상황] + [해결/방법/복구]"
- 검색 의도: 문제 해결형, 트러블슈팅형

**주제 범위 (아래 중 하나 선택)**:
1. 인스타그램 계정 문제: 계정 정지, 비활성화, 해킹, 팔로워 급감
2. 페이스북 광고 문제: 광고 거부, 계정 비활성화, 게재 불가, 정책 위반
3. 메타 비즈니스 관리자: 접근 오류, 권한 문제, 설정 오류
4. 쓰레드 계정 문제: 계정 연동, 접근 제한, 기능 오류

**검색 최적화 제목 예시**:
- "인스타그램 계정 정지 해제 방법 ${CURRENT_YEAR} (이의제기 템플릿)"
- "페이스북 광고 계정 비활성화 복구하는 법"
- "인스타그램 팔로워 급감 원인과 해결 방법"
- "메타 비즈니스 관리자 오류 해결 총정리"
- "페이스북 광고 거부 사유별 해결 방법"
- "인스타그램 해킹 복구 완벽 가이드"`,

    "ai-tips": `GitHub, Reddit 등에서 추천 많이 받거나 유용성 평가가 완료된 AI 도구, MCP 서버, Claude Skills, 플러그인을 소개하는 블로그 주제를 1개 제안하세요.
${mandatoryKeywordNote}
**[중요]**: Google 검색을 통해 최근 1개월 이내 업데이트되거나 주목받는 AI 도구만 다룹니다. 실제 GitHub stars가 많거나 Reddit에서 호평받은 도구만 다룹니다. 사용방법, 설치방법, 공식 링크를 포함해야 합니다.

**[SEO 키워드 전략 - 필수 적용]**:
- 네이버/구글에서 실제 검색량이 높은 AI 도구/플러그인 관련 키워드 타겟팅
- 제목 형식: "[도구명] + [활용 방법/설치 가이드] + [연도]"
- 검색 의도 반영: 정보형("~사용법", "~설치방법"), 리스트형("추천 TOP~", "~가지")

**주제 범위 (아래 중 하나 선택)**:
1. MCP 서버 추천: Claude Code에서 사용 가능한 유용한 MCP 서버 (filesystem, github, brave-search 등)
2. Claude Skills/플러그인: 생산성 높이는 Claude 확장 기능
3. AI 코딩 도구: Cursor, GitHub Copilot, Codeium 등 코딩 보조 AI
4. AI 이미지 도구: Midjourney, DALL-E, Stable Diffusion, Flux 활용법
5. AI 자동화 도구: n8n, Make, Zapier AI 기능 활용
6. 오픈소스 AI 도구: GitHub에서 인기 있는 AI 프로젝트 소개
7. AI 브라우저 확장: ChatGPT, Claude 관련 유용한 크롬 확장
8. AI 생산성 앱: Notion AI, Obsidian AI 플러그인, 업무 자동화 도구

**필수 포함 내용**:
- 공식 GitHub 또는 다운로드 링크
- 설치 방법 (npm, pip, 또는 GUI 설치)
- 기본 사용법 예시
- 장단점 분석

**검색 최적화 제목 예시**:
- "Claude MCP 서버 추천 ${CURRENT_YEAR} - 생산성 높이는 5가지 필수 도구"
- "GitHub Copilot vs Cursor 비교 ${CURRENT_YEAR} - AI 코딩 도구 완벽 분석"
- "Cursor AI 사용법 완벽 가이드 - 설치부터 활용까지"
- "n8n AI 자동화 워크플로우 만들기 ${CURRENT_YEAR}"
- "오픈소스 AI 도구 추천 TOP 10 - GitHub Stars 기준"
- "Claude Desktop MCP 설정 방법 - 파일시스템, GitHub 연동 가이드"`,

    "ai-news": `최신 AI 도구, AI 서비스, AI 모델 출시 관련 뉴스를 전달하는 블로그 주제를 1개 제안하세요.
${mandatoryKeywordNote}
**[중요]**: Google 검색을 통해 최근 1개월 이내 발표된 실제 AI 관련 뉴스만 다룹니다. 신규 출시, 업데이트, 서비스 변경 등 검증된 뉴스성 콘텐츠를 작성합니다. 추측이나 루머는 제외합니다.

**🚨 AI 모델 관련 필수 규칙 🚨**
⚠️ 반드시 Google 검색 결과에서 "가장 최근 출시된 모델"을 확인하세요!
⚠️ 1개월 이상 지난 모델을 "최신", "새로운", "신규"로 표현하지 마세요!
⚠️ 검색 결과의 출시일을 확인하여 구버전인지 최신인지 판단하세요!

**[SEO 키워드 전략 - 필수 적용]**:
- 최신 AI 뉴스 관련 키워드 타겟팅
- 제목 형식: "[AI 서비스/모델명] + [뉴스 내용] + [날짜/연도]"
- 검색 의도 반영: 뉴스형("출시", "업데이트", "발표"), 분석형("의미", "영향")

**주제 범위 (아래 중 하나 선택)**:
1. 새 AI 모델 출시: Gemini 3, Claude 4, GPT-5 등 2025년 신규 모델
2. AI 서비스 업데이트: ChatGPT, Claude, Gemini 등 주요 서비스 기능 추가
3. AI 기업 동향: OpenAI, Anthropic, Google, Meta 등 AI 기업 뉴스
4. AI 규제/정책: AI 관련 법률, 규제, 정책 변화
5. AI 가격 정책: AI 서비스 가격 변경, 무료 플랜 확대 등
6. AI 파트너십: AI 기업 간 협력, 인수합병 소식
7. 오픈소스 AI: Llama 4, Mistral 등 오픈소스 모델 출시/업데이트

**필수 포함 내용**:
- 뉴스 출처 및 발표일 (정확한 날짜)
- 주요 변경 사항 요약
- 사용자에게 미치는 영향
- 공식 발표 링크

**검색 최적화 제목 예시**:
- "Gemini 3 Flash 출시 ${CURRENT_YEAR} - 새로운 기능과 성능 비교"
- "Claude 4 Opus 업데이트 - 달라진 점 총정리"
- "OpenAI GPT-5.2 발표 - 알려진 정보 정리"
- "Google AI Studio 새 기능 ${CURRENT_YEAR} - 개발자 필독"
- "Meta Llama 4 오픈소스 공개 - 성능 비교 분석"`,
  };

  const prompt = `${topicPrompts[category]}
${existingTitlesText}
${feedbackText}

카테고리: ${categoryLabel}

**🚨 최종 확인 사항**:
1. 제목에 연도를 포함할 경우 반드시 ${CURRENT_YEAR}년을 사용하세요. 2024년, 2025년은 절대 사용하지 마세요.
2. 위에 나열된 기존 글과 주제가 겹치지 않도록 완전히 다른 주제를 선택하세요.
3. 제목에 반드시 필수 키워드(${categoryInfo.keywords.slice(0, 3).join(", ")} 등) 중 1개 이상 포함하세요.

반드시 제목만 한 줄로 응답하세요. 다른 설명 없이 제목만 출력하세요.`;

  // AI 카테고리는 Google Search grounding 사용 (최신 정보 기반)
  const useGrounding = isAICategory(category);

  const requestBody: {
    contents: { parts: { text: string }[] }[];
    generationConfig: { temperature: number; maxOutputTokens: number };
    tools?: { google_search: Record<string, never> }[];
  } = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.9, maxOutputTokens: 200 },
  };

  if (useGrounding) {
    requestBody.tools = [{ google_search: {} }];
    console.log("🔍 AI 카테고리 - Google Search grounding 활성화");
  }

  try {
    // 모든 카테고리 gemini-3-flash-preview 사용
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      },
    );

    if (!res.ok) {
      console.error(`[generateTopic] API 실패: ${res.status}, 빈 주제 반환`);
      return "";
    }

    const result = await res.json();
    const topic =
      result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    return topic.replace(/^["']|["']$/g, "").replace(/^\d+\.\s*/, "");
  } catch (error) {
    console.error("[generateTopic] 에러 발생, 빈 주제 반환:", error);
    return "";
  }
}

// 주제 유효성 검증 (마케팅/광고 관련인지 확인)
function validateTopic(
  topic: string,
  category: CategoryKey,
): { isValid: boolean; reason?: string } {
  const lowercaseTopic = topic.toLowerCase();

  // 금지 키워드 (마케팅과 무관한 주제 + 제외 요청된 주제)
  const forbiddenKeywords = [
    // 건강/의료
    "건강",
    "영양",
    "비타민",
    "미네랄",
    "효능",
    "부작용",
    "음식",
    "식품",
    "의학",
    "치료",
    "질병",
    "증상",
    "약물",
    "의료",
    "병원",
    "운동",
    "다이어트",
    "체중",
    "피트니스",
    "phosphorus",
    "calcium",
    "vitamin",
    "health",
    "medical",
    "disease",
    // 음식/여행
    "요리",
    "레시피",
    "맛집",
    "여행",
    "관광",
    // 틱톡 (Meta 플랫폼만 다룸)
    "틱톡",
    "tiktok",
    "틱톡광고",
    "틱톡마케팅",
    // 개인정보/프라이버시 (제외 요청)
    "개인정보",
    "프라이버시",
    "쿠키리스",
    "gdpr",
    "ccpa",
    "제로파티",
    "퍼스트파티",
    "서드파티",
    "쿠키",
    "데이터보호",
    "개인정보보호",
  ];

  // 필수 키워드 (마케팅 관련)
  const requiredKeywords: Record<CategoryKey, string[]> = {
    "meta-ads": [
      "메타",
      "meta",
      "페이스북",
      "facebook",
      "인스타그램",
      "instagram",
      "광고",
      "마케팅",
      "쓰레드",
      "threads",
    ],
    "instagram-reels": [
      "인스타그램",
      "instagram",
      "릴스",
      "reels",
      "영상",
      "콘텐츠",
      "알고리즘",
    ],
    threads: [
      "쓰레드",
      "threads",
      "메타",
      "meta",
      "팔로워",
      "콘텐츠",
      "sns",
      "광고",
      "dm",
      "알고리즘",
      "검색",
      "api",
    ],
    faq: [
      "메타",
      "meta",
      "페이스북",
      "facebook",
      "인스타그램",
      "instagram",
      "광고",
      "계정",
      "차단",
      "복구",
      "오류",
      "문제",
      "쓰레드",
      "threads",
    ],
    "ai-tips": [
      "ai",
      "인공지능",
      "chatgpt",
      "claude",
      "gemini",
      "mcp",
      "cursor",
      "자동화",
      "생산성",
      "플러그인",
    ],
    "ai-news": [
      "ai",
      "인공지능",
      "chatgpt",
      "claude",
      "gemini",
      "gpt",
      "openai",
      "anthropic",
      "google",
      "출시",
      "업데이트",
      "발표",
      "llama",
      "mistral",
    ],
  };

  // 금지 키워드 체크
  for (const keyword of forbiddenKeywords) {
    if (lowercaseTopic.includes(keyword)) {
      return { isValid: false, reason: `금지 키워드 포함: ${keyword}` };
    }
  }

  // 필수 키워드 체크
  const categoryKeywords = requiredKeywords[category];
  const hasRequiredKeyword = categoryKeywords.some((kw) =>
    lowercaseTopic.includes(kw),
  );

  if (!hasRequiredKeyword) {
    return {
      isValid: false,
      reason: `카테고리 관련 키워드 없음. 필요: ${categoryKeywords.join(", ")}`,
    };
  }

  return { isValid: true };
}

// 중복 체크
async function checkDuplicateTopic(
  title: string,
  category: string,
): Promise<{ isDuplicate: boolean; similarTo?: string; reason?: string }> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    return { isDuplicate: false };
  }

  try {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const filterDate = twoWeeksAgo.toISOString().split("T")[0];

    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?filterByFormula=AND(IS_AFTER({date},'${filterDate}'),{category}='${category}')`,
      { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } },
    );

    if (!res.ok) {
      console.error(
        `[duplicate_check] Airtable API 실패: ${res.status}, 중복 체크 스킵`,
      );
      return { isDuplicate: false };
    }

    const result = await res.json();
    const recentTitles =
      result.records?.map(
        (r: { fields: { title: string } }) => r.fields.title,
      ) || [];

    if (recentTitles.length > 0) {
      const checkPrompt = `다음 새 글 제목이 기존 글들과 너무 비슷한지 판단해주세요.

새 글 제목: "${title}"

최근 2주 내 발행된 글 제목들:
${recentTitles.map((t: string, i: number) => `${i + 1}. ${t}`).join("\n")}

JSON으로만 응답: {"isDuplicate": true/false, "similarTo": "비슷한 기존 글 제목 또는 null", "reason": "이유"}`;

      // Gemini 재시도 적용
      const checkResult = await withGeminiRetry(async () => {
        const checkRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: checkPrompt }] }],
              generationConfig: { temperature: 0.1, maxOutputTokens: 200 },
            }),
          },
        );

        if (!checkRes.ok) {
          throw new Error(`Gemini API error: ${checkRes.status}`);
        }

        return checkRes.json();
      });
      const text =
        checkResult.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

      // 안전한 JSON 파싱 (Zod 스키마 검증)
      const parseResult = parseDuplicateCheck(text);
      if (!parseResult.success) {
        notifyJSONParseFailed(
          "duplicate_check",
          parseResult.rawText || text,
          parseResult.error || "Unknown error",
        );
        console.log(
          `[duplicate_check] JSON 파싱 실패, 기본값 사용: ${parseResult.error}`,
        );
      }
      return parseResult.data;
    }

    return { isDuplicate: false };
  } catch (error) {
    console.error("[duplicate_check] 에러 발생, 중복 체크 스킵:", error);
    return { isDuplicate: false };
  }
}

// SEO 키워드 생성 (Gemini 재시도 + 안전한 JSON 파싱)
async function generateSEOKeywords(title: string, category: string) {
  const prompt = `SEO 키워드 연구 전문가로서 "${title}" 주제의 키워드를 분석하세요. 카테고리: ${category}.
JSON 형식으로만 응답: {"primary":"메인키워드","secondary":["보조키워드5개"],"lsi":["LSI키워드5개"],"questions":["FAQ질문3개"],"searchIntent":"정보형또는거래형","seoTitle":"SEO최적화제목60자이내","metaDescription":"메타설명155자이내"}`;

  try {
    const result = await withGeminiRetry(async () => {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 1000 },
          }),
        },
      );

      if (!res.ok) {
        throw new Error(`Gemini API error: ${res.status}`);
      }

      return res.json();
    });

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // 안전한 JSON 파싱 (Zod 스키마 검증)
    const parseResult = parseSEOKeywords(text);
    if (!parseResult.success) {
      notifyJSONParseFailed(
        "seo_keywords",
        parseResult.rawText || text,
        parseResult.error || "Unknown error",
      );
      console.log(
        `[seo_keywords] JSON 파싱 실패, 기본값 사용: ${parseResult.error}`,
      );
    }
    return parseResult.data;
  } catch (error) {
    console.error("[seo_keywords] 모든 재시도 실패, fallback 사용:", error);
    return getDefaultSEOKeywords(title, category);
  }
}

// SEO 키워드 Fallback 생성
function getDefaultSEOKeywords(title: string, category: string) {
  // 카테고리별 기본 키워드
  const categoryKeywords: Record<string, string[]> = {
    "meta-ads": [
      "메타 광고",
      "페이스북 광고",
      "인스타그램 광고",
      "Meta Ads",
      "광고 최적화",
    ],
    "instagram-reels": [
      "인스타그램 릴스",
      "릴스 마케팅",
      "숏폼 콘텐츠",
      "Reels",
      "릴스 알고리즘",
    ],
    threads: [
      "쓰레드",
      "Threads",
      "메타 쓰레드",
      "쓰레드 광고",
      "쓰레드 마케팅",
      "쓰레드 DM",
      "쓰레드 알고리즘",
    ],
    faq: [
      "마케팅 FAQ",
      "광고 문제 해결",
      "트러블슈팅",
      "광고 오류",
      "해결 방법",
    ],
    "ai-tips": [
      "AI 활용",
      "인공지능 팁",
      "AI 도구",
      "업무 자동화",
      "AI 생산성",
    ],
    "ai-news": [
      "AI 뉴스",
      "인공지능 최신",
      "AI 트렌드",
      "AI 업데이트",
      "기술 동향",
    ],
  };

  const baseKeywords = categoryKeywords[category] || [
    "디지털 마케팅",
    "온라인 광고",
  ];

  // 제목에서 주요 단어 추출 (한글 2글자 이상)
  const titleWords = title.match(/[가-힣]{2,}/g) || [];
  const primaryKeyword = titleWords[0] || baseKeywords[0];

  return {
    primary: primaryKeyword,
    secondary: [
      ...new Set([...baseKeywords.slice(0, 3), ...titleWords.slice(1, 4)]),
    ].slice(0, 5),
    lsi: [
      `${primaryKeyword} 가이드`,
      `${primaryKeyword} ${CURRENT_YEAR}`,
      `${primaryKeyword} 방법`,
      `${primaryKeyword} 팁`,
      `${primaryKeyword} 전략`,
    ],
    questions: [
      `${primaryKeyword}란 무엇인가요?`,
      `${primaryKeyword} 어떻게 시작하나요?`,
      `${primaryKeyword} 성공 비결은?`,
    ],
    searchIntent: "정보형" as const,
    seoTitle: title.slice(0, 60),
    metaDescription:
      `${title}에 대해 알아봅니다. ${CURRENT_YEAR}년 최신 정보와 실전 가이드를 제공합니다.`.slice(
        0,
        155,
      ),
    isFallback: true, // fallback 여부 표시
  };
}

// AI 카테고리용: Google Search로 최신 정보 검색
async function searchLatestAIInfo(title: string): Promise<string> {
  const searchPrompt = `"${title}" 주제에 대해 최근 1개월 이내의 최신 정보를 검색하세요.

다음 내용을 정리해주세요:
1. 공식 발표일/출시일
2. 주요 기능 및 변경사항
3. 공식 링크 (GitHub, 공식 사이트 등)
4. 사용자 반응 및 평가

검색 결과를 요약해서 알려주세요.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: searchPrompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 2000 },
        tools: [{ google_search: {} }],
      }),
    },
  );

  const result = await res.json();
  return result.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// 콘텐츠 생성 (v2 프롬프트 빌더 사용 + 재시도 + fallback)
async function generateContent(
  title: string,
  category: CategoryKey,
  seoKeywords: {
    primary?: string;
    secondary?: string[];
    regenerationFeedback?: string;
  },
) {
  // AI 카테고리는 먼저 최신 정보 검색
  const useGrounding = isAICategory(category);
  let searchContext = "";

  if (useGrounding) {
    console.log(`🔍 AI 카테고리 - 최신 정보 검색 중...`);
    try {
      searchContext = await searchLatestAIInfo(title);
      console.log(`✅ 검색 완료 - ${searchContext.length}자 수집`);
    } catch (error) {
      console.error(`⚠️ 검색 실패, 검색 없이 진행:`, error);
    }
  }

  // v2 프롬프트 빌더 사용
  let prompt = buildContentPromptV2(title, category as V2CategoryKey, {
    seoKeywords: {
      primary: seoKeywords.primary,
      secondary: seoKeywords.secondary,
    },
    regenerationFeedback: seoKeywords.regenerationFeedback,
  });

  if (useGrounding && searchContext) {
    // 검색 결과를 프롬프트에 추가
    prompt = `[중요] 아래 검색 결과를 바탕으로 최신 정보 기반의 글을 작성하세요.
오래된 정보나 추측은 포함하지 마세요. 실제 발표일/출시일을 명시하세요.

## 최신 검색 결과
${searchContext}

---

${prompt}`;
    console.log(`📝 v2 프롬프트 사용 - 카테고리: ${category} (검색 결과 포함)`);
  } else {
    console.log(`📝 v2 프롬프트 사용 - 카테고리: ${category}`);
  }

  try {
    // 콘텐츠 생성 (withGeminiRetry로 3회 재시도)
    const result = await withGeminiRetry(async () => {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
          }),
        },
      );

      if (!res.ok) {
        throw new Error(`Gemini API error: ${res.status}`);
      }

      const data = await res.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (!content || content.length < 100) {
        throw new Error("Empty or too short content received");
      }

      return content;
    });

    return result;
  } catch (error) {
    console.error("[content] 모든 재시도 실패, fallback 콘텐츠 생성:", error);
    return generateFallbackContent(title, category, seoKeywords.primary);
  }
}

// 콘텐츠 생성 Fallback (API 완전 실패 시)
function generateFallbackContent(
  title: string,
  category: string,
  primaryKeyword?: string,
): string {
  const categoryLabels: Record<string, string> = {
    "meta-ads": "Meta 광고",
    "instagram-reels": "인스타그램 릴스",
    threads: "쓰레드",
    faq: "FAQ",
    "ai-tips": "AI 활용 팁",
    "ai-news": "AI 뉴스",
  };

  const categoryLabel = categoryLabels[category] || "마케팅";
  const keyword = primaryKeyword || title.match(/[가-힣]{2,}/)?.[0] || "마케팅";

  return `# ${title}

안녕하세요, Meta 광고 전문 대행사 **폴라애드(POLARAD)**입니다.

오늘은 **${keyword}**에 대해 알아보겠습니다.

---

## ${keyword}란?

${keyword}는 ${CURRENT_YEAR}년 디지털 마케팅에서 중요한 요소입니다. 효과적인 마케팅 전략을 위해 반드시 이해해야 할 개념입니다.

---

## 핵심 포인트

1. **기본 이해**: ${keyword}의 기본 개념을 먼저 파악하세요.
2. **실전 적용**: 실제 마케팅 캠페인에 적용하는 방법을 알아보세요.
3. **성과 측정**: 효과를 측정하고 최적화하는 방법을 익히세요.

---

## 폴라애드와 함께하세요

${categoryLabel} 관련 더 자세한 정보가 필요하시다면, 폴라애드에 문의해 주세요.

Meta 광고 전문가가 맞춤 컨설팅을 제공해 드립니다.

👉 **[폴라애드 무료 컨설팅 신청하기](https://polarad.co.kr)**

---

*이 글은 AI 생성 실패로 인한 기본 템플릿입니다. 관리자 수동 보완이 필요합니다.*
`;
}

// Airtable 업로드 (재시도 전략 적용)
async function uploadToAirtable(data: {
  title: string;
  category: string;
  content: string;
  tags: string[];
  seoKeywords: string[];
  publishedAt: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
}): Promise<string | null> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    console.log("[airtable] 환경변수 미설정 - 업로드 스킵");
    return null;
  }

  try {
    const result = await withAirtableRetry(async () => {
      const res = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            records: [
              {
                fields: {
                  date: data.publishedAt,
                  title: data.title,
                  category: data.category,
                  content: data.content,
                  tags: data.tags.join(", "),
                  seoKeywords: JSON.stringify(data.seoKeywords),
                  publishedAt: data.publishedAt,
                  status: "published",
                  slug: data.slug,
                  description: data.description,
                  thumbnailUrl: data.thumbnailUrl,
                },
              },
            ],
          }),
        },
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[Airtable] API error ${res.status}:`, errorText);
        console.error(`[Airtable] 전송 데이터:`, {
          title: data.title?.slice(0, 50),
          category: data.category,
          contentLength: data.content?.length,
          descriptionLength: data.description?.length,
          slug: data.slug,
        });
        throw new Error(`Airtable API error ${res.status}: ${errorText}`);
      }

      return res.json();
    });

    const recordId = result.records?.[0]?.id || null;
    if (!recordId) {
      console.error("[airtable] 레코드 ID 없음 - 응답:", result);
    }
    return recordId;
  } catch (error) {
    console.error("[airtable] 모든 재시도 실패:", error);
    return null;
  }
}

// Airtable 썸네일 URL 업데이트
async function updateAirtableThumbnail(
  recordId: string,
  thumbnailUrl: string,
): Promise<boolean> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    return false;
  }

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}/${recordId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: { thumbnailUrl },
        }),
      },
    );

    if (!res.ok) {
      console.error("[airtable] 썸네일 업데이트 실패:", res.status);
      return false;
    }

    console.log("✅ Airtable 썸네일 URL 업데이트 완료");
    return true;
  } catch (error) {
    console.error("[airtable] 썸네일 업데이트 오류:", error);
    return false;
  }
}

// IMAGE_PROMPTS 제거됨 → image-variation.ts의 generateUniqueVariation() + buildImagePrompt() 사용

// 썸네일 생성 (베리에이션 시스템 + 3단계 폴백)
async function generateThumbnail(
  title: string,
  slug: string,
): Promise<{ path: string }> {
  const API_TIMEOUT = 40000;

  // R2 설정 확인
  if (!isR2Configured()) {
    console.error("❌ R2 설정 없음 - 기본 이미지 사용");
    return { path: "/images/solution-website.webp" };
  }

  const timestamp = Date.now();
  let lastError = "";

  // 3단계 폴백: 각 단계마다 다른 베리에이션 사용
  for (let step = 0; step < 3; step++) {
    let variation;
    try {
      variation = await generateUniqueVariation();
    } catch (e) {
      console.error(`[이미지] 베리에이션 생성 실패:`, e);
      lastError = "VARIATION_ERROR";
      continue;
    }

    const prompt = buildImagePrompt(title, variation);
    console.log(
      `🖼️ 이미지 생성 시도 ${step + 1}/3 — ${variation.activity.slice(0, 40)}...`,
    );
    console.log(`📍 ${variation.location.slice(0, 80)}...`);

    // 각 단계에서 2회씩 시도
    for (let retry = 0; retry < 2; retry++) {
      try {
        // 재시도 시 2초 대기
        if (retry > 0) {
          console.log(`⏳ 2초 대기 후 재시도...`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseModalities: ["image", "text"] },
            }),
            signal: controller.signal,
          },
        );

        clearTimeout(timeoutId);

        // Rate Limit
        if (res.status === 429) {
          console.error(`[이미지] Rate Limit - 5초 대기`);
          lastError = "RATE_LIMIT";
          await new Promise((resolve) => setTimeout(resolve, 5000));
          continue;
        }

        if (!res.ok) {
          console.error(`[이미지] API 에러 ${res.status}`);
          lastError = `API_ERROR_${res.status}`;
          continue;
        }

        const result = await res.json();

        // 안전 필터 체크
        if (result.candidates?.[0]?.finishReason === "SAFETY") {
          console.error(`[이미지] 안전 필터 거부 - 다음 단계로`);
          lastError = "SAFETY_FILTER";
          break; // 다음 단계로 이동
        }

        const imageData = result.candidates?.[0]?.content?.parts?.find(
          (p: { inlineData?: { mimeType?: string; data?: string } }) =>
            p.inlineData?.mimeType?.startsWith("image/"),
        );

        if (imageData?.inlineData?.data) {
          const imageBuffer = Buffer.from(imageData.inlineData.data, "base64");

          // 반복 압축: 30KB 이하까지 quality 단계적 하향
          let quality = 75;
          let webpBuffer = await sharp(imageBuffer)
            .resize(1200, 630, { fit: "cover" })
            .webp({ quality })
            .toBuffer();

          while (webpBuffer.length > 30 * 1024 && quality > 20) {
            quality -= 15;
            webpBuffer = await sharp(imageBuffer)
              .resize(1200, 630, { fit: "cover" })
              .webp({ quality })
              .toBuffer();
          }

          const filename = `${slug}-${timestamp}.webp`;
          console.log(
            `☁️ R2 업로드: ${filename} (${(webpBuffer.length / 1024).toFixed(1)}KB, q=${quality})`,
          );
          const r2Url = await uploadImageToR2(
            webpBuffer,
            filename,
            "marketing-news",
          );
          console.log(`✅ 이미지 생성 성공`);

          // 사용 기록 저장 (실패해도 이미지 생성은 유효)
          try {
            await saveUsedCombo(variation);
          } catch (e) {
            console.warn("[이미지] 사용 기록 저장 실패 (무시):", e);
          }

          return { path: r2Url };
        } else {
          console.error(`[이미지] 이미지 데이터 없음`);
          lastError = "NO_IMAGE_DATA";
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.error(`[이미지] 타임아웃`);
          lastError = "TIMEOUT";
        } else {
          console.error(`[이미지] 에러:`, error);
          lastError = error instanceof Error ? error.message : "UNKNOWN";
        }
      }
    }
  }

  // 모든 시도 실패
  console.error(`❌ 이미지 생성 최종 실패: ${lastError}`);
  notifyImageGenerationFailed(
    title,
    6,
    `3단계 폴백 모두 실패. 마지막: ${lastError}`,
  );
  return { path: "/images/solution-website.webp" };
}

export async function GET(request: Request) {
  // 마케팅 뉴스 자동 생성 비활성화 (2026-03-13)
  // 상품 관련 콘텐츠(daily-content)만 운영, 마케팅 소식은 중단
  return NextResponse.json(
    { disabled: true, message: "마케팅 뉴스 자동 생성이 비활성화되었습니다" },
    { status: 200 },
  );

  const url = new URL(request.url);
  const forceCategory = url.searchParams.get("category") as CategoryKey | null;
  const forceRun = url.searchParams.get("force") === "true";

  // Cron 인증 확인 (force 파라미터가 없을 때만)
  const authHeader = request.headers.get("authorization");
  if (!forceRun && CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 오늘 요일 확인 (KST 기준)
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  const dayOfWeek = kstDate.getUTCDay();

  // 카테고리 결정: force 파라미터 > 요일별 매핑
  let category: CategoryKey | undefined =
    forceCategory && ALL_CATEGORIES[forceCategory as ArticleCategory]
      ? (forceCategory as CategoryKey)
      : DAY_CATEGORY_MAP[dayOfWeek];

  // 요일 체크 (force가 아닐 때만)
  if (!forceRun && !category) {
    return NextResponse.json({
      message: `오늘(${dayOfWeek})은 실행 요일이 아닙니다. 실행 요일: 일(0), 월(1), 화(2), 수(3), 금(5), 토(6)`,
      skipped: true,
    });
  }

  // force 모드인데 카테고리가 없으면 기본값 사용
  if (!category) {
    category = "meta-ads";
  }

  // 오늘 날짜 (KST 기준) - try 블록 밖에서 계산
  const today = kstDate.toISOString().split("T")[0];

  // 현재 실행 단계 추적 (에러 발생 시 알림에 사용)
  let currentStep = "초기화";

  try {
    console.log(`🚀 자동 글 생성 시작 - 카테고리: ${category}`);

    // 0. 중복 실행 방지: 오늘 이미 해당 카테고리 글이 생성되었는지 확인
    currentStep = "중복 확인";
    console.log(`🔍 중복 실행 확인 중... (${today}, ${category})`);
    const todayCheck = await checkTodayArticleExists(category!, today);
    if (todayCheck.exists && !forceRun) {
      console.log(
        `⚠️ 오늘 이미 ${category} 카테고리 글이 존재합니다: "${todayCheck.title}"`,
      );
      return NextResponse.json({
        message: `오늘(${today}) 이미 ${category} 카테고리 글이 생성되었습니다.`,
        existingTitle: todayCheck.title,
        skipped: true,
        reason: "duplicate_prevented",
      });
    }
    console.log(`✅ 중복 확인 완료 - 새 글 생성 진행`);

    // 0-2. 기존 글 제목 조회 (주제 중복 방지용)
    console.log("📋 기존 글 제목 조회...");
    const existingTitles = await getExistingTitles(category);
    console.log(`   최근 30일 내 ${category} 글: ${existingTitles.length}개`);

    // 1. 주제 선택 (아카이브 우선 → AI fallback)
    currentStep = "주제 선택";
    let title = "";
    let topicSource: "archive" | "ai" = "archive";

    // 1-1. 아카이브에서 주제 가져오기 (우선)
    console.log(`📚 주제 아카이브에서 주제 가져오기 시도...`);
    const archivedTopic = await getUnusedTopic(category);

    if (archivedTopic) {
      title = archivedTopic;
      console.log(`✅ 아카이브에서 주제 선택: "${title}"`);
    } else {
      // 1-2. 아카이브 비어있음 → AI 생성 fallback
      console.log(`⚠️ 아카이브 비어있음, AI 주제 생성 fallback...`);
      topicSource = "ai";

      let topicAttempts = 0;
      const MAX_TOPIC_ATTEMPTS = 5;
      let lastValidation: { isValid: boolean; reason?: string } = {
        isValid: false,
      };
      let previousFeedback: string | undefined;

      // 카테고리별 필수 키워드 (fallback용)
      const fallbackKeywords: Record<CategoryKey, string> = {
        "meta-ads": "인스타그램 광고",
        "instagram-reels": "인스타그램 릴스",
        threads: "쓰레드",
        faq: "인스타그램 계정",
        "ai-tips": "AI 활용",
        "ai-news": "AI 업데이트",
      };

      while (topicAttempts < MAX_TOPIC_ATTEMPTS) {
        title = await generateTopic(category, existingTitles, previousFeedback);
        console.log(`📝 AI 생성 주제 (시도 ${topicAttempts + 1}): ${title}`);

        lastValidation = validateTopic(title, category);
        if (lastValidation.isValid) {
          console.log(`✅ 주제 유효성 검증 통과`);
          break;
        }

        console.log(`⚠️ 주제 유효성 검증 실패: ${lastValidation.reason}`);
        topicAttempts++;
        previousFeedback = `생성한 제목 "${title}"이(가) 거부되었습니다. 이유: ${lastValidation.reason}`;

        // 2회 시도 후부터 fallback 적용 (키워드 자동 삽입)
        if (topicAttempts >= 2) {
          const keyword = fallbackKeywords[category];
          if (title && !title.toLowerCase().includes(keyword.toLowerCase())) {
            // 여러 fallback 패턴 시도
            const fallbackPatterns = [
              `${keyword} ${title.replace(/^.*?(?=[가-힣A-Za-z])/, "")}`.trim(),
              `${keyword} 완벽 가이드 ${CURRENT_YEAR}`,
              `${keyword} 활용법 총정리`,
              `${keyword} 시작하기 - 초보자 가이드`,
            ];

            for (const fallbackTitle of fallbackPatterns) {
              console.log(`🔄 Fallback 시도: "${fallbackTitle}"`);
              const fallbackValidation = validateTopic(fallbackTitle, category);
              if (fallbackValidation.isValid) {
                title = fallbackTitle;
                console.log(`✅ Fallback 주제 유효성 검증 통과`);
                lastValidation = fallbackValidation;
                break;
              }
            }

            if (lastValidation.isValid) break;
          }
        }

        if (topicAttempts >= MAX_TOPIC_ATTEMPTS) {
          throw new Error(
            `주제 생성 실패: 아카이브 비어있고, AI ${MAX_TOPIC_ATTEMPTS}회 시도 후에도 유효한 주제 생성 실패. 마지막 실패 사유: ${lastValidation.reason}`,
          );
        }
      }
    }

    console.log(`📌 최종 주제: "${title}" (source: ${topicSource})`);

    // 2. 중복 체크 (빠른 Jaccard 유사도 → AI 검증)
    let duplicateAttempts = 0;
    while (duplicateAttempts < 3) {
      // 2-1. 빠른 사전 필터링 (Jaccard 유사도, API 호출 불필요)
      const quickCheck = checkTitleDuplicate(title, existingTitles, 0.6);
      if (quickCheck.isDuplicate) {
        console.log(
          `⚡ 빠른 중복 감지: "${quickCheck.matchedTitle}" (유사도 ${(quickCheck.similarity || 0) * 100}%)`,
        );
        duplicateAttempts++;

        // 피드백 포함 재생성
        let validTitle = false;
        let regenAttempts = 0;
        let regenFeedback = `"${title}"은(는) "${quickCheck.matchedTitle}"과(와) 너무 유사합니다. 완전히 다른 주제를 생성하세요.`;

        while (!validTitle && regenAttempts < 3) {
          title = await generateTopic(category, existingTitles, regenFeedback);
          const validation = validateTopic(title, category);
          if (validation.isValid) {
            validTitle = true;
          } else {
            console.log(`⚠️ 재생성 주제 유효성 실패: ${validation.reason}`);
            regenFeedback = `생성한 제목 "${title}"이(가) 거부되었습니다. 이유: ${validation.reason}`;
            regenAttempts++;
          }
        }
        continue;
      }

      // 2-2. AI 기반 상세 중복 검사 (Jaccard 통과 시에만)
      const duplicateCheck = await checkDuplicateTopic(title, category);
      if (!duplicateCheck.isDuplicate) break;

      console.log(
        `⚠️ AI 중복 발견: "${duplicateCheck.similarTo}", 재생성... (${duplicateAttempts + 1}/3)`,
      );

      // 피드백 포함 재생성
      let validTitle = false;
      let regenAttempts = 0;
      let regenFeedback = `"${title}"은(는) 기존 글 "${duplicateCheck.similarTo}"과(와) 중복됩니다. 완전히 다른 주제를 생성하세요.`;

      while (!validTitle && regenAttempts < 3) {
        title = await generateTopic(category, existingTitles, regenFeedback);
        const validation = validateTopic(title, category);
        if (validation.isValid) {
          validTitle = true;
        } else {
          console.log(`⚠️ 재생성 주제 유효성 실패: ${validation.reason}`);
          regenFeedback = `생성한 제목 "${title}"이(가) 거부되었습니다. 이유: ${validation.reason}`;
          regenAttempts++;
        }
      }

      duplicateAttempts++;
    }

    // 슬러그 생성 + 중복 체크
    const baseSlug = generateSlug(title);
    console.log(`🔗 슬러그 생성: ${baseSlug}`);
    const slug = await ensureUniqueSlug(baseSlug);

    // 3. SEO 키워드 연구
    currentStep = "SEO 키워드 연구";
    console.log("🔍 SEO 키워드 연구...");
    const seoKeywords = await generateSEOKeywords(title, category);

    // 4. 콘텐츠 생성 + 품질 검증
    currentStep = "콘텐츠 생성";
    console.log("✍️ 콘텐츠 생성...");
    let content = await generateContent(title, category, seoKeywords);

    // 4-1. 품질 검증
    const keywords = [
      seoKeywords.primary,
      ...(seoKeywords.secondary || []).slice(0, 2),
    ].filter(Boolean);

    let validationResult = validateContentQuality(content, {
      keywords,
      category,
    });
    console.log(
      `📊 품질 점수: ${validationResult.score}/100 (${validationResult.grade})`,
    );

    // 4-2. 품질 미달 시 1회 재생성 시도
    if (
      validationResult.score < 70 &&
      validationResult.recommendation === "regenerate"
    ) {
      console.log("⚠️ 품질 미달, 피드백 포함 재생성 시도...");
      const feedback = generateRegenerationFeedback(validationResult);

      // 피드백을 포함한 재생성 프롬프트
      content = await generateContent(title, category, {
        ...seoKeywords,
        regenerationFeedback: feedback,
      });

      // 재검증
      validationResult = validateContentQuality(content, {
        keywords,
        category,
      });
      console.log(
        `📊 재생성 품질 점수: ${validationResult.score}/100 (${validationResult.grade})`,
      );
    }

    // 4-3. 여전히 70점 미만이면 경고 알림 (발행은 계속)
    if (validationResult.score < 70) {
      console.log(`⚠️ 품질 점수 미달 상태로 발행: ${validationResult.score}점`);
      notifyQualityCheckFailed(
        title,
        validationResult.score,
        validationResult.issues.map((i) => i.message),
      );
    }

    console.log(formatValidationSummary(validationResult));

    // 5. MDX 파일 구성 (이미지 없이 먼저 준비)
    const description =
      seoKeywords.metaDescription || `${title}에 대해 알아봅니다.`;
    const seoTitle = seoKeywords.seoTitle || title;
    const tags = [
      seoKeywords.primary,
      ...(seoKeywords.secondary || []).slice(0, 3),
    ]
      .filter(Boolean)
      .slice(0, 7);

    const allKeywords = [
      seoKeywords.primary,
      ...(seoKeywords.secondary || []),
      ...(seoKeywords.lsi || []),
    ]
      .filter(Boolean)
      .slice(0, 15);

    // 6. Airtable 먼저 저장 (이미지 없이) - 이후 업데이트
    currentStep = "Airtable 저장";
    console.log("📊 Airtable 우선 저장 (콘텐츠만)...");
    const tempThumbnailUrl = "/images/solution-website.webp"; // 임시 기본 이미지
    let airtableId = await uploadToAirtable({
      title: seoTitle,
      category,
      content,
      tags,
      seoKeywords: allKeywords,
      publishedAt: today,
      slug,
      description,
      thumbnailUrl: `https://polarad.co.kr${tempThumbnailUrl}`,
    });

    if (airtableId) {
      console.log(`✅ Airtable 저장 완료: ${airtableId}`);
    } else {
      console.log("⚠️ Airtable 저장 실패, 계속 진행...");
    }

    // 7. 썸네일 생성 (R2 업로드)
    currentStep = "이미지 생성";
    console.log("🖼️ 썸네일 생성...");
    const thumbnail = await generateThumbnail(title, slug);

    // 7-1. 이미지 생성 성공 시 Airtable 업데이트
    if (airtableId && thumbnail.path !== "/images/solution-website.webp") {
      console.log("📊 Airtable 이미지 URL 업데이트...");
      const thumbnailUrl = thumbnail.path.startsWith("http")
        ? thumbnail.path
        : `https://polarad.co.kr${thumbnail.path}`;
      await updateAirtableThumbnail(airtableId, thumbnailUrl);
    }

    const result = {
      success: true,
      title: seoTitle,
      category,
      slug,
      thumbnail: thumbnail.path,
      airtableId,
      generatedAt: new Date().toISOString(),
    };

    console.log("✅ 완료!", result);

    // 9. 텔레그램 알림 (성공) - Instagram은 별도 Cron에서 처리
    await sendTelegramNotification("success", {
      title: seoTitle,
      slug,
      category: ALL_CATEGORIES[category].label,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ 에러:", error);
    const errorMessage =
      error instanceof Error
        ? `${error.message}\n\nStack: ${error.stack?.split("\n").slice(0, 5).join("\n")}`
        : "Unknown error";

    // 텔레그램 알림 (실패) - 카테고리와 단계 정보 포함
    await sendTelegramNotification("error", {
      errorMessage,
      category: category ? ALL_CATEGORIES[category]?.label : undefined,
      step: currentStep,
    });

    return NextResponse.json(
      {
        error: "Generation failed",
        message: errorMessage,
      },
      { status: 500 },
    );
  }
}
