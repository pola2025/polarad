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
    // 주요 서비스 페이지 명시 (AI가 사이트 구조를 이해하기 쉽게)
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "서비스 안내",
          "url": "https://polarad.co.kr/service"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "포트폴리오",
          "url": "https://polarad.co.kr/portfolio"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "마케팅 소식",
          "url": "https://polarad.co.kr/marketing-news"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "상담신청",
          "url": "https://polarad.co.kr/contact"
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
