"use client";

import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Target,
  Zap,
  Shield,
  Heart,
  Users,
  BadgeCheck,
  Headphones,
  Building2,
  TrendingUp,
} from "lucide-react";

const coreValues = [
  {
    icon: Target,
    title: "단순함",
    description:
      "카카오 로그인 한 번으로 고객 정보를 정확하게 수집합니다. 스팸 걱정 없이 진성 리드만 받으세요.",
  },
  {
    icon: Zap,
    title: "신속함",
    description:
      "기획 확정 후 5~7일 내 제작 완료. 빠르게 리드 수집을 시작할 수 있습니다.",
  },
  {
    icon: Shield,
    title: "합리성",
    description:
      "월 5만원부터 홈페이지 + 알림 자동화. 텔레그램 알림과 성과 분석까지 모두 포함됩니다.",
  },
];

const whyPolaad = [
  {
    icon: Heart,
    title: "중소기업을 이해합니다",
    description:
      "제한된 예산으로도 효율적인 리드 수집이 가능합니다. 카카오 로그인과 텔레그램 알림으로 간편하게 시작하세요.",
  },
  {
    icon: Users,
    title: "올인원 솔루션",
    description:
      "랜딩페이지 제작, 카카오 로그인 연동, 텔레그램 알림, 관리 대시보드까지. 리드 수집에 필요한 모든 것을 한 번에 제공합니다.",
  },
  {
    icon: BadgeCheck,
    title: "투명한 가격 정책",
    description:
      "숨겨진 비용이 없습니다. 접수형 월 5만원, 운영형 월 22만원, 프리미엄 월 55만원. 6개월 약정 후 홈페이지는 영구 소유입니다.",
  },
  {
    icon: Headphones,
    title: "지속적인 지원",
    description:
      "제작 후에도 궁금한 점이 있다면 언제든 문의할 수 있습니다. 약정 종료 후 상위 플랜으로 업그레이드하거나 계속 이용할 수 있습니다.",
  },
];

const stats = [
  { value: "50+", label: "제작 완료" },
  { value: "98%", label: "고객 만족도" },
  { value: "7일", label: "평균 제작" },
  { value: "24/7", label: "고객 지원" },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "홈", url: "https://polarad.co.kr" },
          { name: "회사소개", url: "https://polarad.co.kr/about" },
        ]}
      />

      <main className="min-h-screen bg-[#0a0a0a]">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 overflow-hidden bg-[#0a0a0a] text-white -mt-[60px] md:-mt-[60px] lg:-mt-[64px] pt-[calc(60px+6rem)] lg:pt-[calc(64px+10rem)]">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(201,169,98,0.06)_0%,transparent_70%)] pointer-events-none" />

          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a962]/10 border border-[#c9a962]/20 text-[#c9a962] text-sm font-semibold mb-6"
              >
                <Building2 className="w-4 h-4" />
                <span>회사소개</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-[1.8] break-keep"
              >
                중소기업의
                <br />
                <span className="text-[#c9a962]">온라인 영업 파트너</span>
              </motion.h1>

              {/* Gold line divider */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-[2px] bg-[#c9a962] mb-6 mx-auto"
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base lg:text-lg text-[#ccc] mb-8 leading-[1.85] max-w-xl mx-auto break-keep"
              >
                폴라애드는 중소기업이 온라인 영업의 어려움을 겪지 않도록
                <br className="hidden md:block" />
                복잡한 과정을 하나로 모아{" "}
                <span className="text-white font-semibold">
                  쉽고 빠르게
                </span>{" "}
                시작할 수 있도록 돕습니다.
              </motion.p>

              {/* Mission card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5 mb-10 max-w-md mx-auto"
              >
                <div className="text-sm text-[#c9a962] font-semibold mb-2">
                  Our Mission
                </div>
                <p className="text-white font-medium break-keep">
                  &ldquo;모든 중소기업이 24시간 일하는 온라인 영업사원을 가질 수
                  있도록&rdquo;
                </p>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5 text-center"
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

        {/* 핵심 가치 Section */}
        <section className="py-16 lg:py-24 bg-[#1a1a1a]">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 break-keep">
                폴라애드의 <span className="text-[#c9a962]">핵심 가치</span>
              </h2>
              <p className="text-[#888] text-base lg:text-lg">
                고객의 성공을 위해 추구하는 세 가지 가치
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto">
              {coreValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-[#2a2a2a] border border-white/[0.06] rounded-xl p-6"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#c9a962]/10 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-[#c9a962]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-[#999] text-sm leading-relaxed break-keep">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 왜 폴라애드인가 Section */}
        <section className="py-16 lg:py-24 bg-[#222]">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 break-keep">
                왜 <span className="text-[#c9a962]">폴라애드</span>인가?
              </h2>
              <p className="text-[#888] text-base lg:text-lg">
                폴라애드를 선택해야 하는 이유
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {whyPolaad.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-[#2a2a2a] border border-white/[0.06] rounded-xl p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#c9a962]/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[#c9a962]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-[#999] text-sm leading-relaxed break-keep">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden bg-[#0a0a0a]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(201,169,98,0.06)_0%,transparent_70%)] pointer-events-none" />
          <div className="container relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white break-keep"
              >
                함께 시작하실 준비가 되셨나요?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-base md:text-lg mb-8 text-[#888] break-keep"
              >
                폴라애드와 함께라면 온라인 영업이 어렵지 않습니다
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-3 justify-center items-center"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#c9a962] hover:bg-[#b8983f] text-black font-semibold rounded-lg transition-colors"
                >
                  무료 상담 신청
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/service"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/20 text-white hover:bg-white/5 font-semibold rounded-lg transition-colors"
                >
                  서비스 보기
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
