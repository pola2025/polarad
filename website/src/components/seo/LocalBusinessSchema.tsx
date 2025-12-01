// components/seo/LocalBusinessSchema.tsx

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "폴라애드",
    "image": "https://polarad.co.kr/images/office.jpg",
    "@id": "https://polarad.co.kr",
    "url": "https://polarad.co.kr",
    "telephone": "+82-32-345-9834",
    "priceRange": "₩₩₩",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "가산디지털2로 98, 롯데 IT 캐슬 2동 11층 1107",
      "addressLocality": "금천구",
      "addressRegion": "서울특별시",
      "postalCode": "08506",
      "addressCountry": "KR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 37.4776,
      "longitude": 126.8844
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "24"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
