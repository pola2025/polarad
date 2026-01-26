/**
 * Content Studio 로그인 API
 * POST /api/content-studio/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getClientByEmail,
  verifyPassword,
  createToken,
  createTokenCookie,
  type LoginRequest,
  type LoginResponse,
} from '@/lib/content-studio';

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // 입력 검증
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 클라이언트 조회
    const client = await getClientByEmail(email);

    if (!client) {
      return NextResponse.json(
        { success: false, error: '등록되지 않은 이메일입니다.' },
        { status: 401 }
      );
    }

    // 계정 상태 확인
    if (client.status === 'suspended') {
      return NextResponse.json(
        { success: false, error: '계정이 일시 정지되었습니다. 관리자에게 문의하세요.' },
        { status: 403 }
      );
    }

    // 비밀번호 검증
    const isValid = await verifyPassword(password, client.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // JWT 토큰 생성
    const token = await createToken({
      clientId: client.id,
      email: client.email,
      name: client.name,
    });

    // 응답 생성 (쿠키 설정)
    const response = NextResponse.json<LoginResponse>({
      success: true,
      token,
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        websiteUrl: client.websiteUrl,
      },
    });

    // HttpOnly 쿠키 설정
    response.headers.set('Set-Cookie', createTokenCookie(token));

    return response;
  } catch (error) {
    console.error('[ContentStudio] Login error:', error);
    return NextResponse.json(
      { success: false, error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
