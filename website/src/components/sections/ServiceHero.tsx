"use client";

import { YouTubeBackground } from "@/components/ui/YouTubeBackground";

export function ServiceHero() {
  return (
    <section className="relative pt-28 pb-12 lg:pt-36 lg:pb-16 bg-[#1a1a1a] text-white text-center overflow-hidden">
      <YouTubeBackground videoId="P8sYVH4ryjU" overlayOpacity={75} />
      <div className="container px-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a962]/10 border border-[#c9a962]/20 text-[#c9a962] text-sm font-semibold mb-6">
          6개월 약정 · 홈페이지 영구 소유
        </div>
        <h1 className="text-3xl lg:text-5xl font-bold mb-4 break-keep">
          우리 업종에 맞는 <span className="text-[#c9a962]">플랜</span>을
          선택하세요
        </h1>
        <p className="text-[#888] text-base lg:text-lg max-w-xl mx-auto">
          접수만 필요하면 5만원, 광고까지 맡기면 22만원,
          <br className="hidden sm:block" />
          콘텐츠 배포까지 매일 하면 55만원.
        </p>
      </div>
    </section>
  );
}
