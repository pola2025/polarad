export interface IndustryDemo {
  key: string;
  slug: string;
  name: string;
  image: string;
  url: string;
  badge: string;
  heroTitle: string;
  adBrand: string;
  adCaption: string;
  adCta: string;
  tgMessage: string;
  stats: { value: string; label: string }[];
  report: { label: string; value: string; highlight?: boolean }[];
  desc: string;
  icon: string;
  longDesc?: string;
  challenges?: string[];
  benefits?: string[];
  recommendedTier?: "접수형" | "운영형" | "프리미엄";
  tierReason?: string;
}

// SVG icons (gold stroke, 24x24)
const icons = {
  interior:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a962" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/><path d="M10 9h4"/></svg>',
  architecture:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a962" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><path d="M5 20V8l3-3h8l3 3v12"/><path d="M9 20v-4h6v4"/><path d="M9 10h1"/><path d="M14 10h1"/><path d="M9 14h1"/><path d="M14 14h1"/><path d="M12 3v2"/></svg>',
  education:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a962" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8"/><path d="M8 11h6"/></svg>',
  consulting:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a962" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
  legal:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a962" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="m5 7 7-4 7 4"/><path d="M5 7v4a7 7 0 0 0 3.5 6"/><path d="M19 7v4a7 7 0 0 1-3.5 6"/><path d="M5 21h14"/><path d="M9 21v-2"/><path d="M15 21v-2"/></svg>',
  wedding:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a962" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3C7.5 3 4 7 4 12c0 3 1.5 5.5 4 7h8c2.5-1.5 4-4 4-7 0-5-3.5-9-8-9z"/><path d="M12 3c1.5 2 2.5 4.5 2.5 7s-1 5-2.5 7"/><path d="M12 3c-1.5 2-2.5 4.5-2.5 7s1 5 2.5 7"/><path d="M8 19l1 2"/><path d="M16 19l-1 2"/><path d="M12 17v4"/></svg>',
  realestate:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a962" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M9 8h1"/><path d="M9 12h1"/><path d="M9 16h1"/><path d="M14 8h1"/><path d="M14 12h1"/><path d="M14 16h1"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>',
  moving:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a962" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h1"/><path d="M15 18h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  lifeservice:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a962" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
};

export const industries: IndustryDemo[] = [
  {
    key: "interior",
    slug: "interior",
    name: "인테리어",
    image: "/images/demo/interior.png",
    url: "oo-interior.polarad.co.kr",
    badge: "인테리어 전문",
    heroTitle: "당신의 공간을\n새롭게 바꿔드립니다",
    adBrand: "OO인테리어",
    adCaption:
      "<strong>10년 된 주방이 이렇게 바뀝니다</strong><br>시공 전·후 사진 확인하고 무료 상담 받으세요.",
    adCta: "무료 상담 신청 →",
    tgMessage:
      "이름: 김OO\n연락처: 010-XXXX-XXXX\n문의: 거실 리모델링 견적 요청",
    stats: [
      { value: "12", label: "이번 달 DB" },
      { value: "8", label: "상담 완료" },
      { value: "3", label: "계약 전환" },
      { value: "25%", label: "전환율" },
    ],
    report: [
      { label: "광고 노출", value: "42,300회" },
      { label: "클릭", value: "1,840회" },
      { label: "DB 접수", value: "12건", highlight: true },
      { label: "CPR", value: "$18.2" },
    ],
    desc: "시공 전·후 비교로 고객의 마음을 사로잡는 마케팅",
    icon: icons.interior,
    longDesc:
      "인테리어 업종은 시공 전·후 비교 사진이 가장 강력한 마케팅 소재입니다. Meta 광고로 지역 타겟팅하여 리모델링·인테리어를 고민하는 잠재 고객에게 포트폴리오를 노출하고, 홈페이지 문의 폼을 통해 견적 상담 DB를 자동으로 수집합니다. 평균 CPR(문의당 비용) $15~25 수준으로, 월 30만원 광고비로 15~20건의 견적 문의를 확보할 수 있습니다. 카카오톡·문자 응대 자동화와 텔레그램 즉시 알림을 결합하면 경쟁사보다 빠른 응대로 계약 전환율을 높일 수 있습니다.",
    challenges: [
      "시공 사진만으로는 차별화 어려움 — 경쟁 업체도 비슷한 포트폴리오 보유",
      "네이버 파워링크 클릭당 비용 2,000~5,000원으로 광고비 부담 큼",
      "견적 문의 후 빠른 응대가 안 되면 경쟁사에 계약 뺏김",
    ],
    benefits: [
      "Meta 광고로 네이버 대비 1/3 비용으로 지역 타겟 견적 문의 확보",
      "문의 접수 즉시 텔레그램 알림 → 5분 내 응대로 계약 선점",
      "월간 리포트로 어떤 소재가 문의를 가장 많이 만드는지 데이터 확인",
    ],
    recommendedTier: "운영형",
    tierReason:
      "광고 집행부터 DB 수집·월간 리포트까지 한 번에 관리하는 운영형이 인테리어 업종의 지속적 견적 문의 확보에 최적입니다.",
  },
  {
    key: "architecture",
    slug: "architecture",
    name: "건축/설계",
    image: "/images/demo/architecture.png",
    url: "oo-archi.polarad.co.kr",
    badge: "건축설계 전문",
    heroTitle: "설계부터 완공까지\n함께합니다",
    adBrand: "OO건축",
    adCaption:
      "<strong>꿈꾸던 건물, 설계부터 다릅니다</strong><br>무료 설계 상담 받아보세요.",
    adCta: "무료 설계 상담 →",
    tgMessage:
      "이름: 정OO\n연락처: 010-XXXX-XXXX\n문의: 단독주택 신축 설계 의뢰",
    stats: [
      { value: "8", label: "이번 달 DB" },
      { value: "5", label: "미팅 완료" },
      { value: "2", label: "설계 착수" },
      { value: "25%", label: "전환율" },
    ],
    report: [
      { label: "광고 노출", value: "28,100회" },
      { label: "클릭", value: "920회" },
      { label: "DB 접수", value: "8건", highlight: true },
      { label: "CPR", value: "$22.5" },
    ],
    desc: "설계부터 완공까지, 전문성을 보여주는 마케팅",
    icon: icons.architecture,
    longDesc:
      "건축·설계 업종은 수천만 원대 고단가 프로젝트를 다루는 만큼, 신뢰와 전문성을 전달하는 콘텐츠 마케팅이 핵심입니다. Meta 광고로 단독주택 신축·전원주택을 꿈꾸는 40~60대 자산가 층에 준공 사례 영상을 노출하고, 무료 설계 상담 신청 폼으로 DB를 수집합니다. CPR $20~30 수준이지만 계약 1건당 수익이 크기 때문에 광고 효율이 매우 높습니다. 프리미엄 홈페이지에 3D 투시도·준공 사진을 체계적으로 정리하면 상담 전환율이 크게 올라갑니다.",
    challenges: [
      "포트폴리오 사진만으로는 설계 철학·기술력 전달이 어려움",
      "잠재 고객이 실제 착공까지 1~2년씩 고민하는 긴 구매 주기",
      "지역·예산 범위가 맞지 않는 비적격 문의 비율이 높음",
    ],
    benefits: [
      "Meta 상세 타겟팅으로 자산가·토지 보유자 층에만 광고 노출해 적격 DB 비율 향상",
      "상담 신청 폼에 예산·부지 유무 질문 추가 → 비적격 문의 사전 필터링",
      "준공 사례 영상 콘텐츠로 장기 신뢰 축적 → 1~2년 후 실제 착공 시 자연 유입",
    ],
    recommendedTier: "프리미엄",
    tierReason:
      "고단가·장기 구매 주기 특성상 프리미엄 홈페이지와 전략적 콘텐츠 운영이 필수이며, 계약 1건으로 광고비 전체를 충분히 회수할 수 있습니다.",
  },
  {
    key: "education",
    slug: "education",
    name: "학원/교육",
    image: "/images/demo/education.png",
    url: "oo-academy.polarad.co.kr",
    badge: "교육 전문",
    heroTitle: "아이의 가능성을\n키워드립니다",
    adBrand: "OO학원",
    adCaption:
      "<strong>우리 아이 성적, 한 달이면 달라집니다</strong><br>무료 레벨 테스트 신청하세요.",
    adCta: "무료 레벨테스트 →",
    tgMessage:
      "이름: 박OO (학부모)\n연락처: 010-XXXX-XXXX\n문의: 중2 수학 레벨테스트 신청",
    stats: [
      { value: "18", label: "이번 달 DB" },
      { value: "12", label: "상담 완료" },
      { value: "7", label: "등록 전환" },
      { value: "39%", label: "전환율" },
    ],
    report: [
      { label: "광고 노출", value: "55,200회" },
      { label: "클릭", value: "2,340회" },
      { label: "DB 접수", value: "18건", highlight: true },
      { label: "CPR", value: "$14.8" },
    ],
    desc: "학부모 신뢰를 얻는 체계적 마케팅",
    icon: icons.education,
    longDesc:
      "학원·교육 업종은 학부모의 불안심리와 자녀 성적 향상에 대한 기대를 마케팅의 핵심 메시지로 활용합니다. Meta 광고로 반경 3km 이내 학부모에게 무료 레벨테스트·체험 수업을 제안하면 CPR $12~18로 DB를 효율적으로 수집할 수 있습니다. 등록률은 빠른 상담 연락과 첫 수업 체험 경험에 크게 좌우되므로, 문의 즉시 알림 → 당일 상담 콜 → 체험 수업 예약으로 이어지는 자동화 흐름이 필요합니다. 시즌(3월 개학, 7월 방학) 전 집중 광고로 수강생을 선점하는 전략이 효과적입니다.",
    challenges: [
      "학원가 밀집 지역에서 비슷한 커리큘럼·강사진으로 차별화 어려움",
      "개강 시즌에만 문의가 몰리고 비수기에는 광고 효율이 급락",
      "학부모가 여러 학원을 동시에 상담하므로 첫 연락 속도가 등록 여부 결정",
    ],
    benefits: [
      "지역·학년·관심사 타겟팅으로 관련성 높은 학부모에게만 광고 노출",
      "레벨테스트 신청 폼 접수 즉시 텔레그램 알림 → 당일 상담 콜로 등록 전환율 향상",
      "시즌별 광고 예산 자동 조정 계획으로 비수기 낭비 없이 성수기에 집중 투자",
    ],
    recommendedTier: "운영형",
    tierReason:
      "시즌성이 강한 교육 업종은 월별 광고 최적화와 소재 업데이트가 핵심이므로, 지속 운영 관리가 포함된 운영형이 적합합니다.",
  },
  {
    key: "consulting",
    slug: "consulting",
    name: "경영컨설팅",
    image: "/images/demo/consulting.png",
    url: "oo-consulting.polarad.co.kr",
    badge: "경영 전문",
    heroTitle: "비즈니스 성장의\n파트너가 되겠습니다",
    adBrand: "OO컨설팅",
    adCaption:
      "<strong>매출 30% 성장, 전략이 달랐습니다</strong><br>무료 경영 진단 받아보세요.",
    adCta: "무료 경영 진단 →",
    tgMessage:
      "이름: 유OO\n연락처: 010-XXXX-XXXX\n문의: 소규모 법인 경영 진단 요청",
    stats: [
      { value: "10", label: "이번 달 DB" },
      { value: "7", label: "미팅 완료" },
      { value: "3", label: "계약 체결" },
      { value: "30%", label: "전환율" },
    ],
    report: [
      { label: "광고 노출", value: "22,100회" },
      { label: "클릭", value: "780회" },
      { label: "DB 접수", value: "10건", highlight: true },
      { label: "CPR", value: "$25.6" },
    ],
    desc: "비즈니스 성장을 이끄는 B2B 마케팅",
    icon: icons.consulting,
    longDesc:
      "경영컨설팅 업종은 대표자·C레벨 의사결정자에게 신뢰를 심어주는 콘텐츠가 마케팅의 전부입니다. Meta와 LinkedIn 광고로 중소기업 대표·임원층에 무료 경영 진단·세미나를 제안하고, 상담 DB를 수집합니다. CPR이 $25~40로 높지만 계약 단가가 수백만~수천만 원대이므로 1건 전환으로도 수십 배 ROI를 달성합니다. 성공 사례 인터뷰·수치 기반 리포트 콘텐츠가 전문성을 증명하는 핵심 소재입니다.",
    challenges: [
      "대표자가 직접 광고를 보고 연락하기보다 지인 소개·검색으로 유입되는 경우가 많음",
      "컨설팅 서비스의 실체가 보이지 않아 온라인 광고 신뢰도 낮음",
      "구매 결정까지 수개월 걸리는 장기 세일즈 사이클 관리 어려움",
    ],
    benefits: [
      "성공 사례 수치(매출 30% 증가 등)를 광고 소재에 활용해 신뢰도와 클릭률 동시 향상",
      "무료 진단 보고서 제공 → 가치 먼저 경험시켜 계약 전환 장벽 낮춤",
      "CRM 연동으로 장기 리드 관리 → 6개월 후 계약으로 이어지는 파이프라인 구축",
    ],
    recommendedTier: "프리미엄",
    tierReason:
      "고신뢰·고단가 B2B 특성상 전문적인 홈페이지, 콘텐츠 전략, 리드 너처링 자동화가 필요하므로 프리미엄 플랜이 투자 대비 효과가 가장 큽니다.",
  },
  {
    key: "legal",
    slug: "legal",
    name: "법률/세무",
    image: "/images/demo/legal-tax.png",
    url: "oo-tax.polarad.co.kr",
    badge: "세무·법률 전문",
    heroTitle: "복잡한 세무,\n쉽게 해결합니다",
    adBrand: "OO세무회계",
    adCaption:
      "<strong>종합소득세, 혼자 하지 마세요</strong><br>세무사가 직접 상담해드립니다.",
    adCta: "무료 세무 상담 →",
    tgMessage:
      "이름: 강OO\n연락처: 010-XXXX-XXXX\n문의: 법인 기장대리 견적 요청",
    stats: [
      { value: "22", label: "이번 달 DB" },
      { value: "15", label: "상담 완료" },
      { value: "9", label: "기장 계약" },
      { value: "41%", label: "전환율" },
    ],
    report: [
      { label: "광고 노출", value: "38,700회" },
      { label: "클릭", value: "1,560회" },
      { label: "DB 접수", value: "22건", highlight: true },
      { label: "CPR", value: "$12.1" },
    ],
    desc: "전문 상담 DB를 안정적으로 확보하는 마케팅",
    icon: icons.legal,
    longDesc:
      "법률·세무 업종은 세금·법적 문제가 생긴 시점의 즉각적 수요를 포착하는 것이 마케팅의 핵심입니다. Meta 광고로 사업자·자영업자·부동산 투자자 층에 세금 절감·무료 상담 메시지를 노출하면 CPR $10~15로 업종 평균보다 저렴하게 DB를 확보할 수 있습니다. 특히 종합소득세 신고 기간(5월), 부가세 신고 기간(1·7월) 시즌에 광고를 집중하면 월 20~30건의 기장 계약 DB를 확보할 수 있습니다. 빠른 전화 상담과 1회 무료 세무 진단 서비스가 계약 전환의 결정적 요소입니다.",
    challenges: [
      "네이버 광고 단가가 높고 대형 세무법인과의 예산 경쟁이 심함",
      "세무·법률 서비스의 전문성을 광고 소재 몇 줄로 설명하기 어려움",
      "상담 문의가 와도 가격 비교만 하고 이탈하는 체리피커 비율이 높음",
    ],
    benefits: [
      "시즌 집중 광고로 세금 신고 기간에 월 20~30건 기장 계약 DB 확보",
      "업종·지역 맞춤 타겟팅으로 사업자·자영업자 층 적격 DB 비율 향상",
      "1회 무료 세무 진단 오퍼로 신뢰 구축 → 장기 기장 계약 전환율 41% 달성",
    ],
    recommendedTier: "프리미엄",
    tierReason:
      "법률·세무는 신뢰가 구매 결정의 전부인 업종으로, 전문성이 묻어나는 홈페이지와 시즌별 광고 전략 설계가 필수이므로 프리미엄 플랜이 적합합니다.",
  },
  {
    key: "wedding",
    slug: "wedding",
    name: "웨딩",
    image: "/images/demo/wedding.png",
    url: "oo-studio.polarad.co.kr",
    badge: "웨딩 전문",
    heroTitle: "인생에서 가장 빛나는\n순간을 담습니다",
    adBrand: "OO스튜디오",
    adCaption:
      "<strong>평생 간직할 사진, 달라야 합니다</strong><br>포트폴리오 확인하고 상담 예약하세요.",
    adCta: "포트폴리오 보기 →",
    tgMessage:
      "이름: 이OO\n연락처: 010-XXXX-XXXX\n문의: 10월 웨딩 촬영 예약 문의",
    stats: [
      { value: "15", label: "이번 달 DB" },
      { value: "10", label: "상담 완료" },
      { value: "6", label: "촬영 예약" },
      { value: "40%", label: "전환율" },
    ],
    report: [
      { label: "광고 노출", value: "35,600회" },
      { label: "클릭", value: "1,420회" },
      { label: "DB 접수", value: "15건", highlight: true },
      { label: "CPR", value: "$16.5" },
    ],
    desc: "인생 최고의 순간을 담는 감성 마케팅",
    icon: icons.wedding,
    longDesc:
      "웨딩 업종은 감성적 비주얼과 리얼 후기가 예약 결정에 결정적인 영향을 미칩니다. Meta 광고로 약혼·결혼 준비 중인 20~30대 커플에게 포트폴리오 영상을 노출하고, 상담 예약 폼으로 DB를 수집합니다. 웨딩 스튜디오·드레스샵·플래너 등 업종 특성상 커플이 여러 업체를 동시에 비교하므로, 차별화된 콘셉트 포트폴리오와 빠른 상담 응대가 예약 전환의 핵심입니다. CPR $14~20 수준으로, 월 15~20건 상담 DB 확보 시 6건 이상 예약이 가능합니다.",
    challenges: [
      "결혼 성수기(봄·가을)에 광고가 집중되어 CPR이 비수기 대비 2배 이상 상승",
      "커플이 SNS에서 영감을 찾다가 실제 예약까지 2~3개월 소요되는 긴 검토 기간",
      "포트폴리오 콘셉트·가격대·분위기의 차별점을 광고 소재에서 빠르게 전달하기 어려움",
    ],
    benefits: [
      "비수기 광고 효율 극대화 전략으로 연중 안정적인 예약 파이프라인 구축",
      "실제 촬영 결과물 영상 광고 소재로 클릭률 업종 평균 대비 40% 이상 향상",
      "상담 예약 폼 접수 즉시 알림 → 당일 응대로 타 업체 비교 전에 관계 형성",
    ],
    recommendedTier: "운영형",
    tierReason:
      "시즌별 예산 조절과 감성 비주얼 소재 업데이트가 지속적으로 필요한 업종으로, 월별 운영 관리가 포함된 운영형이 가장 효율적입니다.",
  },
  {
    key: "realestate",
    slug: "realestate",
    name: "부동산",
    image: "/images/demo/realestate.png",
    url: "oo-realty.polarad.co.kr",
    badge: "부동산 전문",
    heroTitle: "내 집 마련,\n전문가와 함께하세요",
    adBrand: "OO부동산",
    adCaption:
      "<strong>이 매물, 놓치면 후회합니다</strong><br>지금 바로 상담 예약하세요.",
    adCta: "매물 상담 →",
    tgMessage: "이름: 서OO\n연락처: 010-XXXX-XXXX\n문의: OO역 투룸 매매 문의",
    stats: [
      { value: "25", label: "이번 달 DB" },
      { value: "18", label: "상담 완료" },
      { value: "5", label: "계약 체결" },
      { value: "20%", label: "전환율" },
    ],
    report: [
      { label: "광고 노출", value: "71,800회" },
      { label: "클릭", value: "2,890회" },
      { label: "DB 접수", value: "25건", highlight: true },
      { label: "CPR", value: "$11.5" },
    ],
    desc: "매물 노출부터 계약까지 이어지는 마케팅",
    icon: icons.realestate,
    longDesc:
      "부동산 업종은 매물 희소성과 지역 정보의 신뢰성을 마케팅 핵심 메시지로 활용합니다. Meta 광고로 특정 지역 거주자·관심자에게 신규 매물과 시세 정보를 노출하면 CPR $10~15로 대량 DB 확보가 가능합니다. 중개사의 전문성과 성사 실적을 강조하는 콘텐츠가 타 중개소와의 차별화 포인트이며, 매물 상담 접수 후 빠른 응대가 계약으로 연결되는 핵심 변수입니다. 전세·매매·임대 유형별로 타겟을 세분화하면 광고 효율이 크게 향상됩니다.",
    challenges: [
      "같은 지역 내 수십 개 중개소가 동일 매물을 광고하여 차별화 어려움",
      "부동산 규제·금리 변화에 따라 매수 심리가 급변하여 광고 일관성 유지 어려움",
      "허위 매물·낚시성 광고에 대한 불신으로 광고 클릭 후 이탈율이 높음",
    ],
    benefits: [
      "실제 매물 사진·가격·특징 명시 광고로 허위 매물 불신 극복 → 적격 DB 비율 향상",
      "지역·매물 유형·예산 별 세분화 타겟팅으로 월 25건 이상 적격 상담 DB 확보",
      "매물 업로드 즉시 자동 광고 소재 생성 연동으로 신규 매물 노출 속도 극대화",
    ],
    recommendedTier: "운영형",
    tierReason:
      "매물 변동에 따른 광고 소재 지속 업데이트와 지역 타겟팅 최적화가 필요하므로 운영형의 월별 관리 서비스가 부동산 업종에 가장 적합합니다.",
  },
  {
    key: "moving",
    slug: "moving",
    name: "이사/용달",
    image: "/images/demo/moving.png",
    url: "oo-moving.polarad.co.kr",
    badge: "이사 전문",
    heroTitle: "새 집으로의 이동,\n안전하게 책임집니다",
    adBrand: "OO이사",
    adCaption:
      "<strong>이사 스트레스, 우리가 대신합니다</strong><br>무료 견적 받아보세요.",
    adCta: "무료 견적 받기 →",
    tgMessage:
      "이름: 홍OO\n연락처: 010-XXXX-XXXX\n문의: 3/20 원룸 포장이사 견적",
    stats: [
      { value: "30", label: "이번 달 DB" },
      { value: "22", label: "견적 발송" },
      { value: "14", label: "계약 확정" },
      { value: "47%", label: "전환율" },
    ],
    report: [
      { label: "광고 노출", value: "48,500회" },
      { label: "클릭", value: "2,100회" },
      { label: "DB 접수", value: "30건", highlight: true },
      { label: "CPR", value: "$9.8" },
    ],
    desc: "견적 문의부터 계약까지 빠르게 전환하는 마케팅",
    icon: icons.moving,
    longDesc:
      "이사·용달 업종은 이사 날짜가 정해진 순간 빠른 견적 비교가 이루어지는 단기 의사결정 서비스입니다. Meta 광고로 이사를 앞둔 사람들에게 당일 무료 견적을 제안하면 CPR $8~12로 업종 중 가장 낮은 비용에 DB를 확보할 수 있습니다. 이사 시즌(2~4월, 8~9월)에 광고비를 집중하고, 견적 접수 즉시 전화 연락하는 자동 알림 시스템이 47% 이상의 높은 계약 전환율을 만드는 핵심입니다. 후기·별점 콘텐츠를 광고 소재로 활용하면 신뢰도가 높아져 클릭률이 30% 이상 향상됩니다.",
    challenges: [
      "이사 날짜가 정해진 고객이 3~5개 업체에 동시 견적을 요청하여 가격 경쟁이 심함",
      "이사 시즌(2~4월)에는 물량이 넘쳐 광고 없이도 바쁘고, 비수기에는 일감이 없는 양극화",
      "비용 절감을 위해 개인 포터를 이용하는 소형 이사 수요를 전문 업체로 유도하기 어려움",
    ],
    benefits: [
      "견적 접수 즉시 텔레그램 알림으로 30분 내 연락 → 경쟁 업체보다 먼저 신뢰 형성",
      "비수기 광고 집중 운영으로 성수기 외에도 월 30건 이상 안정적 DB 확보",
      "실제 고객 후기·사진 광고 소재 활용으로 클릭률 향상 및 이탈 없이 계약 전환",
    ],
    recommendedTier: "운영형",
    tierReason:
      "시즌 집중·비수기 분산 전략과 즉각적인 DB 응대 자동화가 핵심이므로, 지속 운영 관리와 알림 자동화가 포함된 운영형이 최적입니다.",
  },
  {
    key: "lifeservice",
    slug: "lifeservice",
    name: "생활전문",
    image: "/images/demo/life-service.png",
    url: "oo-service.polarad.co.kr",
    badge: "생활서비스 전문",
    heroTitle: "전문 기술로\n생활의 불편을 해결합니다",
    adBrand: "OO생활서비스",
    adCaption:
      "<strong>에어컨 청소, 미루지 마세요</strong><br>전문 기사가 직접 방문합니다. 누수탐지·방역도 한번에.",
    adCta: "무료 견적 요청 →",
    tgMessage:
      "이름: 최OO\n연락처: 010-XXXX-XXXX\n문의: 화장실 누수탐지 + 에어컨 청소 견적",
    stats: [
      { value: "35", label: "이번 달 DB" },
      { value: "28", label: "견적 발송" },
      { value: "18", label: "시공 완료" },
      { value: "51%", label: "전환율" },
    ],
    report: [
      { label: "광고 노출", value: "62,400회" },
      { label: "클릭", value: "3,120회" },
      { label: "DB 접수", value: "35건", highlight: true },
      { label: "CPR", value: "$8.5" },
    ],
    desc: "누수탐지·에어컨청소·방역 등 전문기술 마케팅",
    icon: icons.lifeservice,
  },
];

export function getIndustryBySlug(slug: string): IndustryDemo | undefined {
  return industries.find((i) => i.slug === slug);
}
