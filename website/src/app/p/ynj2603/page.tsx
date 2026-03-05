"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  Monitor,
  Megaphone,
  Bot,
  CreditCard,
  CalendarDays,
  AlertTriangle,
  ChevronRight,
  Expand,
} from "lucide-react";

const sampleSites = [
  {
    name: "스타일 A",
    url: "https://financialhealing.imweb.me/",
    desc: "심플 블루 톤",
  },
  {
    name: "스타일 B",
    url: "https://primeroad.imweb.me/",
    desc: "프리미엄 다크",
  },
  {
    name: "스타일 C",
    url: "https://ynjbiz.imweb.me/",
    desc: "클래식 비즈니스",
  },
  { name: "스타일 D", url: "https://mjgood.imweb.me/", desc: "모던 클린" },
  { name: "스타일 E", url: "https://jmbiz.imweb.me/", desc: "컨설팅 전문" },
  { name: "스타일 F", url: "https://ganaanbiz.imweb.me/", desc: "신뢰감 그린" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
        transition-all duration-200 bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-95"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span>복사됨</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>복사</span>
        </>
      )}
    </button>
  );
}

export default function ProposalPage() {
  const [expandedSite, setExpandedSite] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white"
      style={{ wordBreak: "keep-all", overflowWrap: "break-word" }}
    >
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a5f 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl"
            style={{ background: "#3b82f6" }}
          />
          <div
            className="absolute bottom-10 right-20 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "#6366f1" }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-5 py-16 sm:py-20 text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm mb-6"
            style={{ background: "rgba(255,255,255,0.12)", color: "#ffffff" }}
          >
            <CalendarDays className="w-4 h-4" />
            <span>2026.03.05</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
            style={{ color: "#ffffff", textWrap: "balance" }}
          >
            홈페이지 리뉴얼 업무&nbsp;안내
          </h1>
          <p
            className="text-base sm:text-lg max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            진행 업무 범위 및 비용 안내서
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8">
        {/* 서비스 1: 당근마켓 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-8">
          <div className="flex items-start gap-3 sm:gap-4 mb-5">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-50 flex items-center justify-center">
              <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-orange-500 mb-0.5">
                SERVICE 01
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                당근마켓 광고관리
              </h2>
            </div>
          </div>
          <ul className="space-y-2.5 sm:space-y-3">
            {[
              "광고소재 제작 (이미지/텍스트 디자인)",
              "광고 캠페인 설정 및 타겟 세팅",
              "광고 효율 분석 및 이슈사항 전달",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm sm:text-base text-gray-600"
              >
                <ChevronRight className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 서비스 2: 홈페이지 리뉴얼 */}
        <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-8 relative">
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <span className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
              핵심
            </span>
          </div>
          <div className="flex items-start gap-3 sm:gap-4 mb-5">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-blue-600 mb-0.5">
                SERVICE 02
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                홈페이지 리뉴얼
              </h2>
            </div>
          </div>
          <ul className="space-y-2.5 sm:space-y-3 mb-5">
            {[
              "아임웹 → 자체개발 홈페이지로 전환",
              "아임웹 월 비용 지출 없음 (비용 절감)",
              "도메인만 별도 결제 필요",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm sm:text-base text-gray-600"
              >
                <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 sm:p-4">
            <p className="text-xs sm:text-sm text-amber-800">
              <strong className="text-amber-900">도메인 안내:</strong>{" "}
              후이즈(whois.co.kr)에서 신규 구매하거나, 기존 보유 도메인이 있는
              경우 해당 도메인을 그대로 사용합니다.
            </p>
          </div>
        </div>

        {/* 서비스 3: 게시글 자동화 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-8">
          <div className="flex items-start gap-3 sm:gap-4 mb-5">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-violet-50 flex items-center justify-center">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-violet-600 mb-0.5">
                SERVICE 03
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                게시글 자동화
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-medium bg-violet-50 text-violet-700 mt-1">
                자동배포
              </span>
            </div>
          </div>
          <ul className="space-y-2.5 sm:space-y-3">
            {[
              "홈페이지 게시글 매일 1개 자동배포",
              "인스타그램 게시글 매일 1개 자동배포",
              "쓰레드(Threads) 게시글 매일 1개 자동배포",
              "사전 기획된 컨셉에 맞는 콘텐츠 자동생성",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm sm:text-base text-gray-600"
              >
                <ChevronRight className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 비용 */}
        <div
          className="rounded-2xl p-6 sm:p-8 text-center"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
            color: "#ffffff",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <CreditCard className="w-5 h-5" style={{ color: "#93c5fd" }} />
            <span className="text-sm font-medium" style={{ color: "#93c5fd" }}>
              월 서비스 비용
            </span>
          </div>
          <div
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-1"
            style={{ color: "#ffffff" }}
          >
            220,000
            <span className="text-xl sm:text-2xl font-medium ml-1">원</span>
          </div>
          <p className="text-sm mb-6 sm:mb-8" style={{ color: "#bfdbfe" }}>
            VAT 포함 · 6개월 단위 결제
          </p>
          <div className="flex justify-center gap-8 sm:gap-12 flex-wrap">
            <div>
              <div className="text-sm" style={{ color: "#93c5fd" }}>
                6개월 총액
              </div>
              <div
                className="text-xl sm:text-2xl font-bold"
                style={{ color: "#ffffff" }}
              >
                1,320,000원
              </div>
            </div>
            <div>
              <div className="text-sm" style={{ color: "#93c5fd" }}>
                결제 단위
              </div>
              <div
                className="text-xl sm:text-2xl font-bold"
                style={{ color: "#ffffff" }}
              >
                6개월
              </div>
            </div>
          </div>
        </div>

        {/* 결제 계좌 */}
        <div className="bg-white rounded-2xl border-2 border-blue-600 shadow-sm p-5 sm:p-8">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span>결제 계좌 정보</span>
          </h3>
          <div className="space-y-0">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm sm:text-base text-gray-500">은행</span>
              <span className="font-semibold text-sm sm:text-base text-gray-900">
                우리은행
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100 gap-2">
              <span className="text-sm sm:text-base text-gray-500 flex-shrink-0">
                계좌번호
              </span>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="font-semibold text-sm sm:text-base text-gray-900 font-mono tracking-wider">
                  1005-302-954803
                </span>
                <CopyButton text="1005302954803" />
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm sm:text-base text-gray-500">예금주</span>
              <span className="font-semibold text-sm sm:text-base text-gray-900">
                폴라애드(이재호)
              </span>
            </div>
          </div>
        </div>

        {/* 아임웹 해지 */}
        <div className="bg-red-50 border-l-4 border-red-500 rounded-r-2xl p-4 sm:p-6">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-red-800 mb-1 text-sm sm:text-base">
                아임웹 해지 안내
              </h4>
              <p className="text-xs sm:text-sm text-red-700">
                아임웹 결제는 <strong>2026년 3월 5일(목)</strong> 기준으로 종료
                및 해지 처리됩니다. 리뉴얼 홈페이지가 해당 일자 전에 준비
                완료됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 진행 일정 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 sm:mb-8">
            진행 일정
          </h2>
          <div className="relative pl-8">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-blue-100" />
            {[
              { step: "STEP 1", desc: "업무 범위 확인 및 계약 체결" },
              { step: "STEP 2", desc: "홈페이지 리뉴얼 디자인 및 개발" },
              { step: "STEP 3", desc: "도메인 연결 및 홈페이지 오픈" },
              {
                step: "STEP 4",
                desc: "당근마켓 광고 세팅 및 게시글 자동화 시작",
              },
              { step: "STEP 5", desc: "아임웹 해지 처리 완료" },
            ].map((item, i) => (
              <div key={i} className="relative pb-7 last:pb-0">
                <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-blue-600 border-4 border-white shadow-sm flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <div className="text-xs font-semibold text-blue-600 mb-0.5">
                  {item.step}
                </div>
                <div className="text-sm sm:text-base text-gray-700 font-medium">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 홈페이지 시안 갤러리 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8">
          <h2
            className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5"
            style={{ textWrap: "balance" }}
          >
            홈페이지 스타일 시안
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6">
            원하시는 스타일을 선택해 주세요. 클릭하면 새 창에서 실제 사이트를
            확인할 수 있습니다.
          </p>

          {/* 시안 그리드 - 썸네일 미리보기 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {sampleSites.map((site) => (
              <a
                key={site.url}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-xl border-2 border-gray-200 overflow-hidden
                  transition-all duration-200 hover:border-blue-400 hover:shadow-lg block"
              >
                {/* 썸네일 미리보기 이미지 */}
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
                  <img
                    src={`https://image.thum.io/get/width/600/crop/450/${site.url}`}
                    alt={`${site.name} 미리보기`}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  {/* 이미지 로딩 실패 시 폴백 */}
                  <div className="absolute inset-0 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 hidden">
                    <Monitor className="w-8 h-8 text-gray-300" />
                  </div>
                  {/* 호버 오버레이 */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 bg-white/90 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-800">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>사이트 보기</span>
                    </div>
                  </div>
                </div>
                <div className="p-2.5 sm:p-3 border-t border-gray-100">
                  <div className="font-semibold text-xs sm:text-sm text-gray-800">
                    {site.name}
                  </div>
                  <div className="text-[11px] sm:text-xs text-gray-400">
                    {site.desc}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 푸터 */}
        <div className="text-center py-6 sm:py-8 text-gray-400 text-xs sm:text-sm">
          폴라애드 · 대표 이재호 · 본 문서는 업무 진행 안내를 위해 제공됩니다.
        </div>
      </div>
    </div>
  );
}
