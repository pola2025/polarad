import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { ServiceSchema } from "@/components/seo/ServiceSchema";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TierCarousel } from "@/components/service/TierCarousel";
import {
  CheckCircle2,
  ArrowRight,
  Shield,
  Globe,
  Megaphone,
  Database,
  BarChart3,
} from "lucide-react";

export const metadata: Metadata = {
  title: "서비스 안내 | 접수형·운영형·프리미엄 - 폴라애드",
  description:
    "소상공인 구독형 영업 인프라. 접수형 월 5만원, 운영형 월 22만원, 프리미엄 월 55만원. 6개월 약정 후 홈페이지 영구 소유. SEO, GA4, 검색 등록 기본 포함.",
  openGraph: {
    title: "서비스 안내 | 폴라애드",
    description: "접수형·운영형·프리미엄 3가지 플랜. 월 5만원부터.",
    url: "https://polarad.co.kr/service",
    type: "website",
    locale: "ko_KR",
    siteName: "폴라애드",
  },
  alternates: {
    canonical: "https://polarad.co.kr/service",
  },
};

const tiers = [
  {
    name: "접수형",
    price: "5",
    unit: "만원/월",
    desc: "홈페이지만 필요한 분",
    highlight: false,
    features: [
      "반응형 홈페이지 제작",
      "문의 폼 → 자동 저장",
      "텔레그램 실시간 알림",
      "Google/Naver 검색 등록",
      "GA4 기본 설치",
    ],
    notIncluded: ["Meta 광고 운영", "월간 성과 리포트", "광고 소재 제작"],
  },
  {
    name: "운영형",
    price: "22",
    unit: "만원/월",
    desc: "광고까지 맡기고 싶은 분",
    highlight: true,
    features: [
      "접수형 전체 포함",
      "Meta 광고 운영 (CPR $20 목표)",
      "1캠페인 멀티소재 전략",
      "월간 성과 리포트 자동 발송",
      "GA4 채널별 유입 분석",
      "CRM 상태 관리",
    ],
    notIncluded: ["멀티채널 (당근+구글)", "전담 매니저 배정"],
  },
  {
    name: "프리미엄",
    price: "55",
    unit: "만원/월",
    desc: "콘텐츠 배포 + 멀티채널",
    highlight: false,
    features: [
      "운영형 전체 포함",
      "Meta + 당근 + 구글 멀티채널",
      "전담 매니저 1:1 배정",
      "매일 게시글·인스타·쓰레드 콘텐츠 배포",
      "광고 소재 월 4회 제작",
      "주간 성과 브리핑",
      "A/B 테스트 운영",
    ],
    notIncluded: [],
  },
];

const serviceFaqs = [
  {
    question: "약정은 어떻게 되나요?",
    answer:
      "모든 플랜 6개월 약정입니다. 약정 후 홈페이지는 영구 소유이며, 광고 운영만 중단됩니다.",
  },
  {
    question: "환불 정책은요?",
    answer:
      "약정 기간 내 해지 시, 잔여 기간 구독료에서 30% 환불수수료를 차감한 금액을 환불해 드립니다. 예: 2개월 이용 후 해지 시 잔여 4개월분의 70%를 환불.",
  },
  {
    question: "카드 결제 가능한가요?",
    answer:
      "네, 카드 결제 가능합니다. 6개월분 일시불 결제이며, 카드 할부는 결제 시 선택하실 수 있습니다.",
  },
  {
    question: "플랜 변경이 가능한가요?",
    answer:
      "월 단위로 상위 플랜으로 업그레이드 가능합니다. 다운그레이드는 약정 종료 후 가능합니다.",
  },
  {
    question: "쇼핑몰도 가능한가요?",
    answer:
      "쇼핑몰/온라인몰 판매 서비스는 제외됩니다. 서비스업(문의 접수형) 업종에 최적화되어 있습니다.",
  },
];

const layerSections = [
  {
    icon: Globe,
    layer: "Layer 0",
    title: "디지털 존재감",
    items: [
      "반응형 홈페이지 (Next.js · Vercel · Cloudflare)",
      "도메인 비용 외 인프라 추가비용 ZERO",
      "Google Search Console 등록",
      "Naver Search Advisor 등록",
      "GA4 설치 + 기본 이벤트 추적",
    ],
  },
  {
    icon: Megaphone,
    layer: "Layer 1",
    title: "DB 수집 인프라",
    items: [
      "홈페이지 문의 폼 → 자동 저장",
      "Meta 광고 → Webhook → 자동 저장",
      "당근마켓 광고 설정 지원",
    ],
  },
  {
    icon: Database,
    layer: "Layer 2",
    title: "알림 자동화",
    items: [
      "DB 접수 즉시 이메일 알림 (클라이언트)",
      "BCC 관리자 수신 (운영 모니터링)",
      "CRM 상태 관리",
    ],
  },
  {
    icon: BarChart3,
    layer: "Layer 3",
    title: "성과 분석",
    items: [
      "월간 성과 리포트 자동 발송",
      "GA4 채널별 유입 분석",
      "Meta 광고 CPL 트래킹",
    ],
  },
];

export default function ServicePage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "홈", url: "https://polarad.co.kr" },
          { name: "서비스 안내", url: "https://polarad.co.kr/service" },
        ]}
      />
      <FAQSchema faqs={serviceFaqs} />
      <ServiceSchema />

      {/* Hero */}
      <ServiceHero />

      {/* Pricing Cards — 모바일 좌우 슬라이드 + 버튼 */}
      <section className="py-10 lg:py-24 bg-[#1a1a1a]">
        <div className="container px-4">
          <TierCarousel tiers={tiers} />
        </div>
      </section>

      {/* Layer 0-3 포함 서비스 — #4 카피 변경, #5 좌우 카드 슬라이드 */}
      <section className="py-10 lg:py-24 bg-[#222]">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-2xl lg:text-3xl font-bold text-white text-center mb-4">
                포함 서비스 상세
              </h2>
              <p className="text-[#888] text-center mb-8 sm:mb-12 max-w-xl mx-auto text-sm sm:text-base break-keep">
                매월 이용하면 온라인 고객확보 어렵지 않고,
                <br />
                마케팅, 홈페이지, 콘텐츠까지 한번에 해결
              </p>
            </ScrollReveal>

            {/* 모바일: 좌우 스크롤, md+: 2x2 그리드 */}
            <ScrollReveal>
              <div className="flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-2 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:mx-0 md:px-0 md:pb-0">
                {layerSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <div
                      key={section.layer}
                      className="min-w-[280px] shrink-0 snap-start bg-[#2a2a2a] border border-white/[0.06] rounded-xl p-5 sm:p-6 md:min-w-0 md:shrink"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#c9a962]/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[#c9a962]" />
                        </div>
                        <div>
                          <span className="text-xs font-mono text-[#c9a962]/60 block">
                            {section.layer}
                          </span>
                          <span className="text-white font-semibold">
                            {section.title}
                          </span>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {section.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-sm text-gray-300"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#c9a962] shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-sm text-[#888] text-center mt-8">
                87개 광고 계정을 직접 운영한 노하우를 이식합니다.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Refund Policy */}
      <section className="py-10 lg:py-24 bg-[#222]">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-8">
                <Shield className="w-6 h-6 text-[#c9a962]" />
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  환불 정책
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.06}>
              <div className="bg-[#2a2a2a] border border-white/[0.06] rounded-xl p-6">
                <div className="text-white font-bold text-lg mb-3">
                  잔여 기간 금액 − 30% 수수료
                </div>
                <p className="text-[#999] text-sm leading-relaxed mb-4">
                  약정 기간 내 해지 시, 잔여 기간 구독료에서 환불수수료 30%를
                  차감한 금액을 환불해 드립니다.
                </p>
                <div className="bg-[#333] rounded-lg p-4 text-sm text-[#bbb]">
                  <span className="text-[#c9a962] font-medium">예시</span>{" "}
                  운영형(월 22만원) 2개월 이용 후 해지 → 잔여 4개월분 88만원 ×
                  70% ={" "}
                  <span className="text-white font-semibold">
                    61.6만원 환불
                  </span>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <p className="mt-4 text-sm text-[#c9a962]">
                * 6개월 약정 종료 후에는 월 단위 자동 연장, 언제든 해지 가능
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 lg:py-24 bg-[#1a1a1a]">
        <div className="container px-4">
          <ScrollReveal>
            <h2 className="text-2xl lg:text-3xl font-bold text-white text-center mb-8 sm:mb-12">
              자주 묻는 질문
            </h2>
          </ScrollReveal>
          <div className="max-w-3xl mx-auto space-y-3">
            {serviceFaqs.map((faq, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.05}>
                <details className="group bg-[#2a2a2a] border border-white/[0.06] rounded-xl">
                  <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer list-none">
                    <span className="text-white font-medium text-sm lg:text-base">
                      {faq.question}
                    </span>
                    <svg
                      className="w-5 h-5 text-[#888] group-open:rotate-180 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-sm text-[#888]">
                    {faq.answer}
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 text-center bg-gradient-to-b from-[#1a1a1a] to-[#222]">
        <ScrollReveal>
          <h2 className="text-2xl font-bold text-white mb-3">
            지금 시작하세요
          </h2>
          <p className="text-sm text-[#888] mb-8">
            무료 상담을 통해 사업에 맞는 플랜을 추천받으세요
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-br from-[#c9a962] to-[#b08d3e] text-[#1a1a1a] font-bold text-base hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,169,98,0.4)] transition-all"
          >
            무료 상담 신청
            <ArrowRight className="w-5 h-5" />
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
