/**
 * Content Studio 게시 API
 * POST /api/content-studio/publish - 콘텐츠를 마케팅소식에 게시
 */

import { NextRequest, NextResponse } from 'next/server';
import { marked } from 'marked';
import {
  verifyToken,
  extractTokenFromCookie,
  extractTokenFromHeader,
  getContentById,
  updateContent,
  logUsage,
} from '@/lib/content-studio';
import { generateThumbnail } from '@/lib/content-generator';

// 환경변수
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID; // 마케팅소식 베이스
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || '뉴스레터';

// 슬러그 생성
function generateSlug(title: string): string {
  // 한글 → 영어 변환 또는 타임스탬프 기반
  const timestamp = Date.now().toString(36);
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 30);

  return `${cleanTitle}-${timestamp}`;
}

// 카테고리 매핑 (Content Studio → 마케팅소식)
function mapCategoryToKorean(category: string): string {
  const categoryMap: Record<string, string> = {
    'meta-ads': 'Meta 광고',
    'instagram-reels': '인스타그램 릴스',
    'threads': '쓰레드',
    'google-ads': 'Google 광고',
    'marketing-trends': '마케팅 트렌드',
    'ai-trends': 'AI 트렌드',
    'ai-tips': 'AI 활용 팁',
    'ai-news': 'AI 뉴스',
    'faq': 'FAQ',
  };

  return categoryMap[category] || category;
}

// 인증 헬퍼
async function authenticate(request: NextRequest) {
  const cookieToken = extractTokenFromCookie(request.headers.get('cookie'));
  const headerToken = extractTokenFromHeader(request.headers.get('authorization'));
  const token = cookieToken || headerToken;

  if (!token) return null;
  return verifyToken(token);
}

/**
 * POST - 콘텐츠 게시
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

    const body: {
      contentId: string;
      generateThumbnailFlag?: boolean;
    } = await request.json();

    const { contentId, generateThumbnailFlag = true } = body;

    if (!contentId) {
      return NextResponse.json(
        { success: false, error: '콘텐츠 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 콘텐츠 조회
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

    // 이미 게시된 콘텐츠 확인
    if (content.status === 'published' && content.publishedUrl) {
      return NextResponse.json(
        { success: false, error: '이미 게시된 콘텐츠입니다.' },
        { status: 400 }
      );
    }

    // 마크다운 → HTML 변환
    const htmlContent = await marked(content.content, {
      gfm: true,
      breaks: true,
    });

    // 썸네일 생성 (옵션)
    let thumbnailUrl = content.thumbnailUrl;
    if (generateThumbnailFlag && !thumbnailUrl) {
      try {
        const keyword = content.category;
        thumbnailUrl = await generateThumbnail(content.title, keyword);
        console.log('[ContentStudio] Thumbnail generated:', thumbnailUrl);
      } catch (error) {
        console.error('[ContentStudio] Thumbnail generation failed:', error);
        // 썸네일 생성 실패해도 게시는 계속
        thumbnailUrl = '/images/default-thumbnail.jpg';
      }
    }

    // 슬러그 생성
    const slug = generateSlug(content.title);
    const now = new Date().toISOString();

    // 마케팅소식 Airtable에 레코드 생성
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      return NextResponse.json(
        { success: false, error: 'Airtable 설정이 필요합니다.' },
        { status: 500 }
      );
    }

    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

    const airtableRes = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          title: content.title,
          description: content.description || '',
          content: content.content, // 마크다운 저장
          category: mapCategoryToKorean(content.category),
          tags: content.tags,
          seoKeywords: content.seoKeywords || '',
          slug,
          thumbnailUrl: thumbnailUrl || '',
          author: '폴라애드',
          status: 'published',
          publishedAt: now,
          date: now.split('T')[0], // YYYY-MM-DD
          featured: false,
          views: 0,
        },
      }),
    });

    if (!airtableRes.ok) {
      const error = await airtableRes.text();
      console.error('[ContentStudio] Airtable publish error:', error);
      return NextResponse.json(
        { success: false, error: '게시에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 게시 URL 생성
    const publishedUrl = `/marketing-news/${slug}`;

    // Content Studio 콘텐츠 업데이트
    await updateContent(contentId, {
      status: 'published',
      publishedUrl,
      thumbnailUrl,
      htmlContent,
    });

    // 사용량 로그
    await logUsage(payload.clientId, 'publish', 0, 'none');

    return NextResponse.json({
      success: true,
      publishedUrl,
      thumbnailUrl,
      slug,
      message: '게시가 완료되었습니다.',
    });
  } catch (error) {
    console.error('[ContentStudio] Publish error:', error);
    return NextResponse.json(
      { success: false, error: '게시 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
