import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import type { ArticleListItem } from '@/lib/marketing-news/types';
import { CATEGORIES } from '@/lib/marketing-news/types';
import { ViewCounter } from './ViewCounter';

interface ArticleCardProps {
  article: ArticleListItem;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const categoryInfo = CATEGORIES[article.category];

  if (featured) {
    return (
      <Link
        href={`/marketing-news/${article.slug}`}
        className="group block card card-highlight overflow-hidden"
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-video md:aspect-[4/3]">
            <Image
              src={article.thumbnail || '/images/marketing-news/default-thumbnail.png'}
              alt={`${article.title} - ${article.description.slice(0, 60)}`}
              width={800}
              height={450}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              data-ai-generated="true"
            />
            <div className="absolute top-4 left-4">
              <span className="badge badge-accent">
                Featured
              </span>
            </div>
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <span className="badge badge-primary w-fit mb-4">
              {categoryInfo.label}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {article.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500 whitespace-nowrap">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(article.publishedAt)}
                </span>
                <ViewCounter slug={article.slug} showIcon />
              </div>
              <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                읽기 <ArrowRight size={16} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/marketing-news/${article.slug}`}
      className="group block card overflow-hidden p-0"
    >
      <div className="relative aspect-video">
        <Image
          src={article.thumbnail || '/images/marketing-news/default-thumbnail.png'}
          alt={`${article.title} - ${article.description.slice(0, 60)}`}
          width={600}
          height={338}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          data-ai-generated="true"
        />
      </div>
      <div className="p-5">
        <span className="badge badge-primary text-xs mb-3">
          {categoryInfo.label}
        </span>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {article.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-500 whitespace-nowrap">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(article.publishedAt)}
            </span>
            <ViewCounter slug={article.slug} showIcon />
          </div>
          <ArrowRight size={16} className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
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
