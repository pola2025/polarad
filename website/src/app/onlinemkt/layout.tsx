import type { Metadata } from 'next';
import { OnlineMktSchema } from '@/components/seo/OnlineMktSchema';

export const metadata: Metadata = {
  title: '온라인마케팅 올인원 패키지 | 2026 새해 프로모션 - 폴라애드',
  description: '인쇄물 디자인 + 홈페이지 제작 + 마케팅 자동화를 한 번에! 선착순 10개 기업 특별 할인 + 2년 자동화 무료 제공. 로고, 명함, 대봉투, 계약서, 명찰 디자인과 반응형 홈페이지, 텔레그램 알림, SMS 자동 발송까지 비즈니스 시작에 필요한 모든 것을 폴라애드가 통합 진행합니다.',
  keywords: [
    '온라인마케팅',
    '올인원 패키지',
    '홈페이지 제작',
    '인쇄물 디자인',
    '마케팅 자동화',
    '새해 프로모션',
    '2026 프로모션',
    '법인영업',
    '폴라애드',
    '명함 디자인',
    '로고 디자인',
    '반응형 홈페이지',
    '텔레그램 알림',
    'SMS 자동 발송',
    '메타 광고',
    '네이버 검색광고',
    '중소기업 마케팅',
    '창업 패키지',
    '비즈니스 시작',
    'DB 마케팅',
  ],
  authors: [{ name: '폴라애드', url: 'https://polarad.co.kr' }],
  creator: '폴라애드',
  publisher: '폴라애드',

  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://polarad.co.kr/onlinemkt',
    siteName: '폴라애드',
    title: '온라인마케팅 올인원 패키지 | 2026 새해 프로모션',
    description: '선착순 10개 기업 특별 할인 + 2년 자동화 무료! 인쇄물 + 홈페이지 + 마케팅 자동화를 한 번에.',
    images: [
      {
        url: '/api/og/onlinemkt',
        width: 1200,
        height: 630,
        alt: '폴라애드 온라인마케팅 올인원 패키지 - 2026 새해 프로모션',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@polarad',
    creator: '@polarad',
    title: '온라인마케팅 올인원 패키지 | 2026 새해 프로모션',
    description: '선착순 10개 기업 특별 할인 + 2년 자동화 무료! 인쇄물 + 홈페이지 + 마케팅 자동화를 한 번에.',
    images: ['/api/og/onlinemkt'],
  },

  alternates: {
    canonical: 'https://polarad.co.kr/onlinemkt',
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

  category: '온라인 마케팅',
};

export default function OnlineMktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OnlineMktSchema />
      {children}
    </>
  );
}
