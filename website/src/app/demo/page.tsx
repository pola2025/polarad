import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { industries } from "@/lib/demo-data";
import { DemoHero } from "@/components/sections/DemoHero";

export const metadata: Metadata = {
  title: "업종별 마케팅 데모",
  description:
    "9개 업종별 맞춤 마케팅 데모를 확인하세요. 홈페이지 제작부터 광고, DB 수집, 리포트까지 실제 운영 화면과 동일한 구성입니다.",
  openGraph: {
    title: "업종별 마케팅 데모 | 폴라애드",
    description:
      "인테리어, 건축, 교육, 컨설팅 등 9개 업종별 맞춤 마케팅 솔루션 데모",
    url: "https://polarad.co.kr/demo",
  },
  alternates: {
    canonical: "https://polarad.co.kr/demo",
  },
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white -mt-[60px] md:-mt-[60px] lg:-mt-[68px] pt-[60px] md:pt-[60px] lg:pt-[68px]">
      {/* Hero */}
      <DemoHero />

      {/* 3x3 Card Grid */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-10 pb-20 md:pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry) => (
            <Link
              key={industry.slug}
              href={`/demo/${industry.slug}`}
              className="group block bg-[#2a2a2a] border border-white/[0.06] rounded-xl overflow-hidden transition-all duration-300 hover:border-[rgba(201,169,98,0.35)] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
            >
              <div className="relative h-[200px] overflow-hidden">
                <Image
                  src={industry.image}
                  alt={industry.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div
                  className="mb-3"
                  dangerouslySetInnerHTML={{ __html: industry.icon }}
                />
                <h3 className="text-xl font-semibold mb-2">{industry.name}</h3>
                <p className="text-sm text-[#888] leading-relaxed">
                  {industry.desc}
                </p>
                <span className="inline-block mt-4 px-3 py-1 rounded text-xs tracking-wide bg-[rgba(201,169,98,0.1)] text-[#c9a962] border border-[rgba(201,169,98,0.2)]">
                  데모 보기 &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 text-center bg-gradient-to-b from-[#1a1a1a] to-[#222]">
        <h2 className="text-2xl font-bold mb-2">우리 업종도 가능할까?</h2>
        <p className="text-sm text-[#888] mb-8">
          어떤 업종이든 POLAAD가 맞춤 솔루션을 제공합니다
        </p>
        <Link
          href="/contact"
          className="inline-block px-12 py-4 rounded-xl bg-gradient-to-br from-[#c9a962] to-[#b08d3e] text-[#1a1a1a] font-bold text-base hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,169,98,0.4)] transition-all"
        >
          무료 상담 신청
        </Link>
      </section>
    </div>
  );
}
