/**
 * 기존 MDX 글들을 에어테이블에 백필하는 API
 * POST /api/backfill-airtable
 */

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

interface ArticleFrontmatter {
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  thumbnail: string;
  featured: boolean;
  status: string;
  seo?: {
    keywords: string[];
    ogImage: string;
  };
}

// 에어테이블에 이미 있는 글인지 확인
async function checkExisting(title: string): Promise<boolean> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    return false;
  }

  const filterFormula = `{title}='${title.replace(/'/g, "\\'")}'`;
  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?filterByFormula=${encodeURIComponent(filterFormula)}`,
    { headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` } }
  );

  const result = await res.json();
  return (result.records?.length || 0) > 0;
}

// 에어테이블에 업로드
async function uploadToAirtable(data: {
  title: string;
  category: string;
  content: string;
  tags: string[];
  seoKeywords: string[];
  slug: string;
  publishedAt: string;
  description: string;
}): Promise<string | null> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    return null;
  }

  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      records: [{
        fields: {
          date: data.publishedAt,
          title: data.title,
          category: data.category,
          content: data.content.substring(0, 100000), // Airtable 필드 제한
          tags: data.tags.join(', '),
          seoKeywords: JSON.stringify(data.seoKeywords),
          publishedAt: data.publishedAt,
          status: 'published',
          slug: data.slug,
          description: data.description
        }
      }]
    })
  });

  const result = await res.json();

  if (result.error) {
    console.error(`Airtable upload error for ${data.slug}:`, result.error);
  }

  return result.records?.[0]?.id || null;
}

// MDX 파일들 가져오기
async function getMdxFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        files.push(...await getMdxFiles(fullPath));
      } else if (item.name.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  } catch {
    // 디렉토리 없으면 빈 배열 반환
  }

  return files;
}

export async function POST() {
  try {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
      return NextResponse.json({ error: 'Airtable 설정이 없습니다' }, { status: 500 });
    }

    const contentDir = path.join(process.cwd(), 'content', 'marketing-news');
    const files = await getMdxFiles(contentDir);

    const results: { slug: string; status: string; airtableId?: string }[] = [];

    for (const file of files) {
      const slug = path.basename(file, '.mdx');
      const fileContent = await fs.readFile(file, 'utf-8');
      const { data, content } = matter(fileContent);
      const frontmatter = data as ArticleFrontmatter;

      // 이미 있는지 확인
      const exists = await checkExisting(frontmatter.title);
      if (exists) {
        results.push({ slug, status: 'skipped (already exists)' });
        continue;
      }

      // 에어테이블에 업로드
      const airtableId = await uploadToAirtable({
        title: frontmatter.title,
        category: frontmatter.category,
        content: content,
        tags: frontmatter.tags || [],
        seoKeywords: frontmatter.seo?.keywords || frontmatter.tags || [],
        slug,
        publishedAt: frontmatter.publishedAt,
        description: frontmatter.description,
      });

      if (airtableId) {
        results.push({ slug, status: 'uploaded', airtableId });
      } else {
        results.push({ slug, status: 'failed' });
      }

      // Rate limit 방지
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const uploaded = results.filter(r => r.status === 'uploaded').length;
    const skipped = results.filter(r => r.status.includes('skipped')).length;
    const failed = results.filter(r => r.status === 'failed').length;

    return NextResponse.json({
      success: true,
      summary: { total: files.length, uploaded, skipped, failed },
      results
    });

  } catch (error) {
    console.error('Backfill error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
