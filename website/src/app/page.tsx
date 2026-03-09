import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import HeroSection from "@/components/sections/HeroSection";
import ServiceOverviewSection from "@/components/sections/ServiceOverviewSection";
import PainPointsSection from "@/components/sections/PainPointsSection";
import SolutionSection from "@/components/sections/SolutionSection";
import UrgencyCTASection from "@/components/sections/UrgencyCTASection";
import FAQSection from "@/components/sections/FAQSection";

export const metadata: Metadata = {
  title:
    "소상공인 리드 자동화 구독 | 홈페이지+광고+DB수집 월 22만원 - 폴라애드",
  description:
    "홈페이지 따로, 광고 따로, DB 따로? 이제 그만하세요. 홈페이지 제작+Meta 광고+DB 자동 수집 올인원 월 22만원. 6개월 약정 후 홈페이지 영구 소유.",
  keywords: [
    "소상공인 마케팅",
    "DB 수집 자동화",
    "홈페이지 제작",
    "Meta 광고 대행",
    "구독형 마케팅",
    "소상공인 홈페이지",
    "인테리어 마케팅",
    "학원 마케팅",
    "건축 마케팅",
    "온라인 영업",
    "GA4 설치",
    "SEO 최적화",
    "폴라애드",
  ],
  openGraph: {
    title: "본업에만 집중하세요. 고객은 저희가 데려옵니다 | 폴라애드",
    description:
      "홈페이지+광고+DB수집 올인원 월 22만원. 6개월 약정 후 홈페이지 영구 소유.",
    url: "https://polarad.co.kr",
    type: "website",
    locale: "ko_KR",
    siteName: "폴라애드",
  },
  alternates: {
    canonical: "https://polarad.co.kr",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  const faqs = [
    {
      question: "정확히 무엇이 포함되나요?",
      answer:
        "반응형 홈페이지 제작, Meta 광고 운영, DB 자동 수집, GA4 설치, Google/Naver 검색 등록, 월간 성과 리포트가 모두 포함됩니다.",
    },
    {
      question: "6개월 약정 후에는 어떻게 되나요?",
      answer:
        "홈페이지는 영구 소유입니다. 광고 운영만 중단되며, 재구독 시 월 15만원에 광고 운영만 이어갈 수 있습니다.",
    },
    {
      question: "환불 정책은 어떻게 되나요?",
      answer:
        "1개월차 30%, 2~3개월차 20%, 4개월차 15% 환불. 5개월차부터는 환불 불가합니다.",
    },
    {
      question: "우리 업종에도 맞나요?",
      answer:
        "인테리어, 건축, 학원, 컨설팅, 법률, 웨딩, 부동산, 이사, 생활전문 등 서비스업 전반에 적용 가능합니다.",
    },
    {
      question: "제작 기간은 얼마나 걸리나요?",
      answer:
        "기획 내용 확정 후 영업일 기준 5~7일 내에 홈페이지 제작, 광고 세팅, 자동화 연동까지 모두 완료됩니다.",
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: "홈", url: "https://polarad.co.kr" }]}
      />

      <FAQSchema faqs={faqs} />
      <LocalBusinessSchema />

      <HeroSection />
      <ServiceOverviewSection />
      <PainPointsSection />
      <SolutionSection />
      <UrgencyCTASection />
      <FAQSection />
    </>
  );
}
