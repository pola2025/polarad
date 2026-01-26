/**
 * Content Studio 주제 제안 API
 * POST /api/content-studio/topics/suggest
 *
 * Gemini 3 Flash를 사용하여 키워드 기반 콘텐츠 주제를 생성합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  verifyToken,
  extractTokenFromCookie,
  extractTokenFromHeader,
  logUsage,
  type TopicSuggestRequest,
  type TopicSuggestResponse,
  type ContentCategory,
} from '@/lib/content-studio';

// Gemini 설정
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 카테고리별 프롬프트 컨텍스트
const CATEGORY_CONTEXT: Record<ContentCategory, string> = {
  'meta-ads': 'Meta(Facebook/Instagram) 광고 운영, 광고 계정 관리, 광고 정책, 광고 성과 최적화',
  'instagram-reels': 'Instagram 릴스 제작, 숏폼 콘텐츠 전략, 릴스 알고리즘, 인게이지먼트',
  'threads': 'Threads 앱 활용, 텍스트 기반 SNS 마케팅, Threads 성장 전략',
  'google-ads': 'Google Ads 운영, 검색 광고, 디스플레이 광고, 유튜브 광고, ROAS 최적화',
  'marketing-trends': '디지털 마케팅 트렌드, 최신 마케팅 기법, 마케팅 전략',
  'ai-trends': 'AI 마케팅 도구, ChatGPT 활용, AI 자동화, 생성형 AI 트렌드',
  'ai-tips': 'AI 도구 활용 팁, 업무 자동화, AI 프롬프트 작성법',
  'ai-news': 'AI 최신 뉴스, 새로운 AI 도구 출시, AI 모델 업데이트, AI 서비스 동향',
  'faq': 'SNS 광고 FAQ, 계정 문제 해결, 광고 정책 위반 대응',
};

export async function POST(request: NextRequest): Promise<NextResponse<TopicSuggestResponse>> {
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
    const body: TopicSuggestRequest = await request.json();
    const { keyword, category, count = 10 } = body;

    if (!keyword || !category) {
      return NextResponse.json(
        { success: false, error: '키워드와 카테고리를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Gemini 모델 설정 (flash 사용 - 가벼운 작업)
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const categoryContext = CATEGORY_CONTEXT[category] || '디지털 마케팅';

    const prompt = `당신은 디지털 마케팅 콘텐츠 전문가입니다.
주어진 키워드를 바탕으로 블로그 글 주제 ${count}개를 생성해주세요.

## 카테고리
${category}: ${categoryContext}

## 입력 키워드
${keyword}

## 주제 작성 규칙
1. 실무자가 실제로 검색할 만한 구체적인 주제
2. SEO에 최적화된 제목 형식 (숫자, 방법, 가이드 등 포함)
3. 타겟: 1인 사업자, 인하우스 마케터, 소규모 대표
4. 2026년 기준 최신 트렌드 반영
5. 각 주제는 50자 이내

## 출력 형식
JSON 배열로 주제만 출력하세요:
["주제1", "주제2", "주제3", ...]

JSON 배열만 출력하세요. 다른 설명은 불필요합니다.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // JSON 파싱
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('[ContentStudio] Failed to parse topics:', response);
      return NextResponse.json(
        { success: false, error: '주제 생성에 실패했습니다. 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    const topics: string[] = JSON.parse(jsonMatch[0]);

    // 사용량 로깅
    const tokensUsed = result.response.usageMetadata?.totalTokenCount || 0;
    await logUsage(payload.clientId, 'topic_suggest', tokensUsed, 'gemini-3-flash-preview');

    return NextResponse.json({
      success: true,
      topics: topics.slice(0, count),
    });
  } catch (error) {
    console.error('[ContentStudio] Topic suggest error:', error);
    return NextResponse.json(
      { success: false, error: '주제 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
