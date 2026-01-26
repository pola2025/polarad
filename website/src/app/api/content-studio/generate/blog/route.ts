/**
 * Content Studio 블로그 콘텐츠 생성 API
 * POST /api/content-studio/generate/blog
 *
 * Gemini 3 Pro를 사용하여 블로그 콘텐츠를 생성합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  verifyToken,
  extractTokenFromCookie,
  extractTokenFromHeader,
  logUsage,
  updateTopicStatus,
  type ContentGenerateRequest,
  type ContentGenerateResponse,
  type ToneType,
  type ContentLength,
} from '@/lib/content-studio';

// Gemini 설정
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 톤앤매너 설명
const TONE_DESCRIPTIONS: Record<ToneType, string> = {
  professional: '전문적이고 신뢰감 있는 톤. 정확한 정보와 데이터 중심.',
  friendly: '친근하고 따뜻한 톤. 독자와 대화하듯 편안하게.',
  casual: '캐주얼하고 가벼운 톤. 이모지 적절히 사용, 쉬운 표현.',
};

// 마크다운 → 플레인텍스트 변환 (네이버 블로그용)
function markdownToPlainText(markdown: string): string {
  return markdown
    // 제목을 줄바꿈 + 볼드 효과로 변환
    .replace(/^### (.+)$/gm, '\n■ $1\n')
    .replace(/^## (.+)$/gm, '\n▶ $1\n')
    .replace(/^# (.+)$/gm, '\n【$1】\n')
    // 볼드/이탤릭 제거
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    // 링크를 텍스트만 남김
    .replace(/\[(.+?)\]\((.+?)\)/g, '$1 ($2)')
    // 리스트 변환
    .replace(/^- /gm, '• ')
    .replace(/^\d+\. /gm, '→ ')
    // 코드 블록 제거
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`(.+?)`/g, '$1')
    // 여러 줄바꿈 정리
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function POST(request: NextRequest): Promise<NextResponse<ContentGenerateResponse>> {
  try {
    // 인증 확인
    const cookieToken = extractTokenFromCookie(request.headers.get('cookie'));
    const headerToken = extractTokenFromHeader(request.headers.get('authorization'));
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    // 요청 파싱
    const body: ContentGenerateRequest = await request.json();
    const { topic, category, tone, length, topicId } = body;

    if (!topic || !category || !tone || !length) {
      return NextResponse.json(
        { success: false, error: '필수 정보를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // Gemini Pro 모델 설정 (콘텐츠 생성은 Pro 사용)
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-pro-preview',
      generationConfig: {
        maxOutputTokens: 8192,
      },
    });

    const toneDescription = TONE_DESCRIPTIONS[tone];
    const targetLength = length as ContentLength;

    const prompt = `당신은 디지털 마케팅 콘텐츠 전문가입니다.
주어진 주제로 블로그 글을 작성해주세요.

## 주제
${topic}

## 카테고리
${category}

## 톤앤매너
${toneDescription}

## 분량
${targetLength}자 내외 (한글 기준)

## 작성 규칙
1. **마크다운 형식**: 제목(##), 소제목(###), 리스트(-), 강조(**) 사용
2. **SEO 최적화**: 핵심 키워드를 제목과 본문에 자연스럽게 배치
3. **구조**: 도입부 → 본문 (3-4개 섹션) → 마무리
4. **실용적**: 독자가 바로 적용할 수 있는 구체적인 정보
5. **2026년 기준**: 최신 트렌드와 정보 반영
6. **CTA 포함**: 글 마지막에 자연스러운 행동 유도

## 출력 형식 (JSON만 출력)
{
  "title": "SEO 최적화된 제목 (50자 이내)",
  "description": "메타 설명 (150자 이내, 클릭 유도)",
  "content": "마크다운 형식의 본문 (${targetLength}자 내외)",
  "tags": ["태그1", "태그2", "태그3", "태그4", "태그5"],
  "seoKeywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"]
}

JSON만 출력하세요. 다른 설명은 불필요합니다.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // JSON 파싱
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[ContentStudio] Failed to parse content:', response);
      return NextResponse.json(
        { success: false, error: '콘텐츠 생성에 실패했습니다. 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    const generated = JSON.parse(jsonMatch[0]);

    // 플레인텍스트 변환 (네이버 블로그용)
    const plainText = markdownToPlainText(generated.content);

    // 주제 상태 업데이트 (있으면)
    if (topicId) {
      await updateTopicStatus(topicId, 'used');
    }

    // 사용량 로깅
    const tokensUsed = result.response.usageMetadata?.totalTokenCount || 0;
    await logUsage(payload.clientId, 'content_generate', tokensUsed, 'gemini-3-pro-preview');

    return NextResponse.json({
      success: true,
      content: {
        title: generated.title,
        content: generated.content,
        plainText,
        description: generated.description,
        tags: generated.tags || [],
        seoKeywords: generated.seoKeywords || [],
      },
      tokensUsed,
    });
  } catch (error) {
    console.error('[ContentStudio] Content generate error:', error);
    return NextResponse.json(
      { success: false, error: '콘텐츠 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
