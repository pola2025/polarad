'use client';

import Link from 'next/link';
import { CATEGORIES, type ArticleCategory } from '@/lib/marketing-news/types';

interface CategoryFilterProps {
  currentCategory?: ArticleCategory | 'all';
}

export function CategoryFilter({ currentCategory = 'all' }: CategoryFilterProps) {
  const categories = [
    { key: 'all' as const, label: '전체 보기', href: '/marketing-news' },
    ...Object.entries(CATEGORIES).map(([key, value]) => ({
      key: key as ArticleCategory,
      label: value.label,
      href: `/marketing-news/category/${key}`,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const isActive = currentCategory === category.key;
        return (
          <Link
            key={category.key}
            href={category.href}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all border-2 ${
              isActive
                ? 'bg-primary border-primary text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
            }`}
          >
            {category.label}
          </Link>
        );
      })}
    </div>
  );
}
