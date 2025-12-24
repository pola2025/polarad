/**
 * 주제 아카이브 대량 생성 API (Google Search 기반)
 * POST /api/admin/topics/generate
 *
 * Query params:
 * - category: 카테고리 (meta-ads, instagram-reels, threads, faq, ai-tips, ai-news)
 * - count: 생성할 주제 개수 (기본 25, 최대 100 - 내부적으로 25개씩 배치)
 *
 * Google Search grounding을 사용하여 최근 1개월 이내 트렌딩 주제 검색
 */

import { NextRequest, NextResponse } from 'next/server';
import { CATEGORIES } from '@/lib/marketing-news';
import {
  addTopicsToArchive,
  topicExists,
  getUnusedTopicCount,
  getAllUnusedTopicCounts,
  getAllTopicTitles,
} from '@/lib/marketing-news/topic-archive';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ADMIN_SECRET = process.env.CRON_SECRET;

type CategoryKey = 'meta-ads' | 'instagram-reels' | 'threads' | 'faq' | 'ai-tips' | 'ai-news';

function getContentYear(): string {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  return String(kstDate.getUTCFullYear() + 1);
}
const CURRENT_YEAR = getContentYear();

// 현재 월 (검색 기간용)
function getCurrentMonth(): string {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  return `${kstDate.getUTCFullYear()}년 ${kstDate.getUTCMonth() + 1}월`;
}

// 필수 키워드 정의 (검증용)
const REQUIRED_KEYWORDS: Record<CategoryKey, string[]> = {
  'meta-ads': ['메타', 'Meta', '페이스북', 'Facebook', '인스타그램', 'Instagram', '광고', '마케팅', '쓰레드', 'Threads'],
  'instagram-reels': ['인스타그램', 'Instagram', '릴스', 'Reels', '영상', '콘텐츠', '알고리즘'],
  'threads': ['쓰레드', 'Threads', '메타', 'Meta', '팔로워', '콘텐츠', 'SNS'],
  'faq': ['메타', 'Meta', '페이스북', 'Facebook', '인스타그램', 'Instagram', '광고', '계정', '차단', '복구', '오류', '문제', '쓰레드', 'Threads'],
  'ai-tips': ['AI', '인공지능', 'ChatGPT', 'Claude', 'Gemini', 'MCP', 'Cursor', '자동화', '생산성', '플러그인'],
  'ai-news': ['AI', '인공지능', 'ChatGPT', 'Claude', 'Gemini', 'GPT', 'OpenAI', 'Anthropic', 'Google', '출시', '업데이트', '발표', 'Llama', 'Mistral'],
};

// 카테고리별 검색 쿼리 (Google Search용)
const SEARCH_QUERIES: Record<CategoryKey, string[]> = {
  'meta-ads': [
    '인스타그램 광고 트렌드 2024 2025',
    '페이스북 광고 최신 업데이트',
    '메타 광고 성과 최적화 방법',
    '인스타그램 마케팅 전략',
    '메타 비즈니스 스위트 새 기능',
  ],
  'instagram-reels': [
    '인스타그램 릴스 알고리즘 변화 2024 2025',
    '릴스 조회수 늘리는 방법',
    '인스타그램 릴스 트렌드',
    '릴스 편집 앱 추천',
    '인스타 릴스 음악 인기',
  ],
  'threads': [
    '쓰레드 앱 업데이트 2024 2025',
    '쓰레드 팔로워 늘리기',
    '쓰레드 마케팅 활용법',
    'threads 새 기능',
    '쓰레드 vs 트위터',
  ],
  'faq': [
    '인스타그램 계정 정지 해결',
    '페이스북 광고 거부 이유',
    '인스타그램 오류 해결',
    '메타 비즈니스 계정 문제',
    '인스타그램 로그인 문제',
  ],
  'ai-tips': [
    'ChatGPT 활용법 2024 2025',
    'Claude AI 사용 팁',
    'AI 자동화 도구 추천',
    'Cursor AI 개발 도구',
    'AI 생산성 향상 방법',
  ],
  'ai-news': [
    'ChatGPT 새 기능 업데이트 2024 2025',
    'Claude 3.5 Anthropic 발표',
    'Google Gemini 출시',
    'OpenAI GPT 최신 뉴스',
    'AI 업계 동향',
  ],
};

// 주제 유효성 검증
function validateTopic(title: string, category: CategoryKey): boolean {
  if (!title || title.length < 10 || title.length > 100) return false;

  // 금지 키워드
  const forbiddenKeywords = [
    '건강', '영양', '비타민', '효능', '부작용', '음식', '식품',
    '의학', '치료', '질병', '약물', '의료', '병원',
    '요리', '레시피', '맛집', '여행', '관광',
    '틱톡', 'tiktok',
    '개인정보', '프라이버시', '쿠키리스', 'gdpr',
  ];

  const titleLower = title.toLowerCase();
  for (const keyword of forbiddenKeywords) {
    if (titleLower.includes(keyword.toLowerCase())) return false;
  }

  const keywords = REQUIRED_KEYWORDS[category];
  const hasKeyword = keywords.some((k) => titleLower.includes(k.toLowerCase()));

  return hasKeyword;
}

// Google Search grounding으로 트렌딩 주제 생성
async function generateTrendingTopics(
  category: CategoryKey,
  count: number,
  existingTitles: string[]
): Promise<string[]> {
  const categoryLabel = CATEGORIES[category]?.label || category;
  const keywords = REQUIRED_KEYWORDS[category];
  const searchQueries = SEARCH_QUERIES[category];
  const currentMonth = getCurrentMonth();

  const existingTitlesText = existingTitles.length > 0
    ? `\n\n**[중복 방지 - 아래 제목들과 유사한 주제는 절대 피하세요]**:\n${existingTitles.slice(0, 100).map((t, i) => `${i + 1}. ${t}`).join('\n')}`
    : '';

  const categoryPrompts: Record<CategoryKey, string> = {
    'meta-ads': `Meta(페이스북/인스타그램) 광고 및 마케팅 관련 블로그 주제.
- Meta 광고 운영: 광고 세팅, 예산 최적화, 타겟팅, ROAS 개선
- 인스타그램 콘텐츠: 릴스 만드는 법, 피드 구성, 스토리 활용
- 인스타그램 운영: 팔로워 늘리기, 인게이지먼트, 알고리즘
- 쓰레드 활용: 쓰레드 시작하기, 콘텐츠 전략, 팔로워 확보`,

    'instagram-reels': `인스타그램 릴스 전문 블로그 주제.
- 릴스 만드는 법, 편집 기술, 효과 활용
- 릴스 알고리즘 공략, 노출 전략, 데드존
- 트렌드 분석, 음악/챌린지 활용
- 조회수 늘리기, 인게이지먼트 높이기`,

    'threads': `쓰레드(Threads) 전문 블로그 주제.
- 쓰레드 시작하기, 기본 사용법
- 팔로워 늘리기, 콘텐츠 전략
- 인스타그램 연동, 크로스 포스팅
- 마케팅 활용, 브랜드 운영`,

    'faq': `Meta 플랫폼(인스타그램/페이스북/쓰레드) 문제 해결 FAQ 주제.
- 계정 정지/복구, 차단 해제, 이의 신청
- 광고 승인 거부 해결, 정책 위반
- 비즈니스 계정 오류, 인사이트 문제
- 로그인 문제, 보안 설정, 2단계 인증`,

    'ai-tips': `AI 도구 활용 팁 블로그 주제.
- ChatGPT, Claude, Gemini 실전 활용법
- AI 자동화, 생산성 도구 세팅
- MCP, Cursor 등 개발 도구
- 프롬프트 엔지니어링 기법`,

    'ai-news': `AI 업계 최신 뉴스 블로그 주제.
- ChatGPT, GPT 모델 업데이트 소식
- Claude, Anthropic 신규 발표
- Google Gemini, DeepMind 동향
- AI 기업 동향, 신규 서비스 출시`,
  };

  const prompt = `당신은 디지털 마케팅 블로그 편집장입니다.
**최근 1개월 이내 (${currentMonth} 기준)** 가장 관심도가 높은 "${categoryLabel}" 관련 블로그 주제를 ${count}개 생성하세요.

**[Google 검색으로 확인할 트렌드 키워드]**:
${searchQueries.map((q, i) => `${i + 1}. ${q}`).join('\n')}

위 키워드로 검색한 최신 트렌드와 인기 주제를 바탕으로 블로그 제목을 생성하세요.

${categoryPrompts[category]}

**[필수 조건]**:
1. 각 제목에 다음 키워드 중 최소 1개 이상 포함: ${keywords.map((k) => `"${k}"`).join(', ')}
2. 제목 길이: 15~50자
3. SEO 최적화: 실제 검색량이 높은 롱테일 키워드 타겟팅
4. 최신성: 연도 ${CURRENT_YEAR} 또는 "최신", "업데이트" 등 표현 권장
5. 다양성: 각 주제가 서로 다른 세부 주제를 다루도록 (중복 X)
6. 틱톡(TikTok) 관련 내용 절대 제외 (Meta 플랫폼만)
${existingTitlesText}

**[출력 형식]**:
- 순수 JSON 배열만 출력
- 추가 설명이나 마크다운 없이 JSON만 출력
- 예시: ["주제1", "주제2", "주제3"]

지금 ${count}개의 주제를 JSON 배열로 출력하세요:`;

  // Gemini API with Google Search grounding
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 8192,
        },
        tools: [{ google_search: {} }], // Google Search grounding 활성화
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  return parseJSONArray(text);
}

// JSON 파싱 (마크다운 코드 블록 처리)
function parseJSONArray(text: string): string[] {
  // ```json ... ``` 또는 ``` ... ``` 형식 처리
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  const jsonText = codeBlockMatch ? codeBlockMatch[1].trim() : text.trim();

  try {
    const parsed = JSON.parse(jsonText);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => typeof item === 'string' && item.length > 0);
    }
    return [];
  } catch {
    // JSON 파싱 실패 시 줄바꿈으로 분리 시도
    return text
      .split('\n')
      .map((line) => line.replace(/^[\d]+\.\s*/, '').replace(/^["'`-]\s*/, '').replace(/["'`]$/, '').trim())
      .filter((line) => line.length > 10 && line.length < 100);
  }
}

export async function POST(request: NextRequest) {
  // 인증 체크
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (token !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as CategoryKey | null;
  const countParam = parseInt(searchParams.get('count') || '25', 10);
  const targetCount = Math.min(Math.max(countParam, 10), 100); // 10~100 사이로 제한

  // 카테고리 미지정 시 전체 현황 반환
  if (!category) {
    const counts = await getAllUnusedTopicCounts();
    return NextResponse.json({
      message: '카테고리를 지정해주세요 (?category=meta-ads&count=50)',
      currentStock: counts,
      availableCategories: Object.keys(REQUIRED_KEYWORDS),
      usage: 'POST /api/admin/topics/generate?category=meta-ads&count=100',
    });
  }

  if (!REQUIRED_KEYWORDS[category]) {
    return NextResponse.json(
      { error: `Invalid category: ${category}` },
      { status: 400 }
    );
  }

  console.log(`[TopicGenerate] Starting: category=${category}, targetCount=${targetCount}`);

  try {
    // 기존 주제 목록 가져오기 (중복 방지)
    const existingTitles = await getAllTopicTitles(category);
    console.log(`[TopicGenerate] Existing topics: ${existingTitles.length}`);

    // 배치 처리 (25개씩)
    const batchSize = 25;
    const batches = Math.ceil(targetCount / batchSize);

    let totalGenerated = 0;
    let totalValid = 0;
    let totalInvalid = 0;
    let totalDuplicate = 0;
    let totalAdded = 0;
    const allInvalidTopics: string[] = [];
    const allDuplicateTopics: string[] = [];

    for (let batch = 0; batch < batches; batch++) {
      const batchCount = Math.min(batchSize, targetCount - (batch * batchSize));
      console.log(`[TopicGenerate] Batch ${batch + 1}/${batches}: generating ${batchCount} topics...`);

      // Google Search로 트렌딩 주제 생성
      const rawTopics = await generateTrendingTopics(category, batchCount, existingTitles);
      totalGenerated += rawTopics.length;
      console.log(`[TopicGenerate] Batch ${batch + 1}: parsed ${rawTopics.length} topics`);

      // 유효성 검증 및 중복 체크
      const validTopics: Array<{ title: string; category: CategoryKey }> = [];

      for (const title of rawTopics) {
        // 유효성 검증
        if (!validateTopic(title, category)) {
          totalInvalid++;
          allInvalidTopics.push(title);
          continue;
        }

        // 기존 목록에 이미 있는지 체크
        if (existingTitles.includes(title)) {
          totalDuplicate++;
          allDuplicateTopics.push(title);
          continue;
        }

        // 아카이브 내 중복 체크
        const exists = await topicExists(title, category);
        if (exists) {
          totalDuplicate++;
          allDuplicateTopics.push(title);
          continue;
        }

        validTopics.push({ title, category });
        existingTitles.push(title); // 다음 배치에서 중복 방지
        totalValid++;
      }

      // 아카이브에 추가
      if (validTopics.length > 0) {
        const addResult = await addTopicsToArchive(validTopics);
        totalAdded += addResult.success;
      }

      // 배치 간 딜레이 (Rate limit 방지)
      if (batch < batches - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    // 현재 재고 확인
    const currentCount = await getUnusedTopicCount(category);

    return NextResponse.json({
      success: true,
      category,
      requested: targetCount,
      batches,
      generated: totalGenerated,
      valid: totalValid,
      invalid: totalInvalid,
      duplicate: totalDuplicate,
      added: totalAdded,
      currentStock: currentCount,
      invalidTopics: allInvalidTopics.slice(0, 10),
      duplicateTopics: allDuplicateTopics.slice(0, 10),
    });
  } catch (error) {
    console.error('[TopicGenerate] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET: 현재 재고 확인
export async function GET(request: NextRequest) {
  // 인증 체크
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (token !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as CategoryKey | null;

  if (category) {
    const count = await getUnusedTopicCount(category);
    return NextResponse.json({ category, unusedCount: count });
  }

  const counts = await getAllUnusedTopicCounts();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return NextResponse.json({
    totalUnused: total,
    byCategory: counts,
    recommendation: total < 200 ? '⚠️ 재고 부족! 각 카테고리별 100개 이상 권장' : '✅ 재고 충분',
  });
}
