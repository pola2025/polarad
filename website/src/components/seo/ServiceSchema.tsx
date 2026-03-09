export function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "소상공인 구독형 마케팅",
    name: "폴라애드 구독형 영업 인프라",
    description:
      "홈페이지 제작, Meta 광고 운영, DB 자동 수집까지 월 22만원. 6개월 약정 후 홈페이지 영구 소유. 소상공인 전용 올인원 디지털 영업 솔루션.",
    provider: {
      "@type": "Organization",
      name: "폴라애드",
      url: "https://polarad.co.kr",
    },
    areaServed: {
      "@type": "Country",
      name: "대한민국",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "폴라애드 3티어 구독 서비스",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "접수형",
            description:
              "반응형 홈페이지 제작, 문의 폼 자동 저장, 텔레그램 실시간 알림, Google/Naver 검색 등록, GA4 기본 설치",
          },
          price: "50000",
          priceCurrency: "KRW",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "50000",
            priceCurrency: "KRW",
            unitText: "월",
            billingDuration: "P6M",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "운영형",
            description:
              "접수형 전체 포함 + Meta 광고 운영(CPR $20 목표), 1캠페인 멀티소재 전략, 월간 성과 리포트 자동 발송, GA4 채널별 유입 분석, CRM 상태 관리",
          },
          price: "220000",
          priceCurrency: "KRW",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "220000",
            priceCurrency: "KRW",
            unitText: "월",
            billingDuration: "P6M",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "프리미엄",
            description:
              "운영형 전체 포함 + Meta/당근/구글 멀티채널, 전담 매니저 1:1 배정, 광고 소재 월 4회 제작, 주간 성과 브리핑, A/B 테스트 운영",
          },
          price: "550000",
          priceCurrency: "KRW",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "550000",
            priceCurrency: "KRW",
            unitText: "월",
            billingDuration: "P6M",
          },
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
