import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ChevronLeft, User, ChevronRight, Eye } from 'lucide-react';
import { getArticle, getAllSlugs, getRelatedArticles, CATEGORIES } from '@/lib/marketing-news';
import { ArticleCTA, ShareButtons, RelatedArticles, MarkdownContent } from '@/components/marketing-news';
import { ViewCounter } from '@/components/marketing-news/ViewCounter';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 정적 생성을 위한 slug 목록
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// 동적 메타데이터
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: '글을 찾을 수 없습니다' };
  }

  const canonicalUrl = `https://polarad.co.kr/marketing-news/${slug}`;

  return {
    title: article.title,
    description: article.description,
    keywords: article.seo?.keywords || article.tags,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      url: canonicalUrl,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      images: [
        {
          url: article.seo?.ogImage || article.thumbnail,
          width: 1200,
          height: 630,
          alt: `${article.title} - AI 생성 이미지`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [article.seo?.ogImage || article.thumbnail],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(
    slug,
    article.category,
    article.tags,
    3
  );

  const categoryInfo = CATEGORIES[article.category];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: '홈', url: 'https://polarad.co.kr' },
          { name: '마케팅 소식', url: 'https://polarad.co.kr/marketing-news' },
          { name: categoryInfo.label, url: `https://polarad.co.kr/marketing-news/category/${article.category}` },
          { name: article.title, url: `https://polarad.co.kr/marketing-news/${slug}` }
        ]}
      />

      <article>
        {/* Header */}
        <header className="bg-gradient-subtle border-b border-gray-200">
          <div className="container py-10 md:py-16">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <Link href="/marketing-news" className="hover:text-primary transition-colors">
                마케팅 소식
              </Link>
              <ChevronRight size={14} />
              <Link
                href={`/marketing-news/category/${article.category}`}
                className="hover:text-primary transition-colors"
              >
                {categoryInfo.label}
              </Link>
            </nav>

            <div className="max-w-4xl">
              {/* Category Badge */}
              <span className="badge badge-primary mb-6">
                {categoryInfo.label}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {article.title}
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed whitespace-pre-line">
                {article.description}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <User size={18} className="text-gray-400" />
                  <span className="font-medium text-gray-700">{article.author}</span>
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-400" />
                  {formatDate(article.publishedAt)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={18} className="text-gray-400" />
                  {article.readingTime}분 읽기
                </span>
                <span className="flex items-center gap-2">
                  <Eye size={18} className="text-gray-400" />
                  <ViewCounter slug={slug} increment={true} />
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="bg-white">
          <div className="container py-12 md:py-16">
            <div className="grid lg:grid-cols-[1fr_300px] gap-12 xl:gap-16">
              {/* Main Content */}
              <div className="max-w-3xl min-w-0 overflow-hidden">
                {/* Thumbnail */}
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 border border-gray-200">
                  <Image
                    src={article.thumbnail}
                    alt={`${article.title} - ${article.description.slice(0, 80)}`}
                    width={1200}
                    height={675}
                    className="object-cover w-full h-full"
                    priority
                    data-ai-generated="true"
                  />
                  <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/60 text-white text-xs rounded-full backdrop-blur-sm">
                    AI 생성 이미지
                  </div>
                </div>

                {/* Markdown Content - 기존 디자인 시스템 타이포그래피 적용 */}
                <div className="article-content">
                  <MarkdownContent content={article.content} />
                </div>

                {/* CTA */}
                <div className="mt-16">
                  <ArticleCTA source={slug} />
                </div>

                {/* Related Articles */}
                <RelatedArticles articles={relatedArticles} />
              </div>

              {/* Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-6">
                  {/* Share */}
                  <div className="card p-6">
                    <ShareButtons title={article.title} url={`/marketing-news/${slug}`} />
                  </div>

                  {/* Article Info */}
                  <div className="card p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">글 정보</h3>
                    <dl className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">카테고리</dt>
                        <dd className="text-gray-900 font-medium">{categoryInfo.label}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">작성자</dt>
                        <dd className="text-gray-900">{article.author}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">작성일</dt>
                        <dd className="text-gray-900">{formatDate(article.publishedAt)}</dd>
                      </div>
                      {article.updatedAt && article.updatedAt !== article.publishedAt && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">수정일</dt>
                          <dd className="text-gray-900">{formatDate(article.updatedAt)}</dd>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-gray-500">조회수</dt>
                        <dd className="text-gray-900"><ViewCounter slug={slug} /></dd>
                      </div>
                    </dl>
                  </div>

                  {/* Back to List */}
                  <Link
                    href="/marketing-news"
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
                  >
                    <ChevronLeft size={16} />
                    목록으로 돌아가기
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://polarad.co.kr/marketing-news/${slug}`,
              },
              headline: article.title,
              description: article.description,
              image: {
                '@type': 'ImageObject',
                url: `https://polarad.co.kr${article.thumbnail}`,
                width: 1200,
                height: 675,
              },
              author: {
                '@type': 'Organization',
                name: article.author,
                url: 'https://polarad.co.kr',
              },
              publisher: {
                '@type': 'Organization',
                name: '폴라애드',
                url: 'https://polarad.co.kr',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://polarad.co.kr/images/logo-pc.png',
                  width: 200,
                  height: 60,
                },
              },
              datePublished: article.publishedAt,
              dateModified: article.updatedAt || article.publishedAt,
              articleSection: categoryInfo.label,
              keywords: article.tags.join(', '),
              wordCount: article.content.split(/\s+/).filter(Boolean).length,
              inLanguage: 'ko-KR',
            }),
          }}
        />
      </article>
    </>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
