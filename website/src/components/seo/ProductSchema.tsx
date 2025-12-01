// components/seo/ProductSchema.tsx

interface ProductSchemaProps {
  name: string
  description: string
  price: string
  currency: string
  availability: 'InStock' | 'OutOfStock' | 'PreOrder'
  rating?: number
  reviewCount?: number
}

export function ProductSchema({
  name,
  description,
  price,
  currency,
  availability,
  rating = 4.9,
  reviewCount = 18
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": "폴라애드"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://polarad.co.kr/service",
      "priceCurrency": currency,
      "price": price,
      "priceValidUntil": "2025-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": `https://schema.org/${availability}`,
      "seller": {
        "@type": "Organization",
        "name": "폴라애드"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviewCount
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
