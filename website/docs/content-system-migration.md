# 콘텐츠 시스템 마이그레이션 계획

## 개요

마케팅 소식 게시판을 MDX 파일 기반에서 Airtable 기반으로 전환하여, AI 콘텐츠 자동 생성 및 마케터 친화적 워크플로우를 구현합니다.

---

## 현재 구조 (AS-IS)

```
┌─────────────────────────────────────────────────────────────┐
│                    polarad.co.kr (Frontend)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  content/marketing-news/*.mdx  ──→  getAllArticles()        │
│         (로컬 파일)                    (MDX 파싱)            │
│                                            │                 │
│                                            ▼                 │
│                                    /marketing-news 페이지    │
│                                                              │
│  Airtable "뉴스레터"  ──────────→  조회수 저장/조회만 사용   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 문제점

1. **콘텐츠 추가 시 Git 커밋 필요** - 개발자 의존도 높음
2. **AI 생성 콘텐츠 자동 반영 불가** - 파일 시스템 접근 필요
3. **마케터가 직접 수정 어려움** - MDX 문법, Git 사용 필요
4. **검수 프로세스 부재** - draft/published 상태 관리 없음

---

## 목표 구조 (TO-BE)

```
┌─────────────────────────────────────────────────────────────┐
│                 master_polarad (Admin Dashboard)             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  콘텐츠 생성 API ──→ Gemini AI ──→ Airtable "뉴스레터"      │
│       │                               (status: draft)       │
│       │                                    │                 │
│       ▼                                    ▼                 │
│  HCTI + Cloudinary ──────────────→ thumbnailUrl 저장        │
│  (썸네일 자동 생성)                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Airtable "뉴스레터" 테이블                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  마케터가 웹에서 직접:                                       │
│  - 콘텐츠 검수/수정                                          │
│  - status: draft → published 변경                           │
│  - 태그, 카테고리 조정                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    polarad.co.kr (Frontend)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Airtable API ──→ getAllArticles() ──→ /marketing-news      │
│                   (status=published만 조회)                  │
│                                                              │
│  * 기존 MDX 파일은 레거시로 유지 (선택적)                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 마케터 워크플로우

```
1. 콘텐츠 자동 생성 (Cron 또는 수동 트리거)
        │
        ▼
2. Airtable에 "draft" 상태로 저장
        │
        ▼
3. 마케터가 Airtable 웹에서 검수
   - 제목/내용 확인 및 수정
   - 썸네일 확인
   - 태그/카테고리 조정
        │
        ▼
4. status를 "published"로 변경
        │
        ▼
5. polarad.co.kr에 즉시 반영 (캐시 갱신)
```

---

## Airtable 테이블 스키마

**테이블명**: 뉴스레터
**Base ID**: appbqw2GAixv7vSBV

| 필드명 | 타입 | 설명 |
|--------|------|------|
| date | Date | 작성일 |
| title | Text | 게시글 제목 |
| description | Text | 메타 설명 (150자) |
| category | Single Select | 카테고리 |
| content | Long Text | 마크다운 본문 |
| tags | Text | 쉼표 구분 태그 |
| seoKeywords | Text | SEO 키워드 |
| status | Single Select | draft / published / scheduled |
| slug | Text | URL 슬러그 |
| thumbnailUrl | URL | 썸네일 이미지 URL |
| views | Number | 조회수 |
| publishedAt | Date | 발행일 |
| featured | Checkbox | 추천 글 여부 |
| sourceKeyword | Text | 생성 키워드 (AI용) |

---

## 구현 작업 목록

### Phase 1: 프론트엔드 Airtable 연동

- [ ] `src/lib/marketing-news/airtable.ts` 생성
  - Airtable에서 published 글 목록 조회
  - 단일 글 조회 (slug 기준)
  - 카테고리별 필터링

- [ ] `src/lib/marketing-news/index.ts` 수정
  - MDX 대신 Airtable 함수 export
  - 기존 MDX 함수는 레거시로 유지 (선택)

- [ ] 환경변수 확인
  ```env
  AIRTABLE_API_KEY=xxx
  AIRTABLE_BASE_ID=appbqw2GAixv7vSBV
  AIRTABLE_TABLE_NAME=뉴스레터
  ```

### Phase 2: 캐싱 및 성능 최적화

- [ ] ISR (Incremental Static Regeneration) 설정
  - 목록 페이지: 5분 revalidate
  - 상세 페이지: 1분 revalidate

- [ ] On-demand Revalidation API
  - Airtable Webhook → Vercel API → 캐시 갱신

### Phase 3: 콘텐츠 생성 자동화

- [ ] Cron Job 설정 (master_polarad)
  - 매일 특정 시간에 키워드 기반 콘텐츠 생성
  - Airtable에 draft 상태로 저장

- [ ] 썸네일 자동 생성 연동
  - HCTI API → Cloudinary 업로드

---

## 파일 변경 목록

```
src/lib/marketing-news/
├── index.ts          # export 변경 (airtable 함수)
├── airtable.ts       # [신규] Airtable 연동
├── mdx.ts            # [유지] 레거시 MDX 지원
└── types.ts          # 타입 확장 (sourceKeyword 등)

src/app/marketing-news/
├── page.tsx          # 변경 없음 (함수명 동일)
├── [slug]/page.tsx   # 마크다운 렌더링 추가
└── category/[category]/page.tsx  # 변경 없음

src/app/api/
├── revalidate/route.ts  # [신규] On-demand 캐시 갱신
└── views/[slug]/route.ts  # 변경 없음
```

---

## 마크다운 렌더링

Airtable content 필드는 마크다운 형식이므로, 프론트엔드에서 렌더링 필요:

```tsx
// 설치 필요
npm install react-markdown remark-gfm

// 사용
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {article.content}
</ReactMarkdown>
```

---

## 롤백 계획

문제 발생 시 `src/lib/marketing-news/index.ts`에서 export를 MDX 함수로 되돌리면 즉시 롤백 가능:

```ts
// Airtable 사용
export { getAllArticles, getArticle } from './airtable';

// MDX 롤백
// export { getAllArticles, getArticle } from './mdx';
```

---

## 참고 링크

- **Admin Dashboard**: https://master-polarad-co-kr.vercel.app
- **Airtable Base**: https://airtable.com/appbqw2GAixv7vSBV
- **콘텐츠 생성 API**: `/api/content-generator/test`

---

## 문서 정보

| 항목 | 내용 |
|------|------|
| 작성일 | 2025-12-20 |
| 작성자 | Claude Code |
| 상태 | 계획 |
| 우선순위 | 높음 |
