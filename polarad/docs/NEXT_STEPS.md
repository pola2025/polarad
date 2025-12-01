# Polarad 다음 진행 계획

## 현재 완료 상태 (Phase 1)

### 완료된 작업

| 항목 | 상태 | 설명 |
|------|------|------|
| 프로젝트 구조 | ✅ | 하이브리드 모놀리스 (user/admin Route Groups) |
| Prisma 스키마 | ✅ | Cohort, User, Submission, Workflow 등 11개 모델 |
| 회원가입 | ✅ | 5단계 UI + API (/signup) |
| 로그인/로그아웃 | ✅ | JWT 기반 인증 (/login) |
| 고객 대시보드 | ✅ | 진행현황 요약 UI (/dashboard) |
| 자료 제출 UI | ✅ | 필수/선택 항목 폼 (/submissions) |
| 관리자 대시보드 | ✅ | 클라이언트/토큰/알림 관리 (/admin/*) |
| 빌드 | ✅ | `npm run build` 성공 |

---

## Phase 2: DB 연동 및 테스트 (즉시)

### 2.1 환경 설정

```bash
# 1. Supabase 프로젝트에서 연결 정보 복사
# 2. .env 파일 수정
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
NEXTAUTH_SECRET="랜덤-시크릿-키"
```

### 2.2 DB 스키마 적용

```bash
cd F:\polasales\polarad
npm run db:push
```

### 2.3 초기 데이터 생성

Supabase SQL Editor에서 실행:

```sql
-- 테스트 기수 생성
INSERT INTO cohorts (id, name, description, start_date, deadline_date, is_active, created_at, updated_at)
VALUES (
  'cm4xxxxx001',
  '1기',
  '테스트 기수',
  '2025-01-06',
  '2025-01-20',
  true,
  NOW(),
  NOW()
);
```

### 2.4 테스트

1. `/signup` 접속 → 회원가입 테스트
2. `/login` 접속 → 로그인 테스트
3. `/dashboard` 접속 → 대시보드 확인

---

## Phase 3: 자료 제출 완성 (1주)

### 3.1 파일 업로드 설정

**옵션 A: Cloudflare R2 (권장)**
- 비용 효율적
- S3 호환 API

**옵션 B: AWS S3**
- 안정적
- 기존 경험 있으면 선택

### 3.2 구현 항목

| 항목 | 파일 | 설명 |
|------|------|------|
| 업로드 API | `/api/upload/route.ts` | presigned URL 발급 |
| Submissions API | `/api/submissions/route.ts` | 자료 저장/조회 |
| 자료 제출 페이지 연동 | `/submissions/page.tsx` | API 연결 |

### 3.3 필요한 패키지

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

---

## Phase 4: 인증 미들웨어 (1주)

### 4.1 미들웨어 구현

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');

  // /dashboard, /submissions 등 보호된 경로
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // /admin/* 관리자 전용
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 관리자 토큰 검증
  }
}
```

### 4.2 사용자 정보 Context

```typescript
// lib/auth/UserContext.tsx
// 로그인된 사용자 정보를 전역으로 제공
```

---

## Phase 5: 관리자 사용자 관리 (1주)

### 5.1 필요 페이지

| 경로 | 설명 |
|------|------|
| `/admin/users` | 사용자 목록 (기수별 필터) |
| `/admin/users/[id]` | 사용자 상세 (제출현황, 워크플로우) |
| `/admin/cohorts` | 기수 관리 (생성, 수정, 마감일) |

### 5.2 필요 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/users | 사용자 목록 (필터, 페이징) |
| GET | /api/users/[id] | 사용자 상세 |
| PATCH | /api/users/[id] | 사용자 정보 수정 |
| GET | /api/cohorts/[id] | 기수 상세 |
| PATCH | /api/cohorts/[id] | 기수 수정 |

---

## Phase 6: 워크플로우 관리 (2주)

### 6.1 관리자 기능

| 기능 | 설명 |
|------|------|
| 워크플로우 목록 | 상태별/유형별 필터 |
| 시안 업로드 | PDF 업로드 + 자동 알림 |
| 발주 승인 | 상태 변경 + 알림 |
| 택배 정보 입력 | 운송장 번호 + 알림 |

### 6.2 고객 기능

| 기능 | 설명 |
|------|------|
| 진행현황 확인 | 상태별 타임라인 |
| 시안 확인 | PDF 다운로드/미리보기 |
| 발주 요청 | 확인 후 발주 (경고 표시) |
| 배송 조회 | 운송장 번호 링크 |

### 6.3 필요 페이지

```
/dashboard/progress        # 고객: 제작 진행 현황
/admin/workflows          # 관리자: 워크플로우 목록
/admin/workflows/[id]     # 관리자: 워크플로우 상세
```

---

## Phase 7: 알림 시스템 완성 (1주)

### 7.1 SMS 알림 (NCP SENS)

```typescript
// lib/notification/sms.ts
// NCP SENS API 연동
```

### 7.2 이메일 알림 (SendGrid)

```typescript
// lib/notification/email.ts
// SendGrid API 연동
```

### 7.3 자동 알림 스케줄러

```typescript
// Vercel Cron Jobs
// vercel.json 에 cron 설정
{
  "crons": [
    {
      "path": "/api/cron/deadline-reminder",
      "schedule": "0 9 * * *"  // 매일 9시
    }
  ]
}
```

### 7.4 알림 유형

| 시점 | SMS | Email | Telegram |
|------|-----|-------|----------|
| 회원가입 완료 | ✅ | ✅ | - |
| 마감 D-7 | ✅ | ✅ | - |
| 마감 D-3 | ✅ | ✅ | - |
| 마감 D-1 | ✅ | ✅ | 관리자 |
| 시안 완료 | ✅ | ✅ | - |
| 발주 완료 | ✅ | ✅ | - |
| 발송 완료 | ✅ | ✅ | - |

---

## Phase 8: 광고 성과 연동 (1주)

### 8.1 bas_meta 연동

- 동일 Supabase DB 사용
- User ↔ Client 연결
- 광고 성과 조회 API

### 8.2 고객 대시보드

```
/dashboard/analytics      # 광고 성과 대시보드
├── 일간 성과 (노출, 클릭, 비용, 리드)
├── 주간 성과 (효율 등급)
└── 캠페인별 상세
```

---

## 예상 일정

| Phase | 내용 | 예상 기간 |
|-------|------|----------|
| 2 | DB 연동 및 테스트 | 1일 |
| 3 | 자료 제출 완성 | 3-4일 |
| 4 | 인증 미들웨어 | 1-2일 |
| 5 | 관리자 사용자 관리 | 3-4일 |
| 6 | 워크플로우 관리 | 5-7일 |
| 7 | 알림 시스템 완성 | 3-4일 |
| 8 | 광고 성과 연동 | 3-4일 |
| **총** | | **약 3-4주** |

---

## 우선순위 정리

### 즉시 (오늘)
1. Supabase DATABASE_URL 설정
2. `npm run db:push` 실행
3. 기수 데이터 생성
4. 회원가입 → 로그인 테스트

### 이번 주
5. 파일 업로드 (R2/S3)
6. Submissions API
7. 인증 미들웨어

### 다음 주
8. 관리자 사용자 관리
9. 워크플로우 관리 시작

---

**문서 작성일**: 2025-12-01
