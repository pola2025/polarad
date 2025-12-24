// components/seo/OnlineMktSchema.tsx

export function OnlineMktSchema() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "온라인마케팅 올인원 패키지",
    "name": "폴라애드 온라인마케팅 올인원 패키지",
    "description": "인쇄물 디자인 + 홈페이지 제작 + 마케팅 자동화를 한 번에 제공하는 비즈니스 시작 솔루션. 로고, 명함, 대봉투, 계약서, 명찰 디자인과 반응형 홈페이지, 텔레그램 알림, SMS 자동 발송, 메타 광고, 네이버 검색 광고까지 통합 제공.",
    "provider": {
      "@type": "Organization",
      "name": "폴라애드",
      "url": "https://polarad.co.kr",
      "logo": "https://polarad.co.kr/images/logo-pc.png"
    },
    "areaServed": {
      "@type": "Country",
      "name": "대한민국"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "2026 새해 프로모션",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": "선착순 10개 기업 특별 혜택",
          "description": "특별 할인가 + 2년 마케팅 자동화 무료 제공",
          "itemOffered": {
            "@type": "Service",
            "name": "온라인마케팅 올인원 패키지 (BEST)",
            "description": "인쇄물 디자인 5종 + 자체개발 홈페이지 + 마케팅 자동화 2년"
          },
          "availability": "https://schema.org/LimitedAvailability",
          "priceValidUntil": "2026-03-31"
        },
        {
          "@type": "Offer",
          "name": "선착순 20개 기업 혜택",
          "description": "2년 마케팅 자동화 무료 제공",
          "itemOffered": {
            "@type": "Service",
            "name": "온라인마케팅 올인원 패키지",
            "description": "인쇄물 디자인 5종 + 자체개발 홈페이지 + 마케팅 자동화 2년"
          },
          "availability": "https://schema.org/LimitedAvailability",
          "priceValidUntil": "2026-03-31"
        }
      ]
    },
    "serviceOutput": [
      {
        "@type": "Product",
        "name": "인쇄물 디자인",
        "description": "로고, 명함 200매, 대봉투 500매, 계약서 500매, 명찰"
      },
      {
        "@type": "Product",
        "name": "자체개발 홈페이지",
        "description": "반응형 웹사이트, 6가지 스타일, 상담 접수 폼, SEO 최적화, SSL 보안 인증"
      },
      {
        "@type": "Product",
        "name": "마케팅 자동화",
        "description": "텔레그램 실시간 알림, SMS 자동 발송, 메타 광고 관리, 네이버 검색 광고"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "온라인마케팅 올인원 패키지에 무엇이 포함되나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "인쇄물 디자인(로고, 명함, 대봉투, 계약서, 명찰), 자체개발 홈페이지(반응형, 6가지 스타일 선택), 마케팅 자동화(텔레그램 알림, SMS 발송, 메타 광고, 네이버 검색 광고)가 모두 포함됩니다."
        }
      },
      {
        "@type": "Question",
        "name": "2026 새해 프로모션 혜택은 무엇인가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "선착순 10개 기업에게는 특별 할인가와 2년 마케팅 자동화를 무료로 제공하며, 선착순 20개 기업에게는 2년 마케팅 자동화를 무료로 제공합니다."
        }
      },
      {
        "@type": "Question",
        "name": "홈페이지는 어떤 스타일로 제작되나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "6가지 검증된 스타일 중 선호하는 디자인을 선택할 수 있으며, 커스텀 제작(10페이지 이내)도 지원합니다. 모든 홈페이지는 반응형으로 제작되어 PC와 모바일에서 최적화됩니다."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": "https://polarad.co.kr"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "온라인마케팅 올인원 패키지",
        "item": "https://polarad.co.kr/onlinemkt"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
