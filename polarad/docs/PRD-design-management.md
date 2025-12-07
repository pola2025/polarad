# PRD: 시안 관리 시스템

## 1. 개요

### 1.1 배경
현재 워크플로우 시스템에서 시안(디자인) 관리가 단순 URL 저장 방식으로 운영되고 있어, 시안 버전 관리와 고객 피드백 추적이 어렵습니다.

### 1.2 목표
- 워크플로우와 시안 관리를 분리하여 체계적인 시안 버전 관리 제공
- 클라이언트별 시안 목록 페이지 제공 (명함, 대봉투, 명찰, 계약서 등)
- 쓰레드 형태의 피드백 시스템으로 최초 내용부터 확정까지 추적 가능

### 1.3 범위
| 구분 | 포함 | 제외 |
|------|------|------|
| 시안 | 버전 관리, 피드백, 승인/수정요청 | 파일 직접 업로드 (URL 방식 유지) |
| 워크플로우 | 상태 관리는 기존 유지 | 시안 URL 필드 제거 |
| 알림 | 시안 업로드 시 고객 알림 | - |

---

## 2. 용어 정의

| 용어 | 설명 |
|------|------|
| Design (시안) | 특정 워크플로우에 대한 디자인 결과물 (버전별 관리) |
| DesignVersion | 시안의 각 버전 (v1, v2, ... 최종) |
| DesignFeedback | 시안에 대한 고객/관리자 피드백 (쓰레드 형태) |
| 확정 | 고객이 시안을 최종 승인한 상태 |

---

## 3. 기능 요구사항

### 3.1 시안 버전 관리

#### FR-001: 시안 생성
- 관리자가 워크플로우에 대해 시안(Design)을 생성
- 시안 생성 시 첫 번째 버전(DesignVersion v1) 자동 생성
- 시안 URL 입력 (Google Drive, Dropbox 등 외부 링크)

#### FR-002: 시안 버전 추가
- 수정 요청 후 새 버전 업로드 가능 (v2, v3, ...)
- 각 버전별 URL, 업로드 일시, 업로드자 기록
- 이전 버전 히스토리 조회 가능

#### FR-003: 시안 상태 관리
| 상태 | 설명 |
|------|------|
| DRAFT | 임시저장 (고객에게 미공개) |
| PENDING_REVIEW | 고객 확인 대기 |
| REVISION_REQUESTED | 수정 요청됨 |
| APPROVED | 고객 확정 |

### 3.2 피드백 시스템

#### FR-004: 피드백 작성
- 고객: 시안에 대한 수정 요청 또는 의견 작성
- 관리자: 고객 피드백에 대한 답변 작성
- 쓰레드 형태로 대화 이력 유지

#### FR-005: 피드백 구조
```
Design (시안)
└── DesignVersion v1
    └── Feedback: "로고 위치를 왼쪽으로 옮겨주세요" (고객)
    └── Feedback: "수정하여 v2로 업로드했습니다" (관리자)
└── DesignVersion v2
    └── Feedback: "좋습니다. 확정합니다" (고객)
    └── [확정 처리됨]
```

### 3.3 고객 페이지

#### FR-006: 시안 목록 페이지 (Client)
- 클라이언트별 시안 목록 표시
- 워크플로우 타입별 그룹핑 (명함, 대봉투, 명찰, 계약서)
- 각 시안의 현재 상태 표시

#### FR-007: 시안 상세 페이지 (Client)
- 현재 버전 시안 미리보기/링크
- 버전 히스토리 (v1 → v2 → 최종)
- 피드백 쓰레드 표시
- 승인/수정요청 버튼

### 3.4 관리자 페이지

#### FR-008: 시안 관리 목록 (Admin)
- 전체 시안 목록 (필터: 상태, 고객, 타입)
- 확인 대기 중인 시안 우선 표시
- 수정 요청된 시안 알림 표시

#### FR-009: 시안 상세 관리 (Admin)
- 새 버전 업로드
- 피드백 확인 및 답변
- 시안 상태 변경
- 확정 시 워크플로우 상태 자동 업데이트

### 3.5 알림 (Slack + Telegram 연동)

#### FR-010: 시안 업로드 알림
- 관리자가 시안 업로드 + 확인요청 시 알림 발송
- **고객 채널 (Telegram)**:
  - "[업체명] 명함 시안이 업로드되었습니다. 확인해주세요."
  - 시안 확인 페이지 링크 포함
- **관리자 채널 (Slack)**:
  - `#design-notifications` 채널에 알림
  - "[업체명] 명함 시안 v1 업로드 완료"

#### FR-011: 피드백 알림
- **고객 → 관리자 (Slack)**:
  - 고객이 피드백 작성 시 Slack 알림
  - 고객이 수정 요청 시 Slack 알림 (긴급 표시)
  - 고객이 시안 확정 시 Slack 알림
- **관리자 → 고객 (Telegram)**:
  - 관리자가 답변 작성 시 Telegram 알림
  - 새 버전 업로드 시 Telegram 알림

#### FR-012: 알림 이벤트 매트릭스

| 이벤트 | 고객 (Telegram) | 관리자 (Slack) |
|--------|----------------|----------------|
| 시안 업로드 (확인요청) | ✅ 알림 | ✅ 로그 |
| 고객 피드백 작성 | - | ✅ 알림 |
| 고객 수정 요청 | - | ✅ 긴급 알림 |
| 고객 시안 확정 | - | ✅ 알림 |
| 관리자 답변 | ✅ 알림 | - |
| 새 버전 업로드 | ✅ 알림 | ✅ 로그 |

#### FR-013: Slack 채널 구성
- 기존 Submission에서 사용하는 Slack 채널 활용 (slackChannelId)
- 또는 전용 채널 `#design-reviews` 사용
- 메시지 포맷:
```
🎨 [시안 알림] 테스트업체
━━━━━━━━━━━━━━━━━━━━━
📋 타입: 명함
📌 상태: 수정 요청
💬 고객 메시지:
"로고 색상을 파란색으로 변경해주세요"

🔗 시안 관리 바로가기
━━━━━━━━━━━━━━━━━━━━━
```

---

## 4. 데이터 모델

### 4.1 새로운 테이블

```prisma
// 시안 (워크플로우당 1개)
model Design {
  id           String          @id @default(cuid())
  workflowId   String          @unique @map("workflow_id")
  status       DesignStatus    @default(DRAFT)
  currentVersion Int           @default(1) @map("current_version")
  approvedAt   DateTime?       @map("approved_at")
  approvedVersion Int?         @map("approved_version")
  createdAt    DateTime        @default(now()) @map("created_at")
  updatedAt    DateTime        @updatedAt @map("updated_at")

  workflow     Workflow        @relation(fields: [workflowId], references: [id], onDelete: Cascade)
  versions     DesignVersion[]

  @@index([workflowId])
  @@index([status])
  @@map("designs")
}

// 시안 버전
model DesignVersion {
  id           String            @id @default(cuid())
  designId     String            @map("design_id")
  version      Int               // 1, 2, 3, ...
  url          String            // 시안 URL
  note         String?           // 버전 메모 (변경사항 등)
  uploadedBy   String            @map("uploaded_by") // admin ID
  createdAt    DateTime          @default(now()) @map("created_at")

  design       Design            @relation(fields: [designId], references: [id], onDelete: Cascade)
  feedbacks    DesignFeedback[]

  @@unique([designId, version])
  @@index([designId])
  @@map("design_versions")
}

// 시안 피드백 (쓰레드)
model DesignFeedback {
  id           String         @id @default(cuid())
  versionId    String         @map("version_id")
  authorId     String         @map("author_id")
  authorType   String         // "user" | "admin"
  authorName   String         @map("author_name")
  content      String
  createdAt    DateTime       @default(now()) @map("created_at")

  version      DesignVersion  @relation(fields: [versionId], references: [id], onDelete: Cascade)

  @@index([versionId])
  @@index([createdAt])
  @@map("design_feedbacks")
}

enum DesignStatus {
  DRAFT             // 임시저장
  PENDING_REVIEW    // 확인 대기
  REVISION_REQUESTED // 수정 요청
  APPROVED          // 확정
}
```

### 4.2 기존 테이블 수정

```prisma
model Workflow {
  // ... 기존 필드 유지

  // 추가
  design       Design?

  // designUrl, revisionCount, revisionNote 필드는
  // Design 모델로 이관 후 deprecated 처리 (하위호환)
}
```

### 4.3 UserNotificationType 추가

```prisma
enum UserNotificationType {
  // 기존 값 유지
  DESIGN_UPLOADED    // 시안 업로드됨
  DESIGN_FEEDBACK    // 피드백 알림 (추가)
  DESIGN_APPROVED    // 시안 확정됨 (추가)
}
```

---

## 5. API 설계

### 5.1 Admin API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/admin/designs | 시안 목록 조회 |
| GET | /api/admin/designs/:id | 시안 상세 조회 |
| POST | /api/admin/designs | 시안 생성 (첫 버전 포함) |
| POST | /api/admin/designs/:id/versions | 새 버전 업로드 |
| PATCH | /api/admin/designs/:id/status | 시안 상태 변경 |
| POST | /api/admin/designs/:id/feedback | 피드백 작성 |

### 5.2 Client API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/designs | 내 시안 목록 조회 |
| GET | /api/designs/:id | 시안 상세 조회 |
| POST | /api/designs/:id/approve | 시안 확정 |
| POST | /api/designs/:id/request-revision | 수정 요청 |
| POST | /api/designs/:id/feedback | 피드백 작성 |

---

## 6. UI/UX 설계

### 6.1 Client - 시안 목록 페이지 (/designs)

```
┌─────────────────────────────────────────────────────────┐
│  내 시안 관리                                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │ 📇 명함         │  │ 📋 계약서       │              │
│  │ 확인 대기       │  │ 확정 완료       │              │
│  │ v2 · 2일 전     │  │ v1 · 5일 전     │              │
│  │ [시안 확인 →]   │  │ [상세 보기 →]   │              │
│  └─────────────────┘  └─────────────────┘              │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │ 📦 대봉투       │  │ 🏷️ 명찰         │              │
│  │ 수정 진행중     │  │ 준비중          │              │
│  │ v1 · 3일 전     │  │ -               │              │
│  │ [상세 보기 →]   │  │ [대기중]        │              │
│  └─────────────────┘  └─────────────────┘              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Client - 시안 상세 페이지 (/designs/:id)

```
┌─────────────────────────────────────────────────────────┐
│  ← 목록으로    📇 명함 시안    [확인 대기]              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  현재 버전: v2                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │           [시안 미리보기 또는 링크]              │   │
│  │                                                 │   │
│  │    🔗 시안 확인하기 (새 탭에서 열기)             │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │ ✅ 시안 확정  │  │ ✏️ 수정 요청  │                    │
│  └──────────────┘  └──────────────┘                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  📜 버전 히스토리                                       │
│                                                         │
│  ● v2 (현재) · 2024.12.05                              │
│    └ 로고 위치 수정                                     │
│                                                         │
│  ○ v1 · 2024.12.03                                     │
│    └ 최초 시안                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  💬 피드백                                              │
│                                                         │
│  ┌─ v1 ─────────────────────────────────────────────┐  │
│  │ 👤 나: 로고 위치를 왼쪽으로 옮겨주세요 (12/04)   │  │
│  │ 👨‍💼 관리자: 수정하여 v2로 업로드했습니다 (12/05) │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─ v2 ─────────────────────────────────────────────┐  │
│  │ 피드백을 입력하세요...                           │  │
│  │                                          [전송]  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 6.3 Admin - 시안 관리 목록 (/admin/designs)

```
┌─────────────────────────────────────────────────────────┐
│  시안 관리                                              │
├─────────────────────────────────────────────────────────┤
│  상태: [전체 ▼]  타입: [전체 ▼]  검색: [__________]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ⚠️ 확인 대기 (3건)                                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 테스트업체 · 명함 · v2 · 2일 전                  │  │
│  │ 수정 요청: "로고 색상 변경해주세요"              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ABC회사 · 대봉투 · v1 · 3일 전                   │  │
│  │ 확인 대기중                                      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ✅ 확정 완료                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │ XYZ기업 · 계약서 · v1 · 5일 전 확정              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 6.4 Admin - 시안 상세 관리 (/admin/designs/:id)

```
┌─────────────────────────────────────────────────────────┐
│  ← 목록    테스트업체 · 명함    [수정 요청됨]           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────┬───────────────────────┐   │
│  │ 현재 시안 (v2)          │ 새 버전 업로드        │   │
│  │                         │                       │   │
│  │ 🔗 시안 보기            │ URL: [____________]   │   │
│  │                         │ 메모: [____________]  │   │
│  │ 업로드: 2024.12.05      │                       │   │
│  │ 상태: 수정 요청됨       │ [v3 업로드]           │   │
│  │                         │                       │   │
│  │ [확인요청 발송]         │                       │   │
│  └─────────────────────────┴───────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  📜 버전 히스토리                           [전체 보기] │
│  ● v2 · 12/05 · 로고 위치 수정                         │
│  ○ v1 · 12/03 · 최초 시안                              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  💬 피드백 (v2)                                         │
│                                                         │
│  👤 고객: 로고 색상을 파란색으로 변경해주세요 (12/06)   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 답변 입력...                             [전송]  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 7. 워크플로우 연동

### 7.1 상태 전환 매핑

| 시안 상태 변경 | 워크플로우 상태 변경 |
|---------------|---------------------|
| DRAFT → PENDING_REVIEW | IN_PROGRESS → DESIGN_UPLOADED |
| PENDING_REVIEW → REVISION_REQUESTED | (상태 유지) |
| PENDING_REVIEW → APPROVED | DESIGN_UPLOADED → ORDER_REQUESTED |

### 7.2 기존 워크플로우 페이지 수정

**Admin 워크플로우 상세 페이지**
- "시안 업로드" 버튼 → "시안 관리로 이동" 링크로 변경
- 시안 상태 배지 표시

**Client 워크플로우 페이지**
- 시안 확인 시 시안 상세 페이지로 이동

---

## 8. 마이그레이션 계획

### 8.1 데이터 마이그레이션

1. 기존 `designUrl`이 있는 워크플로우 → Design + DesignVersion 생성
2. 기존 `revisionNote` → DesignFeedback으로 이관
3. 기존 `revisionCount` → Design.currentVersion으로 이관

### 8.2 하위 호환성

- Workflow.designUrl 필드는 deprecated로 유지 (삭제하지 않음)
- 기존 API는 유지, 신규 API와 병행 운영

---

## 9. 구현 우선순위

### Phase 1: 기본 구조 (필수)
1. DB 스키마 추가 (Design, DesignVersion, DesignFeedback)
2. Admin 시안 목록/상세 페이지
3. Client 시안 목록/상세 페이지
4. 기본 CRUD API

### Phase 2: 피드백 시스템
1. 피드백 작성 기능
2. 피드백 알림 (텔레그램)

### Phase 3: 워크플로우 연동
1. 시안 상태 ↔ 워크플로우 상태 연동
2. 기존 데이터 마이그레이션

---

## 10. 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | Next.js 15, React 19, TailwindCSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| 고객 알림 | Telegram Bot API |
| 관리자 알림 | Slack Webhook / Slack API |

### 10.1 Slack 연동 방식

**Option A: Incoming Webhook (간단)**
- Slack App에서 Incoming Webhook URL 생성
- 채널별 Webhook URL 사용
- 단방향 알림만 가능

**Option B: Slack API (권장)**
- Bot Token 사용 (`xoxb-...`)
- 채널 동적 지정 가능
- 쓰레드 답글, 반응 추가 등 확장 가능

### 10.2 환경 변수

```env
# Slack
SLACK_BOT_TOKEN=xoxb-...
SLACK_DESIGN_CHANNEL_ID=C0XXXXXXX  # #design-reviews

# Telegram (기존)
TELEGRAM_BOT_TOKEN=...
```

---

## 11. 체크리스트

### 구현 전 확인
- [ ] PRD 검토 완료
- [ ] DB 스키마 승인
- [ ] UI 디자인 확정

### 구현 완료 조건
- [ ] Admin에서 시안 생성/버전 관리 가능
- [ ] Client에서 시안 확인/피드백 가능
- [ ] 시안 확정 시 워크플로우 상태 자동 변경
- [ ] Telegram 알림 발송 (고객)
- [ ] Slack 알림 발송 (관리자)

---

**문서 버전**: 1.1.0
**작성일**: 2024-12-06
**수정일**: 2024-12-06 (Slack/Telegram 연동 추가)
**작성자**: Claude Code
