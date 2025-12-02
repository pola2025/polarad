/**
 * Vercel Cron Job: 자동 마케팅 뉴스 글 생성
 * 스케줄: 월/수/금/일 오전 9시 (KST)
 */

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const CRON_SECRET = process.env.CRON_SECRET;

const CATEGORIES = {
  'meta-ads': { label: 'Meta 광고', folder: 'meta-ads' },
  'google-ads': { label: 'Google 광고', folder: 'google-ads' },
  'marketing-trends': { label: '마케팅 트렌드', folder: 'marketing-trends' },
  'faq': { label: '궁금해요', folder: 'faq' }
} as const;

type CategoryKey = keyof typeof CATEGORIES;

// 요일별 카테고리 매핑 (0=일, 1=월, 2=화, ...)
const DAY_CATEGORY_MAP: Record<number, CategoryKey> = {
  0: 'faq',              // 일요일
  1: 'meta-ads',         // 월요일
  3: 'google-ads',       // 수요일
  5: 'marketing-trends'  // 금요일
};

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

// AI가 주제 자동 생성
async function generateTopic(category: CategoryKey): Promise<string> {
  const categoryLabel = CATEGORIES[category].label;

  const topicPrompts: Record<CategoryKey, string> = {
    'meta-ads': `Meta(페이스북/인스타그램) 광고 또는 인스타그램 활용 관련 블로그 주제를 1개 제안하세요.

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
- "인스타그램 릴스 만드는 법 2025 완벽 가이드 (초보자용)"
- "인스타그램 릴스 데드존 위치 확인 방법 총정리"
- "페이스북 광고 예산 설정 방법 - 소액으로 시작하기"
- "인스타그램 해시태그 추천 2025 (업종별 정리)"
- "쓰레드 팔로워 늘리는 법 7가지 전략"`,

    'google-ads': `Google 광고(검색/디스플레이/유튜브) 관련 블로그 주제를 1개 제안하세요.

**[SEO 키워드 전략 - 필수 적용]**:
- 네이버/구글에서 실제 검색량이 높은 롱테일 키워드 타겟팅
- 제목 형식: "[메인키워드] + [구체적 수식어] + [연도/숫자]"
- 검색 의도 반영: 정보형("~방법", "~하는 법"), 비교형("~vs~"), 리스트형("~가지")

**검색 최적화 제목 예시**:
- "구글 광고 품질점수 올리는 방법 2025 (10점 만드는 비법)"
- "유튜브 광고 단가 비용 총정리 - CPV, CPM 기준"
- "구글 애즈 키워드 플래너 사용법 완벽 가이드"
- "GDN 배너 광고 사이즈 규격 2025 총정리"`,

    'marketing-trends': `디지털 마케팅 트렌드 관련 블로그 주제를 1개 제안하세요.

**[SEO 키워드 전략 - 필수 적용]**:
- 네이버/구글에서 실제 검색량이 높은 트렌드 키워드
- 제목 형식: "[연도] + [메인키워드] + [트렌드/전망/예측]"
- 검색 의도: 정보 수집형, 트렌드 파악형

**검색 최적화 제목 예시**:
- "2025 디지털 마케팅 트렌드 TOP 10 총정리"
- "AI 마케팅 도구 추천 2025 - 무료/유료 비교"
- "숏폼 콘텐츠 마케팅 전략 완벽 가이드"
- "퍼포먼스 마케팅 뜻과 실전 활용법"`,

    'faq': `SNS/광고 플랫폼 사용 중 겪는 문제 해결 관련 블로그 주제를 1개 제안하세요.

**[SEO 키워드 전략 - 필수 적용]**:
- 네이버/구글에서 실제로 검색되는 문제 해결 키워드
- 제목 형식: "[플랫폼] + [문제상황] + [해결/방법/복구]"
- 검색 의도: 문제 해결형, 트러블슈팅형

**검색 최적화 제목 예시**:
- "인스타그램 계정 정지 해제 방법 2025 (이의제기 템플릿)"
- "페이스북 광고 계정 비활성화 복구하는 법"
- "인스타그램 팔로워 급감 원인과 해결 방법"
- "메타 비즈니스 관리자 오류 해결 총정리"`
  };

  const prompt = `${topicPrompts[category]}

카테고리: ${categoryLabel}

반드시 제목만 한 줄로 응답하세요. 다른 설명 없이 제목만 출력하세요.`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 100 }
    })
  });

  const result = await res.json();
  const topic = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  return topic.replace(/^["']|["']$/g, '').replace(/^\d+\.\s*/, '');
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

    const checkRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: checkPrompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 200 }
      })
    });

    const checkResult = await checkRes.json();
    const text = checkResult.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    try {
      return JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{}');
    } catch {
      return { isDuplicate: false };
    }
  }

  return { isDuplicate: false };
}

// SEO 키워드 생성
async function generateSEOKeywords(title: string, category: string) {
  const prompt = `SEO 키워드 연구 전문가로서 "${title}" 주제의 키워드를 분석하세요. 카테고리: ${category}.
JSON 형식으로만 응답: {"primary":"메인키워드","secondary":["보조키워드5개"],"lsi":["LSI키워드5개"],"questions":["FAQ질문3개"],"searchIntent":"정보형또는거래형","seoTitle":"SEO최적화제목60자이내","metaDescription":"메타설명155자이내"}`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1000 }
    })
  });
  const result = await res.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try {
    return JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{}');
  } catch {
    return {};
  }
}

// 콘텐츠 생성
async function generateContent(title: string, category: CategoryKey, seoKeywords: { primary?: string; secondary?: string[] }) {
  const categoryLabel = CATEGORIES[category]?.label || category;
  const kw = seoKeywords.primary
    ? `**SEO 키워드**: 메인: ${seoKeywords.primary}, 보조: ${seoKeywords.secondary?.join(', ') || ''}`
    : '';

  let prompt: string;

  if (category === 'faq') {
    prompt = `구글 SEO 전문가이자 한국 디지털 마케팅 전문가로서 "${title}" 블로그 글을 작성하세요.

${kw}

**[네이버 + 구글 동시 SEO 최적화 - 필수]**:
1. **제목 최적화**: 메인 키워드를 제목 앞쪽에 배치
2. **서론 300자 내 키워드 2회 이상**: 네이버 C-Rank 알고리즘 대응
3. **H2/H3 제목에 키워드 포함**: 구글 크롤링 최적화
4. **키워드 밀도 1.5-2.5%**: 자연스러운 키워드 배치
5. **내부 링크 유도 문구**: "관련 글 더보기", "함께 읽으면 좋은 글"
6. **FAQ 스키마 대응**: 질문-답변 형식으로 구조화

**[콘텐츠 품질 가이드 - 인기 글 벤치마킹]**:
- 구글/네이버 검색 1페이지 상위 노출 글들의 구조와 톤 참고
- 조회수 높은 블로그/유튜브 콘텐츠의 핵심 포인트 반영
- 단순 정보 나열 NO → 실제 경험담, 구체적 수치, 스크린샷 설명 톤으로 작성
- "~해보니", "직접 테스트한 결과", "실제로 ~했더니" 같은 체험형 문체 사용
- 독자가 바로 따라할 수 있는 구체적인 스텝 제공

**[중요] 실제 사용자 문제 해결 콘텐츠**:
- 사용자들이 네이버/구글에서 실제로 검색하는 구체적인 문제와 해결법
- 인터넷에 흔한 뻔한 내용 NO, 실무에서 겪는 트러블슈팅 위주

**구조**:
[서론 - 독자가 겪는 실제 문제 공감 + 핵심 키워드 2회 이상 자연스럽게 포함]

## 1. 문제 상황 파악
### 이런 증상이 나타나나요?
### 왜 이런 문제가 생기는 걸까요?

## 2. 해결 방법 A: [가장 빠른 해결법]
### Step 1~3

> 💡 **폴라애드 팁**: [실무 노하우]

## 3. 해결 방법 B: [A가 안 될 때]

## 4. 이것도 확인해보세요
- 증상별 원인과 해결법을 **글머리 기호**로 정리 (표 사용 금지)

## 5. 예방법

---
## 자주 묻는 질문 (FAQ)
### Q1. [키워드 포함 질문]?
### Q2~Q5

---
**[CTA]** 해결이 안 되시나요? 폴라애드 전문가에게 무료 상담 받아보세요!

분량: 2000-3000자, FAQ: 5개 이상
**중요**: 표(테이블)는 사용하지 마세요. 데이터는 글머리 기호로 나열하세요.
카테고리: ${categoryLabel}
한국어로 작성하세요.`;

  } else {
    prompt = `구글 SEO 전문가이자 한국 디지털 마케팅 전문가로서 "${title}" 블로그 글을 작성하세요.

${kw}

**[네이버 + 구글 동시 SEO 최적화 - 필수]**:
1. **제목 최적화**: 메인 키워드를 제목 앞쪽에 배치, 40자 이내 권장
2. **서론 300자 내 키워드 2회 이상**: 네이버 C-Rank 알고리즘 대응
3. **H2/H3 제목에 키워드 포함**: 구글 크롤링 최적화
4. **키워드 밀도 1.5-2.5%**: 자연스러운 키워드 배치, 과도한 반복 금지
5. **E-E-A-T 신호**: 전문성, 경험, 권위성, 신뢰성 표현 (데이터/사례 인용)
6. **내부 링크 유도 문구**: "관련 글 더보기", "함께 읽으면 좋은 글"
7. **FAQ 스키마 대응**: 질문-답변 형식으로 구조화

**[콘텐츠 품질 가이드 - 인기 글 벤치마킹]**:
- 구글/네이버 검색 1페이지 상위 노출 글들의 구조와 톤 참고
- 조회수 높은 블로그/유튜브 콘텐츠의 핵심 포인트 반영
- 단순 정보 나열 NO → 실제 경험담, 구체적 수치, Before/After 비교로 작성
- "~해보니", "직접 테스트한 결과", "실제로 적용해본 후기" 같은 체험형 문체 사용
- 독자가 바로 따라할 수 있는 구체적인 스텝과 예시 제공
- 최신 데이터나 통계 인용 (2024-2025년 기준)

**구조**:
[서론 - 핵심 키워드 2회 이상 자연스럽게 포함, 독자 문제 공감]

## 1. [키워드]란? (정의와 중요성)
## 2. [키워드] 실전 활용법
### 2-1. [세부 방법 1]
### 2-2. [세부 방법 2]
## 3. 성공 사례 및 데이터
- 구체적인 수치와 Before/After 비교를 **텍스트로** 설명
- 표(테이블) 사용 금지 → 대신 글머리 기호(bullet)로 데이터 나열
- 예: "도입 전 주 15시간 → 도입 후 주 3시간 (80% 절감)"
## 4. 주의사항 및 팁

> 💡 **폴라애드 팁**: [실무 노하우]

## 5. 체크리스트
- [ ] 항목1
- [ ] 항목2

## 핵심 요약

---
## 자주 묻는 질문 (FAQ)
### Q1. [키워드 포함 질문]?
### Q2~Q3

---
**[CTA]** 더 자세한 맞춤 전략이 필요하시다면 폴라애드 전문가와 무료 상담을 받아보세요!

분량: 2500-3500자, FAQ: 3개 이상
**중요**: 표(테이블)는 사용하지 마세요. 데이터는 글머리 기호로 나열하세요.
카테고리: ${categoryLabel}
한국어로 작성하세요.`;
  }

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

// 썸네일 생성
async function generateThumbnail(title: string, filename: string): Promise<string> {
  const prompt = `Create a photorealistic 1024x1024 stock photo for a Korean marketing blog article about: "${title}".
Korean people, Korean office/cafe setting, modern business environment, natural lighting.
ABSOLUTELY NO TEXT, letters, numbers, watermarks, logos in the image.`;

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
    const imagePath = path.join(process.cwd(), 'public', 'images', 'marketing-news', webpFilename);
    await fs.mkdir(path.dirname(imagePath), { recursive: true });
    const imageBuffer = Buffer.from(imageData.inlineData.data, 'base64');
    await sharp(imageBuffer).resize(1200, 630, { fit: 'cover' }).webp({ quality: 80 }).toFile(imagePath);
    return `/images/marketing-news/${webpFilename}`;
  }
  return '/images/solution-website.webp';
}

// Airtable 업로드
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
}) {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    return null;
  }

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

  const result = await res.json();
  return result.records?.[0]?.id || null;
}

// GitHub에 파일 커밋 (Vercel 환경에서 파일 직접 저장 불가하므로)
async function commitToGitHub(
  filePath: string,
  content: string,
  commitMessage: string
): Promise<boolean> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO; // format: "owner/repo"

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    console.log('GitHub 설정 없음 - 파일 커밋 스킵');
    return false;
  }

  try {
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

    return res.ok;
  } catch (error) {
    console.error('GitHub 커밋 실패:', error);
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

// 썸네일 생성 (GitHub 버전)
async function generateThumbnailForGitHub(title: string, slug: string): Promise<{ path: string; buffer?: Buffer }> {
  const prompt = `Create a photorealistic 1024x1024 stock photo for a Korean marketing blog article about: "${title}".
Korean people, Korean office/cafe setting, modern business environment, natural lighting.
ABSOLUTELY NO TEXT, letters, numbers, watermarks, logos in the image.`;

  try {
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

      return {
        path: `/images/marketing-news/${slug}.webp`,
        buffer: webpBuffer
      };
    }
  } catch (error) {
    console.error('썸네일 생성 실패:', error);
  }

  return { path: '/images/solution-website.webp' };
}

export async function GET(request: Request) {
  // Cron 인증 확인
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 오늘 요일 확인 (KST 기준)
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  const dayOfWeek = kstDate.getUTCDay();

  // 오늘이 실행 요일인지 확인
  const category = DAY_CATEGORY_MAP[dayOfWeek];
  if (!category) {
    return NextResponse.json({
      message: `오늘(${dayOfWeek})은 실행 요일이 아닙니다. 실행 요일: 월(1), 수(3), 금(5), 일(0)`,
      skipped: true
    });
  }

  try {
    console.log(`🚀 자동 글 생성 시작 - 카테고리: ${category}`);

    // 1. AI로 주제 생성
    let title = await generateTopic(category);
    console.log(`📝 생성된 주제: ${title}`);

    // 2. 중복 체크 (최대 3번 재시도)
    let attempts = 0;
    while (attempts < 3) {
      const duplicateCheck = await checkDuplicateTopic(title, category);
      if (!duplicateCheck.isDuplicate) break;

      console.log(`⚠️ 중복 발견, 재생성... (${attempts + 1}/3)`);
      title = await generateTopic(category);
      attempts++;
    }

    const slug = generateSlug(title);
    const today = kstDate.toISOString().split('T')[0];

    // 3. SEO 키워드 연구
    console.log('🔍 SEO 키워드 연구...');
    const seoKeywords = await generateSEOKeywords(title, category);

    // 4. 콘텐츠 생성
    console.log('✍️ 콘텐츠 생성...');
    const content = await generateContent(title, category, seoKeywords);

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

    // 7. GitHub에 커밋
    const categoryFolder = CATEGORIES[category].folder;
    const mdxPath = `content/marketing-news/${categoryFolder}/${slug}.mdx`;

    console.log('📤 GitHub 커밋...');
    const mdxCommitted = await commitToGitHub(
      mdxPath,
      mdxContent,
      `📝 자동 생성: ${seoTitle}`
    );

    // 이미지도 GitHub에 업로드
    if (thumbnail.buffer) {
      const imagePath = `public/images/marketing-news/${slug}.webp`;
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
    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ 에러:', error);
    return NextResponse.json({
      error: 'Generation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
