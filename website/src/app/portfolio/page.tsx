"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  Globe,
  Megaphone,
  Bell,
  Calendar,
  BarChart3,
  Layout,
} from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

type Category =
  | "전체"
  | "경영컨설팅"
  | "제조업"
  | "펜션"
  | "전문서비스"
  | "공간디자인"
  | "시스템창호"
  | "집수리";

interface PortfolioItem {
  name: string;
  category: Category;
  domain?: string;
  url?: string;
  description: string;
  services: { icon: React.ElementType; label: string }[];
  gradient: string;
  iconBg: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    name: "JS경영컨설팅",
    category: "경영컨설팅",
    domain: "js경영컨설팅.kr",
    url: "https://xn--js-j52if34d3ff1tbnyjj1r.kr/",
    description:
      "경영컨설팅 전문기업. 정책자금 컨설팅 서비스를 효과적으로 전달하는 전문 홈페이지를 구축했습니다.",
    services: [{ icon: Layout, label: "홈페이지 제작" }],
    gradient: "from-indigo-600/20 to-blue-600/20",
    iconBg: "bg-indigo-500/10 text-indigo-400",
  },
  {
    name: "제이앤아이 파트너스",
    category: "경영컨설팅",
    domain: "jnipartners.co.kr",
    url: "https://www.jnipartners.co.kr/",
    description:
      "정책자금 경영컨설팅 전문기업. AI 기반 자격진단과 DB 광고 자동화로 상담 전환율을 극대화했습니다.",
    services: [
      { icon: Layout, label: "홈페이지 제작" },
      { icon: Megaphone, label: "DB 광고 운영" },
      { icon: Bell, label: "접수알림 자동화" },
    ],
    gradient: "from-blue-600/20 to-indigo-600/20",
    iconBg: "bg-blue-500/10 text-blue-400",
  },
  {
    name: "와이앤제이 기업지원센터",
    category: "경영컨설팅",
    domain: "yjbiz.co.kr",
    url: "https://yjbiz.co.kr",
    description:
      "강원지역 정책자금·인증 컨설팅 전문. 지역 특화 DB 광고 전략으로 안정적 고객 유입을 구축했습니다.",
    services: [
      { icon: Layout, label: "홈페이지 제작" },
      { icon: Megaphone, label: "DB 광고 운영" },
      { icon: Bell, label: "접수알림 자동화" },
    ],
    gradient: "from-violet-600/20 to-purple-600/20",
    iconBg: "bg-violet-500/10 text-violet-400",
  },
  {
    name: "초호쉼터",
    category: "펜션",
    domain: "chorigol.net",
    url: "https://chorigol.net",
    description:
      "파주 기업 워크샵·야유회 전문 단체펜션. 자체 예약시스템과 온라인 마케팅으로 단체 예약률을 높였습니다.",
    services: [
      { icon: Layout, label: "홈페이지 제작" },
      { icon: Calendar, label: "자체 예약시스템" },
      { icon: Megaphone, label: "온라인마케팅" },
    ],
    gradient: "from-emerald-600/20 to-teal-600/20",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
  {
    name: "초호펜션 | 초리골164",
    category: "펜션",
    domain: "chorigol.co.kr",
    url: "https://chorigol.co.kr",
    description:
      "파주 호수뷰 힐링 펜션. 감성적인 브랜드 디자인과 자체 예약시스템으로 개인·가족 예약을 극대화했습니다.",
    services: [
      { icon: Layout, label: "홈페이지 제작" },
      { icon: Calendar, label: "자체 예약시스템" },
      { icon: Megaphone, label: "온라인마케팅" },
    ],
    gradient: "from-green-600/20 to-emerald-600/20",
    iconBg: "bg-green-500/10 text-green-400",
  },
  {
    name: "원에프 (ONEF)",
    category: "전문서비스",
    domain: "onef.kr",
    url: "https://onef.kr",
    description:
      "AI CCTV 전문기업, KTT V-Cam 공식 파트너. 제품 라인업과 기술력을 효과적으로 전달하는 전문 홈페이지를 구축했습니다.",
    services: [
      { icon: Layout, label: "홈페이지 제작" },
      { icon: Globe, label: "제품 카탈로그" },
    ],
    gradient: "from-slate-600/20 to-zinc-600/20",
    iconBg: "bg-slate-500/10 text-slate-400",
  },
  {
    name: "데이원디자인",
    category: "공간디자인",
    domain: "day1design.co.kr",
    url: "https://day1design.co.kr",
    description:
      "공간 디자인 솔루션 전문기업. 포트폴리오 중심 홈페이지와 고객 DB 광고 전략으로 신규 고객 유입을 지원합니다.",
    services: [
      { icon: Layout, label: "홈페이지 제작" },
      { icon: Megaphone, label: "DB 광고 전략" },
      { icon: BarChart3, label: "운영 지원" },
    ],
    gradient: "from-amber-600/20 to-orange-600/20",
    iconBg: "bg-amber-500/10 text-amber-400",
  },
  {
    name: "뜨레시옷",
    category: "펜션",
    domain: "thresiot.imweb.me",
    url: "https://thresiot.imweb.me/",
    description:
      "감성 숙박 브랜드. 브랜드 아이덴티티를 살린 맞춤형 홈페이지를 제작했습니다.",
    services: [{ icon: Layout, label: "홈페이지 제작" }],
    gradient: "from-rose-600/20 to-pink-600/20",
    iconBg: "bg-rose-500/10 text-rose-400",
  },
  {
    name: "토리이엔씨",
    category: "시스템창호",
    domain: "torienc.imweb.me",
    url: "https://torienc.imweb.me/",
    description:
      "시스템창호 전문기업. 기업 신뢰도를 높이는 전문적인 홈페이지를 구축했습니다.",
    services: [{ icon: Layout, label: "홈페이지 제작" }],
    gradient: "from-cyan-600/20 to-sky-600/20",
    iconBg: "bg-cyan-500/10 text-cyan-400",
  },
  {
    name: "단열스토리",
    category: "집수리",
    domain: "insustory.imweb.me",
    url: "https://insustory.imweb.me/",
    description:
      "단열·집수리 전문기업. 전문성을 효과적으로 전달하는 홈페이지를 제작했습니다.",
    services: [{ icon: Layout, label: "홈페이지 제작" }],
    gradient: "from-teal-600/20 to-cyan-600/20",
    iconBg: "bg-teal-500/10 text-teal-400",
  },
  {
    name: "JS시스템",
    category: "제조업",
    domain: "jssys.work",
    url: "https://jssys.work/",
    description:
      "제조업 전문기업. 기업 역량과 제품 라인업을 효과적으로 전달하는 전문 홈페이지를 구축했습니다.",
    services: [{ icon: Layout, label: "홈페이지 제작" }],
    gradient: "from-orange-600/20 to-red-600/20",
    iconBg: "bg-orange-500/10 text-orange-400",
  },
];

const categories: Category[] = [
  "전체",
  "경영컨설팅",
  "제조업",
  "펜션",
  "전문서비스",
  "공간디자인",
  "시스템창호",
  "집수리",
];

const categoryColors: Record<string, string> = {
  경영컨설팅: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  제조업: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  펜션: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  전문서비스: "bg-slate-500/10 text-slate-300 border-slate-500/20",
  공간디자인: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  시스템창호: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  집수리: "bg-teal-500/10 text-teal-400 border-teal-500/20",
};

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("전체");

  const filtered =
    activeCategory === "전체"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "홈", url: "https://polarad.co.kr" },
          { name: "포트폴리오", url: "https://polarad.co.kr/portfolio" },
        ]}
      />

      <main className="min-h-screen bg-[#0a0a0a]">
        {/* Hero */}
        <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,98,0.08)_0%,transparent_60%)]" />
          <div className="container relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a962]/10 border border-[#c9a962]/20 text-[#c9a962] text-sm font-semibold mb-6"
            >
              Portfolio
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight tracking-[-0.5px] break-keep"
            >
              업종별 <span className="text-[#c9a962]">맞춤 솔루션</span>으로
              <br />
              실제 성과를 만들었습니다
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[#999] text-base lg:text-lg max-w-xl mx-auto mb-10 break-keep"
            >
              홈페이지 제작부터 광고 운영, 예약시스템까지.
              <br className="hidden sm:block" />각 업종에 최적화된 구독형
              인프라를 제공합니다.
            </motion.p>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-2"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-[#c9a962] text-[#1a1a1a]"
                      : "bg-white/[0.04] text-[#999] border border-white/[0.08] hover:text-white hover:border-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="pb-20 lg:pb-28">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 max-w-5xl mx-auto">
              {filtered.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="group relative bg-[#151515] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-[#c9a962]/30 transition-all duration-300"
                >
                  {/* Site Preview / Gradient Header */}
                  {item.url ? (
                    <div className="relative aspect-[16/9] overflow-hidden bg-gray-900">
                      <iframe
                        src={item.url}
                        className="absolute top-0 left-0 w-[250%] h-[250%] origin-top-left scale-[0.4] pointer-events-none"
                        title={`${item.name} 미리보기`}
                        loading="lazy"
                      />
                      {/* Hover overlay */}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center"
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-white font-medium bg-[#c9a962] px-4 py-2 rounded-full text-sm">
                          <ExternalLink className="w-4 h-4" />
                          사이트 방문
                        </div>
                      </a>
                      {/* Bottom gradient for name */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#151515] via-[#151515]/80 to-transparent pt-10 pb-3 px-4">
                        <div className="text-lg font-bold text-white">
                          {item.name}
                        </div>
                        {item.domain && (
                          <div className="text-xs text-white/50">
                            {item.domain}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`h-40 bg-gradient-to-br ${item.gradient} flex items-center justify-center relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px]" />
                      <div className="relative text-center">
                        <div className="text-2xl font-bold text-white/90 mb-1">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 lg:p-6">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[item.category]}`}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[#999] text-sm leading-relaxed mb-4 break-keep">
                      {item.description}
                    </p>

                    {/* Services */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {item.services.map((svc) => {
                        const Icon = svc.icon;
                        return (
                          <div
                            key={svc.label}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-[#bbb]"
                          >
                            <Icon className="w-3.5 h-3.5 text-[#c9a962]" />
                            {svc.label}
                          </div>
                        );
                      })}
                    </div>

                    {/* Link */}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-[#c9a962] hover:text-[#d4b872] transition-colors font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        사이트 방문
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 lg:py-20 border-t border-white/[0.06]">
          <div className="container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
              {[
                { value: "50+", label: "제작 완료" },
                { value: "6+", label: "업종 커버" },
                { value: "98%", label: "고객 만족도" },
                { value: "24/7", label: "운영 지원" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-2xl lg:text-3xl font-bold text-[#c9a962] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#888]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-[#111]">
          <div className="container text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 break-keep">
              다음 성공 사례의 주인공이 되세요
            </h2>
            <p className="text-[#999] mb-8 break-keep">
              업종에 맞는 맞춤 솔루션을 제안드립니다
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-br from-[#c9a962] to-[#b08d3e] text-[#1a1a1a] font-bold text-base hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,169,98,0.4)] transition-all"
            >
              무료 상담 신청
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
