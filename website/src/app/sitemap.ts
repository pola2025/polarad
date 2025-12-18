import { MetadataRoute } from 'next'
import { getAllArticles, getArticlesByCategory, CATEGORIES } from '@/lib/marketing-news'
import type { ArticleCategory } from '@/lib/marketing-news/types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://polarad.co.kr'
  const currentDate = new Date()

  // 모든 글 가져오기
  const articles = await getAllArticles()

  // 가장 최근 글의 날짜 (마케팅 뉴스 메인 페이지용)
  const latestArticleDate = articles.length > 0
    ? new Date(articles[0].publishedAt)
    : currentDate

  // 기본 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/service`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/estimator`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // 마케팅 뉴스 메인 페이지 - 최신 글 날짜 사용
  const marketingNewsMain: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/marketing-news`,
      lastModified: latestArticleDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // 마케팅 뉴스 카테고리 페이지 - 글이 있는 카테고리만 포함
  const categoryPagesRaw = await Promise.all(
    Object.keys(CATEGORIES).map(async (category) => {
      const categoryArticles = await getArticlesByCategory(category as ArticleCategory)

      // 글이 없는 카테고리는 sitemap에서 제외
      if (categoryArticles.length === 0) {
        return null
      }

      return {
        url: `${baseUrl}/marketing-news/category/${category}`,
        lastModified: new Date(categoryArticles[0].publishedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }
    })
  )

  const categoryPages: MetadataRoute.Sitemap = categoryPagesRaw.filter(
    (page): page is NonNullable<typeof page> => page !== null
  )

  // 마케팅 뉴스 개별 글
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/marketing-news/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...marketingNewsMain,
    ...categoryPages,
    ...articlePages,
  ]
}
