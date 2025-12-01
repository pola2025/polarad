import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '포트폴리오',
  description: '폴라애드가 제작한 실제 홈페이지 포트폴리오입니다. 각 기업의 특성에 맞춘 맞춤형 디자인과 반응형 웹사이트를 확인해보세요. 50개 이상 제작 완료, 98% 고객 만족도.',
  keywords: ['포트폴리오', '홈페이지 제작 사례', '웹사이트 포트폴리오', '제작 실적', '맞춤형 디자인'],
  openGraph: {
    title: '포트폴리오 | 폴라애드',
    description: '폴라애드가 제작한 실제 홈페이지를 확인해보세요.',
    url: 'https://polarad.co.kr/portfolio',
  },
  alternates: {
    canonical: 'https://polarad.co.kr/portfolio',
  },
}

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
