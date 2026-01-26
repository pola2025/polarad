/**
 * Content Studio 콘텐츠 CRUD API
 * GET /api/content-studio/contents - 콘텐츠 목록
 * POST /api/content-studio/contents - 콘텐츠 저장
 * PATCH /api/content-studio/contents - 콘텐츠 수정
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  verifyToken,
  extractTokenFromCookie,
  extractTokenFromHeader,
  getContentsByClient,
  getContentById,
  createContent,
  updateContent,
  type ContentStatus,
  type AirtableClientContent,
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
 * GET - 콘텐츠 목록 또는 단일 콘텐츠 조회
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

    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('id');
    const status = searchParams.get('status') as ContentStatus | null;

    // 단일 콘텐츠 조회
    if (contentId) {
      const content = await getContentById(contentId);

      if (!content) {
        return NextResponse.json(
          { success: false, error: '콘텐츠를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      // 권한 확인
      if (content.clientId !== payload.clientId) {
        return NextResponse.json(
          { success: false, error: '접근 권한이 없습니다.' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        content,
      });
    }

    // 목록 조회
    const contents = await getContentsByClient(
      payload.clientId,
      status || undefined
    );

    return NextResponse.json({
      success: true,
      contents,
    });
  } catch (error) {
    console.error('[ContentStudio] Get contents error:', error);
    return NextResponse.json(
      { success: false, error: '콘텐츠 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * POST - 새 콘텐츠 저장 (초안)
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

    const body: Partial<AirtableClientContent> = await request.json();

    if (!body.title || !body.content || !body.category) {
      return NextResponse.json(
        { success: false, error: '제목, 내용, 카테고리는 필수입니다.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const contentData: Omit<AirtableClientContent, 'id'> = {
      clientId: payload.clientId,
      topicId: body.topicId,
      title: body.title,
      content: body.content,
      plainText: body.plainText || '',
      htmlContent: body.htmlContent,
      description: body.description,
      category: body.category,
      tags: body.tags || '',
      seoKeywords: body.seoKeywords,
      status: 'draft',
      createdAt: now,
    };

    const contentId = await createContent(contentData);

    if (!contentId) {
      return NextResponse.json(
        { success: false, error: '콘텐츠 저장에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      contentId,
      message: '콘텐츠가 저장되었습니다.',
    });
  } catch (error) {
    console.error('[ContentStudio] Save content error:', error);
    return NextResponse.json(
      { success: false, error: '콘텐츠 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - 콘텐츠 수정
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

    const body: { id: string } & Partial<AirtableClientContent> = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: '콘텐츠 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 권한 확인
    const existing = await getContentById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: '콘텐츠를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (existing.clientId !== payload.clientId) {
      return NextResponse.json(
        { success: false, error: '접근 권한이 없습니다.' },
        { status: 403 }
      );
    }

    const success = await updateContent(id, updates);

    if (!success) {
      return NextResponse.json(
        { success: false, error: '콘텐츠 수정에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '콘텐츠가 수정되었습니다.',
    });
  } catch (error) {
    console.error('[ContentStudio] Update content error:', error);
    return NextResponse.json(
      { success: false, error: '콘텐츠 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
