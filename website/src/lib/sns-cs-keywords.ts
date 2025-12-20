// SNS CS 문제 관련 키워드 목록 (23개, 5개 카테고리)
export const SNS_CS_KEYWORDS = [
  // A. 계정 문제 해결 (8개)
  "인스타그램 무고 계정 정지 복구",
  "메타 비즈니스 관리자 영구 제한 해결",
  "페이스북 광고 계정 갑자기 비활성화",
  "인스타그램 계정 정지 이의 신청",
  "메타 광고 정책 위반 복구 방법",
  "페이스북 계정 제한 24시간 해결",
  "인스타그램 본계정 부계정 동시 정지",
  "메타 광고 정지 문제 해결",

  // B. 비즈니스 관리자 설정 (4개)
  "메타 비즈니스 광고관리자 생성 방법",
  "메타 비즈니스 광고관리자가 필요한 이유",
  "메타 비즈니스 설정 광고 중요성",
  "페이스북 비즈니스 관리자 vs 광고하기 차이",

  // C. 광고하기 버튼 한계 (4개)
  "인스타그램 광고하기 입력폼 제한",
  "페이스북 광고하기 리포팅 제한",
  "광고하기로 광고하면 안되는 이유",
  "메타 광고관리자 없이 광고 문제점",

  // D. 메타 광고 트렌드 (2개)
  "메타 광고 트렌드 2026",
  "메타 어드밴티지 플러스 활용법",

  // E. 메타 고객센터 문의 (5개) - 유입 데이터 기반
  "메타 고객센터 문의 방법",
  "메타 고객센터 채팅 상담",
  "메타 비즈니스 지원 센터 연락처",
  "인스타그램 커뮤니티 보호 활동 제한 해결",
  "메타 고객센터 이메일 문의",
]

// 키워드 카테고리
export const KEYWORD_CATEGORIES = {
  account_recovery: [
    "인스타그램 무고 계정 정지 복구",
    "메타 비즈니스 관리자 영구 제한 해결",
    "페이스북 광고 계정 갑자기 비활성화",
    "인스타그램 계정 정지 이의 신청",
    "메타 광고 정책 위반 복구 방법",
    "페이스북 계정 제한 24시간 해결",
    "인스타그램 본계정 부계정 동시 정지",
    "메타 광고 정지 문제 해결",
  ],
  business_manager: [
    "메타 비즈니스 광고관리자 생성 방법",
    "메타 비즈니스 광고관리자가 필요한 이유",
    "메타 비즈니스 설정 광고 중요성",
    "페이스북 비즈니스 관리자 vs 광고하기 차이",
  ],
  boost_button_limits: [
    "인스타그램 광고하기 입력폼 제한",
    "페이스북 광고하기 리포팅 제한",
    "광고하기로 광고하면 안되는 이유",
    "메타 광고관리자 없이 광고 문제점",
  ],
  meta_trends: [
    "메타 광고 트렌드 2026",
    "메타 어드밴티지 플러스 활용법",
  ],
  meta_support: [
    "메타 고객센터 문의 방법",
    "메타 고객센터 채팅 상담",
    "메타 비즈니스 지원 센터 연락처",
    "인스타그램 커뮤니티 보호 활동 제한 해결",
    "메타 고객센터 이메일 문의",
  ],
}

// 랜덤 키워드 선택
export function getRandomKeyword(): string {
  const index = Math.floor(Math.random() * SNS_CS_KEYWORDS.length)
  return SNS_CS_KEYWORDS[index]
}

// 순환 키워드 선택 (인덱스 기반)
export function getNextKeyword(currentIndex: number): { keyword: string; nextIndex: number } {
  const nextIndex = (currentIndex + 1) % SNS_CS_KEYWORDS.length
  return {
    keyword: SNS_CS_KEYWORDS[currentIndex],
    nextIndex,
  }
}

// 키워드 인덱스로 키워드 가져오기
export function getKeywordByIndex(index: number): string {
  const safeIndex = index % SNS_CS_KEYWORDS.length
  return SNS_CS_KEYWORDS[safeIndex]
}

// 총 키워드 수
export const TOTAL_KEYWORDS = SNS_CS_KEYWORDS.length

// 카테고리별 키워드 가져오기
export function getKeywordsByCategory(category: keyof typeof KEYWORD_CATEGORIES): string[] {
  return KEYWORD_CATEGORIES[category]
}
