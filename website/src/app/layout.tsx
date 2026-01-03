import type { Metadata } from 'next'
import Script from 'next/script'
import { OrganizationSchema } from '@/components/seo/OrganizationSchema'
import { WebSiteSchema } from '@/components/seo/WebSiteSchema'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { PromotionPopup } from '@/components/ui/PromotionPopup'
import { FloatingCaseBanner } from '@/components/ui/FloatingCaseBanner'
import { MobileCaseBanner } from '@/components/ui/MobileCaseBanner'
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

  description: '랜딩페이지 30만원부터, 홈페이지+Meta 광고 자동화까지. 경영컨설팅 광고비 15만원→DB 42건, 인테리어 100만원→217건 실제 성과. Premium 165만원 프로모션 진행 중(~1/31).',

  keywords: [
    '온라인 영업',
    '홈페이지 제작',
    '랜딩페이지 제작',
    'DB 마케팅',
    '잠재고객 발굴',
    'Meta 광고',
    'Meta 광고 자동화',
    '리드 제너레이션',
    '영업 자동화',
    '중소기업 마케팅',
    'B2B 영업',
    '경영컨설팅 마케팅',
    '인테리어 마케팅',
    '직업교육 마케팅',
    '광고 성과',
    'DB 수집',
    '계약 전환율'
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
    title: '폴라애드 | 30만원부터 시작하는 온라인 영업 솔루션',
    description: '경영컨설팅 15만원→42건 DB, 인테리어 100만원→217건 DB 실제 성과. Premium 165만원 프로모션 진행 중(~1/31, 10개 한정).',
    images: [
      {
        url: '/images/og-img.png',
        width: 1200,
        height: 630,
        alt: '폴라애드 - 30만원부터 시작하는 온라인 영업 솔루션',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@polarad',
    creator: '@polarad',
    title: '폴라애드 | 30만원부터 시작하는 온라인 영업 솔루션',
    description: '경영컨설팅 15만원→42건 DB, 인테리어 100만원→217건 DB. Premium 165만원 프로모션 진행 중.',
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
        <main className="min-h-screen pt-[60px] md:pt-[60px] lg:pt-[68px] pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
        <MobileCaseBanner />
        <FloatingCaseBanner />
        <PromotionPopup />
      </body>
    </html>
  )
}
