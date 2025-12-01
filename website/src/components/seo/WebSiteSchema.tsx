// components/seo/WebSiteSchema.tsx

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "폴라애드",
    "alternateName": ["PolaAd", "폴라애드 온라인 영업 솔루션"],
    "url": "https://polarad.co.kr",
    "description": "중소기업을 위한 온라인 영업 자동화 솔루션. 홈페이지 제작, Meta 광고, 인쇄물을 한 번에.",
    "inLanguage": "ko-KR",
    "publisher": {
      "@type": "Organization",
      "name": "폴라애드",
      "url": "https://polarad.co.kr"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://polarad.co.kr/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
