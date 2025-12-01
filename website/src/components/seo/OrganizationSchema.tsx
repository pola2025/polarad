// components/seo/OrganizationSchema.tsx

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "폴라애드",
    "alternateName": "PolaAd",
    "url": "https://polaad.co.kr",
    "logo": "https://polaad.co.kr/logo.png",
    "description": "중소기업을 위한 온라인 영업 자동화 솔루션 전문 기업",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+82-2-XXXX-XXXX",
      "contactType": "고객 상담",
      "areaServed": "KR",
      "availableLanguage": ["Korean"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KR",
      "addressRegion": "서울",
      "addressLocality": "강남구",
      "streetAddress": "테헤란로 123"
    },
    "sameAs": [
      "https://www.facebook.com/polaad",
      "https://www.instagram.com/polaad",
      "https://blog.naver.com/polaad"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
