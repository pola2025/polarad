/**
 * 주제 아카이브 대량 생성 API
 * POST /api/admin/topics/generate
 *
 * Query params:
 * - category: 카테고리 (meta-ads, instagram-reels, threads, faq, ai-tips, ai-news)
 * - count: 생성할 주제 개수 (기본 20, 최대 50)
 */

import { NextRequest, NextResponse } from 'next/server';
import { CATEGORIES } from '@/lib/marketing-news';
import {
  addTopicsToArchive,
  topicExists,
  getUnusedTopicCount,
  getAllUnusedTopicCounts,
} from '@/lib/marketing-news/topic-archive';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ADMIN_SECRET = process.env.CRON_SECRET; // CRON_SECRET을 admin 인증으로 재사용

type CategoryKey = 'meta-ads' | 'instagram-reels' | 'threads' | 'faq' | 'ai-tips' | 'ai-news';

function getContentYear(): string {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  return String(kstDate.getUTCFullYear() + 1);
}
const CURRENT_YEAR = getContentYear();

// 필수 키워드 정의 (검증용)
const REQUIRED_KEYWORDS: Record<CategoryKey, string[]> = {
  'meta-ads': ['메타', 'Meta', '페이스북', 'Facebook', '인스타그램', 'Instagram', '광고', '마케팅', '쓰레드', 'Threads'],
  'instagram-reels': ['인스타그램', 'Instagram', '릴스', 'Reels', '영상', '콘텐츠', '알고리즘'],
  'threads': ['쓰레드', 'Threads', '메타', 'Meta', '팔로워', '콘텐츠', 'SNS'],
  'faq': ['메타', 'Meta', '페이스북', 'Facebook', '인스타그램', 'Instagram', '광고', '계정', '차단', '복구', '오류', '문제', '쓰레드', 'Threads'],
  'ai-tips': ['AI', '인공지능', 'ChatGPT', 'Claude', 'Gemini', 'MCP', 'Cursor', '자동화', '생산성', '플러그인'],
  'ai-news': ['AI', '인공지능', 'ChatGPT', 'Claude', 'Gemini', 'GPT', 'OpenAI', 'Anthropic', 'Google', '출시', '업데이트', '발표', 'Llama', 'Mistral'],
};

// 주제 유효성 검증
function validateTopic(title: string, category: CategoryKey): boolean {
  if (!title || title.length < 10 || title.length > 100) return false;

  const keywords = REQUIRED_KEYWORDS[category];
  const titleLower = title.toLowerCase();
  const hasKeyword = keywords.some((k) => titleLower.includes(k.toLowerCase()));

  return hasKeyword;
}

// 대량 주제 생성 프롬프트
function buildBulkTopicPrompt(category: CategoryKey, count: number, existingTitles: string[]): string {
  const categoryLabel = CATEGORIES[category]?.label || category;
  const keywords = REQUIRED_KEYWORDS[category];

  const existingTitlesText = existingTitles.length > 0
    ? `\n\n**[중복 방지 - 아래 제목들과 유사한 주제는 피하세요]**:\n${existingTitles.slice(0, 50).map((t, i) => `${i + 1}. ${t}`).join('\n')}`
    : '';

  const categoryPrompts: Record<CategoryKey, string> = {
    'meta-ads': `Meta(페이스북/인스타그램) 광고, 인스타그램 활용, 쓰레드 마케팅 관련 블로그 주제.
주제 범위:
- Meta 광고 운영: 광고 세팅, 예산 최적화, 타겟팅, 성과 분석
- 인스타그램 콘텐츠: 릴스 만드는 법, 피드 구성, 스토리 활용
- 인스타그램 운영: 팔로워 늘리기, 인게이지먼트, 알고리즘
- 쓰레드 활용: 쓰레드 시작하기, 콘텐츠 전략, 팔로워 확보`,

    'instagram-reels': `인스타그램 릴스 전문 블로그 주제.
주제 범위:
- 릴스 만드는 법, 편집 기술, 효과 활용
- 릴스 알고리즘 공략, 노출 전략
- 트렌드 분석, 음악/챌린지 활용
- 조회수 늘리기, 인게이지먼트 높이기`,

    'threads': `쓰레드(Threads) 전문 블로그 주제.
주제 범위:
- 쓰레드 시작하기, 기본 사용법
- 팔로워 늘리기, 콘텐츠 전략
- 인스타그램 연동, 크로스 포스팅
- 마케팅 활용, 브랜드 운영`,

    'faq': `Meta 플랫폼(인스타그램/페이스북/쓰레드) 문제 해결 FAQ 주제.
주제 범위:
- 계정 정지/복구, 차단 해제
- 광고 승인 거부 해결
- 비즈니스 계정 오류
- 로그인 문제, 보안 설정`,

    'ai-tips': `AI 도구 활용 팁 블로그 주제.
주제 범위:
- ChatGPT, Claude, Gemini 활용법
- AI 자동화, 생산성 도구
- MCP, Cursor 등 개발 도구
- 프롬프트 엔지니어링`,

    'ai-news': `AI 업계 최신 뉴스 블로그 주제.
주제 범위:
- ChatGPT, GPT 모델 업데이트
- Claude, Anthropic 발표
- Google Gemini, DeepMind 소식
- AI 기업 동향, 신규 서비스 출시`,
  };

  return `당신은 디지털 마케팅 블로그 편집장입니다.
"${categoryLabel}" 카테고리에 맞는 블로그 주제를 ${count}개 생성하세요.

${categoryPrompts[category]}

**[필수 조건]**:
1. 각 제목에 다음 키워드 중 최소 1개 이상 포함: ${keywords.map((k) => `"${k}"`).join(', ')}
2. 제목 길이: 15~50자
3. SEO 최적화: 검색량 높은 롱테일 키워드 타겟팅
4. 연도 ${CURRENT_YEAR} 포함 권장 (최신성 강조)
5. 제목 형식: "[메인키워드] + [구체적 수식어]" 또는 리스트형 ("~가지", "TOP~")
${existingTitlesText}

**[출력 형식]**:
- 순수 JSON 배열만 출력
- 추가 설명이나 마크다운 없이 JSON만 출력
- 예시: ["주제1", "주제2", "주제3"]

지금 ${count}개의 주제를 JSON 배열로 출력하세요:`;
}

// Gemini API 호출
async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
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
  const countParam = parseInt(searchParams.get('count') || '20', 10);
  const count = Math.min(Math.max(countParam, 5), 50); // 5~50 사이로 제한

  // 카테고리 미지정 시 전체 현황 반환
  if (!category) {
    const counts = await getAllUnusedTopicCounts();
    return NextResponse.json({
      message: '카테고리를 지정해주세요 (?category=meta-ads&count=20)',
      currentStock: counts,
      availableCategories: Object.keys(REQUIRED_KEYWORDS),
    });
  }

  if (!REQUIRED_KEYWORDS[category]) {
    return NextResponse.json(
      { error: `Invalid category: ${category}` },
      { status: 400 }
    );
  }

  console.log(`[TopicGenerate] Starting: category=${category}, count=${count}`);

  try {
    // 기존 주제 목록 가져오기 (중복 방지)
    const existingTitles: string[] = []; // TODO: Airtable에서 기존 주제 가져오기

    // Gemini로 주제 생성
    const prompt = buildBulkTopicPrompt(category, count, existingTitles);
    const response = await callGemini(prompt);

    console.log(`[TopicGenerate] Gemini response length: ${response.length}`);

    // JSON 파싱
    const rawTopics = parseJSONArray(response);
    console.log(`[TopicGenerate] Parsed ${rawTopics.length} topics`);

    // 유효성 검증 및 중복 체크
    const validTopics: Array<{ title: string; category: CategoryKey }> = [];
    const invalidTopics: string[] = [];
    const duplicateTopics: string[] = [];

    for (const title of rawTopics) {
      // 유효성 검증
      if (!validateTopic(title, category)) {
        invalidTopics.push(title);
        continue;
      }

      // 아카이브 내 중복 체크
      const exists = await topicExists(title, category);
      if (exists) {
        duplicateTopics.push(title);
        continue;
      }

      validTopics.push({ title, category });
    }

    console.log(
      `[TopicGenerate] Valid: ${validTopics.length}, Invalid: ${invalidTopics.length}, Duplicate: ${duplicateTopics.length}`
    );

    // 아카이브에 추가
    let addResult = { success: 0, failed: 0 };
    if (validTopics.length > 0) {
      addResult = await addTopicsToArchive(validTopics);
    }

    // 현재 재고 확인
    const currentCount = await getUnusedTopicCount(category);

    return NextResponse.json({
      success: true,
      category,
      requested: count,
      generated: rawTopics.length,
      valid: validTopics.length,
      invalid: invalidTopics.length,
      duplicate: duplicateTopics.length,
      added: addResult.success,
      failed: addResult.failed,
      currentStock: currentCount,
      invalidTopics: invalidTopics.slice(0, 5), // 디버깅용
      duplicateTopics: duplicateTopics.slice(0, 5), // 디버깅용
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
  return NextResponse.json({
    totalUnused: Object.values(counts).reduce((a, b) => a + b, 0),
    byCategory: counts,
  });
}
