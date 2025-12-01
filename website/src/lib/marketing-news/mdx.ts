import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { Article, ArticleListItem, ArticleFrontmatter, ArticleCategory } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'marketing-news');

// 모든 MDX 파일 경로 가져오기
function getMdxFiles(dir: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getMdxFiles(fullPath));
    } else if (item.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

// 파일 경로에서 slug 추출 (파일명만 사용, 카테고리 폴더 제외)
function getSlugFromPath(filePath: string): string {
  const fileName = path.basename(filePath, '.mdx');
  return fileName;
}

// 단일 글 가져오기
export async function getArticle(slug: string): Promise<Article | null> {
  // slug가 category/filename 형식일 수 있음
  const possiblePaths = [
    path.join(CONTENT_DIR, `${slug}.mdx`),
    path.join(CONTENT_DIR, slug, 'index.mdx'),
  ];

  // 카테고리별 폴더 내 파일도 확인
  const categories = ['meta-ads', 'marketing-trends'];
  for (const category of categories) {
    possiblePaths.push(path.join(CONTENT_DIR, category, `${slug}.mdx`));
  }

  let filePath: string | null = null;

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }

  if (!filePath) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const frontmatter = data as ArticleFrontmatter;

  // 읽기 시간 계산 (분 단위)
  const { minutes } = readingTime(content);

  return {
    ...frontmatter,
    slug,
    content,
    readingTime: Math.ceil(minutes),
  };
}

// 모든 글 목록 가져오기
export async function getAllArticles(): Promise<ArticleListItem[]> {
  const files = getMdxFiles(CONTENT_DIR);
  const articles: ArticleListItem[] = [];

  for (const file of files) {
    const fileContent = fs.readFileSync(file, 'utf-8');
    const { data, content } = matter(fileContent);
    const frontmatter = data as ArticleFrontmatter;

    // published 상태만 포함
    if (frontmatter.status !== 'published') {
      continue;
    }

    const slug = getSlugFromPath(file);
    const { minutes } = readingTime(content);

    articles.push({
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      category: frontmatter.category,
      tags: frontmatter.tags,
      publishedAt: frontmatter.publishedAt,
      thumbnail: frontmatter.thumbnail,
      featured: frontmatter.featured || false,
      readingTime: Math.ceil(minutes),
    });
  }

  // 최신순 정렬
  return articles.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// 카테고리별 글 목록 가져오기
export async function getArticlesByCategory(category: ArticleCategory): Promise<ArticleListItem[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter(article => article.category === category);
}

// Featured 글 가져오기
export async function getFeaturedArticles(limit: number = 3): Promise<ArticleListItem[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter(article => article.featured).slice(0, limit);
}

// 관련 글 가져오기 (같은 카테고리 또는 같은 태그)
export async function getRelatedArticles(
  currentSlug: string,
  category: ArticleCategory,
  tags: string[],
  limit: number = 3
): Promise<ArticleListItem[]> {
  const allArticles = await getAllArticles();

  // 현재 글 제외
  const otherArticles = allArticles.filter(article => article.slug !== currentSlug);

  // 점수 계산: 같은 카테고리 +2, 같은 태그 +1
  const scoredArticles = otherArticles.map(article => {
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

// 모든 slug 가져오기 (정적 생성용)
export async function getAllSlugs(): Promise<string[]> {
  const files = getMdxFiles(CONTENT_DIR);
  return files.map(file => getSlugFromPath(file));
}

// 검색
export async function searchArticles(query: string): Promise<ArticleListItem[]> {
  const allArticles = await getAllArticles();
  const lowerQuery = query.toLowerCase();

  return allArticles.filter(article =>
    article.title.toLowerCase().includes(lowerQuery) ||
    article.description.toLowerCase().includes(lowerQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
