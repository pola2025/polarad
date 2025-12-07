# PRD: Submission-Workflow 통합 시스템

## 문서 정보
- **버전**: 1.0.0
- **작성일**: 2025-12-03
- **프로젝트**: Polarad Client Portal
- **참조**: startpackage 프로젝트 아키텍처

---

## 1. 개요

### 1.1 목적
사용자의 자료 제출(Submission)과 관리자의 워크플로우(Workflow) 생성을 유기적으로 연결하여,
광고 제작 프로세스를 자동화하고 실시간 추적이 가능한 시스템 구축

### 1.2 현재 상태 (AS-IS)
```
User ─┬─ Submission (1:1) ← 독립적
      └─ Workflow (1:N)   ← 독립적

문제점:
- Submission과 Workflow가 분리된 독립 프로세스
- 관리자가 수동으로 API 호출하여 Workflow 생성
- 자료 제출 → 워크플로우 생성 연동 없음
- 실시간 알림 시스템 없음
```

### 1.3 목표 상태 (TO-BE)
```
User ─── Submission (1:1) ──→ Workflow (1:N)
              │                    │
              ▼                    ▼
         자료 제출 완료 시      자동 생성
              │                    │
              └────── 알림 ────────┘
                 (Telegram/Slack)

개선점:
- Submission 승인 → Workflow 자동 생성
- 실시간 상태 추적 및 알림
- 관리자 워크플로우 생성 UI
- 진행률 시각화
```

---

## 2. 시스템 아키텍처

### 2.1 데이터 모델 관계

```
┌─────────────────────────────────────────────────────────────┐
│                          User                                │
│  - id, email, name, phone                                   │
│  - role: CLIENT | ADMIN                                     │
│  - status: ACTIVE | INACTIVE                                │
└─────────────────────────────────────────────────────────────┘
         │                              │
         │ 1:1                          │ 1:N
         ▼                              ▼
┌─────────────────────┐     ┌─────────────────────────────────┐
│    Submission       │     │         Workflow                 │
│                     │     │                                  │
│ - status:           │     │ - type: NAMECARD, NAMETAG,      │
│   DRAFT             │     │         CONTRACT, ENVELOPE,      │
│   SUBMITTED         │────▶│         WEBSITE, BLOG,           │
│   IN_REVIEW         │     │         META_ADS, NAVER_ADS      │
│   APPROVED ─────────│─────│                                  │
│   REJECTED          │     │ - status: PENDING → SUBMITTED   │
│                     │     │   → IN_PROGRESS → DESIGN_UPLOADED│
│ - isComplete        │     │   → ORDER_REQUESTED → COMPLETED │
│ - completedAt       │     │   → SHIPPED                      │
│                     │     │                                  │
│ - brandName         │     │ - submittedAt                   │
│ - businessLicense   │     │ - designUrl                     │
│ - profilePhoto      │     │ - trackingNumber                │
│ - deliveryAddress   │     │                                  │
└─────────────────────┘     └─────────────────────────────────┘
                                       │
                                       │ 1:N
                                       ▼
                            ┌─────────────────────┐
                            │   WorkflowLog       │
                            │                     │
                            │ - previousStatus    │
                            │ - newStatus         │
                            │ - changedBy         │
                            │ - changedAt         │
                            │ - note              │
                            └─────────────────────┘
```

### 2.2 상태 전이 다이어그램

#### Submission 상태
```
DRAFT ──────▶ SUBMITTED ──────▶ IN_REVIEW
   │              │                  │
   │              │                  ├──▶ APPROVED ──▶ Workflow 자동 생성
   │              │                  │
   │              │                  └──▶ REJECTED
   │              │                           │
   └──────────────┴───────────────────────────┘
                    (수정 후 재제출)
```

#### Workflow 상태
```
PENDING ──▶ SUBMITTED ──▶ IN_PROGRESS ──▶ DESIGN_UPLOADED
                                               │
    ┌──────────────────────────────────────────┘
    │
    ▼
ORDER_REQUESTED ──▶ ORDER_APPROVED ──▶ COMPLETED ──▶ SHIPPED
```

---

## 3. 기능 명세

### 3.1 사용자 기능 (Client App)

#### 3.1.1 자료 제출 (Submission)

| 기능 | 설명 | 우선순위 |
|-----|------|---------|
| 자료 제출 폼 | 브랜드 정보, 사업자등록증, 프로필 등 입력 | P0 |
| 임시 저장 | 작성 중인 내용 저장 (status: DRAFT) | P0 |
| 제출 완료 | 필수 필드 검증 후 제출 (status: SUBMITTED) | P0 |
| 진행률 표시 | 섹션별 완료도 시각화 | P1 |
| 수정 요청 대응 | 반려 시 수정 후 재제출 | P1 |

#### 3.1.2 제작 현황 (Workflow)

| 기능 | 설명 | 우선순위 |
|-----|------|---------|
| 워크플로우 목록 | 나의 모든 워크플로우 조회 | P0 |
| 상태 확인 | 각 워크플로우 진행 상태 확인 | P0 |
| 시안 확인 | 업로드된 디자인 시안 확인 | P1 |
| 배송 추적 | 택배 정보 및 배송 상태 확인 | P1 |
| 수정 요청 | 시안에 대한 피드백 제출 | P2 |

### 3.2 관리자 기능 (Admin App)

#### 3.2.1 자료 제출 관리

| 기능 | 설명 | 우선순위 |
|-----|------|---------|
| 제출 목록 | 모든 사용자의 Submission 조회 | P0 |
| 상세 확인 | Submission 상세 정보 확인 | P0 |
| 승인/반려 | Submission 상태 변경 | P0 |
| 워크플로우 생성 | 승인 시 워크플로우 자동/수동 생성 | P0 |
| 반려 사유 | 반려 시 사유 입력 | P1 |

#### 3.2.2 워크플로우 관리

| 기능 | 설명 | 우선순위 |
|-----|------|---------|
| 워크플로우 목록 | 전체 워크플로우 조회 (필터링) | P0 |
| 상태 변경 | 워크플로우 상태 업데이트 | P0 |
| 시안 업로드 | 디자인 파일 업로드 | P0 |
| 발주 정보 | 발주 관련 정보 입력 | P1 |
| 배송 정보 | 택배사, 운송장 번호 입력 | P1 |
| 변경 이력 | WorkflowLog 조회 | P1 |

### 3.3 알림 시스템

#### 3.3.1 Slack 알림 (프로젝트별 채널)

**채널 네이밍 규칙**:
```
polarad-homepage-{클라이언트명}

예시:
- polarad-homepage-카페블루
- polarad-homepage-스타트업A
- polarad-homepage-별내사진관
```

**채널 생성 트리거**: Submission 승인 시 자동 생성

**채널 기능**:
| 기능 | 설명 | 우선순위 |
|-----|------|---------|
| 채널 생성 | 승인 시 자동 생성, 관리자 초대 | P0 |
| 초기 정보 푸시 | 제출 정보 일괄 업로드 | P0 |
| 상태 변경 로그 | 워크플로우 상태 변경 기록 | P0 |
| 파일 업로드 | 시안, 증빙 서류 업로드 | P1 |
| 진행 상황 알림 | 각 단계별 진행 메시지 | P1 |

#### 3.3.2 Telegram 알림 (즉시 알림)

| 이벤트 | 수신자 | 우선순위 |
|-------|--------|---------|
| 자료 제출 완료 | 관리자 | P0 |
| Submission 승인 | 사용자 | P0 |
| Submission 반려 | 사용자 | P0 |
| 시안 업로드 | 사용자 | P1 |
| 워크플로우 완료 | 사용자 | P1 |
| 배송 출발 | 사용자 | P1 |

---

## 4. API 명세

### 4.1 Client API

```
# Submission
GET    /api/submissions              - 내 제출 정보 조회
POST   /api/submissions              - 제출 정보 저장/업데이트
PATCH  /api/submissions/:id/submit   - 제출 완료 처리

# Workflow
GET    /api/user/workflows           - 내 워크플로우 목록
GET    /api/user/workflows/:id       - 워크플로우 상세
POST   /api/user/workflows/:id/feedback - 피드백 제출
```

### 4.2 Admin API

```
# Submission 관리
GET    /api/admin/submissions           - 전체 제출 목록
GET    /api/admin/submissions/:id       - 제출 상세
PATCH  /api/admin/submissions/:id       - 상태 변경 (승인/반려)

# Workflow 관리
GET    /api/workflows                   - 전체 워크플로우 목록
GET    /api/workflows/:id               - 워크플로우 상세
PATCH  /api/workflows/:id               - 워크플로우 업데이트
POST   /api/workflows                   - 워크플로우 생성 (수동)
POST   /api/workflows/bulk-create       - 워크플로우 일괄 생성

# 알림
POST   /api/notifications/send          - 알림 발송
```

---

## 5. 개발 단계

### Phase 1: 기반 구축 (Foundation)
**목표**: Submission-Workflow 연동 기반 구축

| 작업 | 파일/위치 | 설명 |
|-----|----------|------|
| 1.1 | `packages/database/prisma/schema.prisma` | Submission 상태 enum 추가 |
| 1.2 | `apps/admin/app/api/admin/submissions/` | 관리자 Submission API |
| 1.3 | `apps/admin/app/(dashboard)/submissions/` | 관리자 Submission 관리 페이지 |
| 1.4 | `apps/client/app/api/submissions/` | 클라이언트 Submission API 수정 |

### Phase 2: 연동 로직 (Integration)
**목표**: 자동 워크플로우 생성 및 상태 연동

| 작업 | 파일/위치 | 설명 |
|-----|----------|------|
| 2.1 | `apps/admin/app/api/admin/submissions/[id]/approve/` | 승인 시 워크플로우 자동 생성 |
| 2.2 | `apps/admin/lib/workflow-generator.ts` | 워크플로우 생성 로직 |
| 2.3 | `apps/client/app/(dashboard)/dashboard/submissions/` | 제출 폼 개선 |
| 2.4 | `apps/client/app/(dashboard)/dashboard/workflows/` | 워크플로우 상태 표시 개선 |

### Phase 3: 알림 시스템 (Notification)
**목표**: 실시간 알림 및 상태 추적

| 작업 | 파일/위치 | 설명 |
|-----|----------|------|
| 3.1 | `packages/notifications/` | 알림 패키지 생성 |
| 3.2 | `packages/notifications/telegram.ts` | Telegram 클라이언트 |
| 3.3 | `apps/admin/lib/notification-service.ts` | 알림 서비스 통합 |
| 3.4 | 각 API 라우트 | 이벤트별 알림 트리거 |

### Phase 4: UI/UX 개선 (Enhancement)
**목표**: 사용자 경험 향상

| 작업 | 파일/위치 | 설명 |
|-----|----------|------|
| 4.1 | Client 대시보드 | 진행률 시각화 |
| 4.2 | Admin 대시보드 | 일괄 처리 기능 |
| 4.3 | 양쪽 앱 | 실시간 상태 업데이트 (폴링/SSE) |

---

## 6. 상세 구현 명세

### 6.1 Phase 1.1 - Schema 업데이트

```prisma
// packages/database/prisma/schema.prisma

enum SubmissionStatus {
  DRAFT        // 작성 중
  SUBMITTED    // 제출 완료
  IN_REVIEW    // 검토 중
  APPROVED     // 승인
  REJECTED     // 반려
}

model Submission {
  id              String           @id @default(cuid())
  userId          String           @unique @map("user_id")

  // 기존 필드들...

  // 상태 관리 (추가)
  status          SubmissionStatus @default(DRAFT)
  submittedAt     DateTime?        @map("submitted_at")
  reviewedAt      DateTime?        @map("reviewed_at")
  reviewedBy      String?          @map("reviewed_by")
  rejectionReason String?          @map("rejection_reason")

  user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("submissions")
}

model Workflow {
  // 기존 필드들...

  // Submission 참조 (추가)
  submissionId    String?          @map("submission_id")

  @@map("workflows")
}
```

### 6.2 Phase 2.1 - 승인 시 워크플로우 생성

```typescript
// apps/admin/app/api/admin/submissions/[id]/approve/route.ts

import { prisma } from '@polarad/database'
import { NextRequest, NextResponse } from 'next/server'

// 기본 워크플로우 타입
const DEFAULT_WORKFLOW_TYPES = [
  'NAMECARD',
  'NAMETAG',
  'CONTRACT',
  'ENVELOPE',
  'WEBSITE'
]

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const body = await request.json()
  const { workflowTypes = DEFAULT_WORKFLOW_TYPES, reviewedBy } = body

  // 1. Submission 상태 업데이트
  const submission = await prisma.submission.update({
    where: { id },
    data: {
      status: 'APPROVED',
      reviewedAt: new Date(),
      reviewedBy,
    },
    include: { user: true }
  })

  // 2. 워크플로우 일괄 생성
  const workflows = await Promise.all(
    workflowTypes.map(type =>
      prisma.workflow.upsert({
        where: {
          userId_type: {
            userId: submission.userId,
            type,
          }
        },
        create: {
          userId: submission.userId,
          type,
          status: 'SUBMITTED',
          submissionId: id,
          submittedAt: new Date(),
        },
        update: {
          status: 'SUBMITTED',
          submissionId: id,
          submittedAt: new Date(),
        }
      })
    )
  )

  // 3. 알림 발송 (Phase 3에서 구현)
  // await sendNotification(...)

  return NextResponse.json({
    success: true,
    data: { submission, workflows }
  })
}
```

### 6.3 Phase 3.2 - Slack 클라이언트

```typescript
// packages/notifications/slack.ts

import { WebClient } from "@slack/web-api"

let slackClient: WebClient | null = null

function initSlackClient() {
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN
  if (!SLACK_BOT_TOKEN) {
    console.error("❌ [Slack] SLACK_BOT_TOKEN 환경 변수가 설정되지 않았습니다")
    return null
  }
  if (!slackClient) {
    slackClient = new WebClient(SLACK_BOT_TOKEN)
  }
  return slackClient
}

/**
 * 채널 이름 생성
 * 규칙: polarad-homepage-{클라이언트명}
 * 한글 → 로마자 변환 (슬랙 채널명 규칙 준수)
 */
function generateChannelName(clientName: string): string {
  const sanitized = toSlackChannelName(clientName)
  return `polarad-homepage-${sanitized}`.substring(0, 80)
}

/**
 * Slack 채널 생성
 */
export async function createSlackChannel(params: {
  clientName: string
  userName: string
  userEmail: string
  userPhone: string
  brandName: string
}): Promise<string | null> {
  const client = initSlackClient()
  if (!client) return null

  const channelName = generateChannelName(params.clientName)

  // 기존 채널 확인
  const existing = await findChannelByName(channelName)
  if (existing) return existing

  // 새 채널 생성
  const result = await client.conversations.create({
    name: channelName,
    is_private: false,
  })

  if (!result.ok || !result.channel?.id) {
    throw new Error(`채널 생성 실패: ${result.error}`)
  }

  const channelId = result.channel.id

  // 관리자 초대
  const adminEmails = process.env.SLACK_ADMIN_EMAILS?.split(",") || []
  for (const email of adminEmails) {
    const userId = await findUserByEmail(email.trim())
    if (userId) {
      await client.conversations.invite({ channel: channelId, users: userId })
    }
  }

  // 초기 메시지
  await postMessage({
    channelId,
    text: `🎉 새 프로젝트: ${params.brandName}`,
    blocks: [
      { type: "header", text: { type: "plain_text", text: "🎉 새로운 프로젝트 시작" } },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*고객명:*\n${params.userName}` },
          { type: "mrkdwn", text: `*브랜드:*\n${params.brandName}` },
          { type: "mrkdwn", text: `*연락처:*\n${params.userPhone}` },
          { type: "mrkdwn", text: `*이메일:*\n${params.userEmail}` },
        ],
      },
    ],
  })

  return channelId
}

/**
 * 메시지 전송
 */
export async function postMessage(params: {
  channelId: string
  text: string
  blocks?: any[]
}): Promise<boolean> {
  const client = initSlackClient()
  if (!client) return false

  const result = await client.chat.postMessage({
    channel: params.channelId,
    text: params.text,
    blocks: params.blocks,
  })

  return result.ok || false
}

/**
 * 진행 상황 로그
 */
export async function logProgress(params: {
  channelId: string
  stage: string
  status: string
  details?: Record<string, string>
  emoji?: string
}): Promise<boolean> {
  const fields = [
    { type: "mrkdwn", text: `*단계:*\n${params.stage}` },
    { type: "mrkdwn", text: `*상태:*\n${params.status}` },
  ]

  if (params.details) {
    Object.entries(params.details).forEach(([key, value]) => {
      fields.push({ type: "mrkdwn", text: `*${key}:*\n${value}` })
    })
  }

  return postMessage({
    channelId: params.channelId,
    text: `${params.emoji || "📝"} ${params.stage} - ${params.status}`,
    blocks: [
      { type: "section", text: { type: "mrkdwn", text: `${params.emoji || "📝"} *${params.stage}*` } },
      { type: "section", fields },
      { type: "context", elements: [{ type: "mrkdwn", text: `📅 ${new Date().toLocaleString("ko-KR")}` }] },
      { type: "divider" },
    ],
  })
}

/**
 * 상태 변경 로그
 */
export async function logStateChange(params: {
  channelId: string
  fromState: string
  toState: string
  changedBy?: string
}): Promise<boolean> {
  return logProgress({
    channelId: params.channelId,
    stage: "상태 변경",
    status: params.toState,
    details: {
      "이전 상태": params.fromState,
      "변경 후": params.toState,
      ...(params.changedBy && { "변경자": params.changedBy }),
    },
    emoji: getStateEmoji(params.toState),
  })
}

/**
 * 시안 업로드 로그
 */
export async function logDesignUpload(params: {
  channelId: string
  itemName: string
  designUrl: string
  version?: number
}): Promise<boolean> {
  await postMessage({
    channelId: params.channelId,
    text: `🎨 시안 업로드: ${params.itemName}`,
  })

  return uploadFileToSlack({
    channelId: params.channelId,
    filePath: params.designUrl,
    fileName: `${params.itemName}_시안.jpg`,
    title: `${params.itemName} 시안`,
  })
}

/**
 * 파일 업로드
 */
export async function uploadFileToSlack(params: {
  channelId: string
  filePath: string
  fileName: string
  title: string
}): Promise<boolean> {
  const client = initSlackClient()
  if (!client) return false

  // URL인 경우 다운로드
  let fileContent: Buffer
  if (params.filePath.startsWith("http")) {
    const response = await fetch(params.filePath)
    fileContent = Buffer.from(await response.arrayBuffer())
  } else {
    const fs = require("fs")
    fileContent = fs.readFileSync(params.filePath)
  }

  const result = await client.files.uploadV2({
    channel_id: params.channelId,
    file: fileContent,
    filename: params.fileName,
    title: params.title,
  })

  return result.ok || false
}

function getStateEmoji(state: string): string {
  const map: Record<string, string> = {
    PENDING: "⏳",
    SUBMITTED: "📝",
    IN_PROGRESS: "🎨",
    DESIGN_UPLOADED: "👀",
    ORDER_REQUESTED: "🚀",
    COMPLETED: "✅",
    SHIPPED: "📦",
  }
  return map[state] || "📌"
}
```

### 6.4 Phase 3.3 - Telegram 클라이언트

```typescript
// packages/notifications/telegram.ts

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

export async function sendTelegramMessage(
  chatId: string,
  message: string,
  options?: { parseMode?: 'HTML' | 'Markdown' }
) {
  const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: options?.parseMode || 'HTML',
    })
  })

  return response.json()
}

// 이벤트별 알림 템플릿
export const NotificationTemplates = {
  submissionApproved: (userName: string, brandName: string) =>
    `✅ <b>자료 승인 완료</b>\n\n${userName}님의 "${brandName}" 자료가 승인되었습니다.\n워크플로우가 생성되어 제작이 시작됩니다.`,

  submissionRejected: (userName: string, reason: string) =>
    `❌ <b>자료 보완 필요</b>\n\n${userName}님, 제출하신 자료의 보완이 필요합니다.\n\n사유: ${reason}`,

  designUploaded: (workflowType: string) =>
    `🎨 <b>시안 업로드</b>\n\n${workflowType} 시안이 업로드되었습니다.\n대시보드에서 확인해주세요.`,

  workflowCompleted: (workflowType: string) =>
    `🎉 <b>제작 완료</b>\n\n${workflowType} 제작이 완료되었습니다.`,

  shipped: (workflowType: string, trackingNumber: string) =>
    `📦 <b>배송 시작</b>\n\n${workflowType}이(가) 발송되었습니다.\n운송장: ${trackingNumber}`,
}
```

---

## 7. 테스트 계획

### 7.1 단위 테스트
- Submission 상태 전이 검증
- Workflow 자동 생성 로직
- 알림 발송 함수

### 7.2 통합 테스트
- 사용자 제출 → 관리자 승인 → 워크플로우 생성 전체 흐름
- 알림 수신 확인

### 7.3 E2E 테스트
- 사용자: 로그인 → 자료 제출 → 상태 확인
- 관리자: 로그인 → 승인 → 워크플로우 관리

---

## 8. 마일스톤

| Phase | 예상 작업량 | 의존성 |
|-------|-----------|--------|
| Phase 1 | 기반 구축 | 없음 |
| Phase 2 | 연동 로직 | Phase 1 완료 |
| Phase 3 | 알림 시스템 | Phase 2 완료 |
| Phase 4 | UI/UX 개선 | Phase 2 완료 |

---

## 9. 리스크 및 대응

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|----------|
| 기존 데이터 마이그레이션 | 중 | 마이그레이션 스크립트 작성, 백업 후 진행 |
| Telegram API 제한 | 하 | Rate limiting 처리, 큐 시스템 고려 |
| 실시간 상태 업데이트 성능 | 중 | 폴링 주기 최적화, 필요시 SSE 도입 |

---

## 부록 A: startpackage 참조 코드 위치

| 기능 | startpackage 경로 |
|-----|------------------|
| Submission API | `app/api/submission/route.ts` |
| Workflow 자동 생성 | `app/api/submission/route.ts` (handleSubmissionComplete) |
| 진행률 계산 | `lib/submission-progress.ts` |
| 알림 서비스 | `lib/notification/notificationService.ts` |
| Telegram 클라이언트 | `lib/notification/telegramClient.ts` |
| Slack 통합 | `lib/notification/slackClient.ts` |

---

## 부록 B: 환경 변수

```env
# Slack (필수)
SLACK_BOT_TOKEN=xoxb-xxx
SLACK_ADMIN_EMAILS=admin1@company.com,admin2@company.com

# Telegram (필수)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ADMIN_CHAT_ID=admin_chat_id
TELEGRAM_BACKFILL_CHAT_ID=-1003394139746
```

---

## 부록 C: 민감 파일 처리 정책

### 원칙: Slack 전송 후 서버 폐기

클라이언트가 제출한 민감 파일은 서버에 저장하지 않고, Slack으로 직접 전송 후 메모리에서 폐기합니다.

### 대상 파일
- 사업자등록증
- 신분증
- 계약서
- 기타 개인정보 포함 문서

### 처리 흐름

```
클라이언트 업로드
      │
      ▼
┌─────────────────────────────────────┐
│  서버 메모리 (Buffer)               │
│  - 파일 검증 (타입, 크기)            │
│  - 임시 저장 (메모리 only)           │
└─────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│  Slack 업로드                       │
│  - uploadSensitiveFileToSlack()     │
│  - 채널에 직접 업로드                │
└─────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│  메모리 폐기                        │
│  - Buffer 참조 해제                  │
│  - GC에 의해 자동 정리               │
└─────────────────────────────────────┘
```

### 구현 코드

```typescript
// 민감 파일 Slack 전송 (서버 저장 없음)
export async function uploadSensitiveFileToSlack(params: {
  channelId: string
  buffer: Buffer        // 메모리에서 직접 전송
  fileName: string
  title: string
  userName?: string
}): Promise<boolean> {
  const client = initSlackClient()
  if (!client) return false

  const result = await client.files.uploadV2({
    channel_id: params.channelId,
    file: params.buffer,
    filename: params.fileName,
    title: params.title,
    initial_comment: `🔐 *${params.title}*${params.userName ? ` - ${params.userName}` : ""}\n_이 파일은 보안을 위해 서버에 저장되지 않습니다_`,
  })

  return result.ok || false
}
```

### API 구현 예시

```typescript
// apps/client/app/api/submissions/upload/route.ts

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  // 1. 메모리에 Buffer로 로드
  const buffer = Buffer.from(await file.arrayBuffer())

  // 2. Slack으로 직접 업로드
  const success = await uploadSensitiveFileToSlack({
    channelId: user.slackChannelId,
    buffer,
    fileName: file.name,
    title: '사업자등록증',
    userName: user.name,
  })

  // 3. buffer 변수는 함수 종료 시 자동 해제
  // 서버 디스크/DB에 저장하지 않음

  return NextResponse.json({ success })
}
```

### DB 저장 정책

| 데이터 유형 | DB 저장 | Slack 업로드 | 비고 |
|-----------|--------|-------------|------|
| 텍스트 정보 (브랜드명, 주소 등) | ✅ | ✅ | 메시지로 전송 |
| 민감 파일 (사업자등록증, 신분증) | ❌ | ✅ | Buffer → Slack 직접 |
| 일반 파일 (로고, 시안) | ✅ (URL만) | ✅ | R2/S3 저장 후 URL |
| 비밀번호, 인증정보 | ❌ | ❌ | 암호화 처리 |

---

## 부록 D: 구현 진행 상황 (2025-12-04 업데이트)

### 완료된 작업

#### Phase 1: 기반 구축 ✅
| 작업 | 상태 | 파일 위치 |
|-----|------|----------|
| Schema 업데이트 (SubmissionStatus enum) | ✅ 완료 | `packages/database/prisma/schema.prisma` |
| Submission 상태 필드 추가 | ✅ 완료 | status, submittedAt, reviewedAt, reviewedBy, rejectionReason |
| Workflow unique constraint 추가 | ✅ 완료 | `@@unique([userId, type])` |
| Submission에 slackChannelId 추가 | ✅ 완료 | Slack 채널 연동용 |

#### Phase 2: 연동 로직 ✅
| 작업 | 상태 | 파일 위치 |
|-----|------|----------|
| 관리자 Submission API | ✅ 완료 | `apps/admin/app/api/admin/submissions/` |
| 관리자 Submission 관리 페이지 | ✅ 완료 | `apps/admin/app/(dashboard)/submissions/` |
| 승인 시 워크플로우 자동 생성 | ✅ 완료 | `apps/admin/app/api/admin/submissions/[id]/approve/route.ts` |
| 클라이언트 Submission API 수정 | ✅ 완료 | `apps/client/app/api/submissions/route.ts` |

#### Phase 3: 알림 시스템 ✅
| 작업 | 상태 | 파일 위치 |
|-----|------|----------|
| Slack 클라이언트 | ✅ 완료 | `apps/admin/lib/notification/slackClient.ts` |
| Telegram 클라이언트 | ✅ 완료 | `apps/admin/lib/notification/telegramClient.ts` |
| 채널 생성 및 관리자 초대 | ✅ 완료 | 승인 시 자동 생성 |
| 제출 정보 Slack 푸시 | ✅ 완료 | pushSubmissionData() |
| 민감 파일 처리 함수 | ✅ 완료 | uploadSensitiveFileToSlack() |

#### Phase 4: UI/UX 개선 ✅
| 작업 | 상태 | 파일 위치 |
|-----|------|----------|
| 클라이언트 대시보드 진행률 시각화 | ✅ 완료 | `apps/client/app/(dashboard)/dashboard/page.tsx` |
| 대시보드 API 확장 (submission 정보) | ✅ 완료 | `apps/client/app/api/dashboard/route.ts` |
| 워크플로우 상태 변경 시 Slack 로그 | ✅ 완료 | `apps/admin/app/api/workflows/[id]/route.ts` |
| 사용자 Telegram 알림 (중요 상태) | ✅ 완료 | 디자인 완료, 제작 완료, 배송 알림 |

### 환경변수 설정 (완료)

```env
# apps/admin/.env 및 루트 .env에 추가됨
SLACK_BOT_TOKEN=xoxb-xxx-xxx-xxx
SLACK_ADMIN_EMAILS=mkt@polarad.co.kr,imagine20002@gmail.com
TELEGRAM_BOT_TOKEN=xxx-xxx
TELEGRAM_ADMIN_CHAT_ID=-xxx
```

---

## 부록 E: 남은 작업 및 다음 세션 가이드

### 테스트 필요 항목

| 항목 | 설명 | 우선순위 |
|-----|------|---------|
| 전체 흐름 E2E 테스트 | 사용자 로그인 → 자료 제출 → 관리자 승인 → 워크플로우 생성 | P0 |
| Slack 채널 생성 확인 | 승인 시 `polarad-homepage-{클라이언트명}` 채널 생성 | P0 |
| Telegram 알림 수신 확인 | 사용자에게 알림 정상 도착 확인 | P1 |
| 상태 변경 Slack 로그 확인 | 워크플로우 상태 변경 시 채널에 메시지 | P1 |

### 추가 개선 사항 (선택)

| 항목 | 설명 | 우선순위 |
|-----|------|---------|
| 민감 파일 업로드 UI | Submission 폼에서 직접 파일 업로드 → Slack 전송 | P2 |
| 관리자 일괄 처리 기능 | 여러 Submission 동시 승인/반려 | P2 |
| 실시간 상태 업데이트 | SSE 또는 WebSocket으로 실시간 반영 | P3 |
| 반려 사유 템플릿 | 자주 사용하는 반려 사유 미리 등록 | P3 |

### 다음 세션 시작 시 참고

```
다음 세션 요청문:

---
Polarad Submission-Workflow 통합 시스템 - 테스트 및 마무리

완료된 작업 (Phase 1~4)
- ✅ Schema 업데이트 (Submission 필드 추가)
- ✅ 관리자 Submission API/페이지
- ✅ 승인 시 워크플로우 자동 생성 + Slack 채널 생성
- ✅ Slack/Telegram 클라이언트 구현
- ✅ 클라이언트 대시보드 진행률 시각화
- ✅ 워크플로우 상태 변경 시 Slack 로그
- ✅ 환경변수 설정 완료

다음 진행 필요 작업
1. 전체 흐름 E2E 테스트
2. (선택) 추가 개선 사항 구현

PRD 문서 위치: docs/PRD-submission-workflow-integration.md
---
```

### 테스트 시나리오

#### 1. 사용자 자료 제출
```bash
# 클라이언트 앱: http://localhost:3010
1. /login 페이지에서 테스트 사용자로 로그인
2. /dashboard 페이지에서 "자료 제출하기" 클릭
3. /dashboard/submissions 에서 필수 정보 입력 후 제출
4. 결과: Telegram으로 관리자에게 알림
```

#### 2. 관리자 승인
```bash
# 관리자 앱: http://localhost:3011
1. 관리자 계정으로 로그인
2. /submissions 페이지에서 제출된 자료 확인
3. "승인" 버튼 클릭
4. 결과:
   - Slack 채널 생성 (polarad-homepage-{클라이언트명})
   - 워크플로우 5개 자동 생성 (NAMECARD, NAMETAG, CONTRACT, ENVELOPE, WEBSITE)
   - 제출 정보가 Slack 채널에 푸시
   - 사용자에게 Telegram 승인 알림
```

#### 3. 워크플로우 상태 변경
```bash
1. 관리자 워크플로우 관리 페이지에서 상태 변경
2. 결과:
   - Slack 채널에 상태 변경 로그
   - 디자인 업로드/완료/배송 시 사용자 Telegram 알림
```
