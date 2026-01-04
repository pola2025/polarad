// components/seo/ServiceSchema.tsx

export function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "온라인 마케팅 솔루션",
    "name": "폴라애드 온라인 영업 솔루션",
    "description": "랜딩페이지 30만원부터, 홈페이지+Meta 광고 자동화까지. 중소기업 맞춤형 온라인 영업 시스템 구축. 경영컨설팅 광고비 15만원→DB 42건, 인테리어 광고비 100만원→DB 217건 실제 성과.",
    "provider": {
      "@type": "Organization",
      "name": "폴라애드",
      "url": "https://polarad.co.kr"
    },
    "areaServed": {
      "@type": "Country",
      "name": "대한민국"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "폴라애드 4티어 서비스",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Basic 패키지",
            "description": "Meta 광고 세팅 + 자동화 최초설정. 광고만 빠르게 시작하는 분께 추천"
          },
          "price": "300000",
          "priceCurrency": "KRW"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Normal 패키지",
            "description": "랜딩페이지 1P + Meta 광고 세팅 + 자동화 1개월 + 도메인 1년. 광고 테스트를 시작하는 분께 추천"
          },
          "price": "600000",
          "priceCurrency": "KRW"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pro 패키지",
            "description": "홈페이지 5P + Meta 광고 세팅 + 자동화 2개월 + 도메인 1년 + SEO 최적화. 본격적인 온라인 영업 시작"
          },
          "price": "1100000",
          "priceCurrency": "KRW"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Premium 패키지 (프로모션)",
            "description": "홈페이지 10P + 자동화 6개월 + 게시글 자동생성기 + 도메인 1년 + 알림 + SEO. 1/31까지 선착순 10개 한정 165만원"
          },
          "price": "1650000",
          "priceCurrency": "KRW",
          "priceValidUntil": "2025-01-31"
        }
      ]
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
