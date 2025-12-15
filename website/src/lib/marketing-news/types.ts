// 마케팅 소식 타입 정의

export type ArticleCategory = 'meta-ads' | 'instagram-reels' | 'threads' | 'google-ads' | 'marketing-trends' | 'ai-trends' | 'faq';

export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface ArticleSEO {
  keywords: string[];
  ogImage?: string;
}

export interface ArticleFrontmatter {
  title: string;
  description: string;
  category: ArticleCategory;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  thumbnail: string;
  featured?: boolean;
  status: ArticleStatus;
  seo?: ArticleSEO;
}

export interface Article extends ArticleFrontmatter {
  slug: string;
  content: string;
  readingTime: number;
}

export interface ArticleListItem {
  slug: string;
  title: string;
  description: string;
  category: ArticleCategory;
  tags: string[];
  publishedAt: string;
  thumbnail: string;
  featured: boolean;
  readingTime: number;
}

export const CATEGORIES: Record<ArticleCategory, { label: string; description: string }> = {
  'meta-ads': {
    label: 'Meta 광고',
    description: 'Facebook/Instagram 광고 설정, 최적화, 성과 분석 가이드'
  },
  'instagram-reels': {
    label: '인스타그램 릴스',
    description: '릴스 제작, 알고리즘, 조회수 올리는 법 가이드'
  },
  'threads': {
    label: '쓰레드',
    description: 'Meta Threads 활용법, 팔로워 늘리기, 콘텐츠 전략'
  },
  'google-ads': {
    label: 'Google 광고',
    description: 'Google Ads 설정, 키워드 전략, 성과 최적화 가이드'
  },
  'marketing-trends': {
    label: '마케팅 트렌드',
    description: '최신 디지털 마케팅 동향과 업계 인사이트'
  },
  'ai-trends': {
    label: 'AI 트렌드',
    description: 'AI 마케팅 도구, 생성형 AI 활용법, 최신 AI 인사이트'
  },
  'faq': {
    label: 'FAQ',
    description: '자주 묻는 질문과 문제 해결 가이드'
  }
};
