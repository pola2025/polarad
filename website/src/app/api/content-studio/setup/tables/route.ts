/**
 * Content Studio Airtable 테이블 자동 생성 API
 * POST /api/content-studio/setup/tables
 *
 * Airtable Meta API를 사용하여 필요한 테이블을 자동으로 생성합니다.
 * 필요한 Airtable 토큰 권한: schema.bases:write, data.records:write
 */

import { NextRequest, NextResponse } from 'next/server';

interface TableField {
  name: string;
  type: string;
  options?: Record<string, unknown>;
}

interface TableSchema {
  name: string;
  description?: string;
  fields: TableField[];
}

// Content Studio에 필요한 테이블 스키마 정의
const TABLES_SCHEMA: TableSchema[] = [
  {
    name: 'Clients',
    description: 'Content Studio 클라이언트 계정',
    fields: [
      { name: 'id', type: 'singleLineText' },
      { name: 'name', type: 'singleLineText' },
      { name: 'email', type: 'email' },
      { name: 'passwordHash', type: 'singleLineText' },
      { name: 'websiteUrl', type: 'url' },
      { name: 'airtableBaseId', type: 'singleLineText' },
      {
        name: 'status',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'active', color: 'greenLight2' },
            { name: 'suspended', color: 'redLight2' },
          ],
        },
      },
      { name: 'createdAt', type: 'dateTime', options: { timeZone: 'Asia/Seoul', dateFormat: { name: 'iso' } } },
    ],
  },
  {
    name: 'ClientTopics',
    description: '클라이언트별 저장된 주제',
    fields: [
      { name: 'clientId', type: 'singleLineText' },
      { name: 'title', type: 'singleLineText' },
      {
        name: 'category',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'meta-ads', color: 'blueLight2' },
            { name: 'instagram-reels', color: 'pinkLight2' },
            { name: 'threads', color: 'grayLight2' },
            { name: 'google-ads', color: 'greenLight2' },
            { name: 'marketing-trends', color: 'purpleLight2' },
            { name: 'ai-trends', color: 'cyanLight2' },
            { name: 'ai-tips', color: 'tealLight2' },
            { name: 'faq', color: 'yellowLight2' },
          ],
        },
      },
      {
        name: 'status',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'pending', color: 'yellowLight2' },
            { name: 'used', color: 'greenLight2' },
            { name: 'archived', color: 'grayLight2' },
          ],
        },
      },
      { name: 'createdAt', type: 'dateTime', options: { timeZone: 'Asia/Seoul', dateFormat: { name: 'iso' } } },
    ],
  },
  {
    name: 'ClientContents',
    description: '클라이언트별 생성된 콘텐츠',
    fields: [
      { name: 'clientId', type: 'singleLineText' },
      { name: 'topicId', type: 'singleLineText' },
      { name: 'title', type: 'singleLineText' },
      { name: 'content', type: 'multilineText' },
      { name: 'plainText', type: 'multilineText' },
      { name: 'htmlContent', type: 'multilineText' },
      { name: 'description', type: 'singleLineText' },
      {
        name: 'category',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'meta-ads', color: 'blueLight2' },
            { name: 'instagram-reels', color: 'pinkLight2' },
            { name: 'threads', color: 'grayLight2' },
            { name: 'google-ads', color: 'greenLight2' },
            { name: 'marketing-trends', color: 'purpleLight2' },
            { name: 'ai-trends', color: 'cyanLight2' },
            { name: 'ai-tips', color: 'tealLight2' },
            { name: 'faq', color: 'yellowLight2' },
          ],
        },
      },
      { name: 'tags', type: 'singleLineText' },
      { name: 'seoKeywords', type: 'singleLineText' },
      {
        name: 'status',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'draft', color: 'yellowLight2' },
            { name: 'published', color: 'greenLight2' },
          ],
        },
      },
      { name: 'publishedUrl', type: 'url' },
      { name: 'thumbnailUrl', type: 'url' },
      { name: 'createdAt', type: 'dateTime', options: { timeZone: 'Asia/Seoul', dateFormat: { name: 'iso' } } },
    ],
  },
  {
    name: 'UsageLog',
    description: '사용량 로그',
    fields: [
      { name: 'clientId', type: 'singleLineText' },
      {
        name: 'action',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'topic_suggest', color: 'blueLight2' },
            { name: 'content_generate', color: 'greenLight2' },
            { name: 'publish', color: 'purpleLight2' },
          ],
        },
      },
      { name: 'tokensUsed', type: 'number', options: { precision: 0 } },
      { name: 'model', type: 'singleLineText' },
      { name: 'createdAt', type: 'dateTime', options: { timeZone: 'Asia/Seoul', dateFormat: { name: 'iso' } } },
    ],
  },
  {
    name: 'UsageSummary',
    description: '월별 사용량 요약',
    fields: [
      { name: 'clientId', type: 'singleLineText' },
      { name: 'yearMonth', type: 'singleLineText' },
      { name: 'topicCount', type: 'number', options: { precision: 0 } },
      { name: 'contentCount', type: 'number', options: { precision: 0 } },
      { name: 'publishCount', type: 'number', options: { precision: 0 } },
      { name: 'totalTokens', type: 'number', options: { precision: 0 } },
    ],
  },
];

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { apiKey, baseId }: { apiKey: string; baseId: string } = body;

    // 입력 검증
    if (!apiKey || !baseId) {
      return NextResponse.json(
        { success: false, error: 'API Key와 Base ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 결과 저장
    const results: { table: string; success: boolean; error?: string }[] = [];

    // 각 테이블 생성
    for (const tableSchema of TABLES_SCHEMA) {
      try {
        const response = await fetch(
          `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: tableSchema.name,
              description: tableSchema.description,
              fields: tableSchema.fields,
            }),
          }
        );

        if (response.ok) {
          results.push({ table: tableSchema.name, success: true });
        } else {
          const error = await response.json();
          // 이미 존재하는 경우
          if (error.error?.type === 'DUPLICATE_TABLE_NAME') {
            results.push({
              table: tableSchema.name,
              success: true,
              error: '이미 존재 (스킵)',
            });
          } else {
            results.push({
              table: tableSchema.name,
              success: false,
              error: error.error?.message || response.statusText,
            });
          }
        }
      } catch (err) {
        results.push({
          table: tableSchema.name,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    const allSuccess = results.every((r) => r.success);

    return NextResponse.json({
      success: allSuccess,
      results,
      message: allSuccess
        ? '모든 테이블이 성공적으로 생성되었습니다.'
        : '일부 테이블 생성에 실패했습니다.',
    });
  } catch (error) {
    console.error('[ContentStudio] Setup error:', error);
    return NextResponse.json(
      { success: false, error: '테이블 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
