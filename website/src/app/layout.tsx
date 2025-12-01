import type { Metadata } from 'next'
import { OrganizationSchema } from '@/components/seo/OrganizationSchema'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://polaad.co.kr'),

  title: {
    default: '폴라애드 | 온라인 영업 자동화 & DB 추출 올인원 솔루션',
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

  authors: [{ name: '폴라애드', url: 'https://polaad.co.kr' }],
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
    url: 'https://polaad.co.kr',
    siteName: '폴라애드',
    title: '폴라애드 - 24시간 작동하는 온라인 영업사원',
    description: '중소기업을 위한 올인원 온라인 영업 솔루션. 홈페이지+광고+인쇄물 한 번에.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '폴라애드 온라인 영업 솔루션',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@polaad',
    creator: '@polaad',
    title: '폴라애드 - 24시간 작동하는 온라인 영업사원',
    description: '중소기업을 위한 올인원 온라인 영업 솔루션',
    images: ['/og-image.jpg'],
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
    google: 'your-google-verification-code',
    other: {
      'naver-site-verification': 'your-naver-verification-code',
    },
  },

  alternates: {
    canonical: 'https://polaad.co.kr',
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
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        <OrganizationSchema />
      </head>
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen pt-[76px] md:pt-[60px] lg:pt-[68px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
