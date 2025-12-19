/**
 * Instagram 컨텐츠 생성기
 * Gemini 2.5 Pro로 polarad.co.kr 기반 컨텐츠 생성
 */

import { TemplateData, TemplateType, TEMPLATE_TYPES } from './instagram-templates';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// polarad.co.kr 서비스 내용 기반 컨텐츠 풀
const CONTENT_TOPICS = {
  intro: {
    themes: [
      '체계적인 자동화 접수 시스템',
      '안정적인 매출창출을 위한 온라인 영업 솔루션',
      '영업에 필요한 모든 것을 한 번에',
      'DB 수집부터 계약까지 원스톱 솔루션',
    ],
    services: ['홈페이지', 'Meta 광고', '인쇄물', '자동화 시스템', 'CRM'],
  },
  problem: {
    painPoints: [
      '공유 DB로 경쟁만 치열',
      '미팅 성사율 5% 미만',
      '매월 수백만 원 DB 비용',
      '콜드콜로 시간만 낭비',
      '광고비는 쓰는데 성과는 없고',
      'DB 품질이 너무 낮아서',
    ],
    questions: [
      '아직도 남들이 버린 DB에 전화를 돌리고 계십니까?',
      '광고비만 쓰고 성과는 없으신가요?',
      '매일 콜드콜만 하다가 지치셨나요?',
      'DB 구매 비용이 부담되시나요?',
    ],
  },
  solution: {
    packages: [
      { name: 'Conversion Basecamp', desc: '고객을 설득하고 DB를 추출하는 전환 기지' },
      { name: 'Lead Magnet Engine', desc: '잠재 고객을 정밀 타겟팅하여 유입' },
      { name: 'Authority Kit', desc: '미팅 현장에서 신뢰도를 높이는 브랜딩 키트' },
    ],
    benefits: ['전환율 높은 랜딩페이지', '정밀 타겟팅 광고', '브랜드 신뢰도 향상'],
  },
  feature: {
    features: [
      { name: '실시간 알림', desc: '고객 문의 즉시 알림' },
      { name: '자동 분류', desc: 'AI 기반 리드 자동 분류' },
      { name: 'DB 관리', desc: '체계적인 고객 데이터 관리' },
      { name: '자동 리포트', desc: '광고 성과 자동 리포팅' },
    ],
  },
  stats: {
    metrics: [
      { label: '평균 DB 수집', range: [80, 150], unit: '건' },
      { label: 'DB당 단가', range: [18000, 28000], unit: '원' },
      { label: '미팅 전환율', range: [15, 35], unit: '%' },
      { label: '광고 효율', range: [20, 40], unit: '% 개선' },
    ],
  },
  promo: {
    offers: [
      '선착순 20팀 한정!',
      '이번 달 특별 혜택',
      '창업 지원 프로모션',
      '신규 가입 이벤트',
    ],
    benefits: [
      '자동화 시스템 2년 무료',
      '첫 달 광고비 50% 지원',
      '프리미엄 컨설팅 무료',
      '브랜딩 키트 무료 제공',
    ],
  },
  service: {
    services: [
      {
        name: '홈페이지 제작',
        features: [
          { name: '반응형 웹', desc: 'PC, 모바일 모두 최적화' },
          { name: 'SEO 최적화', desc: '검색엔진 상위 노출' },
          { name: 'DB 폼 연동', desc: '고객 문의 자동 수집' },
        ],
      },
      {
        name: 'Meta 광고',
        features: [
          { name: '정밀 타겟팅', desc: '이상적인 고객층 공략' },
          { name: 'A/B 테스트', desc: '최적의 광고 소재 발굴' },
          { name: '리타겟팅', desc: '이탈 고객 재유입' },
        ],
      },
      {
        name: '인쇄물 제작',
        features: [
          { name: '명함', desc: '200매 기본 제공' },
          { name: '대봉투', desc: '500매 기본 제공' },
          { name: '계약서', desc: '500매 기본 제공' },
        ],
      },
    ],
  },
  cta: {
    messages: [
      '영업에만 집중하세요',
      '나머지는 저희가 다 해드립니다',
      '복잡한 마케팅은 맡기세요',
      '대표님은 계약에만 집중하세요',
    ],
  },
};

// 해시태그 풀
const HASHTAG_POOLS = {
  core: ['#폴라애드', '#polarad', '#온라인마케팅', '#영업자동화', '#DB수집'],
  service: ['#메타광고', '#홈페이지제작', '#인쇄물', '#명함제작', '#브랜딩', '#리드제너레이션', '#마케팅대행'],
  target: ['#B2B마케팅', '#스타트업', '#소상공인', '#창업', '#영업대표', '#세일즈'],
  feature: ['#자동화', '#CRM', '#고객관리', '#마케팅자동화', '#업무효율'],
};

interface GeneratedContent {
  templateType: TemplateType;
  templateData: TemplateData;
  caption: string;
  hashtags: string[];
}

/**
 * Gemini로 Instagram 컨텐츠 생성
 */
export async function generateInstagramContent(): Promise<GeneratedContent> {
  // 랜덤 템플릿 타입 선택
  const templateType = TEMPLATE_TYPES[Math.floor(Math.random() * TEMPLATE_TYPES.length)];

  // Gemini로 컨텐츠 생성
  const templateData = await generateContentWithGemini(templateType);

  // 캡션 생성
  const caption = await generateCaptionWithGemini(templateType, templateData);

  // 해시태그 선택
  const hashtags = selectHashtags(templateType);

  return {
    templateType,
    templateData,
    caption,
    hashtags,
  };
}

/**
 * Gemini로 템플릿 데이터 생성
 */
async function generateContentWithGemini(templateType: TemplateType): Promise<TemplateData> {
  if (!GEMINI_API_KEY) {
    console.log('⚠️ GEMINI_API_KEY 미설정 - 기본 컨텐츠 사용');
    return getDefaultContent(templateType);
  }

  const topic = CONTENT_TOPICS[templateType];
  const prompt = buildPromptForTemplate(templateType, topic);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-06-05:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    const result = await res.json();
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (responseText) {
      return parseGeminiResponse(templateType, responseText);
    }
  } catch (error) {
    console.error('Gemini 컨텐츠 생성 실패:', error);
  }

  return getDefaultContent(templateType);
}

/**
 * 템플릿 타입별 프롬프트 생성
 */
function buildPromptForTemplate(templateType: TemplateType, topic: any): string {
  const baseContext = `당신은 PolarAD(폴라애드) 마케팅 회사의 Instagram 컨텐츠 작성자입니다.
PolarAD는 B2B 영업 대표님들을 위한 자동화 접수 시스템을 제공하는 회사입니다.
주요 서비스: 홈페이지 제작, Meta 광고 운영, 인쇄물 제작, 자동화 시스템

Instagram 이미지용 텍스트를 생성해주세요. 짧고 임팩트 있게 작성하세요.`;

  switch (templateType) {
    case 'intro':
      return `${baseContext}

**템플릿 타입**: 브랜드 소개
**참고 테마**: ${topic.themes.join(', ')}

다음 JSON 형식으로 응답하세요:
{
  "headline": "메인 헤드라인 (2줄, 각 줄 10자 이내, \\n으로 구분)",
  "subHeadline": "서브 헤드라인 (1-2줄, 각 줄 15자 이내)",
  "items": [
    {"icon": "이모지", "text": "서비스명 (4자 이내)"},
    {"icon": "이모지", "text": "서비스명"},
    {"icon": "이모지", "text": "서비스명"}
  ],
  "cta": "CTA 버튼 텍스트 (6자 이내)"
}

기존과 다른 새로운 표현으로 작성하세요. JSON만 출력하세요.`;

    case 'problem':
      return `${baseContext}

**템플릿 타입**: 문제 제기 (영업 대표님의 고민)
**참고 고민**: ${topic.painPoints.join(', ')}
**참고 질문**: ${topic.questions.join(', ')}

다음 JSON 형식으로 응답하세요:
{
  "badge": "배지 텍스트 (10자 이내)",
  "headline": "메인 질문 (3-4줄, 각 줄 8자 이내, \\n으로 구분, 강조할 부분은 그대로)",
  "items": [
    {"text": "문제 앞부분", "highlight": "강조할 부분"},
    {"text": "", "highlight": "강조할 부분"},
    {"text": "문제 앞부분", "highlight": "강조할 부분"}
  ],
  "cta": "솔루션 제안 (12자 이내)",
  "subHeadline": "솔루션 부연 설명 (10자 이내)"
}

기존과 다른 새로운 표현으로 작성하세요. JSON만 출력하세요.`;

    case 'solution':
      return `${baseContext}

**템플릿 타입**: 솔루션 소개 (올인원 패키지)
**참고 패키지**: ${JSON.stringify(topic.packages)}

다음 JSON 형식으로 응답하세요:
{
  "badge": "배지 텍스트 (이모지 포함, 10자 이내)",
  "headline": "메인 헤드라인 (2줄, gradient 클래스용 강조 텍스트 포함)",
  "subHeadline": "서브 헤드라인 (15자 이내)",
  "items": [
    {"icon": "이모지", "text": "패키지명", "highlight": "설명 (20자 이내)"},
    {"icon": "이모지", "text": "패키지명", "highlight": "설명"},
    {"icon": "이모지", "text": "패키지명", "highlight": "설명"}
  ],
  "cta": "프로모션 문구 (15자 이내, 선착순 등)"
}

기존과 다른 새로운 표현으로 작성하세요. JSON만 출력하세요.`;

    case 'feature':
      return `${baseContext}

**템플릿 타입**: 기능 소개
**참고 기능**: ${JSON.stringify(topic.features)}

다음 JSON 형식으로 응답하세요:
{
  "headline": "메인 헤드라인 (2줄, blue 클래스용 강조 텍스트 포함, \\n으로 구분)",
  "subHeadline": "설명 (2줄, 각 줄 15자 이내)",
  "items": [
    {"icon": "이모지", "text": "기능명 (5자 이내)"},
    {"icon": "이모지", "text": "기능명"},
    {"icon": "이모지", "text": "기능명"}
  ],
  "cta": "하단 메시지 (20자 이내)"
}

기존과 다른 새로운 표현으로 작성하세요. JSON만 출력하세요.`;

    case 'stats':
      return `${baseContext}

**템플릿 타입**: 통계/리포트 (Meta 광고 성과)
**참고 지표**: ${JSON.stringify(topic.metrics)}

다음 JSON 형식으로 응답하세요:
{
  "badge": "배지 텍스트 (이모지 포함)",
  "headline": "메인 헤드라인 (2줄, blue 클래스용 강조 텍스트 포함)",
  "subHeadline": "서브 헤드라인",
  "stats": [
    {"label": "지표명", "value": "값 (₩, 건, % 등 포함)", "change": "변화율 (▲/▼ 포함)"},
    {"label": "지표명", "value": "값", "change": "변화율"},
    {"label": "지표명", "value": "값", "change": "변화율"}
  ]
}

실제처럼 보이는 숫자를 랜덤하게 생성하세요. JSON만 출력하세요.`;

    case 'promo':
      return `${baseContext}

**템플릿 타입**: 프로모션
**참고 오퍼**: ${topic.offers.join(', ')}
**참고 혜택**: ${topic.benefits.join(', ')}

다음 JSON 형식으로 응답하세요:
{
  "badge": "배지 텍스트 (이모지 포함)",
  "headline": "메인 헤드라인 (2줄, gold 클래스용 강조 텍스트 포함, 선착순 N팀 등)",
  "subHeadline": "서브 헤드라인 (혜택 요약)",
  "cta": "핵심 혜택 (10자 이내)"
}

긴박감을 주는 표현으로 작성하세요. JSON만 출력하세요.`;

    case 'service':
      return `${baseContext}

**템플릿 타입**: 서비스 상세 소개
**참고 서비스**: ${JSON.stringify(topic.services[Math.floor(Math.random() * topic.services.length)])}

다음 JSON 형식으로 응답하세요:
{
  "badge": "배지 텍스트 (이모지 포함, 서비스명)",
  "headline": "메인 헤드라인 (2줄, blue 클래스용 강조 텍스트 포함)",
  "subHeadline": "핵심 가치 설명 (2줄)",
  "items": [
    {"icon": "이모지", "text": "기능명", "highlight": "설명"},
    {"icon": "이모지", "text": "기능명", "highlight": "설명"},
    {"icon": "이모지", "text": "기능명", "highlight": "설명"}
  ],
  "cta": "CTA 텍스트"
}

기존과 다른 새로운 표현으로 작성하세요. JSON만 출력하세요.`;

    case 'cta':
      return `${baseContext}

**템플릿 타입**: 마무리 CTA
**참고 메시지**: ${topic.messages.join(', ')}

다음 JSON 형식으로 응답하세요:
{
  "headline": "핵심 메시지 (1줄, 10자 이내)",
  "subHeadline": "부연 메시지 (15자 이내)",
  "items": [
    {"icon": "이모지", "text": "서비스명"},
    {"icon": "이모지", "text": "서비스명"},
    {"icon": "이모지", "text": "서비스명"},
    {"icon": "이모지", "text": "서비스명"}
  ],
  "cta": "CTA 버튼 텍스트 (6자 이내)"
}

감성적이고 설득력 있는 표현으로 작성하세요. JSON만 출력하세요.`;

    default:
      return `${baseContext}\n\n기본 브랜드 소개 컨텐츠를 JSON으로 생성하세요.`;
  }
}

/**
 * Gemini 응답 파싱
 */
function parseGeminiResponse(templateType: TemplateType, responseText: string): TemplateData {
  try {
    // JSON 추출 (코드 블록 제거)
    let jsonStr = responseText;
    if (jsonStr.includes('```')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }

    const parsed = JSON.parse(jsonStr.trim());
    return parsed as TemplateData;
  } catch (error) {
    console.error('Gemini 응답 파싱 실패:', error);
    return getDefaultContent(templateType);
  }
}

/**
 * 기본 컨텐츠 (Gemini 실패 시)
 */
function getDefaultContent(templateType: TemplateType): TemplateData {
  const defaults: Record<TemplateType, TemplateData> = {
    intro: {
      headline: '체계적인\n자동화 접수 시스템',
      subHeadline: '안정적인 매출창출을 위한\n온라인 영업 솔루션',
      items: [
        { icon: '🖥️', text: '홈페이지' },
        { icon: '📱', text: 'Meta 광고' },
        { icon: '🖨️', text: '인쇄물' },
      ],
      cta: '무료 상담 신청',
    },
    problem: {
      badge: '영업 대표님께 드리는 질문',
      headline: '아직도\n남들이 버린 DB에\n전화를 돌리고\n계십니까?',
      items: [
        { text: '공유 DB로', highlight: '경쟁만 치열' },
        { text: '', highlight: '미팅 성사율 5% 미만' },
        { text: '매월', highlight: '수백만 원 DB 비용' },
      ],
      cta: '체계적인 자동화 접수 시스템',
      subHeadline: '영업에만 집중하시면 됩니다',
    },
    solution: {
      badge: '✨ 올인원 패키지',
      headline: '체계적인 자동화 접수 시스템\n영업에만 집중하시면 됩니다',
      subHeadline: '모든 것을 한 번에 해결',
      items: [
        { icon: '🎯', text: 'Conversion Basecamp', highlight: '고객을 설득하고 DB를 추출하는 전환 기지' },
        { icon: '🧲', text: 'Lead Magnet Engine', highlight: '잠재 고객을 정밀 타겟팅하여 유입' },
        { icon: '🏆', text: 'Authority Kit', highlight: '미팅 현장에서 신뢰도를 높이는 브랜딩 키트' },
      ],
      cta: '선착순 20팀 자동화 시스템 2년 무료!',
    },
    feature: {
      headline: '체계적인\n자동화 접수 시스템',
      subHeadline: '24시간 자동으로 고객 문의를 접수하고\n실시간 알림으로 빠르게 대응하세요',
      items: [
        { icon: '🔔', text: '실시간 알림' },
        { icon: '📂', text: '자동 분류' },
        { icon: '💾', text: 'DB 관리' },
      ],
      cta: '대표님이 영업에만 집중할 수 있도록',
    },
    stats: {
      badge: '📊 자동 리포팅',
      headline: 'Meta 광고\n자동리포트 시스템',
      subHeadline: '광고 성과를 한눈에, 자동으로 리포팅',
      stats: [
        { label: '총 지출', value: '₩2.8M', change: '예산 대비 94%' },
        { label: 'DB 수집', value: '127건', change: '▲ 23% vs 지난주' },
        { label: 'DB당 단가', value: '₩22K', change: '▼ 12% 개선' },
      ],
    },
    promo: {
      badge: '🎁 특별 프로모션',
      headline: '선착순 20팀\n한정!',
      subHeadline: '지금 신청하시면',
      cta: '자동화 시스템 2년 무료',
    },
    service: {
      badge: '🖥️ 홈페이지 제작',
      headline: '전환율 높은\n홈페이지 제작',
      subHeadline: '단순 홈페이지가 아닙니다\nDB를 추출하는 전환 기지입니다',
      items: [
        { icon: '📱', text: '반응형 웹', highlight: 'PC, 모바일 모두 최적화' },
        { icon: '🔍', text: 'SEO 최적화', highlight: '검색엔진 상위 노출' },
        { icon: '📋', text: 'DB 폼 연동', highlight: '고객 문의 자동 수집' },
      ],
      cta: '무료 상담 받아보세요',
    },
    cta: {
      headline: '영업에만 집중하세요',
      subHeadline: '나머지는 저희가 다 해드립니다',
      items: [
        { icon: '🖥️', text: '홈페이지' },
        { icon: '📱', text: 'Meta 광고' },
        { icon: '📊', text: '자동 리포트' },
        { icon: '🖨️', text: '인쇄물' },
      ],
      cta: '무료 상담 신청',
    },
  };

  return defaults[templateType];
}

/**
 * Gemini로 캡션 생성
 */
async function generateCaptionWithGemini(templateType: TemplateType, templateData: TemplateData): Promise<string> {
  if (!GEMINI_API_KEY) {
    return getDefaultCaption(templateType, templateData);
  }

  const prompt = `당신은 PolarAD(폴라애드) 마케팅 회사의 Instagram 캡션 전문 작성자입니다.
B2B 영업 대표님들을 위한 "올인원 영업 자동화 솔루션"을 제공합니다.

**[중요] 폴라애드 올인원 패키지 - 반드시 골고루 강조할 것**:

📌 1. PC/모바일 반응형 웹사이트 제작 (Conversion Basecamp)
   - 10페이지 이내 반응형 웹 (PC, 태블릿, 모바일 최적화)
   - SEO 최적화로 검색 상위 노출
   - DB 수집 폼 연동 (고객 문의 자동 수집)
   - 도메인 + 호스팅 1년 무료

📌 2. 인쇄물 제작 (Authority Kit) - 미팅 현장 신뢰도 UP
   - 명함 200매
   - 대봉투 500매
   - 계약서 500매
   - 프로페셔널한 브랜딩으로 계약 성사율 향상

📌 3. Meta 광고 자동화 (Lead Magnet Engine)
   - Facebook/Instagram 광고 자동화 설정
   - 타겟 오디언스 최적화
   - 실시간 대시보드 성과 추적

→ 이 모든 것이 "올인원 패키지"로 한 번에 제공됩니다!
→ 대표님은 고객 미팅과 계약 성사에만 집중하시면 됩니다.

**컨텐츠 정보**:
- 타입: ${templateType}
- 헤드라인: ${templateData.headline}
- 서브헤드라인: ${templateData.subHeadline || ''}
- 아이템: ${JSON.stringify(templateData.items || [])}

**캡션 작성 가이드라인**:

1. **총 길이**: 900~1200자 (해시태그 제외)

2. **인스타그램 가로폭 최적화**:
   - 한 줄당 25~30자 이내로 작성
   - 너무 긴 문장은 자연스럽게 줄바꿈
   - 빈 줄로 문단 구분하여 가독성 확보

3. **구조 (필수)**:

[도입부 - 3~4줄]
- 핵심 질문이나 공감 포인트로 시작
- 이모지 1~2개 활용
- 독자의 관심을 끄는 후킹

[본문 - 8~12줄]
- 문제 상황 설명
- 왜 이것이 중요한지
- 폴라애드의 솔루션이 어떻게 도움이 되는지
- 구체적인 예시나 수치 언급
- 각 문단은 2~3줄 후 빈 줄

[체크리스트 섹션 - 올인원 패키지 강조]
━━━━━━━━━━━━━━━━━
✅ PC/모바일 반응형 웹사이트
✅ 명함, 대봉투, 계약서 인쇄물
✅ Meta 광고 자동화 설정
✅ (추가 포인트 1개 더)
━━━━━━━━━━━━━━━━━
→ 체크리스트는 반드시 위 3가지 서비스 포함!

[마무리 - 2~3줄]
- 행동 유도 메시지
- "💬 무료 상담 → 프로필 링크"로 마무리

4. **톤앤매너**:
- 전문적이면서 친근하게
- B2B 영업 대표님 대상
- "~하세요", "~입니다" 존댓말
- 과장 없이 신뢰감 있게

5. **금지사항**:
- 해시태그 포함 금지 (별도 추가됨)
- 이모지 과다 사용 금지 (전체 5~7개 이내)
- 한 줄에 35자 이상 금지

캡션만 출력하세요. 다른 설명 없이 캡션 텍스트만 작성하세요.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.75, maxOutputTokens: 1500 },
        }),
      }
    );

    const result = await res.json();
    const caption = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (caption) {
      return caption;
    }
  } catch (error) {
    console.error('Gemini 캡션 생성 실패:', error);
  }

  return getDefaultCaption(templateType, templateData);
}

/**
 * 기본 캡션 생성
 */
function getDefaultCaption(templateType: TemplateType, data: TemplateData): string {
  const headline = data.headline?.replace(/\n/g, ' ') || '';

  return `${headline} 📊

━━━━━━━━━━━━━━━━━

${data.subHeadline || '체계적인 자동화 접수 시스템으로\n영업에만 집중하세요'}

━━━━━━━━━━━━━━━━━

💬 무료 상담 → 프로필 링크`;
}

/**
 * 해시태그 선택
 */
function selectHashtags(templateType: TemplateType): string[] {
  const selected: string[] = [];

  // 코어 해시태그 (2-3개)
  const coreCount = 2 + Math.floor(Math.random() * 2);
  const shuffledCore = [...HASHTAG_POOLS.core].sort(() => Math.random() - 0.5);
  selected.push(...shuffledCore.slice(0, coreCount));

  // 서비스 해시태그 (2-3개)
  const serviceCount = 2 + Math.floor(Math.random() * 2);
  const shuffledService = [...HASHTAG_POOLS.service].sort(() => Math.random() - 0.5);
  selected.push(...shuffledService.slice(0, serviceCount));

  // 타겟 해시태그 (1-2개)
  const targetCount = 1 + Math.floor(Math.random() * 2);
  const shuffledTarget = [...HASHTAG_POOLS.target].sort(() => Math.random() - 0.5);
  selected.push(...shuffledTarget.slice(0, targetCount));

  // 기능 해시태그 (1-2개)
  const featureCount = 1 + Math.floor(Math.random() * 2);
  const shuffledFeature = [...HASHTAG_POOLS.feature].sort(() => Math.random() - 0.5);
  selected.push(...shuffledFeature.slice(0, featureCount));

  return selected;
}
