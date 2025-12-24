import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '온라인마케팅 올인원 패키지 | 2026 새해 프로모션',
  description: '인쇄물 디자인 + 홈페이지 제작 + 마케팅 자동화를 한 번에! 선착순 10개 기업 특별 할인 + 2년 자동화 무료 제공. 비즈니스 시작에 필요한 모든 것을 폴라애드가 통합 진행합니다.',
  keywords: [
    '온라인마케팅',
    '올인원 패키지',
    '홈페이지 제작',
    '인쇄물 디자인',
    '마케팅 자동화',
    '새해 프로모션',
    '법인영업',
    '폴라애드',
  ],
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
    title: '온라인마케팅 올인원 패키지 | 2026 새해 프로모션',
    description: '선착순 10개 기업 특별 할인 + 2년 자동화 무료! 인쇄물 + 홈페이지 + 마케팅 자동화를 한 번에.',
    images: ['/api/og/onlinemkt'],
  },
  alternates: {
    canonical: 'https://polarad.co.kr/onlinemkt',
  },
};

export default function OnlineMktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
