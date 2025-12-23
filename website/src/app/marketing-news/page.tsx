import type { Metadata } from 'next';
import { Newspaper } from 'lucide-react';
import { getAllArticles, getFeaturedArticles } from '@/lib/marketing-news';
import { ArticleCard, CategoryFilter } from '@/components/marketing-news';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: '마케팅 소식',
  description: 'Meta 광고 운영 팁, 온라인 마케팅 트렌드, 실전 가이드를 확인하세요. 중소기업과 1인 사업자를 위한 실용적인 마케팅 정보를 제공합니다.',
  keywords: ['마케팅 트렌드', 'Meta 광고 팁', 'SNS 마케팅', 'AI 마케팅', '온라인 마케팅', '디지털 마케팅', '중소기업 마케팅'],
  alternates: {
    canonical: 'https://polarad.co.kr/marketing-news',
  },
  openGraph: {
    title: '마케팅 소식 | 폴라애드',
    description: 'Meta 광고 운영 팁, 온라인 마케팅 트렌드, 실전 가이드',
    type: 'website',
    url: 'https://polarad.co.kr/marketing-news',
  },
  twitter: {
    card: 'summary_large_image',
    title: '마케팅 소식 | 폴라애드',
    description: 'Meta 광고 운영 팁, 온라인 마케팅 트렌드, 실전 가이드',
  },
};

export default async function MarketingNewsPage() {
  const [allArticles, featuredArticles] = await Promise.all([
    getAllArticles(),
    getFeaturedArticles(1),
  ]);

  const regularArticles = allArticles.filter(
    (article) => !featuredArticles.some((f) => f.slug === article.slug)
  );

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: '홈', url: 'https://polarad.co.kr' },
          { name: '마케팅 소식', url: 'https://polarad.co.kr/marketing-news' }
        ]}
      />

      {/* Hero Section - 기존 디자인 시스템 적용 */}
      <section className="bg-gradient-subtle py-16 md:py-20 border-b border-gray-200">
        <div className="container">
          <div className="max-w-3xl">
            <div className="badge badge-primary mb-6">
              <Newspaper size={16} />
              <span>Marketing Insights</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              마케팅 소식
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Meta 광고 운영 팁부터 최신 마케팅 트렌드까지,
              <br className="hidden md:block" />
              중소기업을 위한 <strong className="text-primary">실용적인 마케팅 정보</strong>를 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container">
          {/* Category Filter */}
          <div className="mb-10">
            <CategoryFilter currentCategory="all" />
          </div>

          {/* Featured Article */}
          {featuredArticles.length > 0 && (
            <div className="mb-12">
              <ArticleCard article={featuredArticles[0]} featured />
            </div>
          )}

          {/* Article Grid */}
          {regularArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Newspaper size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg font-medium">
                아직 등록된 글이 없습니다
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
