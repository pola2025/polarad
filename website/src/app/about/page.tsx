import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  ArrowRight,
  Target,
  Zap,
  Shield,
  Building2,
  Users,
  Layers,
  TrendingUp,
  CheckCircle2,
  Clock,
  Globe,
  Megaphone,
  Database,
  BarChart3,
} from "lucide-react";

export const metadata: Metadata = {
  title: "회사소개 | 소상공인 구독형 온라인 영업 파트너 - 폴라애드",
  description:
    "폴라애드는 소상공인·중소기업의 구독형 온라인 영업 파트너입니다. 홈페이지 제작부터 Meta 광고, DB 자동 수집, 콘텐츠 배포까지 월 구독료 하나로 해결합니다.",
  keywords: [
    "폴라애드",
    "회사소개",
    "온라인 영업",
    "중소기업 마케팅",
    "구독형 마케팅",
    "소상공인 홈페이지",
    "DB 수집 자동화",
  ],
  openGraph: {
    title: "회사소개 | 폴라애드",
    description:
      "소상공인·중소기업의 구독형 온라인 영업 파트너, 폴라애드를 소개합니다.",
    url: "https://polarad.co.kr/about",
    type: "website",
    locale: "ko_KR",
    siteName: "폴라애드",
  },
  alternates: {
    canonical: "https://polarad.co.kr/about",
  },
};

const coreValues = [
  {
    icon: Target,
    title: "본업에 집중",
    description:
      "대표님은 본업에만 집중하세요. 홈페이지, 광고, DB 수집, 성과 분석까지 온라인 영업의 모든 과정을 저희가 대신합니다.",
  },
  {
    icon: Zap,
    title: "빠른 셋업",
    description:
      "기획 확정 후 5~7일 내 홈페이지 제작, 광고 세팅, 자동화 연동까지 모두 완료. 빠르게 고객 확보를 시작합니다.",
  },
  {
    icon: Shield,
    title: "투명한 가격",
    description:
      "숨겨진 비용 없이 월 구독료 하나로 운영. 접수형 5만원, 운영형 22만원, 프리미엄 55만원. 6개월 약정 후 홈페이지 영구 소유.",
  },
];

const whatWeDoSteps = [
  {
    icon: Globe,
    step: "01",
    title: "홈페이지 제작",
    description:
      "반응형 홈페이지를 제작하고 Google·Naver 검색에 등록합니다. 도메인 비용 외 인프라 추가비용이 없습니다.",
  },
  {
    icon: Megaphone,
    step: "02",
    title: "광고 운영 & DB 수집",
    description:
      "Meta 광고를 CPR $20 목표로 운영하고, 문의 접수 시 DB를 자동 수집·저장합니다.",
  },
  {
    icon: Database,
    step: "03",
    title: "알림 자동화",
    description:
      "문의 접수 즉시 이메일 알림을 보내고 CRM에 자동 저장. 놓치는 고객이 없도록 합니다.",
  },
  {
    icon: BarChart3,
    step: "04",
    title: "성과 분석 & 콘텐츠",
    description:
      "월간 성과 리포트 자동 발송, GA4 분석, 프리미엄은 매일 인스타·쓰레드·블로그 콘텐츠까지 배포합니다.",
  },
];

const differentiators = [
  {
    icon: Layers,
    title: "올인원 구독",
    description:
      "홈페이지 따로, 광고 따로, CRM 따로 결제할 필요 없습니다. 월 구독료 하나에 온라인 영업 인프라 전체가 포함됩니다.",
  },
  {
    icon: Users,
    title: "서비스업 전문",
    description:
      "인테리어, 건축, 학원, 컨설팅, 법률, 웨딩, 부동산 등 문의 접수형 업종에 최적화된 노하우를 보유하고 있습니다.",
  },
  {
    icon: TrendingUp,
    title: "87개 광고 계정 운영 경험",
    description:
      "다양한 업종의 광고 계정을 직접 운영하며 축적한 데이터와 노하우를 고객사에 이식합니다.",
  },
  {
    icon: Clock,
    title: "6개월 후 홈페이지 소유",
    description:
      "약정 종료 후 홈페이지는 영구적으로 고객 소유입니다. 광고 운영만 재구독하거나 독립 운영할 수 있습니다.",
  },
];

const stats = [
  { value: "87+", label: "광고 계정 운영" },
  { value: "5~7일", label: "평균 셋업" },
  { value: "5만~", label: "월 구독료" },
  { value: "24/7", label: "자동 DB 수집" },
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
        <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 overflow-hidden bg-[#0a0a0a] text-white -mt-[60px] md:-mt-[60px] lg:-mt-[64px] pt-[calc(60px+6rem)] lg:pt-[calc(64px+10rem)]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(201,169,98,0.06)_0%,transparent_70%)] pointer-events-none" />

          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a962]/10 border border-[#c9a962]/20 text-[#c9a962] text-sm font-semibold mb-6">
                  <Building2 className="w-4 h-4" />
                  <span>회사소개</span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight break-keep">
                  본업에만 집중하세요
                  <br />
                  <span className="text-[#c9a962]">
                    고객은 저희가 데려옵니다
                  </span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="h-[2px] w-12 bg-[#c9a962] mb-6 mx-auto" />
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="text-base lg:text-lg text-[#ccc] mb-8 leading-relaxed max-w-xl mx-auto break-keep">
                  폴라애드는 소상공인·중소기업을 위한
                  <br className="hidden md:block" />
                  <span className="text-white font-semibold">
                    구독형 온라인 영업 파트너
                  </span>
                  입니다.
                  <br className="hidden md:block" />
                  홈페이지 제작부터 광고, DB 수집, 콘텐츠 배포까지
                  <br className="hidden md:block" />월 구독료 하나로 해결합니다.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.25}>
                <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5 mb-10 max-w-md mx-auto">
                  <div className="text-sm text-[#c9a962] font-semibold mb-2">
                    Our Mission
                  </div>
                  <p className="text-white font-medium break-keep">
                    &ldquo;모든 소상공인이 24시간 일하는 온라인 영업 인프라를
                    가질 수 있도록&rdquo;
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <ScrollReveal key={stat.label} delay={0.3 + index * 0.08}>
                  <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-5 text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-[#c9a962] mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-[#888]">{stat.label}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 핵심 가치 Section */}
        <section className="py-10 lg:py-24 bg-[#1a1a1a]">
          <div className="container px-4">
            <ScrollReveal>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-4 break-keep">
                폴라애드의 <span className="text-[#c9a962]">핵심 가치</span>
              </h2>
              <p className="text-[#888] text-center text-base lg:text-lg mb-8 sm:mb-12">
                고객의 성공을 위해 추구하는 세 가지 원칙
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto">
              {coreValues.map((value, index) => {
                const Icon = value.icon;
                return (
                  <ScrollReveal key={value.title} delay={index * 0.1}>
                    <div className="bg-[#2a2a2a] border border-white/[0.06] rounded-xl p-6 h-full">
                      <div className="w-12 h-12 rounded-lg bg-[#c9a962]/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-[#c9a962]" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {value.title}
                      </h3>
                      <p className="text-[#999] text-sm leading-relaxed break-keep">
                        {value.description}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* 하는 일 Section */}
        <section className="py-10 lg:py-24 bg-[#222]">
          <div className="container px-4">
            <ScrollReveal>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-4 break-keep">
                폴라애드가 <span className="text-[#c9a962]">하는 일</span>
              </h2>
              <p className="text-[#888] text-center text-base lg:text-lg mb-8 sm:mb-12 break-keep">
                온라인 영업에 필요한 4단계를 한 번에 세팅합니다
              </p>
            </ScrollReveal>

            <div className="max-w-3xl mx-auto space-y-4">
              {whatWeDoSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <ScrollReveal key={step.step} delay={index * 0.08}>
                    <div className="bg-[#2a2a2a] border border-white/[0.06] rounded-xl p-5 sm:p-6 flex items-start gap-4">
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-mono text-[#c9a962]/60">
                          {step.step}
                        </span>
                        <div className="w-10 h-10 rounded-lg bg-[#c9a962]/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[#c9a962]" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-1.5">
                          {step.title}
                        </h3>
                        <p className="text-[#999] text-sm leading-relaxed break-keep">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* 차별점 Section */}
        <section className="py-10 lg:py-24 bg-[#1a1a1a]">
          <div className="container px-4">
            <ScrollReveal>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-4 break-keep">
                왜 <span className="text-[#c9a962]">폴라애드</span>인가?
              </h2>
              <p className="text-[#888] text-center text-base lg:text-lg mb-8 sm:mb-12">
                폴라애드를 선택해야 하는 이유
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {differentiators.map((item, index) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal key={item.title} delay={index * 0.08}>
                    <div className="bg-[#2a2a2a] border border-white/[0.06] rounded-xl p-5 h-full">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#c9a962]/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-[#c9a962]" />
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
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* 구독 플랜 요약 */}
        <section className="py-10 lg:py-24 bg-[#222]">
          <div className="container px-4">
            <ScrollReveal>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-4 break-keep">
                <span className="text-[#c9a962]">구독 플랜</span> 한눈에 보기
              </h2>
              <p className="text-[#888] text-center text-base lg:text-lg mb-8 sm:mb-12">
                사업 규모에 맞는 플랜을 선택하세요
              </p>
            </ScrollReveal>

            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                {
                  name: "접수형",
                  price: "5만원",
                  desc: "홈페이지만 필요한 분",
                  features: [
                    "반응형 홈페이지",
                    "문의 폼 자동 저장",
                    "텔레그램 알림",
                    "검색 등록 + GA4",
                  ],
                },
                {
                  name: "운영형",
                  price: "22만원",
                  desc: "광고까지 맡기고 싶은 분",
                  popular: true,
                  features: [
                    "접수형 전체 포함",
                    "Meta 광고 운영",
                    "월간 성과 리포트",
                    "CRM 상태 관리",
                  ],
                },
                {
                  name: "프리미엄",
                  price: "55만원",
                  desc: "콘텐츠 + 멀티채널",
                  features: [
                    "운영형 전체 포함",
                    "멀티채널 광고",
                    "매일 콘텐츠 배포",
                    "전담 매니저 배정",
                  ],
                },
              ].map((plan, index) => (
                <ScrollReveal key={plan.name} delay={index * 0.1}>
                  <div
                    className={`rounded-xl p-5 h-full ${
                      plan.popular
                        ? "bg-[#c9a962]/10 border-2 border-[#c9a962]/40"
                        : "bg-[#2a2a2a] border border-white/[0.06]"
                    }`}
                  >
                    {plan.popular && (
                      <div className="text-xs font-semibold text-[#c9a962] mb-2">
                        MOST POPULAR
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-white mb-1">
                      {plan.name}
                    </h3>
                    <div className="text-2xl font-bold text-[#c9a962] mb-1">
                      월 {plan.price}
                    </div>
                    <p className="text-xs text-[#888] mb-4">{plan.desc}</p>
                    <ul className="space-y-2">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-gray-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#c9a962] shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.3}>
              <div className="text-center mt-8">
                <Link
                  href="/service"
                  className="inline-flex items-center gap-2 text-[#c9a962] hover:text-[#b8983f] font-semibold transition-colors"
                >
                  서비스 상세 보기
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 lg:py-16 text-center bg-gradient-to-b from-[#222] to-[#1a1a1a]">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-white break-keep">
              함께 시작하실 준비가 되셨나요?
            </h2>
            <p className="text-base md:text-lg mb-8 text-[#888] break-keep">
              무료 상담을 통해 사업에 맞는 플랜을 추천받으세요
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-br from-[#c9a962] to-[#b08d3e] text-[#1a1a1a] font-bold text-base hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,169,98,0.4)] transition-all"
              >
                무료 상담 신청
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/service"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/20 text-white hover:bg-white/5 font-semibold rounded-lg transition-colors"
              >
                서비스 보기
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </>
  );
}
