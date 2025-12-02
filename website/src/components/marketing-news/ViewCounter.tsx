'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

interface ViewCounterProps {
  slug: string;
  increment?: boolean;
  showIcon?: boolean;
  className?: string;
}

export function ViewCounter({ slug, increment = false, showIcon = false, className = '' }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    async function fetchAndIncrement() {
      try {
        if (increment) {
          // 조회수 증가 (상세 페이지에서)
          const res = await fetch(`/api/views/${slug}`, { method: 'POST' });
          const data = await res.json();
          setViews(data.views);
        } else {
          // 조회수만 조회 (목록에서)
          const res = await fetch(`/api/views/${slug}`);
          const data = await res.json();
          setViews(data.views);
        }
      } catch {
        setViews(0);
      }
    }

    fetchAndIncrement();
  }, [slug, increment]);

  if (showIcon) {
    return (
      <span className={`flex items-center gap-1 text-xs text-gray-500 ${className}`}>
        <Eye size={12} />
        {views === null ? '-' : views.toLocaleString()}
      </span>
    );
  }

  return (
    <span className={className}>
      {views === null ? '-' : `${views.toLocaleString()}회`}
    </span>
  );
}
