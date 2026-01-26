/**
 * Content Studio 주제 CRUD API
 * GET /api/content-studio/topics - 주제 목록
 * POST /api/content-studio/topics - 주제 저장
 * DELETE /api/content-studio/topics - 주제 삭제
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  verifyToken,
  extractTokenFromCookie,
  extractTokenFromHeader,
  getTopicsByClient,
  createTopic,
  deleteTopic,
  updateTopicStatus,
  type TopicSaveRequest,
  type TopicStatus,
} from '@/lib/content-studio';

// 인증 헬퍼
async function authenticate(request: NextRequest) {
  const cookieToken = extractTokenFromCookie(request.headers.get('cookie'));
  const headerToken = extractTokenFromHeader(request.headers.get('authorization'));
  const token = cookieToken || headerToken;

  if (!token) return null;
  return verifyToken(token);
}

/**
 * GET - 주제 목록 조회
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await authenticate(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 쿼리 파라미터에서 status 필터 확인
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as TopicStatus | null;

    const topics = await getTopicsByClient(
      payload.clientId,
      status || undefined
    );

    return NextResponse.json({
      success: true,
      topics,
    });
  } catch (error) {
    console.error('[ContentStudio] Get topics error:', error);
    return NextResponse.json(
      { success: false, error: '주제 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * POST - 주제 저장 (여러 개 한번에)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await authenticate(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body: TopicSaveRequest = await request.json();
    const { titles, category } = body;

    if (!titles || titles.length === 0 || !category) {
      return NextResponse.json(
        { success: false, error: '저장할 주제와 카테고리를 선택해주세요.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    let savedCount = 0;

    // 각 주제 저장
    for (const title of titles) {
      const id = await createTopic({
        clientId: payload.clientId,
        title,
        category,
        status: 'pending',
        createdAt: now,
      });

      if (id) savedCount++;
    }

    return NextResponse.json({
      success: true,
      savedCount,
      message: `${savedCount}개 주제가 저장되었습니다.`,
    });
  } catch (error) {
    console.error('[ContentStudio] Save topics error:', error);
    return NextResponse.json(
      { success: false, error: '주제 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - 주제 삭제
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await authenticate(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get('id');

    if (!topicId) {
      return NextResponse.json(
        { success: false, error: '삭제할 주제 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const success = await deleteTopic(topicId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: '주제 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '주제가 삭제되었습니다.',
    });
  } catch (error) {
    console.error('[ContentStudio] Delete topic error:', error);
    return NextResponse.json(
      { success: false, error: '주제 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - 주제 상태 변경
 */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await authenticate(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body: { id: string; status: TopicStatus } = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: '주제 ID와 상태가 필요합니다.' },
        { status: 400 }
      );
    }

    const success = await updateTopicStatus(id, status);

    if (!success) {
      return NextResponse.json(
        { success: false, error: '주제 상태 변경에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '주제 상태가 변경되었습니다.',
    });
  } catch (error) {
    console.error('[ContentStudio] Update topic error:', error);
    return NextResponse.json(
      { success: false, error: '주제 상태 변경 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
