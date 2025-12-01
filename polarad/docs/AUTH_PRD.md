# Polarad 인증 및 권한 관리 PRD

## 문서 정보
- **문서명**: 인증 및 권한 관리 기획서
- **버전**: 1.0.0
- **작성일**: 2025-12-01
- **상태**: 기획 완료

---

## 1. 개요

### 1.1 목적
시스템의 **관리자 영역**과 **사용자 영역**을 완전히 분리하여 운영합니다.
각 영역은 별도의 인증 체계와 세션 관리를 적용합니다.

### 1.2 현재 문제점
- Basic Auth 사용으로 세션 유지 불안정
- 관리자/사용자 영역 구분 없음
- 브라우저 캐시 의존적인 인증

### 1.3 해결 방안
- NextAuth.js 기반 세션 인증 도입
- 관리자/사용자 별도 인증 Provider
- JWT 토큰 기반 세션 관리

---

## 2. 영역 구분

### 2.1 접근 영역 매트릭스

| 영역 | 경로 | 대상 | 인증 방식 |
|------|------|------|----------|
| **관리자** | `/admin/*` | 운영자, 매니저, 슈퍼관리자 | NextAuth 세션 + Admin 역할 |
| **사용자** | `/dashboard/*` | 광고주 (Client) | NextAuth 세션 + User 역할 |
| **공개** | `/login`, `/signup`, `/` | 모든 방문자 | 인증 불필요 |
| **API** | `/api/*` | 시스템 | 세션 또는 API Key |

### 2.2 현재 라우트 구조

```
app/
├── (admin)/           # Route Group - 관리자
│   ├── admin/         # /admin/*
│   └── layout.tsx
├── (user)/            # Route Group - 사용자
│   ├── dashboard/     # /dashboard/*
│   ├── login/         # /login
│   ├── signup/        # /signup
│   └── layout.tsx
├── api/               # API Routes
├── layout.tsx
└── page.tsx           # 랜딩 페이지
```

---

## 3. 역할 체계

### 3.1 관리자 역할 (AdminRole)

```
AdminRole (DB Enum):
├── SUPER      - 전체 시스템 접근, 관리자 계정 관리
├── MANAGER    - 사용자 관리, 워크플로우 관리, 통계 조회
└── OPERATOR   - 기본 운영 기능 (시안 업로드, 상태 변경)
```

#### 권한 매트릭스

| 기능 | SUPER | MANAGER | OPERATOR |
|------|:-----:|:-------:|:--------:|
| 관리자 계정 CRUD | ✅ | ❌ | ❌ |
| 시스템 설정 변경 | ✅ | ❌ | ❌ |
| 사용자 목록/상세 조회 | ✅ | ✅ | ✅ |
| 사용자 정보 수정 | ✅ | ✅ | ❌ |
| 사용자 삭제 | ✅ | ❌ | ❌ |
| 통계 대시보드 | ✅ | ✅ | ✅ |
| 워크플로우 상태 변경 | ✅ | ✅ | ✅ |
| 시안 업로드 | ✅ | ✅ | ✅ |
| 알림 발송 | ✅ | ✅ | ✅ |
| 알림 템플릿 관리 | ✅ | ✅ | ❌ |

### 3.2 사용자 역할 (User)

```
User 권한:
├── 본인 프로필 조회/수정
├── 본인 자료 제출/수정
├── 본인 워크플로우 조회
├── 시안 확인 및 발주 요청
└── 광고 성과 조회 (본인 Client 연동 시)
```

---

## 4. 인증 플로우

### 4.1 관리자 로그인 플로우

```
[/admin/login 페이지]
         │
         ▼
┌─────────────────────────┐
│  이메일 + 비밀번호 입력   │
└─────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│  POST /api/auth/admin   │
│  - credentials provider │
└─────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Admin 테이블 조회       │
│  - email 검증           │
│  - password bcrypt 검증 │
│  - isActive 확인        │
└─────────────────────────┘
         │
    ┌────┴────┐
    │         │
  성공      실패
    │         │
    ▼         ▼
┌────────┐ ┌────────────┐
│ JWT    │ │ 에러 메시지 │
│ 세션   │ │ 표시       │
│ 생성   │ └────────────┘
└────────┘
    │
    ▼
┌─────────────────────────┐
│  /admin/dashboard 이동   │
└─────────────────────────┘
```

### 4.2 사용자 로그인 플로우

```
[/login 페이지]
         │
         ▼
┌─────────────────────────┐
│  이메일 + 비밀번호 입력   │
└─────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│  POST /api/auth/user    │
│  - credentials provider │
└─────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│  User 테이블 조회        │
│  - email 검증           │
│  - password bcrypt 검증 │
│  - isActive 확인        │
└─────────────────────────┘
         │
    ┌────┴────┐
    │         │
  성공      실패
    │         │
    ▼         ▼
┌────────┐ ┌────────────┐
│ JWT    │ │ 에러 메시지 │
│ 세션   │ │ 표시       │
│ 생성   │ └────────────┘
└────────┘
    │
    ▼
┌─────────────────────────┐
│  /dashboard 이동         │
└─────────────────────────┘
```

### 4.3 로그아웃 플로우

```
[로그아웃 버튼 클릭]
         │
         ▼
┌─────────────────────────┐
│  signOut() 호출          │
│  - 세션 쿠키 삭제        │
│  - JWT 무효화           │
└─────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│  해당 영역 로그인        │
│  페이지로 리다이렉트     │
└─────────────────────────┘
```

---

## 5. 세션 관리

### 5.1 세션 설정

| 항목 | 설정값 |
|------|--------|
| 세션 방식 | JWT (JSON Web Token) |
| 세션 유효기간 | 24시간 |
| Refresh 전략 | 활동 시 자동 갱신 |
| 동시 로그인 | 허용 (디바이스별 세션) |
| 쿠키 이름 | `next-auth.session-token` |
| 쿠키 속성 | `httpOnly`, `secure`, `sameSite: lax` |

### 5.2 JWT 페이로드 구조

```typescript
// 관리자 JWT
interface AdminJWT {
  id: string
  email: string
  name: string
  role: 'SUPER' | 'MANAGER' | 'OPERATOR'
  type: 'admin'
  iat: number  // 발급 시간
  exp: number  // 만료 시간
}

// 사용자 JWT
interface UserJWT {
  id: string
  email: string
  name: string
  clientId?: string  // 연동된 광고 클라이언트
  type: 'user'
  iat: number
  exp: number
}
```

### 5.3 세션 콜백

```typescript
// auth.ts
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id
      token.type = user.type
      token.role = user.role  // admin only
      token.clientId = user.clientId  // user only
    }
    return token
  },
  async session({ session, token }) {
    session.user.id = token.id
    session.user.type = token.type
    session.user.role = token.role
    session.user.clientId = token.clientId
    return session
  }
}
```

---

## 6. Middleware 설계

### 6.1 인증 로직

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// 공개 경로 목록
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/admin/login',
  '/api/auth',
]

// 관리자 역할별 접근 가능 경로
const adminPermissions = {
  SUPER: ['/admin/*'],
  MANAGER: ['/admin/dashboard', '/admin/users', '/admin/workflows', '/admin/notifications'],
  OPERATOR: ['/admin/dashboard', '/admin/workflows', '/admin/notifications'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. 공개 경로 체크
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // 2. 정적 파일 스킵
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // 3. 토큰 조회
  const token = await getToken({ req: request })

  // 4. 관리자 영역 체크
  if (pathname.startsWith('/admin')) {
    // 로그인 페이지는 미인증 상태만 접근
    if (pathname === '/admin/login') {
      if (token?.type === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      return NextResponse.next()
    }

    // 인증 체크
    if (!token || token.type !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // 역할 기반 접근 제어
    if (!hasPermission(token.role, pathname)) {
      return NextResponse.redirect(new URL('/admin/unauthorized', request.url))
    }
  }

  // 5. 사용자 영역 체크
  if (pathname.startsWith('/dashboard')) {
    if (!token || token.type !== 'user') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 6. 로그인 페이지 - 인증된 사용자 리다이렉트
  if (pathname === '/login') {
    if (token?.type === 'user') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### 6.2 경로별 접근 제어 상세

#### 공개 경로

| 경로 | 설명 | 인증 상태별 동작 |
|------|------|-----------------|
| `/` | 랜딩 페이지 | 모두 접근 가능 |
| `/login` | 사용자 로그인 | 인증 시 `/dashboard`로 |
| `/signup` | 회원가입 | 인증 시 `/dashboard`로 |
| `/admin/login` | 관리자 로그인 | 인증 시 `/admin/dashboard`로 |
| `/api/auth/*` | NextAuth API | 시스템 처리 |

#### 관리자 전용 경로

| 경로 | 설명 | 필요 역할 |
|------|------|----------|
| `/admin/dashboard` | 관리자 대시보드 | 모든 Admin |
| `/admin/users` | 사용자 관리 | MANAGER 이상 |
| `/admin/users/[id]` | 사용자 상세 | MANAGER 이상 |
| `/admin/workflows` | 워크플로우 관리 | 모든 Admin |
| `/admin/notifications` | 알림 관리 | 모든 Admin |
| `/admin/admins` | 관리자 계정 관리 | SUPER만 |
| `/admin/settings` | 시스템 설정 | SUPER만 |

#### 사용자 전용 경로

| 경로 | 설명 | 비고 |
|------|------|------|
| `/dashboard` | 사용자 대시보드 | 로그인 필수 |
| `/dashboard/profile` | 프로필 관리 | 본인 정보만 |
| `/dashboard/submissions` | 자료 제출 | 본인 자료만 |
| `/dashboard/workflows` | 제작 진행 현황 | 본인 워크플로우만 |
| `/dashboard/analytics` | 광고 성과 | Client 연동 필요 |

---

## 7. 보안 고려사항

### 7.1 비밀번호 정책

| 항목 | 관리자 | 사용자 |
|------|--------|--------|
| 최소 길이 | 8자 | 4자 |
| 문자 구성 | 영문+숫자+특수문자 | 숫자만 |
| 해싱 알고리즘 | bcrypt | bcrypt |
| Salt Rounds | 12 | 10 |
| 만료 기간 | 90일 (권장) | 없음 |
| 재사용 제한 | 최근 3개 | 없음 |

### 7.2 보안 헤더

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]
```

### 7.3 Rate Limiting

| API 유형 | 제한 | 윈도우 |
|---------|------|--------|
| 로그인 시도 (실패) | 5회 | 1분 |
| 비밀번호 재설정 | 3회 | 1시간 |
| 일반 API | 100회 | 1분 |
| 파일 업로드 | 10회 | 1분 |

### 7.4 세션 보안

- HttpOnly 쿠키 사용 (XSS 방지)
- Secure 플래그 (HTTPS 전용)
- SameSite=Lax (CSRF 방지)
- 세션 고정 공격 방지 (로그인 시 새 세션)

---

## 8. 에러 처리

### 8.1 인증 에러 코드

| 코드 | 메시지 | 설명 |
|------|--------|------|
| `AUTH_INVALID_CREDENTIALS` | 이메일 또는 비밀번호가 올바르지 않습니다 | 로그인 실패 |
| `AUTH_ACCOUNT_DISABLED` | 비활성화된 계정입니다 | isActive=false |
| `AUTH_SESSION_EXPIRED` | 세션이 만료되었습니다 | JWT 만료 |
| `AUTH_UNAUTHORIZED` | 접근 권한이 없습니다 | 역할 부족 |
| `AUTH_RATE_LIMITED` | 너무 많은 시도입니다 | Rate Limit 초과 |

### 8.2 에러 페이지

| 경로 | 용도 |
|------|------|
| `/admin/unauthorized` | 관리자 권한 부족 |
| `/error` | 일반 에러 |

---

## 9. 구현 계획

### 9.1 구현 순서

| 순서 | 작업 | 예상 소요 | 상태 |
|------|------|----------|------|
| 1 | NextAuth 설정 (auth.ts) | 2시간 | ⬜ 대기 |
| 2 | Admin Credentials Provider | 1시간 | ⬜ 대기 |
| 3 | User Credentials Provider | 1시간 | ⬜ 대기 |
| 4 | Middleware 인증 로직 | 2시간 | ⬜ 대기 |
| 5 | 관리자 로그인 페이지 | 1시간 | ⬜ 대기 |
| 6 | 사용자 로그인 페이지 수정 | 1시간 | ⬜ 대기 |
| 7 | 역할 기반 접근 제어 | 1시간 | ⬜ 대기 |
| 8 | 보안 헤더 적용 | 30분 | ⬜ 대기 |
| 9 | Rate Limiting | 1시간 | ⬜ 대기 |
| 10 | 테스트 및 검증 | 2시간 | ⬜ 대기 |

### 9.2 파일 구조

```
lib/
├── auth.ts                 # NextAuth 설정
├── auth/
│   ├── admin-provider.ts   # 관리자 인증 Provider
│   ├── user-provider.ts    # 사용자 인증 Provider
│   └── permissions.ts      # 역할별 권한 정의
app/
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts    # NextAuth API Route
├── (admin)/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx    # 관리자 로그인 페이지
│   │   └── unauthorized/
│   │       └── page.tsx    # 권한 없음 페이지
│   └── layout.tsx
├── (user)/
│   ├── login/
│   │   └── page.tsx        # 사용자 로그인 페이지
│   └── layout.tsx
└── middleware.ts           # 인증 미들웨어
```

---

## 10. 테스트 시나리오

### 10.1 관리자 인증 테스트

| 시나리오 | 예상 결과 |
|---------|----------|
| SUPER 계정으로 `/admin/admins` 접근 | 접근 성공 |
| MANAGER 계정으로 `/admin/admins` 접근 | `/admin/unauthorized`로 리다이렉트 |
| 미인증 상태로 `/admin/dashboard` 접근 | `/admin/login`으로 리다이렉트 |
| 잘못된 비밀번호로 로그인 | 에러 메시지 표시 |
| 비활성화된 계정으로 로그인 | 에러 메시지 표시 |

### 10.2 사용자 인증 테스트

| 시나리오 | 예상 결과 |
|---------|----------|
| 로그인 후 `/dashboard` 접근 | 접근 성공 |
| 미인증 상태로 `/dashboard` 접근 | `/login`으로 리다이렉트 |
| 사용자 계정으로 `/admin/dashboard` 접근 | `/admin/login`으로 리다이렉트 |
| 로그인 상태로 `/login` 접근 | `/dashboard`로 리다이렉트 |

### 10.3 세션 테스트

| 시나리오 | 예상 결과 |
|---------|----------|
| 24시간 후 페이지 접근 | 로그인 페이지로 리다이렉트 |
| 활동 중 세션 갱신 | 세션 유지 |
| 로그아웃 후 보호된 페이지 접근 | 로그인 페이지로 리다이렉트 |

---

## 11. 참고사항

### 11.1 관련 문서
- [Polarad PRD](./PRD.md)
- [NextAuth.js v5 공식 문서](https://authjs.dev/)

### 11.2 DB 스키마 참조

```prisma
// Admin 모델 (이미 존재)
model Admin {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String
  password  String
  role      AdminRole @default(OPERATOR)
  isActive  Boolean   @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

enum AdminRole {
  SUPER
  MANAGER
  OPERATOR
}
```

---

**문서 끝**
