import type { Metadata } from 'next'
import { ProductSchema } from '@/components/seo/ProductSchema'
import { ServiceSchema } from '@/components/seo/ServiceSchema'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import ServiceHeroSection from '@/components/sections/service/ServiceHeroSection'
import ServicePromotionSection from '@/components/sections/service/ServicePromotionSection'
import ServicePricingSection from '@/components/sections/service/ServicePricingSection'
import ServiceCaseStudySection from '@/components/sections/service/ServiceCaseStudySection'
import ServiceAddonsSection from '@/components/sections/service/ServiceAddonsSection'
import ServiceDetailsSection from '@/components/sections/service/ServiceDetailsSection'
import ServiceProcessSection from '@/components/sections/service/ServiceProcessSection'
import ServiceCTASection from '@/components/sections/service/ServiceCTASection'

export const metadata: Metadata = {
  title: '온라인 영업 솔루션 | 30만원부터 시작하는 홈페이지+Meta 광고',
  description: '랜딩페이지 30만원부터, 홈페이지+Meta 광고 자동화까지. Premium 165만원 프로모션(~1/31, 10개 한정). 경영컨설팅 광고비 15만원→DB 42건, 인테리어 광고비 100만원→DB 217건 실제 성과.',

  keywords: [
    '홈페이지 제작',
    '랜딩페이지 제작',
    'Meta 광고',
    'Meta 광고 자동화',
    'B2B 홈페이지',
    '중소기업 홈페이지',
    '반응형 홈페이지',
    '온라인 영업',
    'DB 마케팅',
    '리드 제너레이션',
    '잠재고객 발굴',
    '경영컨설팅 마케팅',
    '인테리어 마케팅',
    '직업교육 마케팅',
    '광고 성과',
    'DB 수집',
    '계약 전환율'
  ],

  openGraph: {
    title: '온라인 영업 솔루션 | 폴라애드',
    description: '30만원부터 시작. 경영컨설팅 15만원→42건 DB, 인테리어 100만원→217건 DB 실제 성과. Premium 165만원 프로모션 중.',
    url: 'https://polarad.co.kr/service',
    images: [{ url: '/images/og-img.png', width: 1200, height: 630 }],
  },

  alternates: {
    canonical: 'https://polarad.co.kr/service',
  },
}

export default function ServicePage() {
  return (
    <>
      <ProductSchema
        name="온라인 영업 Premium 패키지"
        description="홈페이지 10P + Meta 광고 세팅 + 6개월 자동화. 프로모션: 165만원에 1년 자동화 제공"
        price="1650000"
        currency="KRW"
        availability="InStock"
        rating={4.9}
        reviewCount={18}
      />
      <ServiceSchema />

      <BreadcrumbSchema
        items={[
          { name: '홈', url: 'https://polarad.co.kr' },
          { name: '서비스 안내', url: 'https://polarad.co.kr/service' }
        ]}
      />

      <main className="min-h-screen bg-gray-950 text-white">
        <ServiceHeroSection />
        <ServicePromotionSection />
        <ServicePricingSection />
        <ServiceCaseStudySection />
        <ServiceAddonsSection />
        <ServiceDetailsSection />
        <ServiceProcessSection />
        <ServiceCTASection />
      </main>
    </>
  )
}
