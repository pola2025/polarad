export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "폴라애드",
    alternateName: ["PolaAd", "POLARAD", "폴라애드 구독형 영업 인프라"],
    url: "https://polarad.co.kr",
    description:
      "소상공인을 위한 구독형 영업 인프라. 홈페이지 제작, Meta 광고 운영, DB 자동 수집까지 월 22만원.",
    inLanguage: "ko-KR",
    publisher: {
      "@type": "Organization",
      name: "폴라애드",
      url: "https://polarad.co.kr",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://polarad.co.kr/marketing-news?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "서비스 안내",
          url: "https://polarad.co.kr/service",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "업종별 데모",
          url: "https://polarad.co.kr/demo",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "마케팅 소식",
          url: "https://polarad.co.kr/marketing-news",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "간편 진단",
          url: "https://polarad.co.kr/contact",
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
