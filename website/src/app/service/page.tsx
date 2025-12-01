import type { Metadata } from 'next'
import { ProductSchema } from '@/components/seo/ProductSchema'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import ServiceHeroSection from '@/components/sections/service/ServiceHeroSection'
import ServicePackageSection from '@/components/sections/service/ServicePackageSection'
import ServiceFlowMockupSection from '@/components/sections/service/ServiceFlowMockupSection'
import ServiceDetailsSection from '@/components/sections/service/ServiceDetailsSection'
import ServiceProcessSection from '@/components/sections/service/ServiceProcessSection'
import ServiceCTASection from '@/components/sections/service/ServiceCTASection'

export const metadata: Metadata = {
  title: '온라인 영업 올인원 패키지 | 홈페이지+광고+인쇄물 330만원',
  description: '홈페이지 제작(10페이지), Meta 광고 자동화, 명함/계약서 인쇄물을 한 번에. 도메인+호스팅 1년 무료. 중소기업 맞춤형 온라인 영업 솔루션을 지금 시작하세요.',

  keywords: [
    '홈페이지 제작',
    '온라인 마케팅 패키지',
    'B2B 홈페이지',
    '중소기업 홈페이지',
    '반응형 홈페이지',
    'Meta 광고',
    '명함 제작',
    '온라인 영업 패키지'
  ],

  openGraph: {
    title: '온라인 영업 올인원 패키지 | 폴라애드',
    description: '홈페이지 제작(10페이지), Meta 광고 자동화, 명함/계약서 인쇄물',
    url: 'https://polaad.co.kr/service',
    images: [{ url: '/og-service.jpg', width: 1200, height: 630 }],
  },

  alternates: {
    canonical: 'https://polaad.co.kr/service',
  },
}

export default function ServicePage() {
  return (
    <>
      <ProductSchema
        name="온라인 영업 올인원 패키지"
        description="홈페이지 제작(10페이지) + Meta 광고 자동화 + 인쇄물(명함, 대봉투, 계약서, 명찰)"
        price="3300000"
        currency="KRW"
        availability="InStock"
        rating={4.9}
        reviewCount={18}
      />

      <BreadcrumbSchema
        items={[
          { name: '홈', url: 'https://polaad.co.kr' },
          { name: '서비스 안내', url: 'https://polaad.co.kr/service' }
        ]}
      />

      <main className="min-h-screen bg-gray-950 text-white">
        <ServiceHeroSection />
        <ServicePackageSection />
        <ServiceFlowMockupSection />
        <ServiceDetailsSection />
        <ServiceProcessSection />
        <ServiceCTASection />
      </main>
    </>
  )
}
