import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { FAQSchema } from '@/components/seo/FAQSchema'
import HeroSection from '@/components/sections/HeroSection'
import ServiceOverviewSection from '@/components/sections/ServiceOverviewSection'
import PainPointsSection from '@/components/sections/PainPointsSection'
import SolutionSection from '@/components/sections/SolutionSection'
import UrgencyCTASection from '@/components/sections/UrgencyCTASection'
import FAQSection from '@/components/sections/FAQSection'

export const metadata: Metadata = {
  title: '리드 수집 랜딩페이지 제작 | 접수 자동화 전문 - 폴라애드',
  description: '소상공인을 위한 리드 수집 랜딩페이지. 36만원(VAT 별도)에 1년간 접수 자동화 포함. 카카오 로그인, 텔레그램 알림, 실시간 대시보드까지.',
  keywords: [
    '리드수집', '랜딩페이지', '접수자동화', 'DB수집', '소상공인마케팅',
    '카카오로그인', '잠재고객발굴', '온라인접수', '리드제너레이션', '폴라애드'
  ],
  openGraph: {
    title: '리드 수집 랜딩페이지 | 36만원 올인원 패키지 (VAT 별도)',
    description: '1년간 접수 자동화 포함. 카카오 로그인, 텔레그램 알림, 실시간 대시보드.',
    url: 'https://polarad.co.kr',
    type: 'website',
    locale: 'ko_KR',
    siteName: '폴라애드',
  },
  alternates: {
    canonical: 'https://polarad.co.kr',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function HomePage() {
  const faqs = [
    {
      question: '상품 구성은 어떻게 되나요?',
      answer: '36만원(VAT 별도) 올인원 패키지입니다. 리드 수집 랜딩페이지 제작 + 1년간 접수 자동화(카카오 로그인, 텔레그램 알림, 실시간 대시보드)가 포함됩니다. 수정이 필요한 경우 건당 3만원입니다.'
    },
    {
      question: '카카오 로그인이 왜 필요한가요?',
      answer: '카카오 로그인을 통해 정확한 연락처와 본인 인증된 정보를 수집할 수 있습니다. 스팸 접수를 방지하고, 진성 고객만 필터링하여 영업 효율을 극대화합니다.'
    },
    {
      question: '제작 기간은 얼마나 걸리나요?',
      answer: '기획 내용 확정 후 영업일 기준 5~7일 내에 제작 완료됩니다. 랜딩페이지 제작, 카카오 앱 설정, 텔레그램 연동까지 모두 포함됩니다.'
    },
    {
      question: '1년 이후에는 어떻게 되나요?',
      answer: '1년 후 서비스 연장을 원하시면 월 1만원(VAT 별도)에 유지 가능합니다. 연장하지 않으시면 서비스 이용이 종료됩니다.'
    },
    {
      question: '환불이 가능한가요?',
      answer: '서비스 제작 시작 전에는 전액 환불이 가능합니다. 제작 시작 후에는 단순 변심으로 인한 환불이 불가합니다.'
    },
  ]

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: '홈', url: 'https://polarad.co.kr' }
        ]}
      />

      <FAQSchema faqs={faqs} />

      <HeroSection />
      <ServiceOverviewSection />
      <PainPointsSection />
      <SolutionSection />
      <UrgencyCTASection />
      <FAQSection />
    </>
  )
}
