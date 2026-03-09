"use client";

import { useRef } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface Tier {
  name: string;
  price: string;
  unit: string;
  desc: string;
  highlight: boolean;
  features: string[];
  notIncluded: string[];
}

export function TierCarousel({ tiers }: { tiers: Tier[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector("[data-tier-card]");
    const w = card ? card.clientWidth + 16 : 296;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -w : w,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* 모바일 좌우 버튼 */}
      <button
        onClick={() => scroll("left")}
        className="md:hidden absolute -left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#2a2a2a]/90 border border-white/10 flex items-center justify-center text-white/70 active:bg-white/10"
        aria-label="이전"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="md:hidden absolute -right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#2a2a2a]/90 border border-white/10 flex items-center justify-center text-white/70 active:bg-white/10"
        aria-label="다음"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pt-4 pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:mx-auto md:px-0 md:pt-0 md:pb-0 max-w-5xl"
      >
        {tiers.map((tier, i) => (
          <ScrollReveal key={tier.name} delay={i * 0.08}>
            <div
              data-tier-card
              className={`min-w-[280px] snap-start relative rounded-xl p-6 lg:p-8 border transition-all md:min-w-0 ${
                tier.highlight
                  ? "bg-gradient-to-b from-[#c9a962]/10 to-[#2a2a2a] border-[#c9a962]/40 shadow-[0_0_40px_rgba(201,169,98,0.1)]"
                  : "bg-[#2a2a2a] border-white/[0.06]"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-br from-[#c9a962] to-[#b08d3e] text-[#1a1a1a] text-xs font-bold whitespace-nowrap">
                  추천
                </div>
              )}
              <h3 className="text-lg font-semibold text-white mb-1">
                {tier.name}
              </h3>
              <p className="text-sm text-[#888] mb-4">{tier.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  {tier.price}
                </span>
                <span className="text-[#888] ml-1">{tier.unit}</span>
                <div className="text-xs text-[#666] mt-1">
                  VAT 포함 · 6개월 약정
                </div>
              </div>

              <Link
                href="/contact"
                className={`block w-full text-center py-3 rounded-lg font-semibold text-sm transition-all mb-6 ${
                  tier.highlight
                    ? "bg-gradient-to-br from-[#c9a962] to-[#b08d3e] text-[#1a1a1a] hover:shadow-[0_4px_20px_rgba(201,169,98,0.3)]"
                    : "border border-white/10 text-white hover:bg-white/5"
                }`}
              >
                상담 신청
              </Link>

              <div className="space-y-2.5">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#c9a962] shrink-0 mt-0.5" />
                    <span className="text-gray-300">{f}</span>
                  </div>
                ))}
                {tier.notIncluded.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <span className="w-4 h-4 shrink-0 mt-0.5 text-center text-[#555]">
                      -
                    </span>
                    <span className="text-[#555]">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
