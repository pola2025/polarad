# PRD: 서비스 페이지 상품 교체

## 개요

polarad.co.kr의 `/service` 페이지를 기존 4개 상품(홈페이지+Meta 광고)에서 **랜딩접수 프로그램** 단일 상품으로 교체합니다.

---

## 현재 상태

### 메인 페이지 (`/`)
- **상품**: 리드 수집 랜딩페이지 (39.6만원)
- **구성**: HeroSection, ServiceOverviewSection, PainPointsSection, SolutionSection, UrgencyCTASection, FAQSection
- **특징**: 카카오 로그인, 텔레그램 알림, 실시간 대시보드

### 서비스 페이지 (`/service`) - 레거시 대상
- **상품 4개**:
  | 상품 | 가격 | 설명 |
  |------|------|------|
  | Basic | 30만원 | Meta 광고 세팅만 |
  | Normal | 60만원 | 랜딩페이지 1P + Meta 광고 |
  | Pro | 110만원 | 홈페이지 5P + Meta 광고 |
  | Premium | 220만원 | 홈페이지 10P + Meta 광고 + 게시글 자동생성기 |

- **사용 컴포넌트**:
  - `ServiceHeroSection.tsx`
  - `ServicePromotionSection.tsx`
  - `ServicePricingSection.tsx` ← 4개 상품 정의
  - `ServiceCaseStudySection.tsx`
  - `ServiceAddonsSection.tsx`
  - `ServiceDetailsSection.tsx`
  - `ServiceProcessSection.tsx`
  - `ServiceCTASection.tsx`

---

## 변경 목표

1. `/service` 페이지를 **랜딩접수 프로그램** 상품 소개 페이지로 교체
2. 기존 4개 상품 관련 컴포넌트를 레거시 폴더로 백업
3. 메인 페이지와 동일한 디자인 스타일 유지

---

## 작업 상세

### 1단계: 레거시 백업

기존 service 컴포넌트들을 백업합니다.

```
src/components/sections/service/
├── ServiceHeroSection.tsx
├── ServicePromotionSection.tsx
├── ServicePricingSection.tsx
├── ServiceCaseStudySection.tsx
├── ServiceAddonsSection.tsx
├── ServiceDetailsSection.tsx
├── ServiceProcessSection.tsx
└── ServiceCTASection.tsx

↓ 백업 위치

src/components/sections/service-legacy/
├── ServiceHeroSection.tsx
├── ServicePromotionSection.tsx
├── ServicePricingSection.tsx
├── ServiceCaseStudySection.tsx
├── ServiceAddonsSection.tsx
├── ServiceDetailsSection.tsx
├── ServiceProcessSection.tsx
└── ServiceCTASection.tsx
```

### 2단계: /service 페이지 수정

**파일**: `src/app/service/page.tsx`

**변경 전**:
```tsx
import ServiceHeroSection from '@/components/sections/service/ServiceHeroSection'
import ServicePromotionSection from '@/components/sections/service/ServicePromotionSection'
import ServicePricingSection from '@/components/sections/service/ServicePricingSection'
// ... 기타 imports

export default function ServicePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <ServiceHeroSection />
      <ServicePromotionSection />
      <ServicePricingSection />
      // ... 기타 섹션
    </main>
  )
}
```

**변경 후**:
```tsx
import HeroSection from '@/components/sections/HeroSection'
import ServiceOverviewSection from '@/components/sections/ServiceOverviewSection'
import PainPointsSection from '@/components/sections/PainPointsSection'
import SolutionSection from '@/components/sections/SolutionSection'
import UrgencyCTASection from '@/components/sections/UrgencyCTASection'
import FAQSection from '@/components/sections/FAQSection'

export default function ServicePage() {
  return (
    <>
      <HeroSection />
      <ServiceOverviewSection />
      <PainPointsSection />
      <SolutionSection />
      <UrgencyCTASection />
      <FAQSection />
    </>
  )
}
```

### 3단계: 메타데이터 수정

**파일**: `src/app/service/page.tsx`

```tsx
export const metadata: Metadata = {
  title: '리드 수집 랜딩페이지 제작 | 접수 자동화 전문 - 폴라애드',
  description: '소상공인을 위한 리드 수집 랜딩페이지. 39.6만원에 1년간 접수 자동화 포함. 카카오 로그인, 텔레그램 알림, 실시간 대시보드까지.',
  keywords: [
    '리드수집', '랜딩페이지', '접수자동화', 'DB수집', '소상공인마케팅',
    '카카오로그인', '잠재고객발굴', '온라인접수', '리드제너레이션', '폴라리드'
  ],
  openGraph: {
    title: '리드 수집 랜딩페이지 | 39.6만원 올인원 패키지',
    description: '1년간 접수 자동화 포함. 카카오 로그인, 텔레그램 알림, 실시간 대시보드.',
    url: 'https://polarad.co.kr/service',
  },
  alternates: {
    canonical: 'https://polarad.co.kr/service',
  },
}
```

### 4단계: SEO 스키마 수정

**변경 전** (ProductSchema):
```tsx
<ProductSchema
  name="온라인 영업 Premium 패키지"
  description="홈페이지 10P + Meta 광고 세팅 + 6개월 자동화"
  price="1650000"
/>
```

**변경 후**:
```tsx
<ProductSchema
  name="리드 수집 랜딩페이지 올인원 패키지"
  description="리드 수집 랜딩페이지 제작 + 1년간 접수 자동화(카카오 로그인, 텔레그램 알림, 실시간 대시보드)"
  price="396000"
  currency="KRW"
/>
```

### 5단계: Header 메뉴 확인

**파일**: `src/components/layout/Header.tsx`

서비스 링크가 `/service`로 연결되어 있는지 확인. 변경 불필요 (URL 동일).

---

## 상품 정보 (랜딩접수 프로그램)

| 항목 | 내용 |
|------|------|
| **상품명** | 리드 수집 랜딩페이지 올인원 패키지 |
| **가격** | 39.6만원 (VAT 포함) |
| **제작 기간** | 5~7일 (영업일 기준) |
| **포함 항목** | - 리드 수집 랜딩페이지 제작<br>- 카카오 로그인 인증<br>- 텔레그램 실시간 알림<br>- 실시간 접수 대시보드<br>- 1년간 접수 자동화 |
| **추가 비용** | 수정 건당 3.3만원 |
| **연장 비용** | 월 11,000원 (1년 후) |

---

## 체크리스트

- [ ] `src/components/sections/service-legacy/` 폴더 생성
- [ ] 기존 service 컴포넌트 8개 백업
- [ ] `src/app/service/page.tsx` 수정
  - [ ] import 경로 변경
  - [ ] 메타데이터 수정
  - [ ] ProductSchema 수정
  - [ ] 섹션 컴포넌트 교체
- [ ] 빌드 테스트 (`npm run build`)
- [ ] 로컬 확인 (`npm run dev`)
- [ ] `/service` 페이지 접속 확인

---

## 참고 파일

### 메인 페이지 (참조용)
- `src/app/page.tsx` - 구조 참고
- `src/components/sections/ServiceOverviewSection.tsx` - 카카오/텔레그램/대시보드 소개
- `src/components/sections/HeroSection.tsx` - 히어로 섹션
- `src/components/sections/SolutionSection.tsx` - 솔루션 소개
- `src/components/sections/FAQSection.tsx` - FAQ

### 수정 대상
- `src/app/service/page.tsx` - 서비스 페이지 메인
- `src/components/sections/service/*.tsx` - 레거시 백업 대상

---

## 롤백 방법

레거시 복원이 필요한 경우:

```bash
# 1. 현재 service 폴더 백업
mv src/components/sections/service src/components/sections/service-new

# 2. 레거시 복원
mv src/components/sections/service-legacy src/components/sections/service

# 3. page.tsx 복원 (git 사용)
git checkout src/app/service/page.tsx
```

---

**작성일**: 2026-01-26
**작성자**: Claude
