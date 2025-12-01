import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '상담신청',
  description: '폴라애드 무료 상담을 신청하세요. 견적 계산부터 상담 신청까지 한 번에. 1영업일 내 담당자가 직접 연락드립니다. 홈페이지 제작, 광고 설정, 인쇄물 제작 상담.',
  keywords: ['상담신청', '견적문의', '홈페이지 제작 상담', '광고 대행 상담', '무료 상담'],
  openGraph: {
    title: '상담신청 | 폴라애드',
    description: '무료 상담을 신청하세요. 1영업일 내 담당자가 연락드립니다.',
    url: 'https://polarad.co.kr/contact',
  },
  alternates: {
    canonical: 'https://polarad.co.kr/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
