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
// 온라인 마케팅 월 구독 서비스 (인테리어/시공 업종 전문)
const CONTENT_TOPICS = {
  intro: {
    themes: [
      "본업에만 집중하세요. 고객은 저희가 데려옵니다.",
      "홈페이지 따로, 광고 따로, DB 따로? 이제 그만하세요.",
      "월 5만원부터 시작하는 인테리어 마케팅 자동화",
      "6개월 약정으로 고객 DB를 꾸준히 쌓아보세요",
    ],
    services: ["홈페이지 제작", "Meta 광고 운영", "DB 자동화", "콘텐츠 배포"],
  },
  problem: {
    painPoints: [
      "홈페이지도 없이 영업하느라 신뢰감이 없음",
      "광고는 하고 싶은데 어디서부터 시작해야 할지 모름",
      "DB 접수가 와도 관리가 안 돼서 계약을 놓침",
      "매달 콘텐츠 올리는 게 너무 번거롭고 시간이 없음",
      "광고 대행사에 맡기면 비용이 너무 많이 나옴",
      "인테리어 시공 업종 특화 마케팅 솔루션을 찾고 있음",
    ],
    questions: [
      "홈페이지 없이 영업하다 신뢰를 잃은 적 있으신가요?",
      "광고를 해보고 싶은데 어떻게 시작해야 할지 막막하신가요?",
      "DB 접수는 오는데 관리가 안 돼서 계약을 놓치시나요?",
      "매달 콘텐츠 올리는 게 너무 번거로우신가요?",
    ],
  },
  solution: {
    product: {
      name: "온라인 마케팅 월 구독 서비스",
      tiers: [
        { name: "접수형", price: "월 5만원", desc: "홈페이지 + DB접수 자동화" },
        {
          name: "운영형",
          price: "월 22만원",
          desc: "홈페이지 + Meta 광고 운영 + DB관리",
        },
        {
          name: "프리미엄",
          price: "월 55만원",
          desc: "전체 + 매일 게시글·인스타·쓰레드 콘텐츠 배포",
        },
      ],
      contract: "6개월 약정, 카드결제 가능",
    },
    benefits: [
      "홈페이지로 브랜드 신뢰감 즉시 확보",
      "Meta 광고로 인테리어 견적 DB 자동 수집",
      "DB 관리 시스템으로 놓치는 고객 없음",
      "매일 SNS 콘텐츠 자동 배포로 본업에 집중",
    ],
    keyMessages: [
      "본업에만 집중하세요. 고객은 저희가 데려옵니다.",
      "월 5만원부터 시작하는 마케팅 자동화",
      "인테리어·시공 업종 전문 솔루션",
      "6개월 약정, 카드결제 가능",
    ],
  },
  feature: {
    features: [
      { name: "홈페이지 제작", desc: "인테리어 전문 전환 최적화 홈페이지" },
      { name: "Meta 광고", desc: "견적 DB 자동 수집 광고 운영" },
      { name: "DB 관리", desc: "접수 즉시 알림 + 체계적 고객 관리" },
      { name: "콘텐츠 배포", desc: "매일 인스타·쓰레드·블로그 자동 발행" },
    ],
  },
  stats: {
    metrics: [
      { label: "DB 접수 증가율", range: [150, 300], unit: "%" },
      { label: "계약 전환율", range: [12, 25], unit: "%" },
      { label: "월 구독 시작가", value: "5만원" },
      { label: "약정 기간", value: "6개월" },
    ],
  },
  promo: {
    offers: [
      "월 5만원으로 홈페이지 + DB 자동화 시작!",
      "월 22만원에 Meta 광고까지 한 번에!",
      "인테리어 전문 마케팅, 6개월 약정으로 안심!",
      "카드결제 가능, 지금 바로 시작하세요!",
    ],
    benefits: [
      "인테리어 전문 홈페이지 제작",
      "Meta 광고 운영 및 DB 수집",
      "DB 관리 시스템",
      "매일 SNS 콘텐츠 자동 배포",
      "6개월 약정 카드결제 가능",
    ],
  },
  service: {
    services: [
      {
        name: "접수형 (월 5만원)",
        features: [
          { name: "홈페이지 제작", desc: "인테리어 전문 전환 최적화" },
          { name: "DB접수 자동화", desc: "견적 신청 폼 + 즉시 알림" },
          { name: "기본 관리", desc: "DB 현황 대시보드 제공" },
        ],
      },
      {
        name: "운영형 (월 22만원)",
        features: [
          { name: "홈페이지 포함", desc: "접수형 전체 포함" },
          { name: "Meta 광고 운영", desc: "Facebook·Instagram 광고 운영" },
          { name: "DB 관리", desc: "접수 DB 체계적 관리 및 알림" },
        ],
      },
      {
        name: "프리미엄 (월 55만원)",
        features: [
          { name: "운영형 포함", desc: "운영형 전체 포함" },
          { name: "콘텐츠 배포", desc: "매일 게시글·인스타·쓰레드 발행" },
          { name: "전체 자동화", desc: "마케팅 전체를 저희가 운영" },
        ],
      },
    ],
  },
  cta: {
    messages: [
      "본업에만 집중하세요",
      "고객은 저희가 데려옵니다",
      "월 5만원부터 시작하세요",
      "6개월 약정, 카드결제 가능",
    ],
  },
  case: {
    cases: [
      {
        industry: "인테리어 시공",
        period: "3개월",
        stats: [
          { label: "월 DB 접수", value: "47건", change: "운영형 사용" },
          { label: "계약 전환", value: "8건", change: "전환율 17%" },
          { label: "광고비 대비 매출", value: "12배", change: "ROAS 1200%" },
        ],
        quote:
          "본업에만 집중했더니 고객이 알아서 들어오더라고요. 진짜 신기해요.",
      },
      {
        industry: "리모델링 업체",
        period: "6개월",
        stats: [
          { label: "월 DB 접수", value: "63건", change: "프리미엄 사용" },
          { label: "SNS 팔로워", value: "+1,200명", change: "콘텐츠 자동화" },
          { label: "계약 성사", value: "11건", change: "월 평균" },
        ],
        quote:
          "매일 콘텐츠 신경 안 써도 되니까 시공에 집중할 수 있어서 너무 좋아요.",
      },
      {
        industry: "창호 전문점",
        period: "2개월",
        stats: [
          { label: "월 DB 접수", value: "29건", change: "접수형 사용" },
          { label: "홈페이지 방문", value: "1,840명", change: "월 평균" },
          { label: "계약 전환", value: "5건", change: "전환율 17%" },
        ],
        quote: "홈페이지 하나 만들었을 뿐인데 견적 문의가 확 늘었어요.",
      },
    ],
    ctaMessages: [
      "다음 성공 사례의 주인공이 되어보세요",
      "월 5만원으로 이런 성과를 만들어보세요",
      "인테리어 업종 전문 마케팅, 지금 시작하세요",
    ],
  },
};

// 해시태그 풀 - 인테리어/시공 업종 마케팅 서비스 기반
const HASHTAG_POOLS = {
  core: [
    "#폴라애드",
    "#polarad",
    "#인테리어마케팅",
    "#DB수집",
    "#마케팅자동화",
  ],
  service: [
    "#홈페이지제작",
    "#Meta광고",
    "#인스타광고",
    "#DB관리",
    "#콘텐츠자동화",
  ],
  target: [
    "#인테리어업체",
    "#시공업체",
    "#리모델링",
    "#소상공인",
    "#인테리어사장님",
    "#시공사장님",
  ],
  feature: ["#월구독", "#마케팅구독", "#광고대행", "#SNS운영", "#고객DB"],
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
              temperature: 0.7,
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
  const baseContext = `당신은 폴라애드(PolarAD)의 Instagram 컨텐츠 작성자입니다.
폴라애드는 인테리어·시공 업종 전문 온라인 마케팅 월 구독 서비스입니다.

**핵심 메시지**:
- "본업에만 집중하세요. 고객은 저희가 데려옵니다."
- "홈페이지 따로, 광고 따로, DB 따로? 이제 그만하세요."

**서비스 구성 (월 구독)**:
- 접수형: 월 5만원 - 홈페이지 + DB접수 자동화
- 운영형: 월 22만원 - 홈페이지 + Meta 광고 운영 + DB관리 (도메인 별도)
- 프리미엄: 월 55만원 - 전체 + 매일 게시글·인스타·쓰레드 콘텐츠 배포
- 6개월 약정, 카드결제 가능
- 대상: 인테리어·시공 업종

🚫 **[절대 금지] 다음 내용은 절대 언급하지 마세요:**
- 카카오 로그인, 카카오 비즈, 카카오 채널 관련 내용
- 36만원, 3만원, 30만원 등 구 가격표 언급
- "DB접수 랜딩 서비스"라는 구 상품명
- "리드" 표현 (반드시 "DB"로 표현)
- 텔레그램 알림 (단독 기능으로 언급 금지)
- 카카오 로그인 본인인증 관련 내용

✅ **[오직 이것만 언급하세요]:**
- 접수형(5만원), 운영형(22만원), 프리미엄(55만원) 3개 티어
- 홈페이지 제작, Meta 광고, DB 관리, 콘텐츠 자동화
- 인테리어·시공 업종 전문
- 6개월 약정, 카드결제 가능
- "DB" (리드 아님)

Instagram 이미지용 텍스트를 생성해주세요. 짧고 임팩트 있게 작성하세요.

⚠️ **[필수] 줄바꿈 규칙** - 반드시 준수할 것!
- 한 줄의 마지막에 1~2글자만 남는 줄바꿈은 절대 금지
- 예시 (잘못됨): "B2B 마케팅자동화, 지금 안 하\\n면 손해" → "면 손해"처럼 1~2글자만 남으면 안 됨
- 예시 (올바름): "B2B 마케팅자동화\\n지금 안 하면 손해" → 의미 단위로 깔끔하게 줄바꿈
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

**템플릿 타입**: 문제 제기 (인테리어·시공 사장님의 고민)
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

**템플릿 타입**: 솔루션 소개 (월 구독 3개 티어)
**상품 정보**: ${JSON.stringify(topic.product)}
**핵심 혜택**: ${topic.benefits.join(", ")}

다음 JSON 형식으로 응답하세요:
{
  "badge": "배지 텍스트 (이모지 포함, 10자 이내)",
  "headline": "메인 헤드라인 (2줄, gradient 클래스용 강조 텍스트 포함, 월5만원/22만원/55만원 중 하나 강조)",
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

**템플릿 타입**: 통계/리포트 (월 구독 서비스 성과)
**참고 지표**: ${JSON.stringify(topic.metrics)}

다음 JSON 형식으로 응답하세요:
{
  "badge": "배지 텍스트 (이모지 포함)",
  "headline": "메인 헤드라인 (2줄, blue 클래스용 강조 텍스트 포함)",
  "subHeadline": "서브 헤드라인 (DB 증가, 계약 전환율 강조)",
  "stats": [
    {"label": "지표명", "value": "값 (%, 건 등 포함)", "change": "설명"},
    {"label": "지표명", "value": "값", "change": "설명"},
    {"label": "지표명", "value": "값", "change": "설명"}
  ]
}

인테리어 업종 DB 증가율, 계약 전환율 등 실제처럼 보이는 숫자를 생성하세요. JSON만 출력하세요.`;

    case "promo":
      return `${baseContext}

**템플릿 타입**: 프로모션 (월 구독 서비스)
**참고 오퍼**: ${topic.offers.join(", ")}
**참고 혜택**: ${topic.benefits.join(", ")}

다음 JSON 형식으로 응답하세요:
{
  "badge": "배지 텍스트 (이모지 포함)",
  "headline": "메인 헤드라인 (2줄, gold 클래스용 강조 텍스트 포함, 월5만원/22만원/55만원 중 하나 강조)",
  "subHeadline": "서브 헤드라인 (혜택 요약: 홈페이지, Meta 광고, 콘텐츠 자동화 등)",
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
  "headline": "고객/업종명 (예: 인테리어 시공 A사)",
  "subHeadline": "고객 설명 (예: 운영형 구독 3개월)",
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
 * 기본 컨텐츠 (Gemini 실패 시) - 인테리어/시공 업종 월 구독 서비스 기반
 */
function getDefaultContent(templateType: TemplateType): TemplateData {
  const defaults: Record<TemplateType, TemplateData> = {
    intro: {
      headline: "본업에만 집중하세요\n고객은 저희가 데려옵니다",
      subHeadline: "인테리어·시공 업종 전문\n온라인 마케팅 월 구독",
      items: [
        { icon: "🏠", text: "홈페이지" },
        { icon: "📣", text: "Meta 광고" },
        { icon: "📊", text: "DB 관리" },
      ],
      cta: "무료 상담 신청",
    },
    problem: {
      badge: "인테리어 사장님께 드리는 질문",
      headline: "아직도\n홈페이지 없이\n영업하고\n계십니까?",
      items: [
        { text: "광고 어떻게 하는지", highlight: "막막함" },
        { text: "", highlight: "DB 관리가 안 됨" },
        { text: "콘텐츠 올리기가", highlight: "너무 번거로움" },
      ],
      cta: "폴라애드가 대신 해드립니다",
      subHeadline: "본업에만 집중하세요",
    },
    solution: {
      badge: "✨ 온라인 마케팅 월 구독",
      headline: "월 5만원부터\n마케팅 자동화",
      subHeadline: "인테리어·시공 업종 전문",
      items: [
        { icon: "🏠", text: "홈페이지", highlight: "전환 최적화 제작" },
        { icon: "📣", text: "Meta 광고", highlight: "견적 DB 자동 수집" },
        { icon: "📊", text: "DB 관리", highlight: "놓치는 고객 없음" },
        { icon: "📱", text: "콘텐츠", highlight: "매일 SNS 자동 배포" },
      ],
      cta: "6개월 약정, 카드결제 가능",
    },
    feature: {
      headline: "홈페이지부터\nSNS까지 한 번에",
      subHeadline: "인테리어 전문 마케팅 시스템으로\n고객 DB를 꾸준히 쌓으세요",
      items: [
        { icon: "🏠", text: "홈페이지" },
        { icon: "📣", text: "Meta 광고" },
        { icon: "📱", text: "콘텐츠 자동화" },
      ],
      cta: "사장님은 시공에만 집중하세요",
    },
    stats: {
      badge: "📊 실제 성과",
      headline: "인테리어 업종\nDB 증가 효과",
      subHeadline: "Meta 광고로 견적 DB를 꾸준히 수집",
      stats: [
        { label: "월 DB 증가율", value: "210%", change: "운영형 기준" },
        { label: "계약 전환율", value: "17%", change: "업종 평균 대비" },
        { label: "구독 시작가", value: "월 5만원", change: "접수형" },
      ],
    },
    promo: {
      badge: "🎁 온라인 마케팅 월 구독",
      headline: "월 5만원으로\n마케팅 시작!",
      subHeadline: "6개월 약정, 카드결제 가능",
      cta: "인테리어 전문 솔루션",
    },
    service: {
      badge: "📣 운영형 (월 22만원)",
      headline: "Meta 광고로\n견적 DB 자동 수집",
      subHeadline: "홈페이지 + 광고 운영 + DB 관리\n도메인만 별도",
      items: [
        { icon: "🏠", text: "홈페이지", highlight: "전환 최적화 제작" },
        { icon: "📣", text: "Meta 광고", highlight: "Facebook·Instagram 운영" },
        { icon: "📊", text: "DB 관리", highlight: "접수 즉시 알림" },
      ],
      cta: "무료 상담 받아보세요",
    },
    case: {
      badge: "📈 실제 사례",
      headline: "인테리어 시공 A사",
      subHeadline: "운영형 구독 3개월",
      stats: [
        { label: "월 DB 접수", value: "47건", change: "Meta 광고" },
        { label: "계약 성사", value: "8건", change: "전환율 17%" },
        { label: "광고비 대비 매출", value: "12배", change: "ROAS 1200%" },
      ],
      cta: "본업에만 집중했더니 고객이 알아서 들어오더라고요",
    },
    cta: {
      headline: "본업에만 집중하세요",
      subHeadline: "고객은 저희가 데려옵니다",
      items: [
        { icon: "🏠", text: "홈페이지" },
        { icon: "📣", text: "Meta 광고" },
        { icon: "📊", text: "DB 관리" },
        { icon: "📱", text: "콘텐츠 자동화" },
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
 * Gemini API 호출 (캡션) - 인테리어/시공 업종 월 구독 서비스 기반
 */
async function callGeminiForCaption(
  templateType: TemplateType,
  templateData: TemplateData,
): Promise<CaptionResult> {
  const prompt = `당신은 폴라애드(PolarAD)의 Instagram 캡션 전문 작성자입니다.
인테리어·시공 업종 전문 온라인 마케팅 월 구독 서비스를 제공합니다.

**핵심 메시지**:
- "본업에만 집중하세요. 고객은 저희가 데려옵니다."
- "홈페이지 따로, 광고 따로, DB 따로? 이제 그만하세요."

🚫 **[절대 금지 - 이 내용을 언급하면 캡션 전체가 무효됩니다]:**
- 카카오 로그인, 카카오 비즈, 카카오 채널 관련 내용
- 텔레그램 알림 (독립 기능으로 강조 금지)
- 36만원, 3만원, 30만원 등 구 가격 언급
- "DB접수 랜딩 서비스"라는 구 상품명
- "리드" 표현 (반드시 "DB"로만 표현할 것)
- "스팸 차단", "본인인증" 등 구 서비스 특징
- "폴라애드 서비스", "패키지 구성", "올인원 패키지" 등

⚠️ 캡션에 반드시 포함할 핵심 메시지:
   - "인테리어·시공 업종 전문"
   - "월 5만원부터 시작"
   - "홈페이지 + Meta 광고 + DB 관리"
   - "6개월 약정, 카드결제 가능"

**[서비스 구성 - 반드시 이 내용 기반으로 작성]**:

📌 접수형 - 월 5만원
   - 홈페이지 제작 + DB접수 자동화

📌 운영형 - 월 22만원
   - 홈페이지 + Meta 광고 운영 + DB 관리
   - 도메인만 별도

📌 프리미엄 - 월 55만원
   - 운영형 전체 포함
   - 매일 게시글·인스타·쓰레드 콘텐츠 배포

→ 6개월 약정, 카드결제 가능
→ 인테리어·시공 업종 전문
→ 사장님은 본업에만 집중하시면 됩니다

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
- 인테리어·시공 사장님의 마케팅 고민을 건드리는 후킹

[본문 - 15~20줄] ← 충분히 길게!
- 인테리어 업종의 마케팅 어려움을 구체적으로 설명 (3~4줄)
- 폴라애드 구독 서비스가 왜 효과적인지 상세히 (3~4줄)
- 각 티어별 혜택을 어떻게 도움이 되는지 (4~5줄)
- 구체적인 예시, 수치 언급 (DB 증가, 계약 전환율 등) (3~4줄)
- 각 문단은 3~4줄 후 빈 줄로 구분

[체크리스트 섹션 - 서비스 구성 강조]
━━━━━━━━━━━━━━━━━
✅ 접수형 월 5만원 - 홈페이지 + DB 자동화
✅ 운영형 월 22만원 - Meta 광고 운영 포함
✅ 프리미엄 월 55만원 - 콘텐츠 매일 자동 배포
✅ 6개월 약정, 카드결제 가능
✅ 인테리어·시공 업종 전문
━━━━━━━━━━━━━━━━━
→ "본업에만 집중하세요. 고객은 저희가 데려옵니다." 메시지 필수!

[마무리 - 4~5줄]
- 핵심 혜택 다시 한번 강조
- 긴박감 있는 행동 유도 메시지
- "💬 무료 상담 → 프로필 링크"로 마무리
- 간단한 마무리 인사 추가

4. **톤앤매너**:
- 전문적이면서 친근하게
- 인테리어·시공 사장님 대상
- "~하세요", "~입니다" 존댓말
- 과장 없이 신뢰감 있게

5. **금지사항**:
- 해시태그 포함 금지 (별도 추가됨)
- 이모지 과다 사용 금지 (전체 5~7개 이내)
- 한 줄에 35자 이상 금지
- 카카오 로그인, 텔레그램, 스팸 차단 언급 금지

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
 * 기본 캡션 생성 (Gemini 실패 시 사용) - 인테리어/시공 업종 월 구독 서비스 기반
 */
function getDefaultCaption(
  templateType: TemplateType,
  data: TemplateData,
): string {
  const headline =
    data.headline?.replace(/\n/g, " ") ||
    "본업에만 집중하세요. 고객은 저희가 데려옵니다.";

  return `${headline} 📊

인테리어·시공 사장님,
마케팅 때문에 본업에 집중 못하고 계신가요?

━━━━━━━━━━━━━━━━━

홈페이지는 어디서 만들고,
광고는 또 따로 알아보고,
DB 관리까지 혼자 다 하느라...

정작 중요한 시공과 고객 응대에
집중 못 하셨던 적 있으신가요?

폴라애드가 그 고민을 해결해드립니다.

━━━━━━━━━━━━━━━━━

✅ 접수형 - 월 5만원
   홈페이지 + DB접수 자동화

✅ 운영형 - 월 22만원
   홈페이지 + Meta 광고 운영 + DB 관리
   (도메인만 별도)

✅ 프리미엄 - 월 55만원
   운영형 전체 + 매일 게시글·인스타·쓰레드
   콘텐츠 자동 배포

📌 6개월 약정, 카드결제 가능
📌 인테리어·시공 업종 전문

━━━━━━━━━━━━━━━━━

💡 실제 고객 성과

   월 DB 접수: 47건 (운영형 3개월)
   계약 전환율: 17%
   "본업에만 집중했더니 고객이
    알아서 들어오더라고요"

━━━━━━━━━━━━━━━━━

본업에만 집중하세요.
고객은 저희가 데려옵니다.

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
