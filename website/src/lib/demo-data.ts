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
