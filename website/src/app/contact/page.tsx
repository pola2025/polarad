"use client";

import { useState } from "react";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { YouTubeBackground } from "@/components/ui/YouTubeBackground";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Building2,
  Ruler,
  GraduationCap,
  Scale,
  Camera,
  Home,
  Truck,
  Briefcase,
  CircleOff,
  Instagram,
  Megaphone,
  Users,
  CircleDollarSign,
  DollarSign,
  Banknote,
  Gem,
  UserPlus,
  RefreshCw,
  Flag,
  HelpCircle,
} from "lucide-react";

const steps = [
  {
    label: "Step 1 / 4",
    question: "어떤 업종이신가요?",
    options: [
      {
        value: "인테리어",
        title: "인테리어",
        desc: "리모델링·시공",
        icon: Building2,
      },
      {
        value: "건축/설계",
        title: "건축/설계",
        desc: "설계·감리",
        icon: Ruler,
      },
      {
        value: "학원/교육",
        title: "학원/교육",
        desc: "학원·교습소·코칭",
        icon: GraduationCap,
      },
      {
        value: "법률/세무",
        title: "법률/세무",
        desc: "수임·기장 계약",
        icon: Scale,
      },
      {
        value: "웨딩/스튜디오",
        title: "웨딩/스튜디오",
        desc: "촬영·플래닝",
        icon: Camera,
      },
      {
        value: "부동산/중개",
        title: "부동산/중개",
        desc: "매물·분양 상담",
        icon: Home,
      },
      {
        value: "이사/용달",
        title: "이사/용달",
        desc: "견적·계약",
        icon: Truck,
      },
      {
        value: "경영컨설팅",
        title: "경영컨설팅",
        desc: "컨설팅·B2B",
        icon: Briefcase,
      },
    ],
    note: "* 쇼핑몰 및 온라인몰 판매 서비스는 진단 대상에서 제외됩니다.",
  },
  {
    label: "Step 2 / 4",
    question: "현재 온라인 마케팅은\n어떻게 하고 계세요?",
    options: [
      {
        value: "없음",
        title: "아무것도 안 함",
        desc: "홈페이지·SNS 없음",
        icon: CircleOff,
      },
      {
        value: "SNS만",
        title: "SNS만 운영 중",
        desc: "인스타·블로그 직접",
        icon: Instagram,
      },
      {
        value: "광고중",
        title: "광고 돌리는 중",
        desc: "Meta·네이버 등",
        icon: Megaphone,
      },
      {
        value: "대행중",
        title: "대행사 이용 중",
        desc: "성과 불만족",
        icon: Users,
      },
    ],
  },
  {
    label: "Step 3 / 4",
    question: "월 광고 예산은\n어느 정도 생각하세요?",
    options: [
      {
        value: "0",
        title: "아직 없음",
        desc: "시작 전 단계",
        icon: CircleDollarSign,
      },
      {
        value: "30이하",
        title: "30만원 이하",
        desc: "소규모 테스트",
        icon: DollarSign,
      },
      {
        value: "30-100",
        title: "30~100만원",
        desc: "본격 운영",
        icon: Banknote,
      },
      {
        value: "100이상",
        title: "100만원 이상",
        desc: "공격적 성장",
        icon: Gem,
      },
    ],
  },
  {
    label: "Step 4 / 4",
    question: "가장 큰 고민은 뭔가요?",
    options: [
      {
        value: "신규고객",
        title: "신규 고객 확보",
        desc: "DB가 안 들어옴",
        icon: UserPlus,
      },
      {
        value: "재방문",
        title: "재방문·재계약",
        desc: "한 번 오고 끝",
        icon: RefreshCw,
      },
      { value: "브랜딩", title: "브랜딩", desc: "인지도가 낮음", icon: Flag },
      {
        value: "모름",
        title: "뭘 해야 할지 모름",
        desc: "방향 자체가 없음",
        icon: HelpCircle,
      },
    ],
  },
];

function getRecommendation(answers: string[]) {
  const [, marketing, budget] = answers;
  if (marketing === "없음" || budget === "0") {
    return {
      tier: "접수형 추천",
      text: "온라인 기반이 없는 상태라면\n월 5만원 접수형으로 홈페이지부터 시작하세요.",
    };
  }
  if (budget === "100이상" || marketing === "대행중") {
    return {
      tier: "프리미엄 추천",
      text: "이미 광고 경험이 있으시군요.\n전담 매니저 + 멀티채널로 성과를 극대화하세요.",
    };
  }
  return {
    tier: "운영형 추천",
    text: "현재 상태라면 월 22만원 운영대행으로\n안정적인 DB 확보가 가능합니다.",
  };
}

export default function ContactPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    phone: "",
  });
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAgreed) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    setIsSubmitting(true);
    const rec = getRecommendation(answers);
    try {
      const response = await fetch(
        "https://pola-homepage.mkt9834.workers.dev/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            company: formData.company,
            message: `[위저드] 업종: ${answers[0]} / 현황: ${answers[1]} / 예산: ${answers[2]} / 고민: ${answers[3]} → ${rec.tier}`,
            privacyAgreed,
          }),
        },
      );
      const result = await response.json();
      if (result.success) {
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "contact_form_submit", {
            event_category: "conversion",
            event_label: "wizard_diagnosis",
            industry: answers[0],
            recommendation: rec.tier,
          });
        }
        setSubmitted(true);
      } else {
        alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch {
      alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isResultStep = currentStep === steps.length;
  const progress = (currentStep / (steps.length + 1)) * 100;

  if (submitted) {
    return (
      <>
        <BreadcrumbSchema
          items={[
            { name: "홈", url: "https://polarad.co.kr" },
            { name: "간편 진단", url: "https://polarad.co.kr/contact" },
          ]}
        />
        <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-[#c9a962]/10 border border-[#c9a962]/20 flex items-center justify-center mx-auto mb-6">
              <Send className="w-7 h-7 text-[#c9a962]" />
            </div>
            <h1 className="text-2xl font-bold mb-3">신청이 완료되었습니다</h1>
            <p className="text-[#888] mb-8">
              1영업일 내에 담당자가 직접 연락드리겠습니다.
              <br />
              맞춤 진단 리포트도 함께 보내드립니다.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-br from-[#c9a962] to-[#b08d3e] text-[#1a1a1a] font-bold text-sm"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "홈", url: "https://polarad.co.kr" },
          { name: "간편 진단", url: "https://polarad.co.kr/contact" },
        ]}
      />

      <div className="min-h-screen bg-[#1a1a1a] text-white">
        {/* Hero */}
        <section className="relative pt-28 pb-8 lg:pt-36 lg:pb-12 text-center px-4 overflow-hidden">
          <YouTubeBackground videoId="aSgqURjqWiY" overlayOpacity={75} />
          <div className="relative z-10">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 break-keep">
              우리 업체 현황에 맞는
              <br />
              <span className="text-[#c9a962]">맞춤 진단</span>을 받아보세요
            </h1>
            <p className="text-[#888] text-base lg:text-lg max-w-xl mx-auto">
              4개 질문에 답하면 현재 상태에 딱 맞는 솔루션을 알려드립니다.
            </p>
          </div>
        </section>

        {/* Wizard */}
        <section className="pb-20 lg:pb-28 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Progress bar */}
            <div className="flex gap-1.5 mb-8">
              {Array.from({ length: steps.length + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1 rounded-full overflow-hidden bg-white/[0.06]"
                >
                  <div
                    className="h-full bg-[#c9a962] transition-all duration-500"
                    style={{
                      width:
                        i < currentStep
                          ? "100%"
                          : i === currentStep
                            ? `${progress > 0 ? 50 : 0}%`
                            : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="bg-[#2a2a2a] border border-white/[0.06] rounded-xl p-6 lg:p-8">
              {!isResultStep ? (
                <>
                  {/* Step question */}
                  <div className="text-xs text-[#c9a962] font-mono mb-2">
                    {steps[currentStep].label}
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-white mb-6 whitespace-pre-line">
                    {steps[currentStep].question}
                  </h2>

                  {/* Option cards */}
                  <div
                    className={`grid gap-3 ${steps[currentStep].options.length > 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}
                  >
                    {steps[currentStep].options.map((opt) => {
                      const Icon = opt.icon;
                      const selected = answers[currentStep] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelect(opt.value)}
                          className={`relative rounded-xl p-4 border text-left transition-all hover:border-[#c9a962]/40 ${
                            selected
                              ? "bg-[#c9a962]/10 border-[#c9a962]/40"
                              : "bg-[#333] border-white/[0.06]"
                          }`}
                        >
                          <Icon className="w-6 h-6 text-[#c9a962] mb-2" />
                          <div className="text-sm font-semibold text-white">
                            {opt.title}
                          </div>
                          <div className="text-xs text-[#888] mt-0.5">
                            {opt.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {steps[currentStep].note && (
                    <p className="text-[10px] text-[#666] text-center mt-4">
                      {steps[currentStep].note}
                    </p>
                  )}

                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-1 text-sm text-[#888] hover:text-white mt-6 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      이전
                    </button>
                  )}
                </>
              ) : (
                <>
                  {/* Result + Form */}
                  {(() => {
                    const rec = getRecommendation(answers);
                    return (
                      <>
                        <div className="text-center mb-8">
                          <div className="inline-flex px-4 py-1.5 rounded-full bg-[#c9a962]/10 border border-[#c9a962]/20 text-[#c9a962] text-sm font-semibold mb-3">
                            맞춤 진단 결과
                          </div>
                          <div className="text-2xl font-bold text-white mb-2">
                            {rec.tier}
                          </div>
                          <p className="text-sm text-[#888] whitespace-pre-line">
                            {rec.text}
                          </p>
                        </div>

                        <p className="text-sm text-[#888] text-center mb-6">
                          간편 진단 리포트를 받으시려면 연락처를 남겨주세요.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <input
                              type="text"
                              value={formData.company}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  company: e.target.value,
                                })
                              }
                              required
                              placeholder="업체명 (브랜드명)"
                              className="w-full px-4 py-3 bg-[#333] border border-white/[0.06] rounded-lg text-white placeholder-[#555] text-sm focus:outline-none focus:border-[#c9a962]/50"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              required
                              placeholder="대표자명"
                              className="w-full px-4 py-3 bg-[#333] border border-white/[0.06] rounded-lg text-white placeholder-[#555] text-sm focus:outline-none focus:border-[#c9a962]/50"
                            />
                          </div>
                          <div>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phone: e.target.value,
                                })
                              }
                              required
                              placeholder="연락처 (휴대폰)"
                              className="w-full px-4 py-3 bg-[#333] border border-white/[0.06] rounded-lg text-white placeholder-[#555] text-sm focus:outline-none focus:border-[#c9a962]/50"
                            />
                          </div>

                          <label className="flex items-start gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacyAgreed}
                              onChange={(e) =>
                                setPrivacyAgreed(e.target.checked)
                              }
                              className="w-4 h-4 mt-0.5 rounded border-[#555] bg-[#333] text-[#c9a962] focus:ring-[#c9a962]"
                            />
                            <span className="text-xs text-[#888]">
                              <span className="text-red-400">*</span> 개인정보
                              수집 및 이용에 동의합니다
                            </span>
                          </label>

                          <button
                            type="submit"
                            disabled={!privacyAgreed || isSubmitting}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-gradient-to-br from-[#c9a962] to-[#b08d3e] text-[#1a1a1a] font-bold text-sm hover:shadow-[0_4px_20px_rgba(201,169,98,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? (
                              <>
                                <span className="w-4 h-4 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
                                신청 중...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                간편 진단 리포트 받기
                              </>
                            )}
                          </button>

                          <p className="text-[10px] text-center text-[#666]">
                            수집된 개인정보는 상담 목적으로만 사용되며, 상담
                            완료 후 파기됩니다.
                          </p>
                        </form>

                        <button
                          type="button"
                          onClick={handleBack}
                          className="flex items-center gap-1 text-sm text-[#888] hover:text-white mt-6 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          이전
                        </button>
                      </>
                    );
                  })()}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
