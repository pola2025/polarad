// components/seo/ServiceSchema.tsx

export function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "온라인 마케팅 솔루션",
    "name": "폴라애드 올인원 패키지",
    "description": "홈페이지 제작, Meta 광고 자동화, 인쇄물 4종을 한 번에 제공하는 중소기업 맞춤 온라인 영업 솔루션",
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
      "name": "폴라애드 서비스",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "올인원 패키지",
            "description": "홈페이지 10페이지 + Meta 광고 설정 + 인쇄물 4종 + 도메인/호스팅 1년"
          },
          "price": "3300000",
          "priceCurrency": "KRW",
          "priceValidUntil": "2025-12-31"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "홈페이지 제작",
            "description": "맞춤형 반응형 웹사이트 제작"
          },
          "price": "2000000",
          "priceCurrency": "KRW"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Meta 광고 설정",
            "description": "Facebook/Instagram 광고 자동화 설정"
          },
          "price": "500000",
          "priceCurrency": "KRW"
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
