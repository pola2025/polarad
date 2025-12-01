// components/seo/LocalBusinessSchema.tsx

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "폴라애드",
    "image": "https://polaad.co.kr/images/office.jpg",
    "@id": "https://polaad.co.kr",
    "url": "https://polaad.co.kr",
    "telephone": "+82-2-XXXX-XXXX",
    "priceRange": "₩₩₩",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "테헤란로 123",
      "addressLocality": "강남구",
      "addressRegion": "서울",
      "postalCode": "06000",
      "addressCountry": "KR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 37.5012345,
      "longitude": 127.0123456
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
