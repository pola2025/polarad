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
} from "lucide-react";

const sampleSites = [
  { name: "스타일 A", url: "https://financialhealing.imweb.me/" },
  { name: "스타일 B", url: "https://primeroad.imweb.me/" },
  { name: "스타일 C", url: "https://ynjbiz.imweb.me/" },
  { name: "스타일 D", url: "https://mjgood.imweb.me/" },
  { name: "스타일 E", url: "https://jmbiz.imweb.me/" },
  { name: "스타일 F", url: "https://ganaanbiz.imweb.me/" },
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
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
        bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-95"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          복사됨
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          복사
        </>
      )}
    </button>
  );
}

export default function ProposalPage() {
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
            <CalendarDays className="w-4 h-4" />
            2026.03.05
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            홈페이지 리뉴얼
            <br className="md:hidden" /> 업무 안내
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            진행 업무 범위 및 비용 안내서
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* 서비스 1: 당근마켓 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <div className="text-sm font-semibold text-orange-500 mb-1">
                SERVICE 01
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                당근마켓 광고관리
              </h2>
            </div>
          </div>
          <ul className="space-y-3">
            {[
              "광고소재 제작 (이미지/텍스트 디자인)",
              "광고 캠페인 설정 및 타겟 세팅",
              "광고 효율 분석 및 이슈사항 전달",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600">
                <ChevronRight className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 서비스 2: 홈페이지 리뉴얼 */}
        <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow p-8 relative">
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
              핵심
            </span>
          </div>
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Monitor className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-blue-600 mb-1">
                SERVICE 02
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                홈페이지 리뉴얼
              </h2>
            </div>
          </div>
          <ul className="space-y-3 mb-6">
            {[
              "아임웹 → 자체개발 홈페이지로 전환",
              "아임웹 월 비용 지출 없음 (비용 절감)",
              "도메인만 별도 결제 필요",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600">
                <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800">
              <strong className="text-amber-900">도메인 안내:</strong>{" "}
              후이즈(whois.co.kr)에서 신규 구매하거나, 기존 보유 도메인이 있는
              경우 해당 도메인을 그대로 사용합니다.
            </p>
          </div>
        </div>

        {/* 서비스 3: 게시글 자동화 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
              <Bot className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-violet-600 mb-1">
                SERVICE 03
              </div>
              <h2 className="text-xl font-bold text-gray-900">게시글 자동화</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 mt-1">
                자동배포
              </span>
            </div>
          </div>
          <ul className="space-y-3">
            {[
              "홈페이지 게시글 매일 1개 자동 배포",
              "인스타그램 게시글 매일 1개 자동 배포",
              "쓰레드(Threads) 게시글 매일 1개 자동 배포",
              "사전 기획된 컨셉에 맞는 콘텐츠 자동 생성",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600">
                <ChevronRight className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 비용 */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-8 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-blue-300" />
            <span className="text-sm font-medium text-blue-300">
              월 서비스 비용
            </span>
          </div>
          <div className="text-5xl font-extrabold tracking-tight mb-1">
            220,000<span className="text-2xl font-medium ml-1">원</span>
          </div>
          <p className="text-blue-200 text-sm mb-8">
            VAT 포함 · 6개월 단위 결제
          </p>
          <div className="flex justify-center gap-12">
            <div>
              <div className="text-sm text-blue-300">6개월 총액</div>
              <div className="text-2xl font-bold">1,320,000원</div>
            </div>
            <div>
              <div className="text-sm text-blue-300">결제 단위</div>
              <div className="text-2xl font-bold">6개월</div>
            </div>
          </div>
        </div>

        {/* 결제 계좌 */}
        <div className="bg-white rounded-2xl border-2 border-blue-600 shadow-sm p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            결제 계좌 정보
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500">은행</span>
              <span className="font-semibold text-gray-900">우리은행</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500">계좌번호</span>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900 font-mono tracking-wider">
                  1005-302-954803
                </span>
                <CopyButton text="1005302954803" />
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-500">예금주</span>
              <span className="font-semibold text-gray-900">
                폴라애드(이재호)
              </span>
            </div>
          </div>
        </div>

        {/* 아임웹 해지 */}
        <div className="bg-red-50 border-l-4 border-red-500 rounded-r-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-red-800 mb-1">아임웹 해지 안내</h4>
              <p className="text-sm text-red-700">
                아임웹 결제는 <strong>2026년 3월 5일(목)</strong> 기준으로 종료
                및 해지 처리됩니다. 리뉴얼 홈페이지가 해당 일자 전에 준비
                완료됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 진행 일정 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-8">진행 일정</h2>
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
              <div key={i} className="relative pb-8 last:pb-0">
                <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-blue-600 border-4 border-white shadow-sm flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <div className="text-xs font-semibold text-blue-600 mb-0.5">
                  {item.step}
                </div>
                <div className="text-gray-700 font-medium">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 홈페이지 시안 갤러리 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            홈페이지 스타일 시안
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            아래 시안 중 원하시는 스타일을 선택해 주세요. 직접 클릭하여
            미리보기할 수 있습니다.
          </p>

          {/* 시안 그리드 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {sampleSites.map((site) => (
              <button
                key={site.url}
                onClick={() =>
                  setSelectedSite(selectedSite === site.url ? null : site.url)
                }
                className={`group relative rounded-xl border-2 overflow-hidden transition-all duration-200 text-left
                    ${
                      selectedSite === site.url
                        ? "border-blue-600 shadow-lg ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                    }`}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center relative">
                  <Monitor
                    className={`w-10 h-10 transition-colors ${selectedSite === site.url ? "text-blue-500" : "text-gray-300 group-hover:text-blue-400"}`}
                  />
                  {selectedSite === site.url && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-100">
                  <div className="font-semibold text-sm text-gray-800">
                    {site.name}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {site.url.replace("https://", "")}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 시안 미리보기 */}
          {selectedSite && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">
                  미리보기:{" "}
                  {sampleSites.find((s) => s.url === selectedSite)?.name}
                </h3>
                <a
                  href={selectedSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  새 탭에서 보기
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-inner">
                <iframe
                  src={selectedSite}
                  className="w-full h-[600px] md:h-[700px]"
                  title="홈페이지 시안 미리보기"
                />
              </div>
            </div>
          )}

          {/* 전체 링크 목록 */}
          {!selectedSite && (
            <div className="text-center py-8 text-gray-400 text-sm">
              위 시안 카드를 클릭하면 미리보기가 표시됩니다
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="text-center py-8 text-gray-400 text-sm">
          폴라애드 · 대표 이재호 · 본 문서는 업무 진행 안내를 위해 제공됩니다.
        </div>
      </div>
    </div>
  );
}
