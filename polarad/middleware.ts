import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'polarad-secret-key-change-in-production'
)

// 공개 경로 (인증 불필요)
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/admin/login',
]

// 정적 파일 패턴
const staticPatterns = [
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/images',
  '/fonts',
]

// 관리자 역할별 접근 가능 경로
const adminPermissions: Record<string, string[]> = {
  SUPER: ['*'], // 모든 경로
  MANAGER: [
    '/admin/dashboard',
    '/admin/users',
    '/admin/workflows',
    '/admin/notifications',
    '/admin/contracts',
  ],
  OPERATOR: [
    '/admin/dashboard',
    '/admin/workflows',
    '/admin/notifications',
  ],
}

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'))
}

function isStaticPath(pathname: string): boolean {
  return staticPatterns.some(pattern => pathname.startsWith(pattern))
}

function hasAdminPermission(role: string, pathname: string): boolean {
  const permissions = adminPermissions[role]
  if (!permissions) return false
  if (permissions.includes('*')) return true
  return permissions.some(path => pathname.startsWith(path))
}

async function getTokenPayload(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return null

    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { type: string; role?: string; userId: string }
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. 정적 파일 스킵
  if (isStaticPath(pathname)) {
    return NextResponse.next()
  }

  // 2. 공개 경로 체크
  if (isPublicPath(pathname)) {
    // 이미 로그인된 사용자가 로그인 페이지 접근 시 리다이렉트
    const token = await getTokenPayload(request)

    if (token) {
      if (pathname === '/login' || pathname === '/signup') {
        if (token.type === 'user') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }
      if (pathname === '/admin/login') {
        if (token.type === 'admin') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
      }
    }

    return NextResponse.next()
  }

  // 3. 토큰 검증
  const token = await getTokenPayload(request)

  // 4. 관리자 영역 체크
  if (pathname.startsWith('/admin')) {
    if (!token || token.type !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // 역할 기반 접근 제어
    if (token.role && !hasAdminPermission(token.role, pathname)) {
      return NextResponse.redirect(new URL('/admin/unauthorized', request.url))
    }

    return NextResponse.next()
  }

  // 5. 사용자 영역 체크 (dashboard)
  if (pathname.startsWith('/dashboard')) {
    if (!token || token.type !== 'user') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
  }

  // 6. API 경로는 세션 체크 없이 통과 (API 내부에서 처리)
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // 7. 기타 경로는 인증 필요
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
