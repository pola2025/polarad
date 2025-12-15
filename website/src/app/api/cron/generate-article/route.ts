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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const CRON_SECRET = process.env.CRON_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = '-1003280236380'; // 마케팅 소식 알림 채널

const CATEGORIES = {
  'meta-ads': { label: 'Meta 광고', folder: 'meta-ads' },
  'instagram-reels': { label: '인스타그램 릴스', folder: 'instagram-reels' },
  'threads': { label: '쓰레드', folder: 'threads' },
  'faq': { label: '궁금해요', folder: 'faq' }
} as const;

type CategoryKey = keyof typeof CATEGORIES;

// 현재 연도 가져오기 (KST 기준 동적 계산)
function getCurrentYear(): string {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  return String(kstDate.getUTCFullYear());
}
const CURRENT_YEAR = getCurrentYear();

// 요일별 카테고리 매핑 (0=일, 1=월, 2=화, ...)
const DAY_CATEGORY_MAP: Record<number, CategoryKey> = {
  0: 'faq',              // 일요일
  1: 'meta-ads',         // 월요일
  3: 'instagram-reels',  // 수요일
  5: 'threads'           // 금요일
};

// 다음 작성 일정 계산 (월/수/금/일)
function getNextScheduleDate(): { date: string; dayName: string; category: string } {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);

  const scheduleDays = [0, 1, 3, 5]; // 일, 월, 수, 금
  const dayNames: Record<number, string> = { 0: '일요일', 1: '월요일', 3: '수요일', 5: '금요일' };

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
    category: CATEGORIES[DAY_CATEGORY_MAP[currentDay]]?.label || ''
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
• 수: 인스타그램 릴스
• 금: 쓰레드
• 일: 궁금해요`;

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

// AI가 주제 자동 생성
async function generateTopic(category: CategoryKey): Promise<string> {
  const categoryLabel = CATEGORIES[category].label;

  const topicPrompts: Record<CategoryKey, string> = {
    'meta-ads': `Meta(페이스북/인스타그램) 광고 또는 인스타그램 활용 관련 블로그 주제를 1개 제안하세요.

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

    'faq': `SNS/광고 플랫폼 사용 중 겪는 문제 해결 관련 블로그 주제를 1개 제안하세요.

**[중요 제외 사항]**: 틱톡(TikTok) 관련 내용은 절대 포함하지 마세요. Meta 플랫폼(페이스북, 인스타그램, 쓰레드)만 다룹니다.

**[SEO 키워드 전략 - 필수 적용]**:
- 네이버/구글에서 실제로 검색되는 문제 해결 키워드
- 제목 형식: "[플랫폼] + [문제상황] + [해결/방법/복구]"
- 검색 의도: 문제 해결형, 트러블슈팅형

**검색 최적화 제목 예시**:
- "인스타그램 계정 정지 해제 방법 ${CURRENT_YEAR} (이의제기 템플릿)"
- "페이스북 광고 계정 비활성화 복구하는 법"
- "인스타그램 팔로워 급감 원인과 해결 방법"
- "메타 비즈니스 관리자 오류 해결 총정리"`
  };

  const prompt = `${topicPrompts[category]}

카테고리: ${categoryLabel}

**중요**: 제목에 연도를 포함할 경우 반드시 ${CURRENT_YEAR}년을 사용하세요. 2024년은 절대 사용하지 마세요.

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

**[콘텐츠 품질 가이드]**:
- 단순 정보 나열 NO → 실제 경험담, 구체적 수치로 작성
- "~해보니", "직접 테스트한 결과" 같은 체험형 문체 사용
- 독자가 바로 따라할 수 있는 구체적인 스텝 제공

**[🎨 시각화 필수 - 가장 중요!]**
수치, 비교, 통계 데이터가 나오면 **반드시 차트 컴포넌트로 시각화**!
표(테이블)는 절대 사용 금지! 아래 컴포넌트 중 선택:

1. **ComparisonChart** - Before/After, 해결 전후 비교
\`\`\`jsx
<ComparisonChart title="제목" beforeLabel="해결 전" afterLabel="해결 후"
  data={[{ label: "항목", before: "문제", after: "해결", change: "개선" }]} />
\`\`\`

2. **StatCards** - 핵심 수치, 체크포인트 요약
\`\`\`jsx
<StatCards stats={[
  { label: "체크1", value: "확인사항", icon: "✅" },
  { label: "체크2", value: "확인사항", icon: "⚠️" }
]} />
\`\`\`

**글 전체에서 최소 1개 이상의 차트를 사용하세요!**

**구조**:
[서론 - 독자가 겪는 실제 문제 공감 + 핵심 키워드 2회 이상]

## 1. 문제 상황 파악
### 이런 증상이 나타나나요?
### 왜 이런 문제가 생기는 걸까요?

## 2. 해결 방법 A: [가장 빠른 해결법]
### Step 1~3

> 💡 **폴라애드 팁**: [실무 노하우]

## 3. 해결 방법 B: [A가 안 될 때]

## 4. 이것도 확인해보세요 ← **여기서 StatCards로 체크포인트 시각화**

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

**[콘텐츠 품질 가이드]**:
- 단순 정보 나열 NO → 실제 경험담, 구체적 수치, Before/After 비교로 작성
- "~해보니", "직접 테스트한 결과", "실제로 적용해본 후기" 같은 체험형 문체 사용
- 독자가 바로 따라할 수 있는 구체적인 스텝과 예시 제공

**[🎨 시각화 필수 - 가장 중요!]**
글에서 수치, 비교, 통계, 순위, 요약 데이터가 나오면 **반드시 차트 컴포넌트로 시각화**하세요.
표(테이블)는 절대 사용 금지! 아래 3가지 컴포넌트 중 선택:

1. **ComparisonChart** - Before/After, 전후 비교, 도입 효과
\`\`\`jsx
<ComparisonChart
  title="제목"
  beforeLabel="도입 전"
  afterLabel="도입 후"
  data={[
    { label: "항목", before: "이전값", after: "이후값", change: "+50%" }
  ]}
/>
\`\`\`

2. **BarChart** - 순위, 비율, 업종별/항목별 비교
\`\`\`jsx
<BarChart title="제목" unit="%" color="primary" data={[
  { label: "항목1", value: 80 },
  { label: "항목2", value: 60 }
]} />
\`\`\`

3. **StatCards** - 핵심 지표, 권장 수치, 요약 통계
\`\`\`jsx
<StatCards stats={[
  { label: "라벨", value: "수치", icon: "📈", change: "+50%" }
]} />
\`\`\`

**시각화 적용 시점**:
- 업종별/항목별 데이터 → StatCards 또는 BarChart
- 성과 개선 사례 → ComparisonChart
- 권장 수치/예산 → StatCards
- 비교 분석 → ComparisonChart 또는 BarChart
- **글 전체에서 최소 2개 이상의 차트를 사용하세요!**

**[참고 스타일 - 이 형식을 따라하세요]**:
\`\`\`
## 2. 실전 활용법
### 2-1. 소셜 미디어 콘텐츠 제작
직접 테스트한 결과, 인스타그램 피드용 이미지 제작에 특히 효과적이었습니다.

<ComparisonChart
  title="제작 시간 비교"
  beforeLabel="기존"
  afterLabel="도입 후"
  data={[
    { label: "SNS 피드 이미지", before: "2시간", after: "20분", change: "-83%" },
    { label: "광고 배너", before: "3시간", after: "30분", change: "-83%" }
  ]}
/>

### 2-2. 업종별 권장 예산
<StatCards stats={[
  { label: "B2B 서비스", value: "50,000원/일", icon: "💼" },
  { label: "이커머스", value: "30,000원/일", icon: "🛒" }
]} />
\`\`\`

**구조**:
[서론 - 핵심 키워드 2회 이상, 독자 문제 공감, 구체적 수치로 시작]

## 1. [키워드]란? (정의와 중요성)
## 2. [키워드] 실전 활용법 ← **여기서 StatCards 또는 BarChart 사용**
### 2-1. [세부 방법 1]
### 2-2. [세부 방법 2]
## 3. 성공 사례 및 데이터 ← **여기서 ComparisonChart 필수**
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
  let category: CategoryKey | undefined = forceCategory && CATEGORIES[forceCategory] ? forceCategory : DAY_CATEGORY_MAP[dayOfWeek];

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

    // 7. GitHub에 커밋 (website/ 폴더 내에 저장)
    const categoryFolder = CATEGORIES[category].folder;
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
      category: CATEGORIES[category].label
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
