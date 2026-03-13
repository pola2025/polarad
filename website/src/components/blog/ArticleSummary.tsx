interface ArticleSummaryProps {
  description: string;
  tags: string[];
}

export function ArticleSummary({ description, tags }: ArticleSummaryProps) {
  return (
    <aside
      aria-label="핵심 요약"
      className="mb-10 rounded-xl border border-white/[0.08] overflow-hidden"
      style={{ borderLeft: "4px solid #c9a962" }}
    >
      <div className="bg-[#232218] px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a962] mb-3 flex items-center gap-2">
          <span aria-hidden="true">📋</span>
          핵심 요약
        </p>
        <p className="text-[#ccc] text-sm leading-relaxed">{description}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2.5 py-0.5 rounded-full text-xs bg-[#2e2b1f] text-[#c9a962] border border-[#c9a962]/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
