import { Metadata } from "next";

export const metadata: Metadata = {
  title: "간편 진단 · 상담신청",
  description:
    "4가지 질문으로 우리 업종에 맞는 마케팅 플랜을 진단받으세요. 접수형 월 5만원, 운영형 월 22만원, 프리미엄 월 55만원. 1영업일 내 담당자가 연락드립니다.",
  keywords: [
    "상담신청",
    "마케팅 진단",
    "홈페이지 제작 상담",
    "광고 대행 상담",
    "무료 상담",
    "소상공인 마케팅",
  ],
  openGraph: {
    title: "간편 진단 · 상담신청 | 폴라애드",
    description:
      "4가지 질문으로 맞춤 플랜 추천. 1영업일 내 담당자가 연락드립니다.",
    url: "https://polarad.co.kr/contact",
    type: "website",
    locale: "ko_KR",
    siteName: "폴라애드",
  },
  alternates: {
    canonical: "https://polarad.co.kr/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
