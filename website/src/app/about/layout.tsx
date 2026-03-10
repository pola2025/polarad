import { Metadata } from "next";

export const metadata: Metadata = {
  title: "회사소개",
  description:
    "폴라애드는 소상공인·중소기업의 구독형 온라인 영업 파트너입니다. 홈페이지 제작, Meta 광고, DB 자동 수집까지 월 구독료 하나로 해결. 6개월 약정 후 홈페이지 영구 소유.",
  keywords: [
    "폴라애드",
    "회사소개",
    "온라인 영업",
    "중소기업 마케팅",
    "구독형 마케팅",
    "소상공인 홈페이지",
  ],
  openGraph: {
    title: "회사소개 | 폴라애드",
    description:
      "소상공인·중소기업의 구독형 온라인 영업 파트너, 폴라애드를 소개합니다.",
    url: "https://polarad.co.kr/about",
    type: "website",
    locale: "ko_KR",
    siteName: "폴라애드",
  },
  alternates: {
    canonical: "https://polarad.co.kr/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
