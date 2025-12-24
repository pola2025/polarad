import type { Metadata } from 'next'
import Script from 'next/script'
import { OrganizationSchema } from '@/components/seo/OrganizationSchema'
import { WebSiteSchema } from '@/components/seo/WebSiteSchema'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PromotionPopup } from '@/components/ui/PromotionPopup'
import './globals.css'

const GA_MEASUREMENT_ID = 'G-0SK5T8Q0F0'

export const metadata: Metadata = {
  metadataBase: new URL('https://polarad.co.kr'),

  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },

  title: {
    default: '폴라애드 | 법인영업 경영컨설팅 온라인마케팅 DB마케팅 전문',
    template: '%s | 폴라애드'
  },

  description: '단순 홈페이지가 아닌 \'팔리는 시스템\'을 구축합니다. Meta 광고 자동화, 고효율 DB 수집, 인쇄물까지 한 번에. 대표님의 평생 자산(Asset)이 될 영업 엔진을 장착하세요.',

  keywords: [
    '온라인 영업',
    '홈페이지 제작',
    'DB 추출',
    '잠재고객 발굴',
    'Meta 광고',
    '리드 제너레이션',
    '영업 자동화',
    '중소기업 마케팅',
    'B2B 영업',
    '랜딩페이지'
  ],

  authors: [{ name: '폴라애드', url: 'https://polarad.co.kr' }],
  creator: '폴라애드',
  publisher: '폴라애드',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://polarad.co.kr',
    siteName: '폴라애드',
    title: '폴라애드 - Meta DB 수집 광고 & 운영 리포트',
    description: '법인영업, 경영컨설팅, 온라인마케팅, DB마케팅 전문. 고효율 잠재고객 DB 수집부터 성과 분석까지.',
    images: [
      {
        url: '/images/og-img.png',
        width: 1200,
        height: 630,
        alt: '폴라애드 - 경영컨설팅, 법인영업, 온라인마케팅 전문',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@polarad',
    creator: '@polarad',
    title: '폴라애드 - Meta DB 수집 광고 & 운영 리포트',
    description: '법인영업, 경영컨설팅, 온라인마케팅, DB마케팅 전문',
    images: ['/images/og-img.png'],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },


  verification: {
    other: {
      'naver-site-verification': '1aa1300fe30c43fc6fd899daeec8cebf292027f4',
    },
  },

  alternates: {
    canonical: 'https://polarad.co.kr',
  },

  category: '온라인 마케팅',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="facebook-domain-verification" content="c6wudm1sui5g0rslpwib85bo97pt5a" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
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
        <main className="min-h-screen pt-[76px] md:pt-[60px] lg:pt-[68px]">
          {children}
        </main>
        <Footer />
        <PromotionPopup />
      </body>
    </html>
  )
}
