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
  title: '온라인영업 자동화 솔루션 | DB수집 & 리드제너레이션 전문 - 폴라애드',
  description: '소모성 광고비는 이제 그만. 평생 남는 영업 자산(Asset)을 구축하세요. 홈페이지+Meta광고+인쇄물 올인원 패키지. 24시간 잠재고객을 발굴하는 Lead Magnet Engine을 탑재해드립니다.',
  keywords: [
    '온라인마케팅', '온라인영업', 'DB수집', '리드제너레이션', 'DB광고',
    '영업자동화', '세일즈자동화', '정책자금 마케팅', '경영컨설팅 영업', '잠재고객발굴'
  ],
  openGraph: {
    title: '온라인영업 자동화 | DB수집 & 리드제너레이션 전문',
    description: '평생 남는 영업 자산(Asset) 구축. 24시간 잠재고객 발굴 시스템.',
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
      answer: '4가지 티어로 구성됩니다. Basic(30만원): 랜딩페이지 1P, Normal(60만원): 랜딩 1P + Meta 세팅 + 도메인 1년, Pro(110만원): 홈페이지 5P + Meta 세팅 + 도메인 1년, Premium(220만원): 홈페이지 10P + 6개월 자동화 + 도메인 1년. 인쇄물은 추가 옵션으로 선택 가능합니다.'
    },
    {
      question: '현재 진행 중인 프로모션이 있나요?',
      answer: '1월 31일까지 선착순 10개 기업 한정으로 Premium 패키지 55만원 할인(165만원) + 1년 자동화 무료 프로모션을 진행 중입니다.'
    },
    {
      question: '제작 기간은 얼마나 걸리나요?',
      answer: '기획서 확정 후 홈페이지는 30~45 영업일, 인쇄물은 7~10 영업일, 광고 설정은 5~7 영업일이 소요됩니다.'
    },
    {
      question: '환불이 가능한가요?',
      answer: '서비스 제작 시작 전에는 전액 환불이 가능합니다. 제작 시작 후에는 단순 변심으로 인한 환불이 불가하며, 품질상 심각한 하자가 있는 경우에만 환불이 가능합니다.'
    },
    {
      question: '로고가 없어도 제작이 가능한가요?',
      answer: '로고가 없는 경우 로고 제외 후 제작 가능합니다. 로고 반영 희망 시 로고(AI 파일형식) 전달주시면 반영 가능합니다.'
    },
    {
      question: '광고 소재(이미지/영상)도 제작해주시나요?',
      answer: '아니요, 광고 소재는 대표님이 직접 제작해서 전달해주셔야 합니다. 전달주신 소재로 광고 세팅을 도와드립니다.'
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
