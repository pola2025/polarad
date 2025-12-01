import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | 마케팅 소식 | 폴라애드',
    default: '마케팅 소식 | 폴라애드',
  },
};

export default function MarketingNewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
