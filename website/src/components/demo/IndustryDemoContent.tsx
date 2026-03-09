"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { IndustryDemo } from "@/lib/demo-data";

function StepProgress({ activeStep }: { activeStep: number }) {
  const steps = [
    { id: 1, label: "홈페이지" },
    { id: 2, label: "광고" },
    { id: 3, label: "DB 수집" },
    { id: 4, label: "리포트" },
  ];

  return (
    <div className="fixed top-[60px] md:top-[60px] lg:top-[64px] left-0 right-0 z-40 bg-[rgba(26,26,26,0.95)] backdrop-blur-sm border-b border-[rgba(201,169,98,0.1)] flex justify-center h-11">
      {steps.map((step) => (
        <a
          key={step.id}
          href={`#step${step.id}`}
          className={`flex items-center gap-1.5 px-5 h-full text-xs font-semibold transition-all border-b-2 ${
            activeStep === step.id
              ? "text-[#c9a962] border-[#c9a962]"
              : "text-[#666] border-transparent hover:text-[#999]"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              activeStep === step.id ? "bg-[#c9a962]" : "bg-[#444]"
            }`}
          />
          {step.label}
        </a>
      ))}
    </div>
  );
}

export default function IndustryDemoContent({ data }: { data: IndustryDemo }) {
  const [activeStep, setActiveStep] = useState(1);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepNum = parseInt(entry.target.id.replace("step", ""), 10);
            if (!isNaN(stepNum)) setActiveStep(stepNum);
          }
        });
      },
      { threshold: 0.3 },
    );

    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const iconLarge = data.icon
    .replace(/width="24"/g, 'width="48"')
    .replace(/height="24"/g, 'height="48"');

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e0e0e0] -mt-[60px] md:-mt-[60px] lg:-mt-[64px] pt-[60px] md:pt-[60px] lg:pt-[64px]">
      <StepProgress activeStep={activeStep} />

      {/* Hero */}
      <section className="relative min-h-[50vh] md:min-h-[70vh] flex items-center justify-center pt-[80px] pb-[40px] md:pt-[100px] md:pb-[60px] px-5 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={data.image}
            alt={data.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(26,26,26,0.85)] via-[rgba(26,26,26,0.7)] to-[rgba(26,26,26,0.95)]" />
        </div>
        <div className="relative z-10 text-center max-w-[600px]">
          <div
            className="flex justify-center mb-4"
            dangerouslySetInnerHTML={{ __html: iconLarge }}
          />
          <span className="inline-block px-4 py-1.5 rounded-full bg-[rgba(201,169,98,0.15)] border border-[rgba(201,169,98,0.3)] text-[#c9a962] text-[13px] font-semibold mb-5">
            {data.badge}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-snug mb-4 whitespace-pre-line">
            {data.heroTitle}
          </h1>
          <p className="text-[15px] text-[#999]">
            POLAAD가 {data.name} 업종에 제공하는 올인원 마케팅 솔루션
          </p>
        </div>
      </section>

      {/* Step 1: Homepage */}
      <section
        id="step1"
        ref={(el) => {
          sectionsRef.current[0] = el;
        }}
        className="py-12 md:py-20 px-5 flex flex-col items-center"
        style={{ scrollMarginTop: "120px" }}
      >
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 text-[#c9a962] text-[13px] font-bold tracking-widest uppercase mb-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[rgba(201,169,98,0.15)] border border-[rgba(201,169,98,0.4)] text-[13px] font-extrabold">
              1
            </span>
            STEP 1
          </div>
          <h2 className="text-2xl md:text-[28px] font-extrabold text-white">
            전문 홈페이지 제작
          </h2>
          <p className="text-sm text-[#888] mt-2">
            업종 특화 랜딩페이지로 고객의 신뢰를 확보합니다
          </p>
        </div>

        {/* Browser Mockup */}
        <div className="w-full max-w-[700px] rounded-xl overflow-hidden bg-[#2a2a2a] border border-[#3a3a3a] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#333] border-b border-[#3a3a3a]">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 ml-2 px-3 py-1.5 rounded-md bg-[#2a2a2a] border border-[#444] text-[#999] text-xs">
              {data.url}
            </div>
          </div>
          <div className="relative">
            <div className="relative h-[200px] md:h-[280px]">
              <Image
                src={data.image}
                alt={data.name}
                fill
                className="object-cover brightness-[0.7]"
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6 bg-gradient-to-b from-black/20 to-black/50">
              <span className="px-3.5 py-1 rounded-2xl bg-[rgba(201,169,98,0.2)] border border-[rgba(201,169,98,0.4)] text-[#c9a962] text-[11px] font-semibold mb-3">
                {data.badge}
              </span>
              <h3 className="text-xl md:text-[22px] font-extrabold text-white text-center leading-snug whitespace-pre-line">
                {data.heroTitle}
              </h3>
              <button className="mt-4 px-7 py-2.5 rounded-lg bg-[#c9a962] text-[#1a1a1a] text-[13px] font-bold">
                {data.adCta}
              </button>
            </div>
          </div>
          <div className="p-4 md:p-6 flex flex-col gap-2">
            <div className="px-3.5 py-2.5 rounded-md bg-[#333] border border-[#444] text-[#888] text-[13px]">
              이름
            </div>
            <div className="px-3.5 py-2.5 rounded-md bg-[#333] border border-[#444] text-[#888] text-[13px]">
              연락처
            </div>
            <div className="px-3.5 py-2.5 rounded-md bg-[#333] border border-[#444] text-[#888] text-[13px]">
              문의 내용
            </div>
            <button className="mt-1 py-3 rounded-lg bg-[#c9a962] text-[#1a1a1a] text-sm font-bold">
              무료 상담 신청하기
            </button>
          </div>
        </div>
      </section>

      {/* Step 2: Instagram Ad */}
      <section
        id="step2"
        ref={(el) => {
          sectionsRef.current[1] = el;
        }}
        className="py-12 md:py-20 px-5 flex flex-col items-center"
        style={{ scrollMarginTop: "120px" }}
      >
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 text-[#c9a962] text-[13px] font-bold tracking-widest uppercase mb-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[rgba(201,169,98,0.15)] border border-[rgba(201,169,98,0.4)] text-[13px] font-extrabold">
              2
            </span>
            STEP 2
          </div>
          <h2 className="text-2xl md:text-[28px] font-extrabold text-white">
            인스타그램 광고 집행
          </h2>
          <p className="text-sm text-[#888] mt-2">
            타겟 고객에게 정확히 도달하는 퍼포먼스 광고
          </p>
        </div>

        {/* Phone Mockup */}
        <div className="w-full max-w-[320px] rounded-[36px] overflow-hidden bg-[#2a2a2a] border-[3px] border-[#444] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="h-7 bg-[#2a2a2a] flex items-center justify-center">
            <div className="w-[100px] h-1.5 rounded-full bg-[#444]" />
          </div>
          <div className="bg-white">
            <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a962] to-[#8b6914] flex items-center justify-center text-white text-xs font-extrabold">
                AD
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#262626]">
                  {data.adBrand}
                </div>
                <div className="text-[10px] text-[#999]">Sponsored</div>
              </div>
            </div>
            <div className="relative h-[220px] md:h-[280px]">
              <Image
                src={data.image}
                alt={`${data.name} 광고 예시`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex gap-3.5 px-3.5 py-2.5 text-xl">
              <span>&hearts;</span>
              <span>&#x1F4AC;</span>
              <span>&#x27A4;</span>
            </div>
            <div
              className="px-3.5 pb-3.5 text-xs text-[#262626] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data.adCaption }}
            />
            <div className="mx-3.5 mb-3.5 py-2.5 bg-[#0095f6] text-white text-center rounded-lg text-[13px] font-semibold">
              {data.adCta}
            </div>
          </div>
          <div className="h-5 bg-[#2a2a2a] flex items-center justify-center">
            <div className="w-[100px] h-1 rounded-full bg-[#555]" />
          </div>
        </div>
      </section>

      {/* Step 3: DB Collection */}
      <section
        id="step3"
        ref={(el) => {
          sectionsRef.current[2] = el;
        }}
        className="py-12 md:py-20 px-5 flex flex-col items-center"
        style={{ scrollMarginTop: "120px" }}
      >
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 text-[#c9a962] text-[13px] font-bold tracking-widest uppercase mb-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[rgba(201,169,98,0.15)] border border-[rgba(201,169,98,0.4)] text-[13px] font-extrabold">
              3
            </span>
            STEP 3
          </div>
          <h2 className="text-2xl md:text-[28px] font-extrabold text-white">
            실시간 DB 수집
          </h2>
          <p className="text-sm text-[#888] mt-2">
            텔레그램으로 실시간 알림, 대시보드로 한눈에 관리
          </p>
        </div>

        {/* Telegram Card */}
        <div className="w-full max-w-[420px] rounded-xl overflow-hidden bg-[#2a2a2a] border border-[#3a3a3a] shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2.5 px-4 py-3.5 bg-[#1a2733] border-b border-[#2a3744]">
            <div className="w-9 h-9 rounded-full bg-[#2AABEE] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="#fff"
                className="w-[18px] h-[18px]"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.66-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.75 3.99-1.73 6.65-2.88 7.97-3.44 3.8-1.58 4.59-1.86 5.1-1.87.11 0 .37.03.54.17.14.12.18.28.2.45-.01.06.01.24 0 .37z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-white">POLAAD DB 알림</div>
              <div className="text-[11px] text-[#6a8fa8]">{data.url}</div>
            </div>
          </div>
          <div className="p-4">
            <div className="inline-block px-4 py-3 rounded-tl-none rounded-xl bg-[#1a2733] text-[13px] text-[#e0e0e0] leading-relaxed">
              <div className="text-[#c9a962] font-semibold mb-2">
                새로운 문의가 접수되었습니다
              </div>
              {data.tgMessage.split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
            <div className="text-[10px] text-[#666] text-right mt-1.5">
              오후 2:34
            </div>
          </div>
          <div className="flex items-center justify-center gap-1.5 py-2.5 text-xs text-[#c9a962] font-semibold border-t border-[#3a3a3a] animate-pulse">
            새 알림 도착
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-[520px] mt-6 md:mt-8">
          {data.stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl py-3.5 md:py-5 px-3 text-center hover:border-[rgba(201,169,98,0.4)] transition-colors"
            >
              <div className="text-xl md:text-[28px] font-extrabold text-[#c9a962]">
                {stat.value}
              </div>
              <div className="text-[11px] text-[#888] mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Step 4: Report */}
      <section
        id="step4"
        ref={(el) => {
          sectionsRef.current[3] = el;
        }}
        className="py-12 md:py-20 px-5 flex flex-col items-center"
        style={{ scrollMarginTop: "120px" }}
      >
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 text-[#c9a962] text-[13px] font-bold tracking-widest uppercase mb-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[rgba(201,169,98,0.15)] border border-[rgba(201,169,98,0.4)] text-[13px] font-extrabold">
              4
            </span>
            STEP 4
          </div>
          <h2 className="text-2xl md:text-[28px] font-extrabold text-white">
            월간 성과 리포트
          </h2>
          <p className="text-sm text-[#888] mt-2">
            투명한 데이터로 마케팅 효과를 확인합니다
          </p>
        </div>

        {/* Report Card */}
        <div className="w-full max-w-[480px] rounded-xl overflow-hidden bg-[#2a2a2a] border border-[#3a3a3a] shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-5 border-b border-[#3a3a3a]">
            <div className="text-base font-bold text-white">
              {data.name} 월간 리포트
            </div>
            <span className="text-[11px] text-[#888] px-2.5 py-1 rounded-xl bg-[#333]">
              2026년 3월
            </span>
          </div>
          <div className="px-4 md:px-6 py-1">
            {data.report.map((row, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2.5 md:py-3.5 border-b border-[#333] last:border-none"
              >
                <span
                  className={`text-sm ${
                    row.highlight
                      ? "text-[#c9a962] font-semibold"
                      : "text-[#999]"
                  }`}
                >
                  {row.label}
                </span>
                <span
                  className={`font-bold ${
                    row.highlight
                      ? "text-[#c9a962] text-lg"
                      : "text-[#e0e0e0] text-[15px]"
                  }`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-[rgba(201,169,98,0.05)] border-t border-[rgba(201,169,98,0.15)] text-center">
            <span className="text-xs text-[#c9a962] font-semibold">
              POLAAD - {data.name} 마케팅 파트너
            </span>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 px-6 text-center bg-gradient-to-b from-[#1a1a1a] to-[#222]">
        <h2 className="text-2xl font-extrabold text-white mb-2">
          {data.name} 마케팅, 지금 시작하세요
        </h2>
        <p className="text-sm text-[#888] mb-6">
          POLAAD가 홈페이지부터 광고, DB 관리, 리포트까지 모두 해결합니다
        </p>
        <Link
          href="/contact"
          className="inline-block px-12 py-4 rounded-xl bg-gradient-to-br from-[#c9a962] to-[#b08d3e] text-[#1a1a1a] text-base font-extrabold hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,169,98,0.4)] transition-all shadow-[0_4px_20px_rgba(201,169,98,0.3)]"
        >
          무료 상담 신청
        </Link>
      </section>
    </div>
  );
}
