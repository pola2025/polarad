/**
 * Content Studio 현재 사용자 조회 API
 * GET /api/content-studio/auth/me
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  verifyToken,
  extractTokenFromCookie,
  extractTokenFromHeader,
  getClientById,
  getUsageSummary,
} from '@/lib/content-studio';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // 토큰 추출 (쿠키 또는 헤더)
    const cookieToken = extractTokenFromCookie(request.headers.get('cookie'));
    const headerToken = extractTokenFromHeader(request.headers.get('authorization'));
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 토큰 검증
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    // 클라이언트 정보 조회
    const client = await getClientById(payload.clientId);

    if (!client) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (client.status === 'suspended') {
      return NextResponse.json(
        { success: false, error: '계정이 일시 정지되었습니다.' },
        { status: 403 }
      );
    }

    // 사용량 조회
    const usage = await getUsageSummary(client.id);

    return NextResponse.json({
      success: true,
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        websiteUrl: client.websiteUrl,
        airtableBaseId: client.airtableBaseId,
      },
      usage,
    });
  } catch (error) {
    console.error('[ContentStudio] Me error:', error);
    return NextResponse.json(
      { success: false, error: '사용자 정보 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
