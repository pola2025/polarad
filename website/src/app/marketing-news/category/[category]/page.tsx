import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Newspaper } from 'lucide-react';
import { getArticlesByCategory, CATEGORIES, type ArticleCategory } from '@/lib/marketing-news';
import { ArticleCard, CategoryFilter } from '@/components/marketing-news';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/seo/FAQPageSchema';

interface PageProps {
  params: Promise<{ category: string }>;
}

// 정적 생성을 위한 카테고리 목록
export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

// 동적 메타데이터
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryInfo = CATEGORIES[category as ArticleCategory];

  if (!categoryInfo) {
    return { title: '카테고리를 찾을 수 없습니다' };
  }

  const canonicalUrl = `https://polarad.co.kr/marketing-news/category/${category}`;

  // 글이 없는 카테고리는 검색 엔진에서 제외
  const articles = await getArticlesByCategory(category as ArticleCategory);
  const hasArticles = articles.length > 0;

  return {
    title: categoryInfo.label,
    description: categoryInfo.description,
    // 글이 없는 카테고리는 noindex 처리
    robots: hasArticles ? { index: true, follow: true } : { index: false, follow: true },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${categoryInfo.label} | 마케팅 소식 | 폴라애드`,
      description: categoryInfo.description,
      type: 'website',
      url: canonicalUrl,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  // 유효한 카테고리인지 확인
  if (!Object.keys(CATEGORIES).includes(category)) {
    notFound();
  }

  const categoryKey = category as ArticleCategory;
  const categoryInfo = CATEGORIES[categoryKey];
  const articles = await getArticlesByCategory(categoryKey);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: '홈', url: 'https://polarad.co.kr' },
          { name: '마케팅 소식', url: 'https://polarad.co.kr/marketing-news' },
          { name: categoryInfo.label, url: `https://polarad.co.kr/marketing-news/category/${category}` }
        ]}
      />

      {/* FAQ 카테고리인 경우 FAQPage 스키마 추가 */}
      {categoryKey === 'faq' && articles.length > 0 && (
        <FAQPageSchema
          faqs={articles.map((article) => ({
            question: article.title,
            answer: article.description,
          }))}
        />
      )}

      {/* Hero Section */}
      <section className="bg-gradient-subtle py-16 md:py-20 border-b border-gray-200">
        <div className="container">
          <div className="max-w-3xl">
            <div className="badge badge-primary mb-6">
              <Newspaper size={16} />
              <span>Marketing Insights</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {categoryInfo.label}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              {categoryInfo.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container">
          {/* Category Filter */}
          <div className="mb-10">
            <CategoryFilter currentCategory={categoryKey} />
          </div>

          {/* Article Grid */}
          {articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Newspaper size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg font-medium">
                이 카테고리에 등록된 글이 없습니다
              </p>
              <p className="text-gray-500 mt-2">
                곧 유용한 마케팅 정보로 찾아뵙겠습니다.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
