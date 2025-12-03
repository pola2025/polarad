# Polarad 마케팅 패키지 - PRD (Product Requirements Document)

## 문서 정보
- **프로젝트명**: Polarad 마케팅 패키지
- **버전**: 2.0.0
- **작성일**: 2025-12-01
- **최종 수정**: 2025-12-02
- **변경 사항**: 프로젝트 분리 구조 (관리자/사용자)

---

## 1. 프로젝트 개요

### 1.1 목적
Polarad 마케팅 패키지는 **광고 마케팅 서비스를 이용하는 고객**을 위한 통합 관리 시스템입니다.
고객이 필요한 자료를 제출하고, 제작 진행 상황을 실시간으로 확인하며, 광고 성과를 모니터링할 수 있는 플랫폼입니다.

### 1.2 핵심 가치
- **원스톱 서비스**: 자료 제출 → 제작 → 광고 운영 → 성과 리포트까지 한 곳에서
- **실시간 진행 현황**: 제작 단계별 상태 확인 및 알림
- **광고 성과 대시보드**: Meta 광고 성과 실시간 모니터링 (bas_meta 연동)

### 1.3 대상 사용자
| 사용자 유형 | 설명 | 접근 경로 |
|------------|------|----------|
| **고객 (Client)** | 마케팅 서비스를 이용하는 사업자/개인 | client.polarad.co.kr |
| **관리자 (Admin)** | 서비스 운영, 제작 관리, 알림 발송 담당 | admin.polarad.co.kr |

---

## 2. 시스템 아키텍처 (v2.0 - 프로젝트 분리)

### 2.1 전체 구조

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Supabase PostgreSQL                                 │
│                              (공유 데이터베이스)                               │
│                                                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │   users     │ │ submissions │ │  workflows  │ │  contracts              ││
│  │   admins    │ │ clients     │ │ workflow_   │ │  contract_logs          ││
│  │   packages  │ │ submissions │ │    logs     │ │  meta_raw_data          ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
                          ▲                    ▲
                          │                    │
            ┌─────────────┴─────────┐  ┌──────┴──────────────┐
            │                       │  │                      │
┌───────────┴───────────┐   ┌──────┴──┴───────────┐
│                       │   │                      │
│  admin.polarad.co.kr  │   │ client.polarad.co.kr │
│                       │   │                      │
│  ┌─────────────────┐  │   │  ┌────────────────┐  │
│  │ 관리자 프로젝트    │  │   │  │ 사용자 프로젝트  │  │
│  │ (polarad)       │  │   │  │ (polarad-client)│  │
│  └─────────────────┘  │   │  └────────────────┘  │
│                       │   │                      │
│  • 관리자 로그인       │   │  • 사용자 로그인/가입  │
│  • 사용자 관리        │   │  • 계약 요청          │
│  • 계약 승인/거절     │   │  • 자료 제출          │
│  • 워크플로우 관리    │   │  • 진행 현황 확인     │
│  • 클라이언트 관리    │   │  • 광고 성과 조회     │
│  • 토큰/알림 관리     │   │  • 알림 수신          │
│  • Meta 데이터 수집   │   │                      │
│                       │   │                      │
└───────────────────────┘   └──────────────────────┘
        Vercel                      Vercel
```

### 2.2 Monorepo 구조 (Turborepo + pnpm)

> **참고**: polarad.co.kr(랜딩 페이지)는 별도 관리하며 이 Monorepo에 포함하지 않습니다.

```
polarad/                          # GitHub: polasales/polarad
├── apps/
│   ├── admin/                    # admin.polarad.co.kr
│   │   ├── app/
│   │   │   ├── (dashboard)/      # 대시보드 (인증 필요)
│   │   │   │   ├── page.tsx      # 메인 대시보드
│   │   │   │   ├── users/        # 사용자 관리
│   │   │   │   ├── contracts/    # 계약 관리
│   │   │   │   ├── workflows/    # 워크플로우 관리
│   │   │   │   ├── clients/      # Meta 클라이언트 관리
│   │   │   │   ├── tokens/       # 토큰 관리
│   │   │   │   ├── notifications/# 알림 관리
│   │   │   │   └── settings/     # 설정
│   │   │   ├── login/            # 관리자 로그인
│   │   │   ├── unauthorized/     # 권한 없음
│   │   │   └── api/              # 관리자 API
│   │   │       ├── auth/admin/
│   │   │       ├── admin/        # 관리자 전용 API
│   │   │       ├── users/
│   │   │       ├── clients/
│   │   │       ├── tokens/
│   │   │       ├── workflows/
│   │   │       └── notifications/
│   │   ├── public/
│   │   │   └── robots.txt        # 검색엔진 차단
│   │   └── package.json
│   │
│   └── client/                   # client.polarad.co.kr
│       ├── app/
│       │   ├── page.tsx          # 로그인 리다이렉트
│       │   ├── login/            # 사용자 로그인
│       │   ├── signup/           # 회원가입 (4단계)
│       │   ├── dashboard/        # 대시보드 (인증 필요)
│       │   │   ├── page.tsx      # 메인
│       │   │   ├── contract/     # 계약 요청
│       │   │   ├── contracts/    # 계약 목록
│       │   │   ├── submissions/  # 자료 제출
│       │   │   ├── progress/     # 진행 현황
│       │   │   └── analytics/    # 광고 성과
│       │   └── api/              # 사용자 API
│       │       ├── auth/         # login, signup, logout
│       │       ├── user/         # profile, dashboard, workflows
│       │       ├── contracts/
│       │       ├── submissions/
│       │       └── upload/
│       ├── public/
│       │   └── robots.txt        # 검색엔진 차단
│       └── package.json
│
├── packages/
│   ├── database/                 # @polarad/database
│   │   ├── prisma/
│   │   │   └── schema.prisma     # 공유 스키마
│   │   ├── src/
│   │   │   └── index.ts          # Prisma client export
│   │   └── package.json
│   │
│   ├── ui/                       # @polarad/ui
│   │   ├── src/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── config/                   # @polarad/config
│       ├── eslint/
│       ├── typescript/
│       └── package.json
│
├── package.json                  # 루트 (workspaces)
├── pnpm-workspace.yaml
├── turbo.json
└── .gitignore
```

### 2.3 검색엔진 및 AI 크롤링 차단

> **중요**: admin과 client 앱은 내부 시스템이므로 검색엔진 및 AI 크롤러 접근을 차단합니다.

#### robots.txt (apps/admin/public, apps/client/public)
```txt
# 모든 검색엔진 및 AI 크롤러 차단
User-agent: *
Disallow: /

# AI 크롤러 명시적 차단
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Amazonbot
Disallow: /
```

#### Next.js 메타데이터 설정 (각 앱의 layout.tsx)
```typescript
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};
```

#### HTTP 헤더 설정 (next.config.js)
```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
      ],
    },
  ];
}
```

### 2.4 데이터 흐름

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              데이터 흐름 다이어그램                             │
└──────────────────────────────────────────────────────────────────────────────┘

[사용자] client.polarad.co.kr          [관리자] admin.polarad.co.kr
         │                                      │
         │ 1. 회원가입                            │
         ├────────────────→ users 테이블 ←───────┤ 사용자 목록 조회
         │                                      │
         │ 2. 계약 요청                           │
         ├────────────────→ contracts ←─────────┤ 계약 승인/거절
         │                  (PENDING)           │ (APPROVED/REJECTED)
         │                                      │
         │ 3. 자료 제출                           │
         ├────────────────→ submissions ←───────┤ 제출 자료 확인
         │                  + S3 파일            │
         │                      │               │
         │                      ▼               │
         │               4. 워크플로우 생성        │
         │                  workflows ←─────────┤ 상태 변경, 시안 업로드
         │                      │               │
         │                      ▼               │
         │ 5. 진행 현황 확인     │               │
         │←─────────────────────┘               │
         │                                      │
         │ 6. 광고 성과 조회                       │
         ├────────────────→ meta_raw_data ←─────┤ Meta API 데이터 수집
         │                                      │ (Cron Job)
         │                                      │
         │ 7. 알림 수신                           │
         │←───────────────── notifications ←────┤ 알림 발송
         │                  (Telegram/SMS/Email) │
```

---

## 3. 기능 상세

### 3.1 사용자 영역 (client.polarad.co.kr)

#### 3.1.1 회원가입/로그인
| 기능 | 설명 | 상태 |
|------|------|------|
| 회원가입 | 4단계 마법사 (기본정보→연락처→비밀번호→알림동의) | ✅ 구현완료 |
| 로그인 | 클라이언트명 + 연락처 + PIN | ✅ 구현완료 |
| 로그아웃 | 세션 종료 | ✅ 구현완료 |

#### 3.1.2 대시보드
| 기능 | 설명 | 상태 |
|------|------|------|
| 환영 메시지 | 사용자명, 회사명 표시 | ✅ 구현완료 |
| 진행률 | 자료 제출 진행률 % | ✅ 구현완료 |
| 빠른 액션 | 자료 제출, 진행현황 링크 | ✅ 구현완료 |
| 자료 제출 현황 | 프로그레스바 + 항목 리스트 | ✅ 구현완료 |
| 제작 진행 현황 | 워크플로우 상태 표시 | ✅ 구현완료 |

#### 3.1.3 계약 요청
| 기능 | 설명 | 상태 |
|------|------|------|
| 패키지 선택 | 패키지 목록 조회 및 선택 | ✅ 구현완료 |
| 계약 정보 입력 | 사업자 정보, 담당자 정보 | ✅ 구현완료 |
| 전자 서명 | 캔버스 기반 서명 | ✅ 구현완료 |
| 계약 제출 | 계약번호 생성, 이메일 발송 | ✅ 구현완료 |
| 계약 목록 | 내 계약 목록 조회 | ✅ 구현완료 |
| 계약 상세 | 계약 상세 정보, PDF 다운로드 | ✅ 구현완료 |

#### 3.1.4 자료 제출
| 기능 | 설명 | 상태 |
|------|------|------|
| 필수 자료 | 사업자등록증, 프로필사진, 브랜드명 등 6개 | ✅ 구현완료 |
| 선택 자료 | 배송지, 웹사이트 스타일 등 5개 | ✅ 구현완료 |
| 파일 업로드 | S3/R2 presigned URL 방식 | ✅ 구현완료 |
| 자동 저장 | DRAFT/SUBMITTED 상태 관리 | ✅ 구현완료 |

#### 3.1.5 진행 현황
| 기능 | 설명 | 상태 |
|------|------|------|
| 워크플로우 목록 | 8가지 타입 지원 | ✅ 구현완료 |
| 단계별 진행도 | 타입별 다른 단계 | ✅ 구현완료 |
| 시안 확인 | 이미지 링크, 승인/수정 요청 | ✅ 구현완료 |
| 배송 조회 | 5개 택배사 지원 | ✅ 구현완료 |

#### 3.1.6 광고 성과
| 기능 | 설명 | 상태 |
|------|------|------|
| 요약 카드 | 노출수, 클릭, 광고비, 전환 | ⚠️ UI만 완성 |
| 캠페인 테이블 | 캠페인별 성과 | ⚠️ 더미 데이터 |
| Meta API 연동 | 실제 데이터 조회 | ❌ 미구현 |

#### 3.1.7 프로필/알림
| 기능 | 설명 | 상태 |
|------|------|------|
| 프로필 조회 | 내 정보 확인 | ✅ 구현완료 |
| 프로필 수정 | 정보 수정 | ❌ 미구현 |
| 알림 센터 | 알림 목록 | ❌ 미구현 |

### 3.2 관리자 영역 (admin.polarad.co.kr)

#### 3.2.1 대시보드
| 기능 | 설명 | 상태 |
|------|------|------|
| 통계 카드 | 사용자, 클라이언트, 토큰, 워크플로우 | ✅ 구현완료 |
| 최근 워크플로우 | 최근 5건 | ✅ 구현완료 |
| 토큰 만료 임박 | 14일 이내 만료 | ✅ 구현완료 |

#### 3.2.2 사용자 관리
| 기능 | 설명 | 상태 |
|------|------|------|
| 목록 조회 | 검색, 필터, 페이지네이션 | ✅ 구현완료 |
| 상세 조회 | 기본정보, 제출자료, 워크플로우 | ✅ 구현완료 |
| 수정 | 사용자 정보 수정 | ✅ 구현완료 |
| 비활성화 | 사용자 비활성화 | ✅ 구현완료 |

#### 3.2.3 계약 관리
| 기능 | 설명 | 상태 |
|------|------|------|
| 목록 조회 | 상태별 필터, 통계 | ✅ 구현완료 |
| 상세 조회 | 계약 정보, 타임라인 | ✅ 구현완료 |
| 승인/거절 | 계약 처리, 거절 사유 | ✅ 구현완료 |
| PDF 다운로드 | 계약서 PDF 생성 | ✅ 구현완료 |

#### 3.2.4 워크플로우 관리
| 기능 | 설명 | 상태 |
|------|------|------|
| 목록 조회 | 유형별, 상태별 필터 | ✅ 구현완료 |
| 상세 조회 | 진행 단계, 시안, 배송 정보 | ✅ 구현완료 |
| 상태 변경 | 드롭다운 상태 변경 | ✅ 구현완료 |
| 시안 업로드 | 시안 URL 등록 | ✅ 구현완료 |

#### 3.2.5 클라이언트 관리 (Meta)
| 기능 | 설명 | 상태 |
|------|------|------|
| 목록 조회 | 클라이언트 목록 | ✅ 구현완료 |
| 상세 조회 | Meta 토큰, 서비스 기간 | ✅ 구현완료 |
| 토큰 관리 | 토큰 갱신, 상태 확인 | ✅ 구현완료 |
| CRUD | 생성, 수정, 삭제 | ✅ 구현완료 |

#### 3.2.6 토큰/알림/설정
| 기능 | 설명 | 상태 |
|------|------|------|
| 토큰 관리 | 만료 임박/만료됨/재인증 필요 | ✅ 구현완료 |
| 알림 관리 | 발송 이력, 일괄 발송 | ✅ 구현완료 |
| 설정 | 텔레그램, 이메일 설정 | ✅ 구현완료 |

---

## 4. 기술 스택

### 4.1 공통
| 영역 | 기술 |
|------|------|
| Language | TypeScript |
| Framework | Next.js 15 (App Router) |
| UI | Tailwind CSS, shadcn/ui |
| ORM | Prisma |
| Database | PostgreSQL (Supabase) |
| File Storage | Cloudflare R2 / AWS S3 |
| Hosting | Vercel |

### 4.2 관리자 전용
| 영역 | 기술 |
|------|------|
| Meta API | Graph API v22.0 |
| 토큰 암호화 | AES-256-CBC |
| 알림 | Telegram Bot API |
| 이메일 | Resend |
| Cron | Vercel Cron / Railway |

### 4.3 사용자 전용
| 영역 | 기술 |
|------|------|
| 전자서명 | Canvas API |
| PDF | @react-pdf/renderer |
| 파일업로드 | Presigned URL |

---

## 5. 데이터베이스 스키마

### 5.1 핵심 테이블

```prisma
// 사용자 (고객)
model User {
  id              String   @id @default(cuid())
  clientName      String   // 업체명
  name            String   // 담당자명
  email           String   @unique
  phone           String
  password        String   // bcrypt 해시
  smsConsent      Boolean
  emailConsent    Boolean
  telegramEnabled Boolean
  telegramChatId  String?
  isActive        Boolean  @default(true)
  lastLoginAt     DateTime?
  clientId        String?  @unique // Client 연결

  submission      Submission?
  workflows       Workflow[]
  contracts       Contract[]
  notifications   UserNotification[]
}

// 관리자
model Admin {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String
  password  String
  role      AdminRole // SUPER, MANAGER, OPERATOR
  isActive  Boolean   @default(true)
}

// 클라이언트 (Meta 광고 계정)
model Client {
  id                 String     @id @default(cuid())
  clientId           String     @unique
  clientName         String
  email              String     @unique
  metaAdAccountId    String?
  metaAccessToken    String?    // 암호화 저장
  metaRefreshToken   String?
  tokenExpiresAt     DateTime?
  authStatus         AuthStatus // ACTIVE, AUTH_REQUIRED, TOKEN_EXPIRED
  servicePeriodStart DateTime?
  servicePeriodEnd   DateTime?
  telegramChatId     String?
  telegramEnabled    Boolean    @default(false)
  planType           PlanType
  isActive           Boolean    @default(true)

  user               User?
  notificationLogs   NotificationLog[]
  tokenRefreshLogs   TokenRefreshLog[]
}

// 계약
model Contract {
  id              String         @id @default(cuid())
  contractNumber  String         @unique
  userId          String
  packageId       String
  companyName     String
  ceoName         String
  businessNumber  String
  address         String
  contactName     String
  contactPhone    String
  contactEmail    String
  contractPeriod  Int            @default(12)
  monthlyFee      Int
  setupFee        Int            @default(0)
  totalAmount     Int
  startDate       DateTime?
  endDate         DateTime?
  clientSignature String?        // base64
  signedAt        DateTime?
  status          ContractStatus // PENDING, SUBMITTED, APPROVED, REJECTED, ACTIVE
  approvedAt      DateTime?
  approvedBy      String?
  rejectedAt      DateTime?
  rejectReason    String?

  user            User
  package         Package
  logs            ContractLog[]
}

// 자료 제출
model Submission {
  id              String  @id @default(cuid())
  userId          String  @unique
  businessLicense String? // S3 URL
  profilePhoto    String?
  brandName       String?
  contactEmail    String?
  contactPhone    String?
  bankAccount     String?
  deliveryAddress String?
  websiteStyle    String?
  websiteColor    String?
  blogDesignNote  String?
  additionalNote  String?
  status          SubmissionStatus
  isComplete      Boolean @default(false)
  completedAt     DateTime?

  user            User
}

// 워크플로우
model Workflow {
  id               String         @id @default(cuid())
  userId           String
  type             WorkflowType   // NAMECARD, NAMETAG, CONTRACT, ENVELOPE, WEBSITE, BLOG, META_ADS
  status           WorkflowStatus // PENDING, SUBMITTED, IN_PROGRESS, DESIGN_UPLOADED, ORDER_REQUESTED, ORDER_APPROVED, COMPLETED, SHIPPED
  designUrl        String?
  finalUrl         String?
  courier          String?
  trackingNumber   String?
  revisionCount    Int            @default(0)
  revisionNote     String?
  adminNote        String?

  user             User
  logs             WorkflowLog[]
}

// Meta 광고 데이터 (향후 추가)
model MetaRawData {
  id           BigInt   @id @default(autoincrement())
  clientId     String
  date         DateTime @db.Date
  adId         String
  adName       String
  campaignId   String
  campaignName String
  platform     String   // facebook, instagram
  device       String   // mobile, desktop
  impressions  Int
  reach        Int
  clicks       Int
  leads        Int
  spend        Decimal

  @@unique([clientId, date, adId, platform, device])
  @@index([clientId, date])
}
```

---

## 6. 개발 로드맵

### Phase 1: Monorepo 전환 (현재)
- [x] PRD 문서 업데이트 (Monorepo 구조)
- [ ] Turborepo + pnpm workspace 설정
- [ ] packages/database 설정 (공유 Prisma)
- [ ] packages/ui 설정 (공유 컴포넌트)
- [ ] apps/admin 생성 및 관리자 코드 이동
- [ ] apps/client 생성 및 사용자 코드 이동
- [ ] robots.txt 및 검색 제외 설정

### Phase 2: 앱별 정리 및 최적화
- [ ] admin: 라우팅 구조 정리
- [ ] admin: RBAC 권한 시스템 강화
- [ ] client: 프로필 수정 기능
- [ ] client: 알림 센터 기능
- [ ] 공통: Toast 알림 전환 (alert → toast)

### Phase 3: Meta API 연동
- [ ] Prisma 스키마에 Meta 테이블 추가
- [ ] lib/meta 모듈 구현
- [ ] Meta API 엔드포인트 구현
- [ ] 광고 성과 페이지 실데이터 연동
- [ ] 데이터 수집 Cron Job 설정

### Phase 4: 배포 및 최적화
- [ ] Vercel 배포 설정 (각 앱별 프로젝트)
- [ ] 도메인 연결 (admin/client.polarad.co.kr)
- [ ] 성능 최적화
- [ ] 보안 강화

---

## 7. 환경 변수

### 7.1 공통
```bash
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=...
```

### 7.2 관리자 프로젝트
```bash
# Meta API
META_APP_ID=
META_APP_SECRET=

# 토큰 암호화
TOKEN_ENCRYPTION_KEY=<64자 hex>

# Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHAT_ID=

# Email (Resend)
RESEND_API_KEY=

# AI (선택)
GEMINI_API_KEY=
```

### 7.3 사용자 프로젝트
```bash
# File Upload
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_ENDPOINT=
```

---

## 8. 배포 계획

### 8.1 Monorepo 구조

> **참고**: polarad.co.kr(랜딩 페이지)는 별도 프로젝트로 관리합니다.

```
polarad/                          # GitHub: polasales/polarad
├── apps/
│   ├── admin/                    # 관리자 페이지
│   │   ├── app/
│   │   ├── public/robots.txt     # 검색 제외
│   │   ├── package.json
│   │   └── ...
│   └── client/                   # 사용자(고객) 페이지
│       ├── app/
│       ├── public/robots.txt     # 검색 제외
│       ├── package.json
│       └── ...
├── packages/
│   ├── database/                 # 공유 Prisma 스키마
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── package.json
│   ├── ui/                       # 공유 UI 컴포넌트
│   │   └── package.json
│   └── config/                   # 공유 설정 (ESLint, TypeScript)
│       └── package.json
├── package.json                  # 루트 package.json
├── turbo.json                    # Turborepo 설정
└── pnpm-workspace.yaml           # pnpm workspace 설정
```

### 8.2 배포 정보

| 앱 | 도메인 | Vercel 프로젝트 | 역할 | 경로 | 검색 노출 |
|-----|--------|----------------|------|------|----------|
| admin | admin.polarad.co.kr | polarad-admin | 관리자 대시보드 | apps/admin | ❌ 차단 |
| client | client.polarad.co.kr | polarad-client | 사용자 대시보드 | apps/client | ❌ 차단 |
| web | polarad.co.kr | polarad-web (별도) | 랜딩 페이지 | 별도 관리 | ✅ 허용 |

### 8.3 GitHub Repository

- **Repository**: polasales/polarad
- **구조**: Monorepo (Turborepo + pnpm)
- **브랜치 전략**: main → develop → feature/*

---

## 9. 성공 지표 (KPI)

| 지표 | 목표 |
|------|------|
| 자료 제출 완료율 | 95% 이상 |
| 계약 승인 처리 시간 | 24시간 이내 |
| 시스템 가동률 | 99.9% |
| 알림 발송 성공률 | 99% 이상 |

---

**문서 끝**
