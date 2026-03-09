"use client";

import { YouTubeBackground } from "@/components/ui/YouTubeBackground";

export function DemoHero() {
  return (
    <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 text-center px-5 overflow-hidden">
      <YouTubeBackground videoId="lCdPSutylOQ" overlayOpacity={75} />
      <div className="relative z-10">
        <h1 className="text-3xl md:text-5xl font-extralight tracking-tight leading-snug mb-4">
          우리 업종은 이렇게
          <br />
          <span className="text-[#c9a962] font-semibold">만들어집니다</span>
        </h1>
        <p className="text-[#888] text-base md:text-lg max-w-xl mx-auto">
          업종별 맞춤 마케팅 데모를 확인하세요.
          <br />
          실제 운영 화면과 동일한 구성입니다.
        </p>
      </div>
    </section>
  );
}
