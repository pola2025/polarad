/**
 * Vercel Cron Job: 자동 마케팅 뉴스 글 생성
 * 스케줄: 월/수/금/일 오전 9시 (KST)
 */

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import {
  generateUniqueVariation,
  buildImagePrompt,
  saveUsedCombo,
  checkImageDuplicate,
} from '@/lib/image-variation';
import { CATEGORIES as ALL_CATEGORIES, type ArticleCategory } from '@/lib/marketing-news';
import {
  parseDuplicateCheck,
  parseSEOKeywords,
  withGeminiRetry,
  withAirtableRetry,
  withGitHubRetry,
  FailureTracker,
  notifyImageGenerationFailed,
  notifyJSONParseFailed,
  notifyQualityCheckFailed,
} from '@/lib/utils/index';
import {
  validateContent as validateContentQuality,
  formatValidationSummary,
  generateRegenerationFeedback,
} from '@/lib/content-validator';
import { checkTitleDuplicate } from '@/lib/content-similarity';
import {
  buildContentPromptV2,
  validateContentV2,
  type CategoryKey as V2CategoryKey,
} from '@/lib/prompt-templates/v2-content-builder';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const CRON_SECRET = process.env.CRON_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = '-1003280236380'; // 마케팅 소식 알림 채널

// 자동 생성에서 사용하는 카테고리 (types.ts의 CATEGORIES 하위 집합)
type CategoryKey = 'meta-ads' | 'instagram-reels' | 'threads' | 'faq' | 'ai-tips' | 'ai-news';

// 콘텐츠에서 사용할 연도 (항상 다음 연도 사용 - 최신 정보 강조)
function getContentYear(): string {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  // 다음 연도 사용 (2025년이면 2026년 사용)
  return String(kstDate.getUTCFullYear() + 1);
}
const CURRENT_YEAR = getContentYear(); // 현재 2026

// 요일별 카테고리 매핑 (0=일, 1=월, 2=화, ...)
const DAY_CATEGORY_MAP: Record<number, CategoryKey> = {
  0: 'faq',              // 일요일
  1: 'meta-ads',         // 월요일
  2: 'ai-news',          // 화요일
  3: 'instagram-reels',  // 수요일
  5: 'threads',          // 금요일
  6: 'ai-tips'           // 토요일
};

// 다음 작성 일정 계산 (월/화/수/금/토/일)
function getNextScheduleDate(): { date: string; dayName: string; category: string } {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);

  const scheduleDays = [0, 1, 2, 3, 5, 6]; // 일, 월, 화, 수, 금, 토
  const dayNames: Record<number, string> = { 0: '일요일', 1: '월요일', 2: '화요일', 3: '수요일', 5: '금요일', 6: '토요일' };

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

  const nextDate = new Date(kstDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  const dateStr = `${nextDate.getUTCMonth() + 1}월 ${nextDate.getUTCDate()}일`;

  return {
    date: dateStr,
    dayName: dayNames[currentDay] || '',
    category: ALL_CATEGORIES[DAY_CATEGORY_MAP[currentDay]]?.label || ''
  };
}

// 텔레그램 알림 전송
async function sendTelegramNotification(
  type: 'success' | 'error',
  data: {
    title?: string;
    slug?: string;
    category?: string;
    errorMessage?: string;
  }
): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.log('⚠️ TELEGRAM_BOT_TOKEN 미설정 - 알림 스킵');
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

  if (type === 'success') {
    const articleUrl = `https://polarad.co.kr/marketing-news/${data.slug}`;

    message = `✅ *마케팅 소식 자동 작성 완료*

📝 *제목:* ${data.title}
📁 *카테고리:* ${data.category}
🔗 *링크:* [바로가기](${articleUrl})
📸 *Instagram:* 09:30 자동 게시 예정

📅 *다음 작성:* ${nextSchedule.date} (${nextSchedule.dayName}) - ${nextSchedule.category}

${scheduleInfo}`;
  } else {
    message = `❌ *마케팅 소식 자동 작성 실패*

⚠️ *오류:* ${data.errorMessage}

📅 *다음 작성:* ${nextSchedule.date} (${nextSchedule.dayName}) - ${nextSchedule.category}

${scheduleInfo}

🔧 로그를 확인해주세요.`;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: false
      })
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('텔레그램 알림 실패:', error);
    } else {
      console.log('📨 텔레그램 알림 전송 완료');
    }
  } catch (error) {
    console.error('텔레그램 알림 오류:', error);
  }
}

function generateSlug(title: string): string {
  return title.toLowerCase()
    .replace(/[가-힣]+/g, (m) => {
      const map: Record<string, string> = {
        '페이스북': 'facebook', '인스타그램': 'instagram', '구글': 'google',
        '광고': 'ads', '마케팅': 'marketing', '트렌드': 'trends',
        '전략': 'strategy', '가이드': 'guide', '방법': 'how-to',
        '최적화': 'optimization', '예산': 'budget', '성과': 'performance',
        '차단': 'blocked', '복구': 'recover', '오류': 'error', '안됨': 'not-working',
        '메타': 'meta', '리타게팅': 'retargeting', '타겟팅': 'targeting',
        '캠페인': 'campaign', '광고비': 'ad-spend', '클릭': 'click',
        '전환': 'conversion', '노출': 'impression', '도달': 'reach',
        '릴스': 'reels', '쓰레드': 'threads', '스토리': 'story',
        '피드': 'feed', '해시태그': 'hashtag', '알고리즘': 'algorithm',
        '팔로워': 'follower', '데드존': 'deadzone', '사이즈': 'size',
        '콘텐츠': 'content', '계정': 'account', '인게이지먼트': 'engagement'
      };
      for (const [kr, en] of Object.entries(map)) if (m.includes(kr)) return en;
      return '';
    })
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
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
    const filterDate = thirtyDaysAgo.toISOString().split('T')[0];

    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME!)}?filterByFormula=AND(IS_AFTER({date},'${filterDate}'),{category}='${category}')&fields[]=title`,
      { headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` } }
    );

    const result = await res.json();
    return result.records?.map((r: { fields: { title: string } }) => r.fields.title).filter(Boolean) || [];
  } catch (error) {
    console.error('기존 글 제목 조회 실패:', error);
    return [];
  }
}

// AI가 주제 자동 생성 (피드백 기반 재시도 지원)
async function generateTopic(
  category: CategoryKey,
  existingTitles: string[] = [],
  previousFeedback?: string
): Promise<string> {
  const categoryLabel = ALL_CATEGORIES[category].label;

  // 기존 글 제목 목록 (중복 방지용)
  const existingTitlesText = existingTitles.length > 0
    ? `\n\n**[중복 방지 - 아래 제목들과 유사한 주제는 절대 피하세요]**:\n${existingTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
    : '';

  // 이전 시도 실패 피드백
  const feedbackText = previousFeedback
    ? `\n\n**[⚠️ 이전 시도 실패 - 반드시 수정하세요]**:\n${previousFeedback}\n위 문제를 해결한 새로운 제목을 생성하세요.`
    : '';

  // 필수 키워드 명시 (검증과 동기화)
  const requiredKeywordsInfo: Record<CategoryKey, { keywords: string[]; examples: string[] }> = {
    'meta-ads': {
      keywords: ['메타', 'Meta', '페이스북', 'Facebook', '인스타그램', 'Instagram', '광고', '마케팅', '쓰레드', 'Threads'],
      examples: ['인스타그램 광고 최적화', '메타 광고 예산 설정', '페이스북 마케팅 전략'],
    },
    'instagram-reels': {
      keywords: ['인스타그램', 'Instagram', '릴스', 'Reels', '영상', '콘텐츠', '알고리즘'],
      examples: ['인스타그램 릴스 만드는 법', '릴스 알고리즘 공략', '인스타 릴스 조회수'],
    },
    'threads': {
      keywords: ['쓰레드', 'Threads', '메타', 'Meta', '팔로워', '콘텐츠', 'SNS'],
      examples: ['쓰레드 팔로워 늘리기', '메타 쓰레드 활용법', '쓰레드 마케팅'],
    },
    'faq': {
      keywords: ['메타', 'Meta', '페이스북', 'Facebook', '인스타그램', 'Instagram', '광고', '계정', '차단', '복구', '오류', '문제', '쓰레드', 'Threads'],
      examples: ['인스타그램 계정 정지 해제', '페이스북 광고 거부 해결', '메타 비즈니스 오류'],
    },
    'ai-tips': {
      keywords: ['AI', '인공지능', 'ChatGPT', 'Claude', 'Gemini', 'MCP', 'Cursor', '자동화', '생산성', '플러그인'],
      examples: ['ChatGPT 활용법', 'Claude MCP 설정', 'AI 자동화 도구'],
    },
    'ai-news': {
      keywords: ['AI', '인공지능', 'ChatGPT', 'Claude', 'Gemini', 'GPT', 'OpenAI', 'Anthropic', 'Google', '출시', '업데이트', '발표', 'Llama', 'Mistral'],
      examples: ['ChatGPT 새 기능 출시', 'Claude 업데이트 정리', 'OpenAI GPT-5 발표'],
    },
  };

  const categoryInfo = requiredKeywordsInfo[category];
  const mandatoryKeywordNote = `
**[🚨 필수 조건 - 반드시 준수]**:
제목에 다음 키워드 중 **최소 1개 이상 반드시 포함**:
${categoryInfo.keywords.map(k => `"${k}"`).join(', ')}

올바른 제목 예시: ${categoryInfo.examples.join(', ')}
`;

  const topicPrompts: Record<CategoryKey, string> = {
    'meta-ads': `Meta(페이스북/인스타그램) 광고 또는 인스타그램 활용 관련 블로그 주제를 1개 제안하세요.
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

    'instagram-reels': `인스타그램 릴스 관련 블로그 주제를 1개 제안하세요.
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

    'threads': `Meta 쓰레드(Threads) 관련 블로그 주제를 1개 제안하세요.
${mandatoryKeywordNote}
**[중요 제외 사항]**: 틱톡(TikTok) 관련 내용은 절대 포함하지 마세요. Meta 쓰레드만 다룹니다.

**[SEO 키워드 전략 - 필수 적용]**:
- 네이버/구글에서 실제 검색량이 높은 롱테일 키워드 타겟팅
- 제목 형식: "[메인키워드] + [구체적 수식어] + [연도/숫자]"
- 검색 의도 반영: 정보형("~방법", "~하는 법"), 비교형("~vs~"), 리스트형("~가지")

**주제 범위 (아래 중 하나 선택)**:
1. 쓰레드 시작하기: 가입 방법, 프로필 설정, 인스타그램 연동
2. 쓰레드 성장: 팔로워 늘리기, 인게이지먼트 높이기, 알고리즘 이해
3. 쓰레드 콘텐츠: 글쓰기 팁, 바이럴 콘텐츠, 해시태그 전략
4. 쓰레드 vs 트위터(X): 기능 비교, 장단점, 선택 가이드
5. 쓰레드 비즈니스 활용: 브랜드 마케팅, 고객 소통, 트래픽 유도

**검색 최적화 제목 예시**:
- "쓰레드 팔로워 늘리는 법 ${CURRENT_YEAR} 완벽 가이드"
- "쓰레드 시작하기 - 가입부터 첫 게시물까지"
- "쓰레드 vs 트위터 비교 ${CURRENT_YEAR} (어떤 걸 선택할까)"
- "쓰레드 알고리즘 작동 원리와 노출 늘리는 법"
- "쓰레드 마케팅 전략 5가지 - 비즈니스 활용법"`,

    'faq': `Meta 플랫폼(페이스북, 인스타그램, 쓰레드) 또는 Meta 광고 사용 중 겪는 문제 해결 관련 블로그 주제를 1개 제안하세요.
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

    'ai-tips': `GitHub, Reddit 등에서 추천 많이 받거나 유용성 평가가 완료된 AI 도구, MCP 서버, Claude Skills, 플러그인을 소개하는 블로그 주제를 1개 제안하세요.
${mandatoryKeywordNote}
**[중요]**: 실제로 GitHub stars가 많거나 Reddit에서 호평받은 도구만 다룹니다. 사용방법, 설치방법, 공식 링크를 포함해야 합니다.

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

    'ai-news': `최신 AI 도구, AI 서비스, AI 모델 출시 관련 뉴스를 전달하는 블로그 주제를 1개 제안하세요.
${mandatoryKeywordNote}
**[중요]**: 최근 1-2주 내 발표된 AI 관련 뉴스만 다룹니다. 신규 출시, 업데이트, 서비스 변경 등 실제 뉴스성 콘텐츠를 작성합니다.

**[SEO 키워드 전략 - 필수 적용]**:
- 최신 AI 뉴스 관련 키워드 타겟팅
- 제목 형식: "[AI 서비스/모델명] + [뉴스 내용] + [날짜/연도]"
- 검색 의도 반영: 뉴스형("출시", "업데이트", "발표"), 분석형("의미", "영향")

**주제 범위 (아래 중 하나 선택)**:
1. 새 AI 모델 출시: GPT-5, Claude 4, Gemini 2 등 신규 모델 발표
2. AI 서비스 업데이트: ChatGPT, Claude, Gemini 등 주요 서비스 기능 추가
3. AI 기업 동향: OpenAI, Anthropic, Google, Meta 등 AI 기업 뉴스
4. AI 규제/정책: AI 관련 법률, 규제, 정책 변화
5. AI 가격 정책: AI 서비스 가격 변경, 무료 플랜 확대 등
6. AI 파트너십: AI 기업 간 협력, 인수합병 소식
7. 오픈소스 AI: Llama, Mistral 등 오픈소스 모델 출시/업데이트

**필수 포함 내용**:
- 뉴스 출처 및 발표일
- 주요 변경 사항 요약
- 사용자에게 미치는 영향
- 공식 발표 링크

**검색 최적화 제목 예시**:
- "ChatGPT 새 기능 출시 ${CURRENT_YEAR} - [기능명] 완벽 정리"
- "Claude 3.5 Sonnet 업데이트 - 달라진 점 총정리"
- "OpenAI GPT-5 출시 예정 - 알려진 정보 정리"
- "Google Gemini 2.0 발표 - 새로운 기능과 가격"
- "Meta Llama 4 오픈소스 공개 - 성능 비교 분석"`
  };

  const prompt = `${topicPrompts[category]}
${existingTitlesText}
${feedbackText}

카테고리: ${categoryLabel}

**🚨 최종 확인 사항**:
1. 제목에 연도를 포함할 경우 반드시 ${CURRENT_YEAR}년을 사용하세요. 2024년, 2025년은 절대 사용하지 마세요.
2. 위에 나열된 기존 글과 주제가 겹치지 않도록 완전히 다른 주제를 선택하세요.
3. 제목에 반드시 필수 키워드(${categoryInfo.keywords.slice(0, 3).join(', ')} 등) 중 1개 이상 포함하세요.

반드시 제목만 한 줄로 응답하세요. 다른 설명 없이 제목만 출력하세요.`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 200 }
    })
  });

  const result = await res.json();
  const topic = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  return topic.replace(/^["']|["']$/g, '').replace(/^\d+\.\s*/, '');
}

// 주제 유효성 검증 (마케팅/광고 관련인지 확인)
function validateTopic(topic: string, category: CategoryKey): { isValid: boolean; reason?: string } {
  const lowercaseTopic = topic.toLowerCase();

  // 금지 키워드 (마케팅과 무관한 주제 + 제외 요청된 주제)
  const forbiddenKeywords = [
    // 건강/의료
    '건강', '영양', '비타민', '미네랄', '효능', '부작용', '음식', '식품',
    '의학', '치료', '질병', '증상', '약물', '의료', '병원',
    '운동', '다이어트', '체중', '피트니스',
    'phosphorus', 'calcium', 'vitamin', 'health', 'medical', 'disease',
    // 음식/여행
    '요리', '레시피', '맛집', '여행', '관광',
    // 틱톡 (Meta 플랫폼만 다룸)
    '틱톡', 'tiktok', '틱톡광고', '틱톡마케팅',
    // 개인정보/프라이버시 (제외 요청)
    '개인정보', '프라이버시', '쿠키리스', 'gdpr', 'ccpa', '제로파티', '퍼스트파티',
    '서드파티', '쿠키', '데이터보호', '개인정보보호',
  ];

  // 필수 키워드 (마케팅 관련)
  const requiredKeywords: Record<CategoryKey, string[]> = {
    'meta-ads': ['메타', 'meta', '페이스북', 'facebook', '인스타그램', 'instagram', '광고', '마케팅', '쓰레드', 'threads'],
    'instagram-reels': ['인스타그램', 'instagram', '릴스', 'reels', '영상', '콘텐츠', '알고리즘'],
    'threads': ['쓰레드', 'threads', '메타', 'meta', '팔로워', '콘텐츠', 'sns'],
    'faq': ['메타', 'meta', '페이스북', 'facebook', '인스타그램', 'instagram', '광고', '계정', '차단', '복구', '오류', '문제', '쓰레드', 'threads'],
    'ai-tips': ['ai', '인공지능', 'chatgpt', 'claude', 'gemini', 'mcp', 'cursor', '자동화', '생산성', '플러그인'],
    'ai-news': ['ai', '인공지능', 'chatgpt', 'claude', 'gemini', 'gpt', 'openai', 'anthropic', 'google', '출시', '업데이트', '발표', 'llama', 'mistral'],
  };

  // 금지 키워드 체크
  for (const keyword of forbiddenKeywords) {
    if (lowercaseTopic.includes(keyword)) {
      return { isValid: false, reason: `금지 키워드 포함: ${keyword}` };
    }
  }

  // 필수 키워드 체크
  const categoryKeywords = requiredKeywords[category];
  const hasRequiredKeyword = categoryKeywords.some(kw => lowercaseTopic.includes(kw));

  if (!hasRequiredKeyword) {
    return { isValid: false, reason: `카테고리 관련 키워드 없음. 필요: ${categoryKeywords.join(', ')}` };
  }

  return { isValid: true };
}

// 중복 체크
async function checkDuplicateTopic(title: string, category: string): Promise<{ isDuplicate: boolean; similarTo?: string; reason?: string }> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    return { isDuplicate: false };
  }

  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const filterDate = twoWeeksAgo.toISOString().split('T')[0];

  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?filterByFormula=AND(IS_AFTER({date},'${filterDate}'),{category}='${category}')`,
    { headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` } }
  );

  const result = await res.json();
  const recentTitles = result.records?.map((r: { fields: { title: string } }) => r.fields.title) || [];

  if (recentTitles.length > 0) {
    const checkPrompt = `다음 새 글 제목이 기존 글들과 너무 비슷한지 판단해주세요.

새 글 제목: "${title}"

최근 2주 내 발행된 글 제목들:
${recentTitles.map((t: string, i: number) => `${i + 1}. ${t}`).join('\n')}

JSON으로만 응답: {"isDuplicate": true/false, "similarTo": "비슷한 기존 글 제목 또는 null", "reason": "이유"}`;

    // Gemini 재시도 적용
    const checkResult = await withGeminiRetry(async () => {
      const checkRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: checkPrompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 200 }
        })
      });

      if (!checkRes.ok) {
        throw new Error(`Gemini API error: ${checkRes.status}`);
      }

      return checkRes.json();
    });
    const text = checkResult.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // 안전한 JSON 파싱 (Zod 스키마 검증)
    const parseResult = parseDuplicateCheck(text);
    if (!parseResult.success) {
      notifyJSONParseFailed('duplicate_check', parseResult.rawText || text, parseResult.error || 'Unknown error');
      console.log(`[duplicate_check] JSON 파싱 실패, 기본값 사용: ${parseResult.error}`);
    }
    return parseResult.data;
  }

  return { isDuplicate: false };
}

// SEO 키워드 생성 (Gemini 재시도 + 안전한 JSON 파싱)
async function generateSEOKeywords(title: string, category: string) {
  const prompt = `SEO 키워드 연구 전문가로서 "${title}" 주제의 키워드를 분석하세요. 카테고리: ${category}.
JSON 형식으로만 응답: {"primary":"메인키워드","secondary":["보조키워드5개"],"lsi":["LSI키워드5개"],"questions":["FAQ질문3개"],"searchIntent":"정보형또는거래형","seoTitle":"SEO최적화제목60자이내","metaDescription":"메타설명155자이내"}`;

  try {
    const result = await withGeminiRetry(async () => {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1000 }
        })
      });

      if (!res.ok) {
        throw new Error(`Gemini API error: ${res.status}`);
      }

      return res.json();
    });

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // 안전한 JSON 파싱 (Zod 스키마 검증)
    const parseResult = parseSEOKeywords(text);
    if (!parseResult.success) {
      notifyJSONParseFailed('seo_keywords', parseResult.rawText || text, parseResult.error || 'Unknown error');
      console.log(`[seo_keywords] JSON 파싱 실패, 기본값 사용: ${parseResult.error}`);
    }
    return parseResult.data;
  } catch (error) {
    console.error('[seo_keywords] 모든 재시도 실패:', error);
    return { primary: '', secondary: [], lsi: [], questions: [], searchIntent: '정보형' as const };
  }
}

// 콘텐츠 생성 (v2 프롬프트 빌더 사용)
async function generateContent(
  title: string,
  category: CategoryKey,
  seoKeywords: { primary?: string; secondary?: string[]; regenerationFeedback?: string }
) {
  // v2 프롬프트 빌더 사용
  const prompt = buildContentPromptV2(title, category as V2CategoryKey, {
    seoKeywords: {
      primary: seoKeywords.primary,
      secondary: seoKeywords.secondary,
    },
    regenerationFeedback: seoKeywords.regenerationFeedback,
  });

  console.log(`📝 v2 프롬프트 사용 - 카테고리: ${category}`);

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
    })
  });
  return (await res.json()).candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// 썸네일 생성 (로컬 저장용) - 중복 방지 로직 포함
async function generateThumbnail(title: string, filename: string): Promise<string> {
  const MAX_RETRIES = 3;
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'marketing-news');

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // 유니크한 베리에이션 생성
      const variation = await generateUniqueVariation();
      const prompt = buildImagePrompt(title, variation);

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ['image', 'text'] }
        })
      });

      const result = await res.json();
      const imageData = result.candidates?.[0]?.content?.parts?.find((p: { inlineData?: { mimeType?: string; data?: string } }) =>
        p.inlineData?.mimeType?.startsWith('image/')
      );

      if (imageData?.inlineData?.data) {
        const webpFilename = filename.replace(/\.png$/, '.webp');
        const imagePath = path.join(imagesDir, webpFilename);
        await fs.mkdir(path.dirname(imagePath), { recursive: true });

        const imageBuffer = Buffer.from(imageData.inlineData.data, 'base64');
        const webpBuffer = await sharp(imageBuffer).resize(1200, 630, { fit: 'cover' }).webp({ quality: 80 }).toBuffer();

        // 중복 검사
        const duplicateCheck = await checkImageDuplicate(webpBuffer, imagesDir);
        if (duplicateCheck.isDuplicate) {
          console.log(`⚠️ 중복 이미지 감지, 재시도...`);
          continue;
        }

        await fs.writeFile(imagePath, webpBuffer);
        await saveUsedCombo(variation);

        return `/images/marketing-news/${webpFilename}`;
      }
    } catch (error) {
      console.error(`썸네일 생성 실패 (시도 ${attempt + 1}):`, error);
    }
  }

  return '/images/solution-website.webp';
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
    console.log('[airtable] 환경변수 미설정 - 업로드 스킵');
    return null;
  }

  try {
    const result = await withAirtableRetry(async () => {
      const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          records: [{
            fields: {
              date: data.publishedAt,
              title: data.title,
              category: data.category,
              content: data.content,
              tags: data.tags.join(', '),
              seoKeywords: JSON.stringify(data.seoKeywords),
              publishedAt: data.publishedAt,
              status: 'published',
              slug: data.slug,
              description: data.description,
              thumbnailUrl: data.thumbnailUrl
            }
          }]
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Airtable API error ${res.status}: ${errorText}`);
      }

      return res.json();
    });

    const recordId = result.records?.[0]?.id || null;
    if (!recordId) {
      console.error('[airtable] 레코드 ID 없음 - 응답:', result);
    }
    return recordId;
  } catch (error) {
    console.error('[airtable] 모든 재시도 실패:', error);
    return null;
  }
}

// GitHub에 파일 커밋 (재시도 전략 적용)
async function commitToGitHub(
  filePath: string,
  content: string,
  commitMessage: string
): Promise<boolean> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO; // format: "owner/repo"

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    console.log('[github] 환경변수 미설정 - 커밋 스킵');
    return false;
  }

  try {
    return await withGitHubRetry(async () => {
      // 기존 파일 확인 (SHA 필요)
      const checkRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
        { headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` } }
      );

      const existingFile = checkRes.ok ? await checkRes.json() : null;

      // 파일 생성/업데이트
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: commitMessage,
            content: Buffer.from(content).toString('base64'),
            ...(existingFile?.sha ? { sha: existingFile.sha } : {})
          })
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`GitHub API error ${res.status}: ${errorText}`);
      }

      return true;
    });
  } catch (error) {
    console.error('[github] 모든 재시도 실패:', error);
    return false;
  }
}

// 이미지를 GitHub에 업로드
async function uploadImageToGitHub(
  imageBuffer: Buffer,
  filePath: string
): Promise<boolean> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO;

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return false;
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Add thumbnail: ${filePath}`,
          content: imageBuffer.toString('base64')
        })
      }
    );

    return res.ok;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    return false;
  }
}

// 썸네일 생성 (GitHub 버전) - 중복 방지 로직 포함
async function generateThumbnailForGitHub(title: string, slug: string): Promise<{ path: string; buffer?: Buffer }> {
  const MAX_RETRIES = 3;
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'marketing-news');

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // 유니크한 베리에이션 생성
      const variation = await generateUniqueVariation();
      const prompt = buildImagePrompt(title, variation);

      console.log(`🖼️ 이미지 생성 시도 ${attempt + 1}/${MAX_RETRIES}`);
      console.log(`   인원: ${variation.people}`);
      console.log(`   장소: ${variation.location}`);
      console.log(`   활동: ${variation.activity}`);

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ['image', 'text'] }
        })
      });

      const result = await res.json();
      const imageData = result.candidates?.[0]?.content?.parts?.find((p: { inlineData?: { mimeType?: string; data?: string } }) =>
        p.inlineData?.mimeType?.startsWith('image/')
      );

      if (imageData?.inlineData?.data) {
        const imageBuffer = Buffer.from(imageData.inlineData.data, 'base64');
        const webpBuffer = await sharp(imageBuffer)
          .resize(1200, 630, { fit: 'cover' })
          .webp({ quality: 80 })
          .toBuffer();

        // 중복 검사
        const duplicateCheck = await checkImageDuplicate(webpBuffer, imagesDir);

        if (duplicateCheck.isDuplicate) {
          console.log(`⚠️ 중복 이미지 감지! 기존 파일: ${duplicateCheck.matchedFile}, 재시도...`);
          continue; // 다음 시도
        }

        // 사용된 조합 저장
        await saveUsedCombo(variation);

        console.log(`✅ 유니크한 이미지 생성 완료`);

        return {
          path: `/images/marketing-news/${slug}.webp`,
          buffer: webpBuffer
        };
      }
    } catch (error) {
      console.error(`썸네일 생성 실패 (시도 ${attempt + 1}):`, error);
    }
  }

  // 모든 시도 실패 시 에러 (기본 이미지 폴백 제거)
  console.error('❌ 이미지 생성 최종 실패');
  return { path: '/images/solution-website.webp' };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const forceCategory = url.searchParams.get('category') as CategoryKey | null;
  const forceRun = url.searchParams.get('force') === 'true';

  // Cron 인증 확인 (force 파라미터가 없을 때만)
  const authHeader = request.headers.get('authorization');
  if (!forceRun && CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 오늘 요일 확인 (KST 기준)
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  const dayOfWeek = kstDate.getUTCDay();

  // 카테고리 결정: force 파라미터 > 요일별 매핑
  let category: CategoryKey | undefined = forceCategory && ALL_CATEGORIES[forceCategory as ArticleCategory] ? forceCategory : DAY_CATEGORY_MAP[dayOfWeek];

  // 요일 체크 (force가 아닐 때만)
  if (!forceRun && !category) {
    return NextResponse.json({
      message: `오늘(${dayOfWeek})은 실행 요일이 아닙니다. 실행 요일: 월(1), 수(3), 금(5), 일(0)`,
      skipped: true
    });
  }

  // force 모드인데 카테고리가 없으면 기본값 사용
  if (!category) {
    category = 'meta-ads';
  }

  try {
    console.log(`🚀 자동 글 생성 시작 - 카테고리: ${category}`);

    // 0. 기존 글 제목 조회 (중복 방지용)
    console.log('📋 기존 글 제목 조회...');
    const existingTitles = await getExistingTitles(category);
    console.log(`   최근 30일 내 ${category} 글: ${existingTitles.length}개`);

    // 1. AI로 주제 생성 + 유효성 검증 (최대 5번 재시도, 피드백 기반)
    let title = '';
    let topicAttempts = 0;
    const MAX_TOPIC_ATTEMPTS = 5;
    let lastValidation: { isValid: boolean; reason?: string } = { isValid: false };
    let previousFeedback: string | undefined;

    // 카테고리별 필수 키워드 (fallback용)
    const fallbackKeywords: Record<CategoryKey, string> = {
      'meta-ads': '인스타그램 광고',
      'instagram-reels': '인스타그램 릴스',
      'threads': '쓰레드',
      'faq': '인스타그램 계정',
      'ai-tips': 'AI 활용',
      'ai-news': 'AI 업데이트',
    };

    while (topicAttempts < MAX_TOPIC_ATTEMPTS) {
      // 피드백 포함하여 주제 생성
      title = await generateTopic(category, existingTitles, previousFeedback);
      console.log(`📝 생성된 주제 (시도 ${topicAttempts + 1}): ${title}`);

      // 유효성 검증
      lastValidation = validateTopic(title, category);
      if (lastValidation.isValid) {
        console.log(`✅ 주제 유효성 검증 통과`);
        break;
      }

      console.log(`⚠️ 주제 유효성 검증 실패: ${lastValidation.reason}`);
      topicAttempts++;

      // 피드백 구성 (다음 시도에 전달)
      previousFeedback = `생성한 제목 "${title}"이(가) 거부되었습니다. 이유: ${lastValidation.reason}`;

      // 마지막 시도 전: fallback 적용 (키워드 자동 삽입)
      if (topicAttempts >= MAX_TOPIC_ATTEMPTS - 1) {
        const keyword = fallbackKeywords[category];
        if (title && !title.toLowerCase().includes(keyword.toLowerCase())) {
          const fallbackTitle = `${keyword} ${title.replace(/^.*?(?=[가-힣A-Za-z])/, '')}`.trim();
          console.log(`🔄 Fallback 적용: "${fallbackTitle}"`);

          const fallbackValidation = validateTopic(fallbackTitle, category);
          if (fallbackValidation.isValid) {
            title = fallbackTitle;
            console.log(`✅ Fallback 주제 유효성 검증 통과`);
            lastValidation = fallbackValidation;
            break;
          }
        }
      }

      if (topicAttempts >= MAX_TOPIC_ATTEMPTS) {
        throw new Error(`주제 생성 실패: ${MAX_TOPIC_ATTEMPTS}회 시도 후에도 유효한 주제를 생성하지 못함. 마지막 실패 사유: ${lastValidation.reason}`);
      }
    }

    // 2. 중복 체크 (빠른 Jaccard 유사도 → AI 검증)
    let duplicateAttempts = 0;
    while (duplicateAttempts < 3) {
      // 2-1. 빠른 사전 필터링 (Jaccard 유사도, API 호출 불필요)
      const quickCheck = checkTitleDuplicate(title, existingTitles, 0.6);
      if (quickCheck.isDuplicate) {
        console.log(`⚡ 빠른 중복 감지: "${quickCheck.matchedTitle}" (유사도 ${(quickCheck.similarity || 0) * 100}%)`);
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

      console.log(`⚠️ AI 중복 발견: "${duplicateCheck.similarTo}", 재생성... (${duplicateAttempts + 1}/3)`);

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

    const slug = generateSlug(title);
    const today = kstDate.toISOString().split('T')[0];

    // 3. SEO 키워드 연구
    console.log('🔍 SEO 키워드 연구...');
    const seoKeywords = await generateSEOKeywords(title, category);

    // 4. 콘텐츠 생성 + 품질 검증
    console.log('✍️ 콘텐츠 생성...');
    let content = await generateContent(title, category, seoKeywords);

    // 4-1. 품질 검증
    const keywords = [
      seoKeywords.primary,
      ...(seoKeywords.secondary || []).slice(0, 2),
    ].filter(Boolean);

    let validationResult = validateContentQuality(content, { keywords, category });
    console.log(`📊 품질 점수: ${validationResult.score}/100 (${validationResult.grade})`);

    // 4-2. 품질 미달 시 1회 재생성 시도
    if (validationResult.score < 70 && validationResult.recommendation === 'regenerate') {
      console.log('⚠️ 품질 미달, 피드백 포함 재생성 시도...');
      const feedback = generateRegenerationFeedback(validationResult);

      // 피드백을 포함한 재생성 프롬프트
      content = await generateContent(
        title,
        category,
        { ...seoKeywords, regenerationFeedback: feedback }
      );

      // 재검증
      validationResult = validateContentQuality(content, { keywords, category });
      console.log(`📊 재생성 품질 점수: ${validationResult.score}/100 (${validationResult.grade})`);
    }

    // 4-3. 여전히 70점 미만이면 경고 알림 (발행은 계속)
    if (validationResult.score < 70) {
      console.log(`⚠️ 품질 점수 미달 상태로 발행: ${validationResult.score}점`);
      notifyQualityCheckFailed(title, validationResult.score, validationResult.issues.map(i => i.message));
    }

    console.log(formatValidationSummary(validationResult));

    // 5. 썸네일 생성
    console.log('🖼️ 썸네일 생성...');
    const thumbnail = await generateThumbnailForGitHub(title, slug);

    // 6. MDX 파일 구성
    const description = seoKeywords.metaDescription || `${title}에 대해 알아봅니다.`;
    const seoTitle = seoKeywords.seoTitle || title;
    const tags = [
      seoKeywords.primary,
      ...(seoKeywords.secondary || []).slice(0, 3)
    ].filter(Boolean).slice(0, 7);

    const allKeywords = [
      seoKeywords.primary,
      ...(seoKeywords.secondary || []),
      ...(seoKeywords.lsi || [])
    ].filter(Boolean).slice(0, 15);

    const mdxContent = `---
title: "${seoTitle}"
description: "${description}"
category: "${category}"
tags: ${JSON.stringify(tags)}
author: "폴라애드"
publishedAt: "${today}"
updatedAt: "${today}"
thumbnail: "${thumbnail.path}"
featured: false
status: "published"
seo:
  keywords: ${JSON.stringify(allKeywords)}
  ogImage: "${thumbnail.path}"
  primaryKeyword: "${seoKeywords.primary || ''}"
  searchIntent: "${seoKeywords.searchIntent || '정보형'}"
  faqQuestions: ${JSON.stringify(seoKeywords.questions || [])}
---

${content}
`;

    // 7. GitHub에 커밋 (website/ 폴더 내에 저장)
    const categoryFolder = ALL_CATEGORIES[category].folder;
    const mdxPath = `website/content/marketing-news/${categoryFolder}/${slug}.mdx`;

    console.log('📤 GitHub 커밋...');
    const mdxCommitted = await commitToGitHub(
      mdxPath,
      mdxContent,
      `📝 자동 생성: ${seoTitle}`
    );

    // 이미지도 GitHub에 업로드 (website/ 폴더 내에 저장)
    if (thumbnail.buffer) {
      const imagePath = `website/public/images/marketing-news/${slug}.webp`;
      await uploadImageToGitHub(thumbnail.buffer, imagePath);
    }

    // 8. Airtable 업로드
    console.log('📊 Airtable 업로드...');
    const airtableId = await uploadToAirtable({
      title: seoTitle,
      category,
      content,
      tags,
      seoKeywords: allKeywords,
      publishedAt: today,
      slug,
      description,
      thumbnailUrl: `https://polarad.co.kr${thumbnail.path}`
    });

    const result = {
      success: true,
      title: seoTitle,
      category,
      slug,
      mdxPath,
      thumbnail: thumbnail.path,
      airtableId,
      githubCommitted: mdxCommitted,
      generatedAt: new Date().toISOString()
    };

    console.log('✅ 완료!', result);

    // 9. 텔레그램 알림 (성공) - Instagram은 별도 Cron에서 처리
    await sendTelegramNotification('success', {
      title: seoTitle,
      slug,
      category: ALL_CATEGORIES[category].label
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ 에러:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // 텔레그램 알림 (실패)
    await sendTelegramNotification('error', {
      errorMessage
    });

    return NextResponse.json({
      error: 'Generation failed',
      message: errorMessage
    }, { status: 500 });
  }
}
