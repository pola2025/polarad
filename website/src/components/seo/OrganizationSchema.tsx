// components/seo/OrganizationSchema.tsx

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "폴라애드",
    "alternateName": "PolaAd",
    "url": "https://polarad.co.kr",
    "logo": {
      "@type": "ImageObject",
      "url": "https://polarad.co.kr/images/logo-pc.png",
      "width": 200,
      "height": 60
    },
    "image": "https://polarad.co.kr/images/og-image.png",
    "description": "법인영업, 경영컨설팅, 온라인마케팅, DB마케팅 전문 기업. Meta 광고, Google 광고, 퍼포먼스 마케팅 전문.",
    "foundingDate": "2024",
    "sameAs": [
      "https://www.instagram.com/polarad.kr",
      "https://blog.naver.com/polarad"
    ],
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
    },
    "areaServed": {
      "@type": "Country",
      "name": "대한민국"
    },
    "knowsAbout": [
      "온라인 마케팅",
      "퍼포먼스 마케팅",
      "Meta 광고",
      "Google 광고",
      "법인 영업",
      "DB 마케팅"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
