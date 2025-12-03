# PRD: 관리자 대시보드와 클라이언트 페이지 분리

## 문서 정보
- **버전**: 1.0
- **작성일**: 2024-12-02
- **프로젝트**: Polarad 마케팅 패키지 관리 시스템

---

## 1. 배경 및 문제 정의

### 1.1 현재 상황
현재 Polarad 시스템의 라우팅 구조:

```
app/
├── (admin)/
│   ├── layout.tsx          # 관리자 대시보드 레이아웃 (사이드바 포함)
│   └── admin/
│       ├── page.tsx        # 대시보드 메인
│       ├── clients/        # 클라이언트 관리
│       ├── users/          # 사용자 관리
│       ├── contracts/      # 계약 관리
│       ├── workflows/      # 워크플로우 관리
│       ├── tokens/         # 토큰 관리
│       ├── notifications/  # 알림 관리
│       └── settings/       # 설정
├── admin/
│   ├── login/              # 관리자 로그인
│   └── unauthorized/       # 권한 없음 페이지
└── (user)/                 # 사용자(클라이언트) 영역
```

### 1.2 문제점
1. **라우팅 충돌**: `/admin/clients`로 이동 시 미들웨어가 클라이언트 로그인 화면으로 리다이렉트
2. **중복 경로**: `(admin)/admin/`과 `admin/`이 동시에 존재하여 Next.js 라우팅 혼란
3. **인증 로직 혼선**: 미들웨어에서 `/admin` 경로 처리 시 route group `(admin)`과 일반 `admin` 폴더 구분 불가
4. **일관성 부족**: 관리자 영역의 레이아웃과 인증이 분리되어 있음

### 1.3 영향받는 페이지
- `/admin/clients` - 클라이언트 관리
- `/admin/users` - 사용자 관리
- `/admin/contracts` - 계약 관리
- `/admin/workflows` - 워크플로우 관리
- `/admin/tokens` - 토큰 관리
- `/admin/notifications` - 알림 관리
- `/admin/settings` - 설정

---

## 2. 목표

### 2.1 주요 목표
1. 관리자 대시보드와 클라이언트(사용자) 페이지의 명확한 분리
2. 미들웨어 인증 로직 정상화
3. 일관된 라우팅 구조 확립

### 2.2 성공 지표
- 모든 관리자 메뉴가 로그인 후 정상 접근 가능
- 클라이언트(사용자)가 자신의 대시보드에 정상 접근 가능
- 권한에 따른 접근 제어 정상 동작

---

## 3. 제안 솔루션

### 3.1 Option A: Route Group 통합 (권장)

#### 구조 변경
```
app/
├── (admin)/
│   ├── layout.tsx              # 관리자 공통 레이아웃
│   └── admin/
│       ├── login/page.tsx      # 관리자 로그인 (이동)
│       ├── unauthorized/page.tsx
│       ├── page.tsx            # 대시보드 메인
│       ├── clients/
│       ├── users/
│       ├── contracts/
│       ├── workflows/
│       ├── tokens/
│       ├── notifications/
│       └── settings/
├── (client)/                   # 클라이언트(사용자) 영역
│   ├── layout.tsx              # 클라이언트 공통 레이아웃
│   └── dashboard/
│       ├── page.tsx            # 클라이언트 대시보드
│       ├── reports/            # 리포트
│       └── settings/           # 클라이언트 설정
└── (auth)/                     # 인증 페이지
    ├── login/page.tsx          # 클라이언트 로그인
    └── signup/page.tsx         # 회원가입
```

#### 장점
- Route group으로 레이아웃 분리 명확
- URL 구조는 `/admin/...`, `/dashboard/...`로 깔끔
- 미들웨어 로직 단순화

#### 변경 작업
1. `app/admin/login` → `app/(admin)/admin/login` 이동
2. `app/admin/unauthorized` → `app/(admin)/admin/unauthorized` 이동
3. 기존 `app/admin/` 폴더 삭제
4. 미들웨어 수정 불필요 (경로 유지)

---

### 3.2 Option B: 완전 분리 구조

#### 구조 변경
```
app/
├── admin/                      # 관리자 영역 (route group 제거)
│   ├── layout.tsx              # 관리자 레이아웃
│   ├── login/page.tsx
│   ├── page.tsx
│   ├── clients/
│   ├── users/
│   └── ...
├── client/                     # 클라이언트 영역
│   ├── layout.tsx              # 클라이언트 레이아웃
│   ├── login/page.tsx
│   ├── dashboard/
│   └── ...
└── (public)/                   # 공개 페이지
    ├── page.tsx                # 랜딩 페이지
    └── ...
```

#### 장점
- 디렉토리 구조와 URL이 1:1 대응
- 이해하기 쉬운 구조

#### 단점
- 기존 `(admin)` route group 완전 재작업 필요
- 레이아웃 적용 로직 변경 필요

---

### 3.3 Option C: 현재 구조 유지 + 미들웨어 수정

#### 변경 내용
미들웨어에서 특정 경로 예외 처리 추가

```typescript
// middleware.ts 수정
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/admin/login',
  '/admin/unauthorized',  // 추가
]

// 또는 더 정교한 로직
if (pathname.startsWith('/admin')) {
  // login, unauthorized는 공개 경로
  if (pathname === '/admin/login' || pathname === '/admin/unauthorized') {
    return NextResponse.next()
  }
  // 나머지는 인증 필요
  if (!token || token.type !== 'admin') {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}
```

#### 장점
- 최소한의 변경
- 기존 코드 유지

#### 단점
- 근본적 구조 문제 해결 안 됨
- route group과 일반 폴더 혼재 지속

---

## 4. 권장 솔루션: Option A 상세 구현

### 4.1 파일 이동 계획

| 현재 위치 | 이동 위치 | 비고 |
|-----------|-----------|------|
| `app/admin/login/page.tsx` | `app/(admin)/admin/login/page.tsx` | 관리자 로그인 |
| `app/admin/unauthorized/` | `app/(admin)/admin/unauthorized/` | 권한 없음 |

### 4.2 레이아웃 수정

**`app/(admin)/layout.tsx` 수정**
```typescript
// login, unauthorized 페이지는 사이드바 없이 렌더링
// 조건부 레이아웃 적용 또는 중첩 레이아웃 활용

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children; // 기본은 children만 반환
}
```

**`app/(admin)/admin/layout.tsx` 신규 생성**
```typescript
// 대시보드 레이아웃 (사이드바 포함)
// 기존 (admin)/layout.tsx 내용 이동
```

**`app/(admin)/admin/login/layout.tsx` 신규 생성**
```typescript
// 로그인 페이지 전용 레이아웃 (사이드바 없음)
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-900">{children}</div>;
}
```

### 4.3 미들웨어 로직 확인

```typescript
// middleware.ts - 변경 없음
// /admin/login은 publicPaths에 이미 포함
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/admin/login',  // 이미 존재
]
```

---

## 5. 구현 단계

### Phase 1: 구조 정리 (1단계)
1. [ ] `app/admin/login/` → `app/(admin)/admin/login/` 이동
2. [ ] `app/admin/unauthorized/` → `app/(admin)/admin/unauthorized/` 이동
3. [ ] 기존 `app/admin/` 폴더 삭제
4. [ ] 레이아웃 구조 조정

### Phase 2: 레이아웃 분리 (2단계)
1. [ ] `app/(admin)/admin/login/layout.tsx` 생성 (사이드바 없는 레이아웃)
2. [ ] `app/(admin)/admin/unauthorized/layout.tsx` 생성
3. [ ] 기존 `app/(admin)/layout.tsx`를 `app/(admin)/admin/layout.tsx`로 이동

### Phase 3: 미들웨어 검증 (3단계)
1. [ ] 관리자 로그인 테스트
2. [ ] 각 메뉴 접근 테스트
3. [ ] 권한별 접근 제어 테스트

### Phase 4: 클라이언트 영역 정리 (4단계)
1. [ ] `app/(user)/` 구조 확인 및 정리
2. [ ] 클라이언트 대시보드 레이아웃 구현
3. [ ] 클라이언트 전용 메뉴 구성

---

## 6. 위험 요소 및 대응

| 위험 | 영향 | 대응 방안 |
|------|------|----------|
| 경로 변경으로 인한 기존 링크 깨짐 | 중 | 모든 내부 링크 검토 및 수정 |
| 레이아웃 중첩 오류 | 상 | Next.js 레이아웃 동작 테스트 |
| 세션/쿠키 경로 문제 | 중 | 인증 관련 경로 설정 확인 |
| 캐시 무효화 | 하 | 개발 서버 재시작 |

---

## 7. 테스트 체크리스트

### 관리자 영역
- [ ] 비로그인 상태에서 `/admin` 접근 시 `/admin/login`으로 리다이렉트
- [ ] 로그인 후 `/admin` 대시보드 정상 표시
- [ ] `/admin/clients` 클라이언트 관리 페이지 정상 접근
- [ ] `/admin/users` 사용자 관리 페이지 정상 접근
- [ ] `/admin/contracts` 계약 관리 페이지 정상 접근
- [ ] `/admin/workflows` 워크플로우 관리 페이지 정상 접근
- [ ] `/admin/tokens` 토큰 관리 페이지 정상 접근
- [ ] `/admin/notifications` 알림 관리 페이지 정상 접근
- [ ] `/admin/settings` 설정 페이지 정상 접근
- [ ] 사이드바 네비게이션 정상 동작

### 클라이언트(사용자) 영역
- [ ] 비로그인 상태에서 `/dashboard` 접근 시 `/login`으로 리다이렉트
- [ ] 로그인 후 클라이언트 대시보드 정상 표시
- [ ] 관리자 계정으로 클라이언트 영역 접근 제한

### 인증
- [ ] 관리자 로그인 성공/실패 테스트
- [ ] 클라이언트 로그인 성공/실패 테스트
- [ ] 세션 만료 후 자동 로그아웃
- [ ] 역할 기반 접근 제어 (SUPER, MANAGER, OPERATOR)

---

## 8. 향후 고려사항

### 8.1 추가 기능
- 관리자 로그인 2FA 인증
- 세션 타임아웃 설정
- 접근 로그 기록

### 8.2 성능 최적화
- 라우트 프리페칭
- 레이아웃 캐싱
- 미들웨어 성능 모니터링

---

## 부록: 현재 미들웨어 분석

```typescript
// 현재 middleware.ts 구조
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/admin/login',
]

// 문제점: /admin/login이 publicPaths에 있지만
// route group (admin)/admin/login과 일반 admin/login이 혼재
// Next.js가 어느 페이지를 렌더링할지 모호
```

### 해결 원리
Route group `(admin)`은 URL에 영향을 주지 않음
- `app/(admin)/admin/login/page.tsx` → URL: `/admin/login`
- `app/admin/login/page.tsx` → URL: `/admin/login` (충돌!)

→ 하나로 통합하면 문제 해결
