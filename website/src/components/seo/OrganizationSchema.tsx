// components/seo/OrganizationSchema.tsx

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "폴라애드",
    "alternateName": "PolaAd",
    "url": "https://polarad.co.kr",
    "logo": "https://polarad.co.kr/logo.png",
    "description": "법인영업, 경영컨설팅, 온라인마케팅, DB마케팅 전문 기업",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+82-32-345-9834",
      "contactType": "고객 상담",
      "areaServed": "KR",
      "availableLanguage": ["Korean"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KR",
      "addressRegion": "서울특별시",
      "addressLocality": "금천구",
      "streetAddress": "가산디지털2로 98, 롯데 IT 캐슬 2동 11층 1107"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
