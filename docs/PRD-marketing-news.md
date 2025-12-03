# PRD: 폴라애드 마케팅 소식 섹션

**문서 버전**: 1.0
**작성일**: 2025-12-02
**상태**: Draft

---

## 1. 개요

### 1.1 배경
폴라애드 웹사이트에 "마케팅 소식" 섹션을 추가하여 잠재 고객에게 유용한 마케팅 정보를 제공하고, SEO를 통한 유입 증가 및 전문성 어필을 목표로 한다.

### 1.2 목표
- **SEO 강화**: 마케팅 관련 키워드로 검색 유입 증가
- **전문성 어필**: 지속적인 콘텐츠 발행으로 신뢰도 향상
- **리드 생성**: 콘텐츠 → 상담 신청 전환 유도
- **운영 효율화**: AI 자동 생성으로 콘텐츠 제작 부담 최소화

### 1.3 핵심 결정 사항

| 항목 | 결정 |
|------|------|
| 데이터 저장 | MDX 파일 기반 (정적 생성) |
| 자동화 수준 | AI 초안 생성 → 관리자 검토 → 발행 |
| 이미지 처리 | AI 생성 (DALL-E API) |
| 발행 빈도 | 주 3회 이상 |

---

## 2. 콘텐츠 전략

### 2.1 카테고리 구조

```
마케팅 소식
├── meta-ads (Meta 광고 관리 & Tips)
│   ├── 광고 설정 가이드
│   ├── 예산 최적화
│   ├── 타겟팅 전략
│   ├── 광고 소재 제작
│   ├── A/B 테스트
│   ├── 성과 분석
│   ├── 픽셀 & 전환 추적
│   └── 정책 & 승인 이슈
│
└── marketing-trends (온라인 마케팅 트렌드)
    ├── 디지털 마케팅 동향
    ├── 플랫폼 알고리즘 변화
    ├── 신규 광고 기능
    ├── 업종별 성공 사례
    ├── 시즌별 마케팅 전략
    ├── B2B 마케팅
    └── 중소기업 마케팅
```

### 2.2 콘텐츠 형식

| 형식 | 설명 | 분량 |
|------|------|------|
| 가이드 | 단계별 실행 방법 | 2000-3000자 |
| 팁 & 트릭 | 빠른 실용 팁 | 1000-1500자 |
| 트렌드 분석 | 최신 동향 분석 | 1500-2000자 |
| 케이스 스터디 | 성공 사례 분석 | 2000-2500자 |

### 2.3 톤앤매너
- **전문적이면서 친근한** 톤
- 어려운 용어는 **쉽게 풀어서** 설명
- **실용적이고 바로 적용 가능한** 내용 중심
- 타겟: 중소기업 대표, 마케팅 담당자, 1인 사업자

---

## 3. 기술 아키텍처

### 3.1 URL 구조

```
/marketing-news                           # 메인 목록
/marketing-news/[slug]                    # 개별 글
/marketing-news/category/[category]       # 카테고리별 목록
/marketing-news/search?q=[query]          # 검색 결과
```

### 3.2 파일 구조

```
website/
├── src/
│   ├── app/
│   │   └── marketing-news/
│   │       ├── page.tsx                  # 메인 목록
│   │       ├── layout.tsx                # 레이아웃
│   │       ├── [slug]/
│   │       │   └── page.tsx              # 개별 글
│   │       └── category/
│   │           └── [category]/
│   │               └── page.tsx          # 카테고리별
│   │
│   ├── components/
│   │   └── marketing-news/
│   │       ├── ArticleCard.tsx           # 글 카드
│   │       ├── ArticleList.tsx           # 글 목록
│   │       ├── ArticleContent.tsx        # 글 본문
│   │       ├── CategoryFilter.tsx        # 카테고리 필터
│   │       ├── SearchBar.tsx             # 검색
│   │       ├── RelatedArticles.tsx       # 관련 글
│   │       ├── ShareButtons.tsx          # SNS 공유
│   │       └── ArticleCTA.tsx            # 하단 CTA
│   │
│   └── lib/
│       └── marketing-news/
│           ├── mdx.ts                    # MDX 파싱
│           ├── types.ts                  # 타입 정의
│           └── utils.ts                  # 유틸리티
│
└── content/
    └── marketing-news/
        ├── meta-ads/
        │   ├── facebook-ad-setup-guide.mdx
        │   └── ...
        └── marketing-trends/
            ├── 2025-digital-marketing-trends.mdx
            └── ...
```

### 3.3 MDX 파일 구조

```mdx
---
title: "페이스북 광고 예산 최적화 완벽 가이드"
description: "한정된 예산으로 최대 효과를 내는 Facebook 광고 예산 설정 방법을 알아봅니다."
category: "meta-ads"
tags: ["페이스북 광고", "예산 최적화", "ROAS", "CBO"]
author: "폴라애드"
publishedAt: "2025-12-02"
updatedAt: "2025-12-02"
thumbnail: "/images/marketing-news/facebook-budget-optimization.png"
featured: false
status: "published"  # draft | published | archived
seo:
  keywords: ["페이스북 광고 예산", "메타 광고 비용", "광고 예산 설정"]
  ogImage: "/images/marketing-news/og/facebook-budget-optimization.png"
---

# 페이스북 광고 예산 최적화 완벽 가이드

본문 내용...
```

### 3.4 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| MDX 처리 | next-mdx-remote / contentlayer |
| 스타일링 | Tailwind CSS |
| 이미지 생성 | **Nano Banana Pro** (`gemini-3-pro-image-preview`) |
| 글 생성 | **Google Gemini 3.0 Pro Preview** |
| 최신 정보 수집 | **Google Search API (Grounding)** |
| 검색 | 클라이언트 사이드 (Fuse.js) |
| SEO | next-seo, JSON-LD |

> **참고**: 기존 bas_meta 프로젝트에서 `@google/generative-ai` 패키지 사용 중

---

## 4. 기능 명세

### 4.1 메인 목록 페이지 (`/marketing-news`)

**기능**:
- [ ] 최신 글 목록 (페이지네이션, 12개/페이지)
- [ ] 카테고리 필터 탭
- [ ] 검색 입력창
- [ ] Featured 글 하이라이트 (상단 배너)
- [ ] 인기 글 사이드바 (조회수 기준)

**UI 구성**:
```
┌─────────────────────────────────────────────────────┐
│  마케팅 소식 - 온라인 마케팅의 모든 것               │
│  [검색창]                                           │
├─────────────────────────────────────────────────────┤
│  [전체] [Meta 광고] [마케팅 트렌드]                  │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │  Featured Article (큰 카드)                  │   │
│  └─────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │ Card 1  │ │ Card 2  │ │ Card 3  │              │
│  └─────────┘ └─────────┘ └─────────┘              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │ Card 4  │ │ Card 5  │ │ Card 6  │              │
│  └─────────┘ └─────────┘ └─────────┘              │
├─────────────────────────────────────────────────────┤
│  [1] [2] [3] ... [다음]                             │
└─────────────────────────────────────────────────────┘
```

### 4.2 개별 글 페이지 (`/marketing-news/[slug]`)

**기능**:
- [ ] MDX 렌더링 (코드 하이라이팅, 이미지 최적화)
- [ ] 목차 (Table of Contents) 사이드바
- [ ] 예상 읽기 시간
- [ ] SNS 공유 버튼 (카카오, 페이스북, 트위터, 링크복사)
- [ ] 관련 글 추천 (같은 카테고리, 같은 태그)
- [ ] 하단 CTA (상담 신청 유도)
- [ ] 이전/다음 글 네비게이션

**UI 구성**:
```
┌─────────────────────────────────────────────────────┐
│  [카테고리] > [글 제목]                              │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────┬───────────┐   │
│  │                                 │ 목차      │   │
│  │  # 제목                         │ - 섹션1   │   │
│  │  2025.12.02 · 5분 읽기          │ - 섹션2   │   │
│  │                                 │ - 섹션3   │   │
│  │  [썸네일 이미지]                │           │   │
│  │                                 │ 공유하기  │   │
│  │  본문 내용...                   │ [카카오]  │   │
│  │                                 │ [페북]    │   │
│  │                                 │ [트위터]  │   │
│  └─────────────────────────────────┴───────────┘   │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │  📢 광고 성과가 고민이신가요?               │   │
│  │  폴라애드 전문가와 무료 상담하세요          │   │
│  │  [무료 상담 신청하기]                        │   │
│  └─────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  관련 글                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │ Card 1  │ │ Card 2  │ │ Card 3  │              │
│  └─────────┘ └─────────┘ └─────────┘              │
├─────────────────────────────────────────────────────┤
│  [← 이전 글]                      [다음 글 →]      │
└─────────────────────────────────────────────────────┘
```

### 4.3 카테고리 페이지 (`/marketing-news/category/[category]`)

**기능**:
- [ ] 카테고리별 글 필터링
- [ ] 카테고리 설명 헤더
- [ ] 해당 카테고리 인기 태그

### 4.4 검색 기능

**기능**:
- [ ] 실시간 검색 (debounce 300ms)
- [ ] 제목, 본문, 태그 검색
- [ ] 검색 결과 하이라이팅
- [ ] 최근 검색어 저장 (localStorage)

---

## 5. AI 자동 생성 시스템

### 5.1 시스템 구조

```
┌─────────────────────────────────────────────────────┐
│                   관리자 대시보드                     │
│                   (polarad admin)                   │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│              AI 콘텐츠 생성 모듈                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ 주제 선정   │→│ Google 검색 │→│ 글 생성     │→│ 이미지 생성   │ │
│  │ (스케줄링)  │  │ (Grounding) │  │ (Gemini 3.0)│  │(NanaBananaPro)│ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                    검토 큐                           │
│  [초안1] [초안2] [초안3] ...                        │
│  관리자가 검토/수정 후 발행 버튼 클릭                 │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│              MDX 파일 생성 & Git Push                │
│              (자동 배포 트리거)                       │
└─────────────────────────────────────────────────────┘
```

### 5.2 콘텐츠 생성 프롬프트

```
당신은 온라인 마케팅 전문가이자 테크니컬 라이터입니다.
중소기업 대표와 마케팅 담당자를 대상으로
실용적이고 바로 적용 가능한 마케팅 콘텐츠를 작성해주세요.

## 작성 지침

### 대상 독자
- 중소기업 대표 및 마케팅 담당자
- 온라인 마케팅 초중급자
- 1인 사업자, 스타트업 창업자

### 톤앤매너
- 전문적이면서 친근한 톤
- 어려운 용어는 괄호 안에 쉬운 설명 추가
- "~입니다", "~합니다" 형식의 존칭 사용
- 독자를 "여러분" 또는 "마케터 분들"로 호칭

### 구조
1. **도입부** (200-300자)
   - 독자의 공감을 이끄는 문제 제기
   - 이 글을 통해 얻을 수 있는 것 미리보기

2. **본문** (1500-2000자)
   - 3~5개의 핵심 포인트
   - 각 포인트마다 실제 적용 예시
   - 단계별 가이드 형식 선호
   - 중간중간 팁 박스 활용

3. **결론** (200-300자)
   - 핵심 내용 3줄 요약
   - 다음 행동 제안 (CTA)

### SEO 요구사항
- 제목: 50자 이내, 핵심 키워드 포함
- 메타 설명: 150자 이내
- H2, H3 소제목에 키워드 자연스럽게 배치
- 내부 링크 2-3개 제안

## 작성할 콘텐츠 정보

주제: {topic}
카테고리: {category}
타겟 키워드: {keywords}
콘텐츠 유형: {content_type}
참고 자료: {references}

## 출력 형식

---
title: "{생성된 제목}"
description: "{메타 설명}"
category: "{category}"
tags: [{태그 배열}]
seo:
  keywords: [{SEO 키워드 배열}]
---

{MDX 형식의 본문}
```

### 5.3 Google Search Grounding 프로세스

콘텐츠 생성 전 최신 정보를 수집하여 정확하고 시의성 있는 콘텐츠를 생성합니다.

```typescript
// Gemini 3.0 Pro Preview + Google Search Grounding
const model = genAI.getGenerativeModel({
  model: 'gemini-3.0-pro-preview',
  tools: [{
    googleSearch: {}  // Google Search Grounding 활성화
  }]
});

// 1단계: 최신 정보 수집
const searchPrompt = `
주제: ${topic}
카테고리: ${category}

다음 정보를 Google 검색을 통해 수집해주세요:
1. 최근 3개월 내 관련 뉴스 및 업데이트
2. 최신 통계 및 데이터
3. 업계 전문가 의견 및 트렌드
4. 실제 사례 및 성공/실패 사례

검색 결과를 요약하고, 출처 URL을 함께 제공해주세요.
`;

// 2단계: 수집된 정보 기반 콘텐츠 생성
const contentPrompt = `
[수집된 최신 정보]
${searchResults}

[콘텐츠 생성 지침]
위 최신 정보를 바탕으로 마케팅 콘텐츠를 작성해주세요.
- 최신 데이터와 통계 인용
- 출처 명시
- 트렌드 반영
`;
```

**Grounding 활용 포인트**:
- 플랫폼 정책 변경사항 자동 반영
- 최신 광고 기능/업데이트 정보 포함
- 실시간 트렌드 및 업계 동향 반영
- 신뢰할 수 있는 출처 자동 인용

### 5.4 이미지 생성 (Nano Banana Pro)

```typescript
// Nano Banana Pro (gemini-3-pro-image-preview) 이미지 생성
const imageModel = genAI.getGenerativeModel({
  model: 'gemini-3-pro-image-preview'  // Nano Banana Pro
});

const imagePrompt = `
마케팅 블로그 글의 썸네일 이미지를 생성해주세요.

주제: ${articleTitle}
스타일: 깔끔하고 현대적인 비즈니스 일러스트레이션
컬러: 파란색(#0066CC) 기반, 흰색과 연한 회색 조합
분위기: 전문적이고 신뢰감 있는

요구사항:
- 16:9 비율
- 1K 해상도
- 텍스트 없이 이미지만
- 미니멀한 구성
`;

const result = await imageModel.generateContent(imagePrompt);
```

**Nano Banana Pro 장점**:
- 4K 해상도까지 지원
- 텍스트 렌더링 우수 (필요시 제목 포함 가능)
- Google Search 연동으로 실시간 데이터 기반 이미지 생성 가능
- **SynthID 워터마크 자동 포함** (AI 생성 콘텐츠 표시)

**AI 생성 이미지 규약**:
- 모든 AI 생성 이미지에 메타데이터 태그 추가: `ai-generated: true`
- 이미지 alt 텍스트에 "AI 생성 이미지" 명시
- HTML에 `data-ai-generated="true"` 속성 추가
- 필요시 이미지 하단에 "AI로 생성된 이미지입니다" 캡션 표시

**이미지 생성 프롬프트 예시**

```
Create a professional, modern illustration for a marketing blog article.

Topic: {article_title}
Style: Clean, minimalist, corporate
Color scheme: Blue (#0066CC) as primary, with white and light gray
Elements to include: {relevant_icons_or_elements}
Mood: Professional, trustworthy, approachable

Do NOT include:
- Text or words
- Realistic human faces
- Cluttered compositions

Format: 16:9 aspect ratio, suitable for blog thumbnail
```

### 5.4 관리자 기능 (polarad admin)

**마케팅 소식 관리 메뉴**:
- [ ] 콘텐츠 목록 (상태별 필터: 초안/발행됨/보관)
- [ ] AI 글 생성 트리거
- [ ] 초안 검토/수정 에디터
- [ ] 발행 스케줄 설정
- [ ] 콘텐츠 캘린더 뷰
- [ ] 성과 통계 (조회수, 상담 전환)

---

## 6. SEO 전략

### 6.1 온페이지 SEO

**메타 태그**:
```tsx
// 개별 글 페이지
<title>{글 제목} | 폴라애드 마케팅 소식</title>
<meta name="description" content="{글 설명}" />
<meta name="keywords" content="{키워드}" />

// Open Graph
<meta property="og:type" content="article" />
<meta property="og:title" content="{글 제목}" />
<meta property="og:description" content="{글 설명}" />
<meta property="og:image" content="{썸네일}" />
<meta property="og:url" content="{URL}" />
<meta property="article:published_time" content="{발행일}" />
<meta property="article:section" content="{카테고리}" />

// Twitter Card
<meta name="twitter:card" content="summary_large_image" />
```

**구조화 데이터 (JSON-LD)**:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "글 제목",
  "description": "글 설명",
  "image": "썸네일 URL",
  "author": {
    "@type": "Organization",
    "name": "폴라애드"
  },
  "publisher": {
    "@type": "Organization",
    "name": "폴라애드",
    "logo": {
      "@type": "ImageObject",
      "url": "로고 URL"
    }
  },
  "datePublished": "2025-12-02",
  "dateModified": "2025-12-02"
}
```

### 6.2 사이트맵

```xml
<!-- sitemap-marketing-news.xml -->
<urlset>
  <url>
    <loc>https://polarad.co.kr/marketing-news</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://polarad.co.kr/marketing-news/facebook-ad-guide</loc>
    <lastmod>2025-12-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- ... -->
</urlset>
```

### 6.3 내부 링크 전략

- 서비스 페이지 → 관련 마케팅 소식 링크
- 마케팅 소식 → 관련 서비스 페이지 링크
- 글 간 상호 링크 (관련 글)

---

## 7. 성과 측정

### 7.1 KPI

| 지표 | 목표 (3개월) | 목표 (6개월) |
|------|-------------|-------------|
| 월간 콘텐츠 발행 | 12개 | 12개 |
| 월간 페이지뷰 | 500 | 2,000 |
| 평균 체류 시간 | 2분 | 3분 |
| 검색 유입 비율 | 20% | 40% |
| CTA 클릭률 | 2% | 5% |
| 상담 전환 | 2건/월 | 5건/월 |

### 7.2 분석 도구

- Google Analytics 4 (GA4)
- Google Search Console
- 자체 조회수 카운터 (선택)

---

## 8. 구현 로드맵

### Phase 1: 기반 구축 (1주차)
- [ ] 프로젝트 구조 설정
- [ ] MDX 처리 시스템 구축
- [ ] 기본 페이지 레이아웃

### Phase 2: 핵심 기능 (2주차)
- [ ] 메인 목록 페이지
- [ ] 개별 글 페이지
- [ ] 카테고리 필터
- [ ] 검색 기능

### Phase 3: AI 시스템 (3주차)
- [ ] Claude API 연동 (글 생성)
- [ ] DALL-E API 연동 (이미지 생성)
- [ ] 관리자 대시보드 UI

### Phase 4: 최적화 (4주차)
- [ ] SEO 최적화
- [ ] 성능 최적화
- [ ] 초기 콘텐츠 10개 발행
- [ ] 테스트 및 QA

---

## 9. 초기 콘텐츠 계획

### 런칭 시 발행할 콘텐츠 (10개)

**Meta 광고 (5개)**:
1. 페이스북 광고 시작하기: 2025 완벽 가이드
2. 메타 광고 예산 설정, 이것만 알면 됩니다
3. 타겟팅의 기술: 내 고객 찾는 3가지 방법
4. 광고 소재 만들기: 클릭을 부르는 이미지 & 카피
5. 픽셀 설치부터 전환 추적까지 한번에 끝내기

**마케팅 트렌드 (5개)**:
1. 2025년 주목해야 할 디지털 마케팅 트렌드 5가지
2. 중소기업을 위한 마케팅 자동화 시작하기
3. SNS 알고리즘 변화, 이렇게 대응하세요
4. 업종별 온라인 마케팅 성공 사례 모음
5. 연말 마케팅 캠페인 기획 체크리스트

---

## 10. 리스크 및 대응

| 리스크 | 영향 | 대응 방안 |
|--------|------|----------|
| AI 콘텐츠 품질 저하 | 높음 | 검토 프로세스 강화, 프롬프트 개선 |
| SEO 효과 미미 | 중간 | 키워드 리서치 강화, 장기적 관점 유지 |
| 이미지 생성 비용 | 낮음 | 템플릿 재사용, 스톡이미지 혼용 |
| 관리 리소스 부족 | 중간 | 자동화 수준 조절, 발행 주기 조정 |

---

## 11. 승인 및 검토

| 역할 | 담당자 | 승인일 |
|------|--------|--------|
| 기획 | | |
| 개발 | | |
| 디자인 | | |
| 최종 승인 | | |

---

## 부록

### A. 참고 자료
- [Next.js MDX 공식 문서](https://nextjs.org/docs/app/building-your-application/configuring/mdx)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [OpenAI DALL-E API](https://platform.openai.com/docs/guides/images)
- [Anthropic Claude API](https://docs.anthropic.com/)

### B. 용어 정의
- **MDX**: Markdown + JSX, React 컴포넌트를 Markdown에서 사용 가능
- **CTA**: Call to Action, 행동 유도 버튼/문구
- **ROAS**: Return on Ad Spend, 광고 수익률

### C. 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 1.0 | 2025-12-02 | 초안 작성 | Claude |
