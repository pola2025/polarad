import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '회사소개',
  description: '폴라애드는 중소기업의 온라인 영업 파트너입니다. 홈페이지, 광고, 인쇄물을 한 번에 해결하는 올인원 솔루션으로 복잡한 과정 없이 쉽고 빠르게 온라인 영업을 시작하세요.',
  keywords: ['폴라애드', '회사소개', '온라인 영업', '중소기업 마케팅', '올인원 솔루션'],
  openGraph: {
    title: '회사소개 | 폴라애드',
    description: '중소기업의 온라인 영업 파트너, 폴라애드를 소개합니다.',
    url: 'https://polarad.co.kr/about',
  },
  alternates: {
    canonical: 'https://polarad.co.kr/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
