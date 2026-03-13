import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ServiceLink {
  label: string;
  href: string;
  primary?: boolean;
}

const CATEGORY_LINKS: Record<string, ServiceLink[]> = {
  "meta-ads": [
    { label: "Meta 광고 관리", href: "/service", primary: true },
    { label: "업종별 광고 데모", href: "/demo" },
  ],
  "instagram-reels": [
    { label: "인스타그램 마케팅", href: "/service", primary: true },
    { label: "업종별 데모", href: "/demo" },
  ],
  threads: [{ label: "SNS 마케팅 전략", href: "/service", primary: true }],
  "google-ads": [
    { label: "구글 광고 관리", href: "/service", primary: true },
    { label: "업종별 광고 데모", href: "/demo" },
  ],
  "marketing-trends": [
    { label: "맞춤 마케팅 전략", href: "/service", primary: true },
    { label: "무료 진단 받기", href: "/contact" },
  ],
  "ai-trends": [
    { label: "AI 마케팅 솔루션", href: "/service", primary: true },
    { label: "업종별 AI 데모", href: "/demo" },
  ],
  "ai-tips": [
    { label: "AI 마케팅 솔루션", href: "/service", primary: true },
    { label: "업종별 AI 데모", href: "/demo" },
  ],
  "ai-news": [
    { label: "AI 마케팅 솔루션", href: "/service", primary: true },
    { label: "업종별 AI 데모", href: "/demo" },
  ],
  faq: [
    { label: "서비스 상세 보기", href: "/service", primary: true },
    { label: "무료 상담 신청", href: "/contact" },
  ],
};

interface ArticleServiceLinksProps {
  category: string;
}

export function ArticleServiceLinks({ category }: ArticleServiceLinksProps) {
  const links = CATEGORY_LINKS[category];
  if (!links || links.length === 0) return null;

  return (
    <section className="mt-12 bg-[#222] border border-[#c9a962]/20 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-[#c9a962] rounded-full" />
        <p className="text-sm font-semibold text-[#c9a962] uppercase tracking-wide">
          관련 서비스
        </p>
      </div>
      <p className="text-[#888] text-sm mb-5">
        이 글과 관련된 폴라애드 서비스를 확인해보세요.
      </p>
      <div className="flex flex-wrap gap-3">
        {links.map((link) =>
          link.primary ? (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-[#c9a962] to-[#b08d3e] text-[#1a1a1a] font-semibold text-sm hover:shadow-[0_4px_20px_rgba(201,169,98,0.25)] transition-all"
            >
              {link.label}
              <ArrowRight size={15} />
            </Link>
          ) : (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#c9a962]/30 text-[#c9a962] font-medium text-sm hover:bg-[#c9a962]/10 hover:border-[#c9a962]/50 transition-all"
            >
              {link.label}
              <ArrowRight size={15} />
            </Link>
          ),
        )}
      </div>
    </section>
  );
}
