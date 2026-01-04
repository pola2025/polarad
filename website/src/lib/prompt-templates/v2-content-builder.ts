/**
 * V2 콘텐츠 프롬프트 빌더
 * - 카테고리별 맞춤 프롬프트
 * - SEO 최적화 가이드라인
 * - 콘텐츠 검증 규칙
 */

// ============================================
// 타입 정의
// ============================================

export type CategoryKey =
  | 'meta-ads'
  | 'instagram-reels'
  | 'threads'
  | 'faq'
  | 'ai-tips'
  | 'ai-news';

interface ContentOptions {
  seoKeywords?: {
    primary?: string;
    secondary?: string[];
  };
  regenerationFeedback?: string;
}

interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
}

// ============================================
// 현재 연도 (콘텐츠용)
// ============================================

function getContentYear(): string {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  // 현재 연도 사용 (올해 = 2026년)
  return String(kstDate.getUTCFullYear());
}

const CURRENT_YEAR = getContentYear();

// ============================================
// 카테고리별 프롬프트 템플릿
// ============================================
// ⚠️ 폴라애드 표현 규칙:
// - ❌ "메타 공식 파트너", "Meta 공식 파트너사" 사용 금지
// - ✅ "Meta 광고 전문 폴라애드" 또는 "Meta 광고 전문 광고대행사" 사용
// ============================================

const CATEGORY_PROMPTS: Record<CategoryKey, string> = {
  'meta-ads': `당신은 Meta(페이스북/인스타그램) 광고 전문가입니다.
폴라애드(POLARAD)는 Meta 광고 전문 광고대행사입니다.

**글의 목적**: 광고 운영자들이 실제로 적용할 수 있는 실용적인 가이드 제공
**타겟 독자**: 1인 사업자, 소규모 마케터, 인하우스 담당자

**필수 포함 내용**:
1. 구체적인 설정 방법 (단계별)
2. 스크린샷 안내 또는 위치 설명
3. 실제 사례나 예시
4. 주의사항 및 팁
5. 폴라애드 문의 유도 (자연스럽게)`,

  'instagram-reels': `당신은 인스타그램 릴스 전문가입니다.
폴라애드(POLARAD)는 Meta 광고 전문 광고대행사입니다.

**글의 목적**: 릴스 제작 및 운영에 대한 실용적인 가이드 제공
**타겟 독자**: 크리에이터, 소상공인, 마케터

**필수 포함 내용**:
1. 릴스 제작 팁 (촬영, 편집, 음악 선택)
2. 알고리즘 최적화 방법
3. 조회수/인게이지먼트 높이는 전략
4. 트렌드 활용법
5. 폴라애드 문의 유도 (자연스럽게)`,

  'threads': `당신은 Meta 쓰레드(Threads) 전문가입니다.
폴라애드(POLARAD)는 Meta 광고 전문 광고대행사입니다.

**글의 목적**: 쓰레드 활용에 대한 실용적인 가이드 제공
**타겟 독자**: SNS 마케터, 브랜드 담당자, 크리에이터

**필수 포함 내용**:
1. 쓰레드 기본 사용법
2. 팔로워 늘리기 전략
3. 인스타그램 연동 활용법
4. 콘텐츠 제작 팁
5. 폴라애드 문의 유도 (자연스럽게)`,

  'faq': `당신은 Meta 플랫폼 문제 해결 전문가입니다.
폴라애드(POLARAD)는 Meta 광고 전문 광고대행사입니다.

**글의 목적**: 계정 문제, 광고 오류 등 실제 문제 해결 가이드 제공
**타겟 독자**: 문제를 겪고 있는 광고주, 계정 관리자

**필수 포함 내용**:
1. 문제 원인 분석
2. 단계별 해결 방법
3. 메타 공식 도움말 링크
4. 이의 제기 방법 (해당 시)
5. 예방 팁
6. 폴라애드 문의 유도 (전문가 상담 강조)`,

  'ai-tips': `당신은 AI 도구 활용 전문가입니다.
폴라애드(POLARAD)는 AI 기술을 활용한 마케팅 솔루션을 제공합니다.

**글의 목적**: AI 도구 사용법, 설정 가이드, 활용 팁 제공
**타겟 독자**: 마케터, 개발자, 생산성 향상을 원하는 사용자

**🚨 AI 도구/모델 관련 필수 규칙 🚨**
⚠️ 도구 버전은 반드시 공식 문서나 GitHub에서 최신 버전 확인 후 작성하세요!
⚠️ 오래된 버전을 "최신"으로 표현하지 마세요!

**필수 포함 내용**:
1. 도구 소개 및 특징
2. 설치/설정 방법
3. 기본 사용법 예시
4. 고급 활용 팁
5. 장단점 분석
6. 공식 링크 (GitHub, 다운로드 등)`,

  'ai-news': `당신은 폴라애드(POLARAD)의 AI 소식 담당자입니다.
폴라애드는 AI 기술 동향을 주시하며 마케팅에 적용하는 Meta 광고 전문 광고대행사입니다.

**글의 목적**: 최신 AI 뉴스를 정확하고 이해하기 쉽게 전달
**타겟 독자**: AI에 관심 있는 일반인, 마케터, 기술 담당자
**화자**: 폴라애드 (기자가 아님! "안녕하세요, 폴라애드입니다."로 시작)

**🚨 AI 모델 관련 필수 규칙 🚨**
⚠️ 반드시 Google 검색 결과에서 "가장 최근 출시된 모델"을 확인하세요!
⚠️ 1개월 이상 지난 모델을 "최신", "새로운", "신규"로 표현하지 마세요!
⚠️ 검색 결과의 출시일을 확인하여 구버전인지 최신인지 판단하세요!

**필수 포함 내용**:
1. 뉴스 핵심 요약
2. 발표일/출시일 명시 (정확한 날짜)
3. 주요 변경사항 또는 새 기능
4. 사용자에게 미치는 영향
5. 공식 발표 링크
6. 관련 배경 정보

**❌ 금지 표현**:
- "AI 뉴스 전문 기자입니다" (X)
- "기자가 전해드립니다" (X)
→ 대신 "폴라애드입니다", "폴라애드에서 전해드립니다" 사용`,
};

// ============================================
// 프롬프트 빌더
// ============================================

/**
 * V2 콘텐츠 프롬프트 생성
 */
export function buildContentPromptV2(
  title: string,
  category: CategoryKey,
  options: ContentOptions = {}
): string {
  const { seoKeywords, regenerationFeedback } = options;

  const categoryPrompt = CATEGORY_PROMPTS[category] || CATEGORY_PROMPTS['meta-ads'];

  // SEO 키워드 섹션
  let seoSection = '';
  if (seoKeywords?.primary || seoKeywords?.secondary?.length) {
    seoSection = `
**[SEO 키워드 - 본문에 자연스럽게 포함하세요]**
${seoKeywords.primary ? `• 메인 키워드: ${seoKeywords.primary}` : ''}
${seoKeywords.secondary?.length ? `• 보조 키워드: ${seoKeywords.secondary.join(', ')}` : ''}
`;
  }

  // 재생성 피드백 섹션
  let feedbackSection = '';
  if (regenerationFeedback) {
    feedbackSection = `
**[⚠️ 이전 버전 피드백 - 반드시 개선하세요]**
${regenerationFeedback}
`;
  }

  return `${categoryPrompt}

## 작성할 글 제목
"${title}"
${seoSection}
${feedbackSection}
## 작성 규칙 (필수 준수)

1. **분량**: 1500~2500자 (글자수 기준)
2. **구조**: 명확한 서론-본론-결론 + 3개 이상의 소제목(##)
3. **연도**: 반드시 ${CURRENT_YEAR}년 기준으로 작성. 올해는 ${CURRENT_YEAR}년, 작년은 ${Number(CURRENT_YEAR) - 1}년. (2024년, 2027년 이후 연도 사용 금지)
4. **톤앤매너**: 전문적이면서 친근하게
5. **마크다운**: ##, ###, -, **, \` 등 적극 활용
6. **CTA**: 글 마지막에 폴라애드 문의 유도 (자연스럽게)
7. **출처**: 참고 자료가 있다면 출처 명시

## 금지 사항

- ❌ 2024년 이전, 2027년 이후 연도 언급 금지 (올해=${CURRENT_YEAR}년, 작년=${Number(CURRENT_YEAR) - 1}년만 허용)
- ❌ 틱톡(TikTok) 관련 내용
- ❌ 건강, 의료, 음식, 여행 등 마케팅과 무관한 내용
- ❌ 개인정보, 프라이버시 관련 내용
- ❌ 추측이나 확인되지 않은 정보

## 출력 형식

마크다운 형식의 본문만 출력하세요.
메타데이터, JSON, 설명 등은 포함하지 마세요.
`;
}

// ============================================
// 콘텐츠 검증
// ============================================

/**
 * V2 콘텐츠 검증
 */
export function validateContentV2(
  content: string,
  category: CategoryKey
): { isValid: boolean; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];

  // 글자수 체크
  if (content.length < 800) {
    issues.push({
      type: 'error',
      message: `글자수 부족: ${content.length}자 (최소 800자)`,
    });
  }

  // 연도 체크 (2024 이전, 2027 이후 금지)
  if (content.includes('2024') || content.includes('2027') || content.includes('2028')) {
    issues.push({
      type: 'error',
      message: `금지된 연도 포함. 올해(${CURRENT_YEAR}년)와 작년(${Number(CURRENT_YEAR) - 1}년)만 사용하세요.`,
    });
  }

  // 소제목 체크
  const headings = content.match(/^#{2,3}\s+.+$/gm) || [];
  if (headings.length < 2) {
    issues.push({
      type: 'warning',
      message: `소제목 부족: ${headings.length}개 (최소 3개 권장)`,
    });
  }

  // 틱톡 체크
  if (content.toLowerCase().includes('tiktok') || content.includes('틱톡')) {
    issues.push({
      type: 'error',
      message: '틱톡(TikTok) 관련 내용 포함 금지',
    });
  }

  // 카테고리별 키워드 체크
  const categoryKeywords: Record<CategoryKey, string[]> = {
    'meta-ads': ['메타', 'meta', '페이스북', 'facebook', '인스타그램', 'instagram', '광고'],
    'instagram-reels': ['인스타그램', 'instagram', '릴스', 'reels'],
    'threads': ['쓰레드', 'threads'],
    'faq': ['메타', 'meta', '페이스북', 'facebook', '인스타그램', 'instagram'],
    'ai-tips': ['ai', 'chatgpt', 'claude', 'gemini', 'mcp', 'cursor'],
    'ai-news': ['ai', 'chatgpt', 'claude', 'gemini', 'openai', 'anthropic'],
  };

  const keywords = categoryKeywords[category] || [];
  const lowerContent = content.toLowerCase();
  const hasKeyword = keywords.some(kw => lowerContent.includes(kw));

  if (!hasKeyword && keywords.length > 0) {
    issues.push({
      type: 'warning',
      message: `카테고리(${category}) 관련 키워드가 부족합니다`,
    });
  }

  return {
    isValid: issues.filter(i => i.type === 'error').length === 0,
    issues,
  };
}
