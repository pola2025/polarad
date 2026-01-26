/**
 * Content Studio Airtable 클라이언트 연동
 * 클라이언트 계정 관리 및 데이터 조회
 */

import type {
  AirtableClient,
  AirtableClientTopic,
  AirtableClientContent,
  AirtableUsageLog,
  AirtableUsageSummary,
  TopicStatus,
  ContentStatus,
  UsageAction,
  ContentCategory,
} from './types';

// 환경변수
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.CONTENT_STUDIO_BASE_ID;

// 테이블명
const TABLES = {
  CLIENTS: 'Clients',
  TOPICS: 'ClientTopics',
  CONTENTS: 'ClientContents',
  USAGE_LOG: 'UsageLog',
  USAGE_SUMMARY: 'UsageSummary',
};

// ============================================
// Airtable API 헬퍼
// ============================================

interface AirtableRecord<T> {
  id: string;
  fields: T;
  createdTime?: string;
}

interface AirtableResponse<T> {
  records: AirtableRecord<T>[];
  offset?: string;
}

async function airtableFetch<T>(
  table: string,
  options: {
    filterFormula?: string;
    sort?: { field: string; direction: 'asc' | 'desc' }[];
    maxRecords?: number;
    fields?: string[];
  } = {}
): Promise<AirtableRecord<T>[]> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.warn('[ContentStudio] Airtable credentials not configured');
    return [];
  }

  const params = new URLSearchParams();

  if (options.filterFormula) {
    params.append('filterByFormula', options.filterFormula);
  }

  if (options.sort) {
    options.sort.forEach((s, i) => {
      params.append(`sort[${i}][field]`, s.field);
      params.append(`sort[${i}][direction]`, s.direction);
    });
  }

  if (options.maxRecords) {
    params.append('maxRecords', String(options.maxRecords));
  }

  if (options.fields) {
    options.fields.forEach((f) => params.append('fields[]', f));
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('[ContentStudio] Airtable error:', res.status, res.statusText);
    return [];
  }

  const data: AirtableResponse<T> = await res.json();
  return data.records;
}

async function airtableCreate<T>(
  table: string,
  fields: Partial<T>
): Promise<AirtableRecord<T> | null> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.warn('[ContentStudio] Airtable credentials not configured');
    return null;
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error('[ContentStudio] Airtable create error:', error);
    return null;
  }

  return res.json();
}

async function airtableUpdate<T>(
  table: string,
  recordId: string,
  fields: Partial<T>
): Promise<AirtableRecord<T> | null> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.warn('[ContentStudio] Airtable credentials not configured');
    return null;
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}/${recordId}`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error('[ContentStudio] Airtable update error:', error);
    return null;
  }

  return res.json();
}

async function airtableDelete(table: string, recordId: string): Promise<boolean> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.warn('[ContentStudio] Airtable credentials not configured');
    return false;
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}/${recordId}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
  });

  return res.ok;
}

// ============================================
// 클라이언트 관리
// ============================================

interface ClientFields {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  websiteUrl?: string;
  airtableBaseId?: string;
  status: string;
  createdAt: string;
}

export async function getClientByEmail(email: string): Promise<AirtableClient | null> {
  const records = await airtableFetch<ClientFields>(TABLES.CLIENTS, {
    filterFormula: `{email}='${email}'`,
    maxRecords: 1,
  });

  if (records.length === 0) return null;

  const { fields, id: recordId } = records[0];
  return {
    id: fields.id || recordId,
    name: fields.name,
    email: fields.email,
    passwordHash: fields.passwordHash,
    websiteUrl: fields.websiteUrl,
    airtableBaseId: fields.airtableBaseId,
    status: fields.status as AirtableClient['status'],
    createdAt: fields.createdAt,
  };
}

export async function getClientById(clientId: string): Promise<AirtableClient | null> {
  const records = await airtableFetch<ClientFields>(TABLES.CLIENTS, {
    filterFormula: `{id}='${clientId}'`,
    maxRecords: 1,
  });

  if (records.length === 0) return null;

  const { fields, id: recordId } = records[0];
  return {
    id: fields.id || recordId,
    name: fields.name,
    email: fields.email,
    passwordHash: fields.passwordHash,
    websiteUrl: fields.websiteUrl,
    airtableBaseId: fields.airtableBaseId,
    status: fields.status as AirtableClient['status'],
    createdAt: fields.createdAt,
  };
}

// ============================================
// 주제 관리
// ============================================

interface TopicFields {
  clientId: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
}

export async function getTopicsByClient(
  clientId: string,
  status?: TopicStatus
): Promise<(AirtableClientTopic & { id: string })[]> {
  let filter = `{clientId}='${clientId}'`;
  if (status) {
    filter = `AND(${filter}, {status}='${status}')`;
  }

  const records = await airtableFetch<TopicFields>(TABLES.TOPICS, {
    filterFormula: filter,
    sort: [{ field: 'createdAt', direction: 'desc' }],
  });

  return records.map(({ id, fields }) => ({
    id,
    clientId: fields.clientId,
    title: fields.title,
    category: fields.category as ContentCategory,
    status: fields.status as TopicStatus,
    createdAt: fields.createdAt,
  }));
}

export async function createTopic(
  topic: Omit<AirtableClientTopic, 'id'>
): Promise<string | null> {
  const record = await airtableCreate<TopicFields>(TABLES.TOPICS, topic as unknown as Partial<TopicFields>);
  return record?.id || null;
}

export async function updateTopicStatus(
  topicId: string,
  status: TopicStatus
): Promise<boolean> {
  const record = await airtableUpdate<TopicFields>(TABLES.TOPICS, topicId, { status });
  return record !== null;
}

export async function deleteTopic(topicId: string): Promise<boolean> {
  return airtableDelete(TABLES.TOPICS, topicId);
}

// ============================================
// 콘텐츠 관리
// ============================================

interface ContentFields {
  clientId: string;
  topicId?: string;
  title: string;
  content: string;
  plainText: string;
  htmlContent?: string;
  description?: string;
  category: string;
  tags: string;
  seoKeywords?: string;
  status: string;
  publishedUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export async function getContentsByClient(
  clientId: string,
  status?: ContentStatus
): Promise<(AirtableClientContent & { id: string })[]> {
  let filter = `{clientId}='${clientId}'`;
  if (status) {
    filter = `AND(${filter}, {status}='${status}')`;
  }

  const records = await airtableFetch<ContentFields>(TABLES.CONTENTS, {
    filterFormula: filter,
    sort: [{ field: 'createdAt', direction: 'desc' }],
  });

  return records.map(({ id, fields }) => ({
    id,
    clientId: fields.clientId,
    topicId: fields.topicId,
    title: fields.title,
    content: fields.content,
    plainText: fields.plainText,
    htmlContent: fields.htmlContent,
    description: fields.description,
    category: fields.category as ContentCategory,
    tags: fields.tags,
    seoKeywords: fields.seoKeywords,
    status: fields.status as ContentStatus,
    publishedUrl: fields.publishedUrl,
    thumbnailUrl: fields.thumbnailUrl,
    createdAt: fields.createdAt,
  }));
}

export async function getContentById(
  contentId: string
): Promise<(AirtableClientContent & { id: string }) | null> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) return null;

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLES.CONTENTS)}/${contentId}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const { id, fields } = (await res.json()) as AirtableRecord<ContentFields>;

  return {
    id,
    clientId: fields.clientId,
    topicId: fields.topicId,
    title: fields.title,
    content: fields.content,
    plainText: fields.plainText,
    htmlContent: fields.htmlContent,
    description: fields.description,
    category: fields.category as ContentCategory,
    tags: fields.tags,
    seoKeywords: fields.seoKeywords,
    status: fields.status as ContentStatus,
    publishedUrl: fields.publishedUrl,
    thumbnailUrl: fields.thumbnailUrl,
    createdAt: fields.createdAt,
  };
}

export async function createContent(
  content: Omit<AirtableClientContent, 'id'>
): Promise<string | null> {
  const record = await airtableCreate<ContentFields>(TABLES.CONTENTS, content as unknown as Partial<ContentFields>);
  return record?.id || null;
}

export async function updateContent(
  contentId: string,
  updates: Partial<AirtableClientContent>
): Promise<boolean> {
  const record = await airtableUpdate<ContentFields>(TABLES.CONTENTS, contentId, updates as unknown as Partial<ContentFields>);
  return record !== null;
}

// ============================================
// 사용량 관리
// ============================================

interface UsageLogFields {
  clientId: string;
  action: string;
  tokensUsed: number;
  model: string;
  createdAt: string;
}

interface UsageSummaryFields {
  clientId: string;
  yearMonth: string;
  topicCount: number;
  contentCount: number;
  publishCount: number;
  totalTokens: number;
}

export async function logUsage(
  clientId: string,
  action: UsageAction,
  tokensUsed: number,
  model: string
): Promise<void> {
  const now = new Date().toISOString();

  // 로그 추가
  await airtableCreate<UsageLogFields>(TABLES.USAGE_LOG, {
    clientId,
    action,
    tokensUsed,
    model,
    createdAt: now,
  });

  // 월별 요약 업데이트
  const yearMonth = now.slice(0, 7); // 2026-01
  await updateUsageSummary(clientId, yearMonth, action, tokensUsed);
}

async function updateUsageSummary(
  clientId: string,
  yearMonth: string,
  action: UsageAction,
  tokensUsed: number
): Promise<void> {
  // 기존 요약 조회
  const records = await airtableFetch<UsageSummaryFields>(TABLES.USAGE_SUMMARY, {
    filterFormula: `AND({clientId}='${clientId}', {yearMonth}='${yearMonth}')`,
    maxRecords: 1,
  });

  if (records.length === 0) {
    // 새로 생성
    const newSummary: Partial<UsageSummaryFields> = {
      clientId,
      yearMonth,
      topicCount: action === 'topic_suggest' ? 1 : 0,
      contentCount: action === 'content_generate' ? 1 : 0,
      publishCount: action === 'publish' ? 1 : 0,
      totalTokens: tokensUsed,
    };
    await airtableCreate<UsageSummaryFields>(TABLES.USAGE_SUMMARY, newSummary);
  } else {
    // 업데이트
    const existing = records[0];
    const updates: Partial<UsageSummaryFields> = {
      totalTokens: (existing.fields.totalTokens || 0) + tokensUsed,
    };

    if (action === 'topic_suggest') {
      updates.topicCount = (existing.fields.topicCount || 0) + 1;
    } else if (action === 'content_generate') {
      updates.contentCount = (existing.fields.contentCount || 0) + 1;
    } else if (action === 'publish') {
      updates.publishCount = (existing.fields.publishCount || 0) + 1;
    }

    await airtableUpdate<UsageSummaryFields>(TABLES.USAGE_SUMMARY, existing.id, updates);
  }
}

export async function getUsageSummary(
  clientId: string,
  yearMonth?: string
): Promise<AirtableUsageSummary | null> {
  const targetMonth = yearMonth || new Date().toISOString().slice(0, 7);

  const records = await airtableFetch<UsageSummaryFields>(TABLES.USAGE_SUMMARY, {
    filterFormula: `AND({clientId}='${clientId}', {yearMonth}='${targetMonth}')`,
    maxRecords: 1,
  });

  if (records.length === 0) {
    return {
      clientId,
      yearMonth: targetMonth,
      topicCount: 0,
      contentCount: 0,
      publishCount: 0,
      totalTokens: 0,
    };
  }

  const { id, fields } = records[0];
  return {
    id,
    clientId: fields.clientId,
    yearMonth: fields.yearMonth,
    topicCount: fields.topicCount || 0,
    contentCount: fields.contentCount || 0,
    publishCount: fields.publishCount || 0,
    totalTokens: fields.totalTokens || 0,
  };
}

// ============================================
// 대시보드 통계
// ============================================

export async function getDashboardStats(clientId: string) {
  const [pendingTopics, draftContents, publishedContents, monthlyUsage] = await Promise.all([
    getTopicsByClient(clientId, 'pending'),
    getContentsByClient(clientId, 'draft'),
    getContentsByClient(clientId, 'published'),
    getUsageSummary(clientId),
  ]);

  return {
    pendingTopics: pendingTopics.length,
    draftContents: draftContents.length,
    publishedContents: publishedContents.length,
    monthlyUsage: {
      topicCount: monthlyUsage?.topicCount || 0,
      contentCount: monthlyUsage?.contentCount || 0,
      publishCount: monthlyUsage?.publishCount || 0,
    },
  };
}
