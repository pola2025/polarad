# 콘텐츠 자동 생성 시스템 PRD

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | SNS CS 콘텐츠 자동 생성기 |
| **프론트엔드** | https://polarad.co.kr |
| **저장소** | F:\polasales\website |
| **작성일** | 2025-12-20 |

---

## 1. 목표

SNS 관련 CS 문제 해결 콘텐츠를 AI로 자동 생성하여 마케팅 소식 게시판에 발행

### 주요 기능
1. **키워드 기반 콘텐츠 생성** - Gemini AI로 블로그 글 작성
2. **썸네일 자동 생성** - Gemini 이미지 생성 → WebP 압축
3. **Airtable 저장** - draft 상태로 저장, 검수 후 published로 변경
4. **마케팅 소식 자동 반영** - published 상태의 글이 사이트에 표시

---

## 2. 기술 스택

| 구분 | 기술 |
|------|------|
| AI 텍스트 | Gemini 2.0 Flash |
| AI 이미지 | Gemini 2.0 Flash Exp (이미지 생성) |
| 이미지 처리 | Sharp (WebP 변환, 1200x630) |
| 콘텐츠 저장 | Airtable |
| 프론트엔드 | Next.js 15, React, Tailwind |
| 마크다운 렌더링 | react-markdown, remark-gfm |

---

## 3. 데이터 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                    콘텐츠 생성 API                           │
│                 /api/content-generator                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. 키워드 선택 (SNS_CS_KEYWORDS 목록에서)                   │
│         ↓                                                    │
│  2. Gemini로 콘텐츠 리라이팅                                 │
│     - 제목, 설명, 본문 (마크다운)                            │
│     - SEO 키워드, 태그, slug                                 │
│         ↓                                                    │
│  3. Gemini로 썸네일 이미지 생성                              │
│     - 플랫폼별 브랜드 스타일 적용                            │
│     - Sharp로 WebP 변환 (1200x630, 85%)                      │
│     - /public/images/marketing-news/ 에 저장                 │
│         ↓                                                    │
│  4. Airtable "뉴스레터" 테이블에 저장                        │
│     - status: "draft" (검수 필요)                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Airtable "뉴스레터"                       │
├─────────────────────────────────────────────────────────────┤
│  마케터가 웹에서:                                            │
│  - 콘텐츠 검수/수정                                          │
│  - status: draft → published 변경                           │
│  - 태그, 카테고리 조정                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                polarad.co.kr/marketing-news                  │
├─────────────────────────────────────────────────────────────┤
│  - Airtable에서 status='published' 글만 조회                │
│  - react-markdown으로 본문 렌더링                           │
│  - 썸네일 이미지 표시                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. SNS CS 키워드 목록

```typescript
const SNS_CS_KEYWORDS = [
  // Instagram 계정 문제
  "인스타그램 계정 정지 해결",
  "인스타그램 계정 비활성화 복구",
  "인스타 커뮤니티 보호 활동 제한",
  "인스타그램 로그인 차단 해결",
  "인스타그램 계정 해킹 복구",

  // Meta 광고 계정 문제
  "메타 광고 계정 정지 해결",
  "페이스북 광고 계정 비활성화",
  "메타 비즈니스 계정 제한",
  "페이스북 광고 정책 위반 해결",

  // Threads 계정 문제
  "쓰레드 계정 정지",
  "쓰레드 계정 제한 해결",

  // 공통 에러 메시지
  "인스타 특정 활동 제한 해결",
  "메타 계정 이의제기 방법",
  "인스타그램 신원 확인 요청",
]
```

---

## 5. Airtable 스키마

**테이블명**: 뉴스레터
**Base ID**: appbqw2GAixv7vSBV

| 필드명 | 타입 | 설명 |
|--------|------|------|
| date | Date | 작성일 |
| title | Text | 게시글 제목 |
| description | Text | 메타 설명 (150자) |
| category | Single Select | 카테고리 (faq 등) |
| content | Long Text | 마크다운 본문 |
| tags | Text | 쉼표 구분 태그 |
| seoKeywords | Text | SEO 키워드 |
| status | Single Select | draft / published |
| slug | Text | URL 슬러그 |
| thumbnailUrl | URL | 썸네일 이미지 URL |
| views | Number | 조회수 |
| publishedAt | Date | 발행일 |

---

## 6. 환경변수

```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Airtable
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=appbqw2GAixv7vSBV
AIRTABLE_TABLE_NAME=뉴스레터
```

---

## 7. 파일 구조

```
F:\polasales\website\
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── content-generator/
│   │   │   │   └── route.ts          # 콘텐츠 생성 API
│   │   │   └── views/[slug]/
│   │   │       └── route.ts          # 조회수 API
│   │   └── marketing-news/
│   │       ├── page.tsx              # 목록 페이지
│   │       └── [slug]/page.tsx       # 상세 페이지
│   ├── lib/
│   │   ├── marketing-news/
│   │   │   ├── index.ts              # 모듈 export
│   │   │   ├── airtable.ts           # Airtable 연동
│   │   │   ├── types.ts              # 타입 정의
│   │   │   └── mdx.ts                # 레거시 MDX (백업)
│   │   ├── content-generator.ts      # AI 콘텐츠 생성
│   │   └── sns-cs-keywords.ts        # 키워드 목록
│   └── components/
│       └── marketing-news/
│           ├── MarkdownContent.tsx   # 마크다운 렌더링
│           └── ArticleCard.tsx       # 글 카드
├── public/
│   └── images/
│       └── marketing-news/           # 썸네일 이미지 저장
└── docs/
    ├── content-generator-prd.md      # 이 문서
    └── content-system-migration.md   # 마이그레이션 문서
```

---

## 8. API 엔드포인트

### POST /api/content-generator

콘텐츠 생성 및 저장

**Query Parameters:**
- `keyword` (optional): 특정 키워드로 생성
- `save` (optional): `true`면 Airtable에 저장

**Response:**
```json
{
  "success": true,
  "keyword": "인스타 커뮤니티 보호 활동 제한",
  "content": {
    "title": "...",
    "description": "...",
    "slug": "...",
    "thumbnailUrl": "/images/marketing-news/sns-cs-xxx.webp"
  },
  "airtableRecordId": "rec...",
  "savedToAirtable": true
}
```

---

## 9. 마케터 워크플로우

```
1. 콘텐츠 생성 API 호출
   GET /api/content-generator?save=true
        ↓
2. Airtable에 "draft" 상태로 저장
        ↓
3. Airtable 웹에서 검수
   - 제목/내용 확인 및 수정
   - 썸네일 확인
   - 태그/카테고리 조정
        ↓
4. status를 "published"로 변경
        ↓
5. polarad.co.kr/marketing-news에 즉시 반영
```

---

## 10. 구현 체크리스트

### Phase 1: 기본 구조
- [x] Airtable 연동 라이브러리 (airtable.ts)
- [x] 마크다운 렌더링 컴포넌트 (MarkdownContent.tsx)
- [x] 마케팅 소식 Airtable 기반 전환

### Phase 2: 콘텐츠 생성
- [ ] 콘텐츠 생성 API (/api/content-generator)
- [ ] Gemini 텍스트 생성 연동
- [ ] Gemini 이미지 생성 연동
- [ ] Sharp WebP 변환

### Phase 3: 자동화
- [ ] Cron Job 설정 (일일 자동 생성)
- [ ] 텔레그램 알림 연동

---

## 11. 참고 링크

- **Airtable Base**: https://airtable.com/appbqw2GAixv7vSBV
- **Gemini API 문서**: https://ai.google.dev/gemini-api/docs
- **마이그레이션 문서**: ./content-system-migration.md

---

**문서 버전**: 1.0
**최종 수정**: 2025-12-20
