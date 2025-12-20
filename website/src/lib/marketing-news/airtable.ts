/**
 * Airtable 기반 마케팅 소식 조회
 * MDX 파일 대신 Airtable에서 콘텐츠를 가져옵니다.
 */

import type { Article, ArticleListItem, ArticleCategory } from './types';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || '뉴스레터';

interface AirtableRecord {
  id: string;
  fields: {
    date?: string;
    title?: string;
    description?: string;
    category?: string;
    content?: string;
    tags?: string;
    seoKeywords?: string;
    status?: string;
    slug?: string;
    thumbnailUrl?: string;
    views?: number;
    publishedAt?: string;
    featured?: boolean;
    author?: string;
  };
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

// Airtable API 호출 헬퍼
async function fetchAirtable(
  filterFormula?: string,
  sort?: { field: string; direction: 'asc' | 'desc' }[]
): Promise<AirtableRecord[]> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.warn('[Airtable] API credentials not configured');
    return [];
  }

  const params = new URLSearchParams();

  if (filterFormula) {
    params.append('filterByFormula', filterFormula);
  }

  if (sort) {
    sort.forEach((s, i) => {
      params.append(`sort[${i}][field]`, s.field);
      params.append(`sort[${i}][direction]`, s.direction);
    });
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
      next: { revalidate: 300 }, // 5분 캐시
    });

    if (!res.ok) {
      console.error('[Airtable] API error:', res.status, res.statusText);
      return [];
    }

    const data: AirtableResponse = await res.json();
    return data.records;
  } catch (error) {
    console.error('[Airtable] Fetch error:', error);
    return [];
  }
}

// 카테고리 매핑 (Airtable 값 → 타입)
function mapCategory(category: string | undefined): ArticleCategory {
  const categoryMap: Record<string, ArticleCategory> = {
    'Meta 광고': 'meta-ads',
    'meta-ads': 'meta-ads',
    '인스타그램 릴스': 'instagram-reels',
    'instagram-reels': 'instagram-reels',
    '쓰레드': 'threads',
    'threads': 'threads',
    'Google 광고': 'google-ads',
    'google-ads': 'google-ads',
    '마케팅 트렌드': 'marketing-trends',
    'marketing-trends': 'marketing-trends',
    'AI 트렌드': 'ai-trends',
    'ai-trends': 'ai-trends',
    'AI 활용 팁': 'ai-tips',
    'ai-tips': 'ai-tips',
    'FAQ': 'faq',
    'faq': 'faq',
    'SNS CS문제': 'faq', // SNS CS 문제는 FAQ로 매핑
  };

  return categoryMap[category || ''] || 'marketing-trends';
}

// 태그 파싱 (쉼표 구분 문자열 → 배열)
function parseTags(tags: string | undefined): string[] {
  if (!tags) return [];
  return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
}

// 읽기 시간 계산 (분)
function calculateReadingTime(content: string | undefined): number {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// Airtable 레코드 → ArticleListItem 변환
function recordToListItem(record: AirtableRecord): ArticleListItem {
  const { fields } = record;

  return {
    slug: fields.slug || record.id,
    title: fields.title || '제목 없음',
    description: fields.description || '',
    category: mapCategory(fields.category),
    tags: parseTags(fields.tags),
    publishedAt: fields.publishedAt || fields.date || new Date().toISOString(),
    thumbnail: fields.thumbnailUrl || '/images/default-thumbnail.jpg',
    featured: fields.featured || false,
    readingTime: calculateReadingTime(fields.content),
  };
}

// Airtable 레코드 → Article 변환
function recordToArticle(record: AirtableRecord): Article {
  const { fields } = record;

  return {
    slug: fields.slug || record.id,
    title: fields.title || '제목 없음',
    description: fields.description || '',
    category: mapCategory(fields.category),
    tags: parseTags(fields.tags),
    author: fields.author || '폴라애드',
    publishedAt: fields.publishedAt || fields.date || new Date().toISOString(),
    thumbnail: fields.thumbnailUrl || '/images/default-thumbnail.jpg',
    featured: fields.featured || false,
    status: (fields.status as 'draft' | 'published' | 'archived') || 'draft',
    content: fields.content || '',
    readingTime: calculateReadingTime(fields.content),
  };
}

/**
 * 모든 published 글 목록 가져오기
 */
export async function getAllArticles(): Promise<ArticleListItem[]> {
  const records = await fetchAirtable(
    "{status}='published'",
    [{ field: 'publishedAt', direction: 'desc' }]
  );

  return records.map(recordToListItem);
}

/**
 * 단일 글 가져오기 (slug 기준)
 */
export async function getArticle(slug: string): Promise<Article | null> {
  const records = await fetchAirtable(
    `AND({slug}='${slug}', {status}='published')`
  );

  if (records.length === 0) {
    return null;
  }

  return recordToArticle(records[0]);
}

/**
 * 카테고리별 글 목록 가져오기
 */
export async function getArticlesByCategory(
  category: ArticleCategory
): Promise<ArticleListItem[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter((article) => article.category === category);
}

/**
 * Featured 글 가져오기
 */
export async function getFeaturedArticles(
  limit: number = 3
): Promise<ArticleListItem[]> {
  const records = await fetchAirtable(
    "AND({status}='published', {featured}=TRUE())",
    [{ field: 'publishedAt', direction: 'desc' }]
  );

  return records.slice(0, limit).map(recordToListItem);
}

/**
 * 관련 글 가져오기 (같은 카테고리 또는 같은 태그)
 */
export async function getRelatedArticles(
  currentSlug: string,
  category: ArticleCategory,
  tags: string[],
  limit: number = 3
): Promise<ArticleListItem[]> {
  const allArticles = await getAllArticles();

  // 현재 글 제외
  const otherArticles = allArticles.filter(
    (article) => article.slug !== currentSlug
  );

  // 점수 계산: 같은 카테고리 +2, 같은 태그 +1
  const scoredArticles = otherArticles.map((article) => {
    let score = 0;
    if (article.category === category) score += 2;
    for (const tag of article.tags) {
      if (tags.includes(tag)) score += 1;
    }
    return { ...article, score };
  });

  // 점수 높은 순으로 정렬
  scoredArticles.sort((a, b) => b.score - a.score);

  return scoredArticles.slice(0, limit);
}

/**
 * 모든 slug 가져오기 (정적 생성용)
 */
export async function getAllSlugs(): Promise<string[]> {
  const records = await fetchAirtable("{status}='published'");
  return records.map((record) => record.fields.slug || record.id);
}

/**
 * 검색
 */
export async function searchArticles(query: string): Promise<ArticleListItem[]> {
  const allArticles = await getAllArticles();
  const lowerQuery = query.toLowerCase();

  return allArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.description.toLowerCase().includes(lowerQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
