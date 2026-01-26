/**
 * Content Studio 첫 클라이언트 계정 생성 API
 * POST /api/content-studio/setup/client
 *
 * 셋업 과정에서 첫 번째 클라이언트 계정을 생성합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/content-studio';
import { v4 as uuidv4 } from 'uuid';

interface CreateClientRequest {
  apiKey: string;
  baseId: string;
  name: string;
  email: string;
  password: string;
  websiteUrl?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: CreateClientRequest = await request.json();
    const { apiKey, baseId, name, email, password, websiteUrl } = body;

    // 입력 검증
    if (!apiKey || !baseId || !name || !email || !password) {
      return NextResponse.json(
        { success: false, error: '필수 정보를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 비밀번호 해싱
    const passwordHash = await hashPassword(password);

    // UUID 생성
    const clientId = uuidv4();
    const now = new Date().toISOString();

    // Airtable에 클라이언트 생성
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/Clients`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            id: clientId,
            name,
            email,
            passwordHash,
            websiteUrl: websiteUrl || '',
            airtableBaseId: baseId,
            status: 'active',
            createdAt: now,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        {
          success: false,
          error: error.error?.message || '클라이언트 생성에 실패했습니다.',
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      client: {
        id: clientId,
        name,
        email,
      },
      message: '클라이언트 계정이 생성되었습니다. 로그인 해주세요!',
    });
  } catch (error) {
    console.error('[ContentStudio] Create client error:', error);
    return NextResponse.json(
      { success: false, error: '클라이언트 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
