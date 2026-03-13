import type { Metadata } from "next";
import Script from "next/script";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { WebSiteSchema } from "@/components/seo/WebSiteSchema";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-0SK5T8Q0F0";

export const metadata: Metadata = {
  metadataBase: new URL("https://polarad.co.kr"),

  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },

  title: {
    default: "폴라애드 | 본업에만 집중하세요. 고객은 저희가 데려옵니다.",
    template: "%s | 폴라애드",
  },

  description:
    "홈페이지 제작, Meta 광고 운영, DB 자동 수집까지 월 22만원. 6개월 약정 후 홈페이지 영구 소유. 소상공인 맞춤 구독형 영업 인프라.",

  keywords: [
    "소상공인 마케팅",
    "홈페이지 제작",
    "DB 마케팅",
    "DB 수집 자동화",
    "Meta 광고",
    "Meta 광고 대행",
    "구독형 마케팅",
    "온라인 영업",
    "영업 자동화",
    "중소기업 마케팅",
    "인테리어 마케팅",
    "학원 마케팅",
    "건축 마케팅",
    "소상공인 홈페이지",
    "광고 대행",
    "GA4 설치",
    "SEO 최적화",
  ],

  authors: [{ name: "폴라애드", url: "https://polarad.co.kr" }],
  creator: "폴라애드",
  publisher: "폴라애드",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://polarad.co.kr",
    siteName: "폴라애드",
    title: "본업에만 집중하세요. 고객은 저희가 데려옵니다 | 폴라애드",
    description:
      "홈페이지+광고+DB수집 올인원 월 22만원. 6개월 약정 후 홈페이지 영구 소유. 소상공인 맞춤 구독형 영업 인프라.",
    images: [
      {
        url: "/images/og-img.png",
        width: 1200,
        height: 630,
        alt: "폴라애드 - 본업에만 집중하세요. 고객은 저희가 데려옵니다.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@polarad",
    creator: "@polarad",
    title: "본업에만 집중하세요. 고객은 저희가 데려옵니다 | 폴라애드",
    description:
      "홈페이지+광고+DB수집 올인원 월 22만원. 6개월 약정 후 홈페이지 영구 소유.",
    images: ["/images/og-img.png"],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    other: {
      "naver-site-verification": "1aa1300fe30c43fc6fd899daeec8cebf292027f4",
    },
  },

  alternates: {
    canonical: "https://polarad.co.kr",
  },

  category: "온라인 마케팅",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="facebook-domain-verification"
          content="c6wudm1sui5g0rslpwib85bo97pt5a"
        />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body className="font-sans antialiased">
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>

        <Header />
        <main className="min-h-screen pt-[60px] md:pt-[60px] lg:pt-[64px] pb-16 md:pb-0 overflow-x-clip">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
