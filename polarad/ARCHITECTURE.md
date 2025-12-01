# Polarad 마케팅 패키지 - 통합 관리 시스템

## 프로젝트 개요

**프로젝트명**: Polarad 마케팅 패키지
**목적**: 광고 마케팅 서비스 고객을 위한 통합 관리 시스템
**기반**: Next.js 15 + Prisma + Supabase

---

## 1. 시스템 구조

### 1.1 전체 아키텍처

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Polarad 마케팅 패키지                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────┐    ┌─────────────────────────────────┐ │
│  │    고객 포털 (User)      │    │    관리자 대시보드 (Admin)       │ │
│  ├─────────────────────────┤    ├─────────────────────────────────┤ │
│  │ • 회원가입/로그인        │    │ • 전체 현황 대시보드            │ │
│  │ • 자료 제출              │    │ • 고객/기수 관리                │ │
│  │ • 제작 진행 현황         │    │ • 워크플로우 관리               │ │
│  │ • 광고 성과 (bas_meta)   │    │ • 클라이언트(광고) 관리         │ │
│  │                         │    │ • 알림 관리                     │ │
│  └─────────────────────────┘    └─────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                        API Layer                                 │ │
│  │  /api/auth  /api/users  /api/cohorts  /api/submissions          │ │
│  │  /api/workflows  /api/clients  /api/notifications               │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                    Database (Supabase)                           │ │
│  │  Cohort | User | Submission | Workflow | Client | Notification  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, Prisma ORM |
| Database | PostgreSQL (Supabase) |
| Auth | JWT (jose), bcryptjs |
| File Storage | AWS S3 / Cloudflare R2 (예정) |
| Notification | Telegram Bot API, SMS (NCP SENS), Email (예정) |

---

## 2. 프로젝트 구조

```
polarad/
├── app/
│   ├── (user)/                      # 고객 포털 (Route Group)
│   │   ├── layout.tsx
│   │   ├── login/page.tsx           # 로그인
│   │   ├── signup/page.tsx          # 5단계 회원가입
│   │   ├── dashboard/
│   │   │   ├── layout.tsx           # 고객 대시보드 레이아웃
│   │   │   └── page.tsx             # 대시보드 메인
│   │   └── submissions/page.tsx     # 자료 제출
│   │
│   ├── (admin)/                     # 관리자 대시보드 (Route Group)
│   │   ├── layout.tsx               # 사이드바 레이아웃
│   │   └── admin/
│   │       ├── page.tsx             # 관리자 메인
│   │       ├── clients/page.tsx     # 광고 클라이언트 관리
│   │       ├── tokens/page.tsx      # 토큰/인증 관리
│   │       └── notifications/page.tsx # 알림 관리
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts      # 회원가입
│   │   │   ├── login/route.ts       # 로그인 (JWT 발급)
│   │   │   └── logout/route.ts      # 로그아웃
│   │   ├── cohorts/route.ts         # 기수 CRUD
│   │   ├── users/                   # 사용자 관리 (예정)
│   │   ├── submissions/             # 자료 제출 (예정)
│   │   ├── workflows/               # 워크플로우 (예정)
│   │   ├── clients/                 # 광고 클라이언트 CRUD
│   │   ├── tokens/                  # 토큰 관리
│   │   └── notifications/           # 알림 발송
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                     # 랜딩 페이지
│
├── components/
│   ├── ui/                          # shadcn/ui 컴포넌트
│   ├── clients/                     # 클라이언트 관련
│   └── layout/                      # 레이아웃 관련
│
├── lib/
│   ├── prisma.ts                    # Prisma 클라이언트
│   ├── utils.ts                     # 유틸리티
│   ├── telegram/bot.ts              # 텔레그램 봇
│   └── notification/                # 알림 서비스
│
├── types/                           # 타입 정의
├── prisma/schema.prisma             # DB 스키마
└── package.json
```

---

## 3. 데이터베이스 스키마

### 3.1 핵심 모델

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Cohort    │────<│    User     │────<│ Submission  │
│   (기수)    │     │   (고객)    │     │ (자료제출)  │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           │ 1:N
                           ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  Workflow   │────<│WorkflowLog  │
                    │ (제작진행)  │     │ (상태이력)  │
                    └─────────────┘     └─────────────┘
                           │
                           │ 1:1 (선택)
                           ▼
                    ┌─────────────┐
                    │   Client    │  ← bas_meta 연동
                    │ (광고계정)  │
                    └─────────────┘
```

### 3.2 주요 모델

| 모델 | 설명 |
|------|------|
| **Cohort** | 기수 (1기, 2기 등). 서비스 시작일, 마감일 관리 |
| **User** | 고객. 기수에 속하며, 자료 제출 및 워크플로우 보유 |
| **Submission** | 자료 제출 (사업자등록증, 프로필 등) |
| **Workflow** | 제작 진행 (명함, 명찰, 계약서, 홈페이지 등) |
| **WorkflowLog** | 워크플로우 상태 변경 이력 |
| **Client** | 광고 클라이언트 (bas_meta 연동, 토큰 관리) |
| **Admin** | 관리자 계정 |

### 3.3 주요 Enum

```typescript
// 자료 제출 상태
SubmissionStatus: DRAFT | SUBMITTED | IN_REVIEW | APPROVED | REJECTED

// 워크플로우 유형
WorkflowType: NAMECARD | NAMETAG | CONTRACT | ENVELOPE | WEBSITE | BLOG | META_ADS | NAVER_ADS

// 워크플로우 상태
WorkflowStatus: PENDING | SUBMITTED | IN_PROGRESS | DESIGN_UPLOADED | ORDER_REQUESTED | ORDER_APPROVED | COMPLETED | SHIPPED | CANCELLED
```

---

## 4. 라우트 구조

### 4.1 고객 페이지

| 경로 | 설명 |
|------|------|
| `/signup` | 5단계 회원가입 (기수선택→이메일→정보→비밀번호→동의) |
| `/login` | 로그인 (기수+이름+연락처+PIN) |
| `/dashboard` | 고객 대시보드 (진행현황 요약) |
| `/submissions` | 자료 제출 (필수/선택 항목) |
| `/dashboard/progress` | 제작 진행 현황 (예정) |
| `/dashboard/analytics` | 광고 성과 (bas_meta 연동, 예정) |

### 4.2 관리자 페이지

| 경로 | 설명 |
|------|------|
| `/admin` | 관리자 대시보드 |
| `/admin/clients` | 광고 클라이언트 관리 |
| `/admin/tokens` | 토큰/인증 관리 |
| `/admin/notifications` | 알림 관리 |
| `/admin/users` | 사용자 관리 (예정) |
| `/admin/cohorts` | 기수 관리 (예정) |
| `/admin/workflows` | 워크플로우 관리 (예정) |

### 4.3 API 엔드포인트

| Method | Endpoint | 설명 | 상태 |
|--------|----------|------|------|
| POST | /api/auth/signup | 회원가입 | ✅ |
| POST | /api/auth/login | 로그인 | ✅ |
| POST | /api/auth/logout | 로그아웃 | ✅ |
| GET/POST | /api/cohorts | 기수 목록/생성 | ✅ |
| GET/POST | /api/clients | 클라이언트 목록/생성 | ✅ |
| GET/PATCH/DELETE | /api/clients/[id] | 클라이언트 상세 | ✅ |
| GET | /api/tokens | 토큰 상태 조회 | ✅ |
| GET/POST | /api/notifications | 알림 로그/발송 | ✅ |
| GET/PUT | /api/submissions | 자료 제출 | 예정 |
| GET/PATCH | /api/workflows | 워크플로우 관리 | 예정 |

---

## 5. 구현 현황

### Phase 1: Core (완료)

- [x] 프로젝트 구조 설정
- [x] Prisma 스키마 (Cohort, User, Submission, Workflow 등)
- [x] 회원가입 API 및 UI (5단계)
- [x] 로그인/로그아웃 API 및 UI
- [x] 고객 대시보드 UI
- [x] 자료 제출 UI
- [x] 관리자 대시보드 UI (기존)

### Phase 2: DB 연동 (다음)

- [ ] Supabase DATABASE_URL 설정
- [ ] `npm run db:push` 실행
- [ ] 초기 기수 데이터 생성
- [ ] 회원가입 → 로그인 테스트

### Phase 3: 자료 제출 완성

- [ ] 파일 업로드 (S3/R2 연동)
- [ ] Submissions API 구현
- [ ] 제출 상태 관리

### Phase 4: 워크플로우 관리

- [ ] Workflows API 구현
- [ ] 관리자 워크플로우 관리 페이지
- [ ] 시안 업로드/발주 기능
- [ ] 상태 변경 알림

### Phase 5: 광고 성과 연동

- [ ] bas_meta 데이터 연동
- [ ] 고객별 광고 성과 대시보드
- [ ] 리포트 발송

### Phase 6: 알림 시스템 완성

- [ ] SMS 알림 (NCP SENS)
- [ ] 이메일 알림 (SendGrid)
- [ ] 자동 알림 스케줄러 (Cron)

---

## 6. 실행 방법

### 6.1 설치

```bash
cd F:\polasales\polarad
npm install
```

### 6.2 환경 변수 설정

```bash
cp .env.example .env
# .env 파일에 실제 값 입력
```

필수 환경 변수:
```
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
TELEGRAM_BOT_TOKEN="your-bot-token"
```

### 6.3 데이터베이스 설정

```bash
npm run db:generate  # Prisma 클라이언트 생성
npm run db:push      # 스키마 적용
```

### 6.4 개발 서버 실행

```bash
npm run dev  # http://localhost:3010
```

---

## 7. 연동 시스템

### 7.1 bas_meta 연동

- 동일한 Supabase 데이터베이스 사용
- `clients` 테이블 공유 (User와 1:1 연결 가능)
- 광고 성과 데이터 조회

### 7.2 알림 채널

| 채널 | 용도 | 상태 |
|------|------|------|
| Telegram | 관리자 알림, 리포트 | ✅ |
| SMS | 마감일, 긴급 알림 | 예정 |
| Email | 시안 완료, 상세 안내 | 예정 |

---

## 8. 다음 작업 우선순위

### 즉시 필요
1. **DATABASE_URL 설정** - Supabase 연결
2. **db:push 실행** - 테이블 생성
3. **기수 생성** - 테스트용 1기 데이터

### 단기 (1주)
4. **파일 업로드** - S3/R2 연동
5. **Submissions API** - 자료 제출 저장/조회
6. **인증 미들웨어** - 페이지별 접근 제어

### 중기 (2주)
7. **관리자 사용자 관리** - 고객 목록, 상태 관리
8. **워크플로우 관리** - 시안/발주 프로세스
9. **알림 자동화** - 마감일 리마인더

---

**문서 버전**: 2.0.0
**최종 수정**: 2025-12-01
**작성자**: Claude (Opus 4.5)
