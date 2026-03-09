/**
 * Instagram 컨텐츠 생성기
 * polarad.co.kr 기반 컨텐츠 생성
 *
 * ⚠️ GEMINI 모델 절대규칙 (변경 금지) ⚠️
 * ─────────────────────────────────────────
 * | 용도           | 모델                          |
 * |----------------|-------------------------------|
 * | 템플릿 데이터  | gemini-3-flash-preview        |
 * | 캡션 생성      | gemini-3.1-pro-preview          |
 * ─────────────────────────────────────────
 * ❌ Gemini 2.x 버전 사용 절대 금지
 * ❌ 모델명 임의 변경 금지
 */

import {
  TemplateData,
  TemplateType,
  TEMPLATE_TYPES,
} from "./instagram-templates";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// polarad.co.kr 서비스 내용 기반 컨텐츠 풀
// DB접수 랜딩 서비스 - 36만원 단일 상품 기반
const CONTENT_TOPICS = {
  intro: {
    themes: [
      "월 3만원으로 1년 자동화",
      "카카오 로그인으로 진성 리드만 수집",
      "5~7일 만에 완성되는 리드 수집 시스템",
      "스팸 없는 진짜 고객만 받는 랜딩페이지",
    ],
    services: ["랜딩페이지", "카카오 로그인", "텔레그램 알림", "관리 대시보드"],
  },
  problem: {
    painPoints: [
      "스팸 접수로 시간 낭비",
      "가짜 전화번호로 연락 안 됨",
      "반복 접수로 중복 DB",
      "접수 알림이 늦어서 놓침",
      "고객 데이터 관리가 안 돼서",
      "엑셀로 일일이 정리하느라",
    ],
    questions: [
      "아직도 스팸 접수 때문에 시간 낭비하고 계십니까?",
      "가짜 전화번호 때문에 연락이 안 되셨나요?",
      "접수 알림이 늦어서 고객을 놓치셨나요?",
      "엑셀로 DB 정리하느라 시간 다 쓰시나요?",
    ],
  },
  solution: {
    product: {
      name: "DB접수 랜딩 서비스",
      price: "36만원",
      monthly: "월 3만원",
      period: "1년 이용권",
    },
    benefits: [
      "카카오 로그인으로 본인인증된 정보만 수집",
      "스팸/반복 접수 자동 차단",
      "텔레그램으로 즉시 알림",
      "관리 대시보드에서 한눈에 확인",
    ],
    keyMessages: [
      "진성 리드만 수집하세요",
      "월 3만원으로 1년간 자동화",
      "5~7일 만에 제작 완료",
      "스팸 걱정 없이 영업에만 집중",
    ],
  },
  feature: {
    features: [
      { name: "카카오 로그인", desc: "본인인증된 연락처만 수집" },
      { name: "스팸 차단", desc: "반복접수/가짜번호 자동 필터" },
      { name: "텔레그램 알림", desc: "접수 즉시 실시간 알림" },
      { name: "관리 대시보드", desc: "접수 현황 한눈에 파악" },
    ],
  },
  stats: {
    metrics: [
      { label: "스팸 차단율", range: [95, 99], unit: "%" },
      { label: "연락 성공률", range: [85, 95], unit: "%" },
      { label: "평균 제작 기간", value: "5~7일" },
      { label: "월 비용", value: "3만원" },
    ],
  },
  promo: {
    offers: [
      "36만원에 1년 완전 자동화!",
      "월 3만원이면 충분합니다!",
      "5~7일 내 제작 완료!",
      "카카오 로그인으로 스팸 제로!",
    ],
    benefits: [
      "맞춤형 랜딩페이지 제작",
      "카카오 로그인 연동",
      "텔레그램 실시간 알림",
      "관리 대시보드 제공",
      "1년 운영 포함",
    ],
  },
  service: {
    services: [
      {
        name: "랜딩페이지 제작",
        features: [
          { name: "맞춤 디자인", desc: "업종에 맞는 전환 최적화" },
          { name: "모바일 최적화", desc: "PC, 모바일 완벽 대응" },
          { name: "DB 폼 연동", desc: "카카오 로그인 기반 수집" },
        ],
      },
      {
        name: "접수 자동화",
        features: [
          { name: "카카오 로그인", desc: "본인인증된 정보만 수집" },
          { name: "스팸 필터", desc: "반복/가짜 접수 자동 차단" },
          { name: "중복 방지", desc: "같은 고객 중복 접수 차단" },
        ],
      },
      {
        name: "알림 & 관리",
        features: [
          { name: "텔레그램 알림", desc: "접수 즉시 실시간 알림" },
          { name: "대시보드", desc: "접수 현황 한눈에 파악" },
          { name: "데이터 관리", desc: "엑셀 다운로드 지원" },
        ],
      },
    ],
  },
  cta: {
    messages: [
      "영업에만 집중하세요",
      "스팸 걱정은 이제 끝",
      "진성 리드만 받으세요",
      "월 3만원으로 1년 자동화",
    ],
  },
  case: {
    cases: [
      {
        industry: "경영컨설팅",
        period: "1개월",
        stats: [
          { label: "총 접수", value: "127건", change: "월 평균" },
          { label: "스팸 차단", value: "98%", change: "카카오 로그인" },
          { label: "연락 성공", value: "92%", change: "본인인증 효과" },
        ],
        quote: "스팸 없이 진짜 고객만 받으니 영업 효율이 확 올랐습니다",
      },
      {
        industry: "인테리어",
        period: "2개월",
        stats: [
          { label: "총 접수", value: "89건", change: "월 평균" },
          { label: "스팸 차단", value: "97%", change: "반복 접수 차단" },
          { label: "계약 전환", value: "15건", change: "전환율 17%" },
        ],
        quote: "가짜 번호 없이 연락이 다 되니까 시간 낭비가 없어요",
      },
      {
        industry: "교육서비스",
        period: "1개월",
        stats: [
          { label: "총 접수", value: "156건", change: "월 평균" },
          { label: "스팸 차단", value: "99%", change: "카카오 로그인" },
          { label: "등록 완료", value: "23명", change: "전환율 15%" },
        ],
        quote: "텔레그램 알림으로 바로 연락하니 등록률이 확 올랐습니다",
      },
    ],
    ctaMessages: [
      "다음 성공 사례의 주인공이 되어보세요",
      "월 3만원으로 이런 성과를 만들어보세요",
      "스팸 없는 진성 리드만 받아보세요",
    ],
  },
};

// 해시태그 풀 - DB접수 랜딩 서비스 기반
const HASHTAG_POOLS = {
  core: ["#폴라애드", "#polarad", "#DB수집", "#리드수집", "#영업자동화"],
  service: [
    "#랜딩페이지",
    "#카카오로그인",
    "#텔레그램알림",
    "#리드제너레이션",
    "#접수자동화",
  ],
  target: [
    "#B2B마케팅",
    "#소상공인",
    "#중소기업",
    "#영업대표",
    "#세일즈",
    "#사업자",
  ],
  feature: ["#스팸차단", "#본인인증", "#실시간알림", "#대시보드", "#업무효율"],
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
  const templateType =
    TEMPLATE_TYPES[Math.floor(Math.random() * TEMPLATE_TYPES.length)];

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
 * Gemini로 템플릿 데이터 생성 (재시도 로직 포함)
 */
async function generateContentWithGemini(
  templateType: TemplateType,
): Promise<TemplateData> {
  if (!GEMINI_API_KEY) {
    console.log("⚠️ GEMINI_API_KEY 미설정 - 기본 컨텐츠 사용");
    return getDefaultContent(templateType);
  }

  const topic = CONTENT_TOPICS[templateType];
  const prompt = buildPromptForTemplate(templateType, topic);

  // 최대 2번 재시도
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`🤖 Gemini 템플릿 데이터 생성 중... (시도 ${attempt}/2)`);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7, // 약간 낮춰서 더 안정적인 JSON 생성
              maxOutputTokens: 1000,
            },
          }),
        },
      );

      if (!res.ok) {
        console.error(`❌ Gemini API 오류 (시도 ${attempt}): ${res.status}`);
        continue;
      }

      const result = await res.json();
      const responseText =
        result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!responseText) {
        console.error(`❌ Gemini 응답 비어있음 (시도 ${attempt})`);
        continue;
      }

      // 파싱 시도
      const parsed = parseGeminiResponse(templateType, responseText);

      // 파싱 성공 여부 확인 (기본값이 아닌 경우)
      const defaultContent = getDefaultContent(templateType);
      if (parsed.headline !== defaultContent.headline) {
        console.log(`✅ Gemini 템플릿 데이터 생성 성공 (시도 ${attempt})`);
        return parsed;
      }

      console.warn(`⚠️ Gemini 파싱 실패로 폴백됨 (시도 ${attempt})`);
    } catch (error) {
      console.error(`❌ Gemini 컨텐츠 생성 실패 (시도 ${attempt}):`, error);
    }

    // 재시도 전 대기
    if (attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log("⚠️ 모든 Gemini 시도 실패 - 기본 컨텐츠 사용");
  return getDefaultContent(templateType);
}

/**
 * 템플릿 타입별 프롬프트 생성
 */
function buildPromptForTemplate(
  templateType: TemplateType,
  topic: any,
): string {
  const baseContext = `당신은 PolarAD(폴라애드)의 Instagram 컨텐츠 작성자입니다.
PolarAD는 B2B 영업 대표님들을 위한 "DB접수 랜딩 서비스"를 제공합니다.

**핵심 상품: DB접수 랜딩 서비스 36만원 (VAT 별도)**
- 월 3만원 / 1년 이용권
- 맞춤형 랜딩페이지 제작
- 카카오 로그인 연동 (스팸 차단, 본인인증)
- 텔레그램 실시간 알림
- 관리 대시보드 제공
- 5~7일 내 제작 완료
- 수정 요청: 건당 3만원
- 1년 후 연장: 월 1만원

🚫 **[절대 금지] 다음 내용은 절대 언급하지 마세요:**
- Meta 광고, Facebook 광고, Instagram 광고 관련 내용
- 홈페이지 제작 (10페이지, 5페이지 등)
- 광고 자동화, 광고 세팅, 광고 대행
- 4티어 시스템 (Basic, Normal, Pro, Premium)
- 자동 리포팅, 자동 보고서
- 30만원, 60만원, 110만원, 220만원 등 기존 가격
- SEO 최적화, 검색엔진 최적화
- "광고비", "ROAS", "CPA" 등 광고 용어

✅ **[오직 이것만 언급하세요]:**
- DB접수 랜딩 서비스 36만원
- 카카오 로그인, 텔레그램 알림, 대시보드
- 스팸 차단, 진성 리드, 본인인증
- 월 3만원, 1년 자동화
- 5~7일 제작

Instagram 이미지용 텍스트를 생성해주세요. 짧고 임팩트 있게 작성하세요.

⚠️ **[필수] 줄바꿈 규칙** - 반드시 준수할 것!
- 한 줄의 마지막에 1~2글자만 남는 줄바꿈은 절대 금지
- 예시 (잘못됨): "B2B 영업자동화, 지금 안 하\\n면 손해" → "면 손해"처럼 1~2글자만 남으면 안 됨
- 예시 (올바름): "B2B 영업자동화\\n지금 안 하면 손해" → 의미 단위로 깔끔하게 줄바꿈
- 줄바꿈은 반드시 의미 단위(단어, 구절)로 끊어서 각 줄이 균형 있게 구성되어야 함
- 각 줄은 최소 3글자 이상이어야 함`;

  switch (templateType) {
    case "intro":
      return `${baseContext}

**템플릿 타입**: 브랜드 소개
**참고 테마**: ${topic.themes.join(", ")}

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

    case "problem":
      return `${baseContext}

**템플릿 타입**: 문제 제기 (영업 대표님의 고민)
**참고 고민**: ${topic.painPoints.join(", ")}
**참고 질문**: ${topic.questions.join(", ")}

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

    case "solution":
      return `${baseContext}

**템플릿 타입**: 솔루션 소개 (DB접수 랜딩 서비스)
**상품 정보**: ${JSON.stringify(topic.product)}
**핵심 혜택**: ${topic.benefits.join(", ")}

다음 JSON 형식으로 응답하세요:
{
  "badge": "배지 텍스트 (이모지 포함, 10자 이내)",
  "headline": "메인 헤드라인 (2줄, gradient 클래스용 강조 텍스트 포함, 36만원/월3만원 강조)",
  "subHeadline": "서브 헤드라인 (15자 이내)",
  "items": [
    {"icon": "이모지", "text": "기능명", "highlight": "설명 (20자 이내)"},
    {"icon": "이모지", "text": "기능명", "highlight": "설명"},
    {"icon": "이모지", "text": "기능명", "highlight": "설명"},
    {"icon": "이모지", "text": "기능명", "highlight": "설명"}
  ],
  "cta": "핵심 메시지 (15자 이내)"
}

기존과 다른 새로운 표현으로 작성하세요. JSON만 출력하세요.`;

    case "feature":
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

    case "stats":
      return `${baseContext}

**템플릿 타입**: 통계/리포트 (DB접수 랜딩 서비스 성과)
**참고 지표**: ${JSON.stringify(topic.metrics)}

다음 JSON 형식으로 응답하세요:
{
  "badge": "배지 텍스트 (이모지 포함)",
  "headline": "메인 헤드라인 (2줄, blue 클래스용 강조 텍스트 포함)",
  "subHeadline": "서브 헤드라인 (스팸 차단, 연락 성공률 강조)",
  "stats": [
    {"label": "지표명", "value": "값 (%, 건 등 포함)", "change": "설명"},
    {"label": "지표명", "value": "값", "change": "설명"},
    {"label": "지표명", "value": "값", "change": "설명"}
  ]
}

카카오 로그인 기반 스팸 차단율, 연락 성공률 등 실제처럼 보이는 숫자를 생성하세요. JSON만 출력하세요.`;

    case "promo":
      return `${baseContext}

**템플릿 타입**: 프로모션 (DB접수 랜딩 서비스)
**참고 오퍼**: ${topic.offers.join(", ")}
**참고 혜택**: ${topic.benefits.join(", ")}

다음 JSON 형식으로 응답하세요:
{
  "badge": "배지 텍스트 (이모지 포함)",
  "headline": "메인 헤드라인 (2줄, gold 클래스용 강조 텍스트 포함, 36만원/월3만원 강조)",
  "subHeadline": "서브 헤드라인 (혜택 요약: 카카오 로그인, 텔레그램 알림 등)",
  "cta": "핵심 혜택 (10자 이내)"
}

긴박감을 주는 표현으로 작성하세요. JSON만 출력하세요.`;

    case "service":
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

    case "case":
      const randomCase =
        topic.cases[Math.floor(Math.random() * topic.cases.length)];
      return `${baseContext}

**템플릿 타입**: 실제 사례/성과
**참고 사례**: ${JSON.stringify(randomCase)}
**CTA 메시지**: ${topic.ctaMessages.join(", ")}

다음 JSON 형식으로 응답하세요:
{
  "badge": "배지 텍스트 (이모지 포함, 예: 📈 실제 사례)",
  "headline": "고객/업종명 (예: 경영컨설팅 A사)",
  "subHeadline": "고객 설명 (예: 영업 대표님)",
  "stats": [
    {"label": "지표명", "value": "값", "change": "부가 설명"},
    {"label": "지표명", "value": "값", "change": "부가 설명"},
    {"label": "지표명", "value": "값", "change": "부가 설명"}
  ],
  "cta": "고객 추천사 (30자 이내)"
}

실제 성과처럼 보이는 숫자를 사용하세요. JSON만 출력하세요.`;

    case "cta":
      return `${baseContext}

**템플릿 타입**: 마무리 CTA
**참고 메시지**: ${topic.messages.join(", ")}

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
 * Gemini 응답에서 JSON 추출 및 정리
 */
function extractAndCleanJson(responseText: string): string {
  let jsonStr = responseText;

  // 1. 코드 블록 제거
  if (jsonStr.includes("```")) {
    const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      jsonStr = match[1];
    } else {
      jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    }
  }

  // 2. JSON 객체만 추출 (앞뒤 텍스트 제거)
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonStr = jsonMatch[0];
  }

  // 3. 일반적인 JSON 오류 수정
  jsonStr = jsonStr
    // 작은따옴표 → 큰따옴표 (속성명)
    .replace(/'/g, '"')
    // 후행 쉼표 제거 (배열/객체 끝)
    .replace(/,\s*([}\]])/g, "$1")
    // 줄바꿈이 문자열 내에 있으면 \n으로 이스케이프
    .replace(/:\s*"([^"]*)\n([^"]*)"/g, (match, p1, p2) => {
      return `: "${p1}\\n${p2}"`;
    })
    // 제어 문자 제거 (탭 제외)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");

  return jsonStr.trim();
}

/**
 * Gemini 응답 파싱 (강화된 버전)
 */
function parseGeminiResponse(
  templateType: TemplateType,
  responseText: string,
): TemplateData {
  try {
    const jsonStr = extractAndCleanJson(responseText);
    const parsed = JSON.parse(jsonStr);
    console.log(`✅ Gemini 템플릿 데이터 파싱 성공 (${templateType})`);
    return parsed as TemplateData;
  } catch (error) {
    // 파싱 실패 시 상세 로그
    console.error("❌ Gemini 응답 파싱 실패:", error);
    console.error("📝 원본 응답 (첫 500자):", responseText.slice(0, 500));

    // 정리된 JSON 시도
    try {
      const cleanedJson = extractAndCleanJson(responseText);
      console.error("📝 정리된 JSON (첫 500자):", cleanedJson.slice(0, 500));
    } catch {
      // 무시
    }

    console.log("⚠️ 기본 컨텐츠로 폴백합니다.");
    return getDefaultContent(templateType);
  }
}

/**
 * 기본 컨텐츠 (Gemini 실패 시) - DB접수 랜딩 서비스 기반
 */
function getDefaultContent(templateType: TemplateType): TemplateData {
  const defaults: Record<TemplateType, TemplateData> = {
    intro: {
      headline: "카카오 로그인으로\n진성 리드만 수집",
      subHeadline: "스팸 없는 리드 수집 시스템\n월 3만원으로 1년 자동화",
      items: [
        { icon: "💬", text: "카카오 로그인" },
        { icon: "🔔", text: "텔레그램 알림" },
        { icon: "📊", text: "대시보드" },
      ],
      cta: "무료 상담 신청",
    },
    problem: {
      badge: "영업 대표님께 드리는 질문",
      headline: "아직도\n스팸 접수 때문에\n시간 낭비하고\n계십니까?",
      items: [
        { text: "가짜 번호로", highlight: "연락 안 됨" },
        { text: "", highlight: "반복 접수로 중복 DB" },
        { text: "접수 알림이", highlight: "늦어서 놓침" },
      ],
      cta: "카카오 로그인으로 해결",
      subHeadline: "진성 리드만 받으세요",
    },
    solution: {
      badge: "✨ DB접수 랜딩 서비스",
      headline: "월 3만원으로\n1년 자동화",
      subHeadline: "5~7일 만에 제작 완료",
      items: [
        { icon: "📱", text: "랜딩페이지", highlight: "맞춤형 디자인 제작" },
        { icon: "💬", text: "카카오 로그인", highlight: "스팸/반복 접수 차단" },
        {
          icon: "🔔",
          text: "텔레그램 알림",
          highlight: "접수 즉시 실시간 알림",
        },
        {
          icon: "📊",
          text: "관리 대시보드",
          highlight: "접수 현황 한눈에 파악",
        },
      ],
      cta: "36만원에 1년 운영 포함!",
    },
    feature: {
      headline: "카카오 로그인으로\n스팸 완전 차단",
      subHeadline:
        "본인인증된 정보만 수집하고\n텔레그램으로 즉시 알림 받으세요",
      items: [
        { icon: "💬", text: "카카오 로그인" },
        { icon: "🚫", text: "스팸 차단" },
        { icon: "🔔", text: "실시간 알림" },
      ],
      cta: "대표님은 영업에만 집중하세요",
    },
    stats: {
      badge: "📊 실제 성과",
      headline: "카카오 로그인\n스팸 차단 효과",
      subHeadline: "본인인증으로 진성 리드만 수집",
      stats: [
        { label: "스팸 차단율", value: "98%", change: "카카오 로그인" },
        { label: "연락 성공률", value: "92%", change: "본인인증 효과" },
        { label: "평균 제작", value: "5~7일", change: "빠른 제작" },
      ],
    },
    promo: {
      badge: "🎁 DB접수 랜딩 서비스",
      headline: "36만원에\n1년 완전 자동화!",
      subHeadline: "월 3만원이면 충분합니다",
      cta: "5~7일 내 제작 완료",
    },
    service: {
      badge: "📱 랜딩페이지 제작",
      headline: "전환율 높은\n랜딩페이지",
      subHeadline: "카카오 로그인으로 스팸 차단\n텔레그램으로 즉시 알림",
      items: [
        {
          icon: "📱",
          text: "모바일 최적화",
          highlight: "PC, 모바일 완벽 대응",
        },
        { icon: "💬", text: "카카오 로그인", highlight: "본인인증 기반 수집" },
        { icon: "🔔", text: "텔레그램 알림", highlight: "접수 즉시 알림" },
      ],
      cta: "무료 상담 받아보세요",
    },
    case: {
      badge: "📈 실제 사례",
      headline: "경영컨설팅 A사",
      subHeadline: "영업 대표님",
      stats: [
        { label: "총 접수", value: "127건", change: "월 평균" },
        { label: "스팸 차단", value: "98%", change: "카카오 로그인" },
        { label: "연락 성공", value: "92%", change: "본인인증 효과" },
      ],
      cta: "스팸 없이 진짜 고객만 받으니 효율이 확 올랐습니다",
    },
    cta: {
      headline: "영업에만 집중하세요",
      subHeadline: "스팸 걱정은 이제 끝",
      items: [
        { icon: "📱", text: "랜딩페이지" },
        { icon: "💬", text: "카카오 로그인" },
        { icon: "🔔", text: "텔레그램 알림" },
        { icon: "📊", text: "대시보드" },
      ],
      cta: "무료 상담 신청",
    },
  };

  return defaults[templateType];
}

/**
 * Gemini로 캡션 생성 (재시도 로직 포함)
 */
async function generateCaptionWithGemini(
  templateType: TemplateType,
  templateData: TemplateData,
): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.warn("⚠️ GEMINI_API_KEY 미설정 - 기본 캡션 사용");
    return getDefaultCaption(templateType, templateData);
  }

  // 최대 3번 재시도
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await callGeminiForCaption(templateType, templateData);

      // finish_reason 체크 - MAX_TOKENS면 잘린 것
      if (result.finishReason === "MAX_TOKENS") {
        console.warn(`⚠️ 캡션이 토큰 한도로 잘림 (시도 ${attempt})`);
        continue;
      }

      if (result.caption && result.caption.length >= 1000) {
        console.log(
          `✅ 캡션 생성 성공 (시도 ${attempt}): ${result.caption.length}자`,
        );
        return result.caption;
      }
      console.warn(
        `⚠️ 캡션 길이 부족 (시도 ${attempt}): ${result.caption?.length || 0}자 (최소 1000자 필요)`,
      );
    } catch (error) {
      console.error(`❌ 캡션 생성 실패 (시도 ${attempt}):`, error);
    }

    // 재시도 전 대기
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.warn("⚠️ 모든 캡션 생성 시도 실패 - 기본 캡션 사용");
  return getDefaultCaption(templateType, templateData);
}

interface CaptionResult {
  caption: string | null;
  finishReason: string | null;
}

/**
 * Gemini API 호출 (캡션) - DB접수 랜딩 서비스 기반
 */
async function callGeminiForCaption(
  templateType: TemplateType,
  templateData: TemplateData,
): Promise<CaptionResult> {
  const prompt = `당신은 PolarAD(폴라애드)의 Instagram 캡션 전문 작성자입니다.
B2B 영업 대표님들을 위한 "DB접수 랜딩 서비스"를 제공합니다.

**[핵심 상품] DB접수 랜딩 서비스 36만원 (VAT 별도)**

🚫 **[절대 금지 - 이 내용을 언급하면 캡션 전체가 무효됩니다]:**
- Meta 광고, Facebook 광고, Instagram 광고 관련 내용
- 홈페이지 제작 (10페이지, 5페이지 등)
- 광고 자동화, 광고 세팅, 광고 대행
- 4티어 시스템 (Basic, Normal, Pro, Premium 패키지)
- 자동 리포팅, 자동 보고서, 광고 성과 리포트
- 30만원, 60만원, 110만원, 220만원 등 기존 가격
- SEO 최적화, 검색엔진 최적화
- "광고비", "ROAS", "CPA", "CTR" 등 광고 용어
- "폴라애드 서비스", "패키지 구성", "올인원 패키지" 등 기존 표현

⚠️ 캡션에 반드시 포함할 핵심 메시지:
   - "카카오 로그인으로 진성 리드만 수집"
   - "스팸 접수 완전 차단"
   - "월 3만원으로 1년 자동화"
   - "5~7일 내 제작 완료"

**[서비스 구성]**:

📌 DB접수 랜딩 서비스 36만원 (VAT 별도)
   - 월 3만원 / 1년 이용권
   - 맞춤형 랜딩페이지 제작
   - 카카오 로그인 연동 (스팸 차단, 본인인증)
   - 텔레그램 실시간 알림
   - 관리 대시보드 제공
   - 5~7일 내 제작 완료

📌 핵심 기능
   - 카카오 로그인: 본인인증된 연락처만 수집
   - 스팸 차단: 반복접수/가짜번호 자동 필터
   - 텔레그램 알림: 접수 즉시 실시간 알림
   - 관리 대시보드: 접수 현황 한눈에 파악

📌 추가 옵션
   - 수정 요청: 건당 3만원
   - 1년 후 연장: 월 1만원 (VAT 별도)

→ 대표님은 진성 고객 미팅과 계약 성사에만 집중하시면 됩니다.

**컨텐츠 정보**:
- 타입: ${templateType}
- 헤드라인: ${templateData.headline}
- 서브헤드라인: ${templateData.subHeadline || ""}
- 아이템: ${JSON.stringify(templateData.items || [])}

**캡션 작성 가이드라인**:

⚠️ **[필수] 최소 1000자 이상 작성할 것!** (해시태그 제외)
→ 짧은 캡션은 인스타그램 알고리즘에 불리합니다.
→ 반드시 아래 구조를 모두 포함해서 충분한 분량으로 작성하세요.

1. **총 길이**: 1000~1500자 (해시태그 제외) - 반드시 지킬 것!

2. **인스타그램 가로폭 최적화**:
   - 한 줄당 25~30자 이내로 작성
   - 너무 긴 문장은 자연스럽게 줄바꿈
   - 빈 줄로 문단 구분하여 가독성 확보

3. **구조 (필수)**:

[도입부 - 3~4줄]
- 핵심 질문이나 공감 포인트로 시작
- 이모지 1~2개 활용
- 독자의 관심을 끄는 후킹 (스팸, 가짜번호 문제)

[본문 - 15~20줄] ← 충분히 길게!
- 스팸/가짜번호 문제 상황을 구체적으로 설명 (3~4줄)
- 카카오 로그인이 왜 효과적인지 상세히 (3~4줄)
- 폴라애드의 솔루션이 어떻게 도움이 되는지 (4~5줄)
- 구체적인 예시, 수치 언급 (스팸 차단율 98%, 연락 성공률 92% 등) (3~4줄)
- 각 문단은 3~4줄 후 빈 줄로 구분

[체크리스트 섹션 - 서비스 구성 강조]
━━━━━━━━━━━━━━━━━
✅ 36만원에 1년 운영 포함
✅ 카카오 로그인으로 스팸 차단
✅ 텔레그램 실시간 알림
✅ 관리 대시보드 제공
✅ 5~7일 내 제작 완료
━━━━━━━━━━━━━━━━━
→ "월 3만원으로 1년 자동화" 메시지 필수!

[마무리 - 4~5줄]
- 핵심 혜택 다시 한번 강조
- 긴박감 있는 행동 유도 메시지
- "💬 무료 상담 → 프로필 링크"로 마무리
- 간단한 마무리 인사 추가

4. **톤앤매너**:
- 전문적이면서 친근하게
- B2B 영업 대표님 대상
- "~하세요", "~입니다" 존댓말
- 과장 없이 신뢰감 있게

5. **금지사항**:
- 해시태그 포함 금지 (별도 추가됨)
- 이모지 과다 사용 금지 (전체 5~7개 이내)
- 한 줄에 35자 이상 금지
- 4티어 시스템 언급 금지 (단일 상품임)

⚠️ 반드시 1000자 이상으로 작성하세요! 짧으면 다시 작성해야 합니다.
캡션만 출력하세요. 다른 설명 없이 캡션 텍스트만 작성하세요.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.75, maxOutputTokens: 8192 },
      }),
    },
  );

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status}`);
  }

  const result = await res.json();
  const caption = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  const finishReason = result.candidates?.[0]?.finishReason || null;

  console.log(
    `📝 캡션 생성 결과: ${caption?.length || 0}자, finishReason: ${finishReason}`,
  );

  return { caption: caption || null, finishReason };
}

/**
 * 기본 캡션 생성 (Gemini 실패 시 사용) - DB접수 랜딩 서비스 기반
 */
function getDefaultCaption(
  templateType: TemplateType,
  data: TemplateData,
): string {
  const headline =
    data.headline?.replace(/\n/g, " ") || "카카오 로그인으로 진성 리드만 수집";

  return `${headline} 📊

아직도 스팸 접수 때문에
시간 낭비하고 계십니까?

━━━━━━━━━━━━━━━━━

가짜 전화번호로 연락 안 되고,
반복 접수로 중복 DB만 쌓이고,
접수 알림이 늦어서 고객 놓치고...

영업 대표님들의 고민,
폴라애드가 해결해드립니다.

━━━━━━━━━━━━━━━━━

✅ DB접수 랜딩 서비스 36만원
   (VAT 별도 / 월 3만원 / 1년 이용권)

📌 맞춤형 랜딩페이지 제작
📌 카카오 로그인 연동 (스팸 차단)
📌 텔레그램 실시간 알림
📌 관리 대시보드 제공
📌 5~7일 내 제작 완료

💡 카카오 로그인으로
   본인인증된 진성 리드만 수집하세요!

━━━━━━━━━━━━━━━━━

📈 실제 고객 성과

   스팸 차단율: 98%
   연락 성공률: 92%

   "스팸 없이 진짜 고객만 받으니
    영업 효율이 확 올랐습니다"

━━━━━━━━━━━━━━━━━

대표님은 진성 고객 미팅과
계약 성사에만 집중하세요.

스팸 걱정은 이제 끝입니다.

💬 무료 상담 신청
   → 프로필 링크 클릭`;
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
  const shuffledService = [...HASHTAG_POOLS.service].sort(
    () => Math.random() - 0.5,
  );
  selected.push(...shuffledService.slice(0, serviceCount));

  // 타겟 해시태그 (1-2개)
  const targetCount = 1 + Math.floor(Math.random() * 2);
  const shuffledTarget = [...HASHTAG_POOLS.target].sort(
    () => Math.random() - 0.5,
  );
  selected.push(...shuffledTarget.slice(0, targetCount));

  // 기능 해시태그 (1-2개)
  const featureCount = 1 + Math.floor(Math.random() * 2);
  const shuffledFeature = [...HASHTAG_POOLS.feature].sort(
    () => Math.random() - 0.5,
  );
  selected.push(...shuffledFeature.slice(0, featureCount));

  return selected;
}
