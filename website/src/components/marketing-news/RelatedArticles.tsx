import Link from 'next/link';
import Image from 'next/image';
import type { ArticleListItem } from '@/lib/marketing-news/types';
import { CATEGORIES } from '@/lib/marketing-news/types';

interface RelatedArticlesProps {
  articles: ArticleListItem[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">관련 글</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {articles.map((article) => (
          <RelatedArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}

function RelatedArticleCard({ article }: { article: ArticleListItem }) {
  const categoryInfo = CATEGORIES[article.category];

  return (
    <Link
      href={`/marketing-news/${article.slug}`}
      className="group block card overflow-hidden p-0"
    >
      <div className="relative aspect-video">
        <Image
          src={article.thumbnail || '/images/marketing-news/default-thumbnail.png'}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <span className="badge badge-primary text-xs mb-2">
          {categoryInfo.label}
        </span>
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}
