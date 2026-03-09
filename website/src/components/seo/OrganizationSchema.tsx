export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "폴라애드",
    alternateName: "PolaAd",
    url: "https://polarad.co.kr",
    logo: {
      "@type": "ImageObject",
      url: "https://polarad.co.kr/images/logo-pc.png",
      width: 200,
      height: 60,
    },
    image: "https://polarad.co.kr/images/og-img.png",
    description:
      "소상공인 전용 구독형 영업 인프라. 홈페이지 제작, Meta 광고 운영, DB 자동 수집, GA4 설치, SEO 최적화까지 월 22만원.",
    foundingDate: "2024",
    sameAs: [
      "https://www.instagram.com/polarad.kr",
      "https://blog.naver.com/polarad",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+82-32-345-9834",
      contactType: "고객 상담",
      areaServed: "KR",
      availableLanguage: ["Korean"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      addressRegion: "서울특별시",
      addressLocality: "금천구",
      streetAddress: "가산디지털2로 98, 롯데 IT 캐슬 2동 11층 1107",
    },
    areaServed: {
      "@type": "Country",
      name: "대한민국",
    },
    knowsAbout: [
      "소상공인 마케팅",
      "구독형 마케팅",
      "홈페이지 제작",
      "Meta 광고",
      "DB 마케팅",
      "GA4 분석",
      "SEO 최적화",
      "온라인 영업 자동화",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
