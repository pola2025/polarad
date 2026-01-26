import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Content Studio',
    template: '%s | Content Studio',
  },
  description: '폴라애드 콘텐츠 스튜디오 - AI 기반 마케팅 콘텐츠 생성',
  robots: 'noindex, nofollow',
};

export default function ContentStudioRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
