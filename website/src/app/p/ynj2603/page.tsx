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
  BarChart3,
  MousePointerClick,
  Eye,
  TrendingUp,
  Instagram,
  Globe,
  MessageCircle,
  ArrowRight,
  X,
  Sparkles,
  RefreshCw,
  Zap,
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

/* 당근마켓 광고 대시보드 목업 */
function DaangnAdMockup() {
  return (
    <div className="mt-6 rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
      {/* 당근 헤더 */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100"
        style={{ background: "#FF6F0F" }}
      >
        <div className="w-5 h-5 rounded bg-white/30 flex items-center justify-center text-white text-[10px] font-bold">
          당
        </div>
        <span className="text-xs font-semibold" style={{ color: "#fff" }}>
          당근 광고 관리
        </span>
        <span
          className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
        >
          전문가모드
        </span>
      </div>
      {/* 대시보드 KPI */}
      <div className="grid grid-cols-4 gap-0 border-b border-gray-100">
        {[
          {
            label: "노출수",
            value: "12,847",
            icon: Eye,
            color: "#3b82f6",
            change: "+23%",
          },
          {
            label: "클릭수",
            value: "486",
            icon: MousePointerClick,
            color: "#8b5cf6",
            change: "+18%",
          },
          {
            label: "CTR",
            value: "3.78%",
            icon: TrendingUp,
            color: "#10b981",
            change: "+0.5%",
          },
          {
            label: "소진액",
            value: "48,600원",
            icon: BarChart3,
            color: "#f59e0b",
            change: "",
          },
        ].map((kpi, i) => (
          <div
            key={i}
            className="p-3 sm:p-4 text-center border-r last:border-r-0 border-gray-50"
          >
            <kpi.icon
              className="w-4 h-4 mx-auto mb-1 opacity-60"
              style={{ color: kpi.color }}
            />
            <div className="text-[11px] text-gray-400">{kpi.label}</div>
            <div className="text-sm sm:text-base font-bold text-gray-800">
              {kpi.value}
            </div>
            {kpi.change && (
              <div className="text-[10px] font-medium text-emerald-500">
                {kpi.change}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* 캠페인 리스트 */}
      <div className="p-3 sm:p-4">
        <div className="text-[11px] font-semibold text-gray-500 mb-2">
          진행중인 캠페인
        </div>
        {[
          {
            name: "지역 타겟 광고",
            status: "진행중",
            budget: "일 5,000원",
            reach: "2.1km",
          },
          {
            name: "피드 광고 A안",
            status: "진행중",
            budget: "일 3,000원",
            reach: "3.0km",
          },
        ].map((camp, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 border-b last:border-b-0 border-gray-50 gap-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                {camp.name}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <span className="text-[10px] sm:text-xs text-gray-400">
                {camp.budget}
              </span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded bg-orange-50 font-medium"
                style={{ color: "#FF6F0F" }}
              >
                {camp.reach}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 홈페이지 리뉴얼 비포/애프터 시각화 */
function RenewalVisual() {
  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
      {/* Before: 아임웹 */}
      <div className="flex-1 w-full rounded-xl border-2 border-dashed border-red-200 bg-red-50/50 p-4 relative">
        <div className="absolute -top-2.5 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">
          BEFORE
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-gray-300 flex items-center justify-center text-[8px] font-bold text-white">
            iW
          </div>
          <span className="text-xs font-medium text-gray-500">아임웹</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-400">월 비용</span>
            <span className="font-semibold text-red-500 line-through">
              매월 결제
            </span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-400">커스텀</span>
            <span className="text-red-400">제한적</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-400">속도</span>
            <span className="text-red-400">보통</span>
          </div>
        </div>
      </div>

      <ArrowRight className="w-5 h-5 text-blue-400 flex-shrink-0 rotate-90 sm:rotate-0" />

      {/* After: 자체개발 */}
      <div className="flex-1 w-full rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4 relative">
        <div className="absolute -top-2.5 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-600">
          AFTER
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-medium text-blue-700">자체개발</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-400">월 비용</span>
            <span className="font-semibold text-blue-600">도메인만</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-400">커스텀</span>
            <span className="text-blue-600">100% 자유</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-400">속도</span>
            <span className="text-blue-600">초고속</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 게시글 자동화 시각화 - 실제 콘텐츠 와이어프레임 */
function AutoPostVisual() {
  return (
    <div className="mt-6 space-y-4">
      {/* 자동화 플로우 */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-3 px-4 rounded-lg bg-violet-50 border border-violet-100">
        <Sparkles className="w-4 h-4 text-violet-500" />
        <span className="text-[11px] sm:text-xs font-medium text-violet-600">
          AI 콘텐츠 생성
        </span>
        <ArrowRight className="w-3 h-3 text-violet-300" />
        <RefreshCw className="w-4 h-4 text-violet-500" />
        <span className="text-[11px] sm:text-xs font-medium text-violet-600">
          자동 스케줄링
        </span>
        <ArrowRight className="w-3 h-3 text-violet-300" />
        <Globe className="w-4 h-4 text-violet-500" />
        <span className="text-[11px] sm:text-xs font-medium text-violet-600">
          3채널 배포
        </span>
      </div>

      {/* 채널별 실제 콘텐츠 미리보기 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* 홈페이지 블로그 게시글 */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border-b border-gray-100">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[11px] font-semibold text-gray-600">
              홈페이지 블로그
            </span>
          </div>
          <div className="p-3">
            {/* 썸네일 */}
            <div
              className="w-full aspect-[16/9] rounded-lg mb-3 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
                <div
                  className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5"
                  style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
                >
                  2025년 정책자금
                </div>
                <div
                  className="text-[11px] sm:text-xs font-bold leading-tight"
                  style={{ color: "#fff" }}
                >
                  중소기업 정책자금
                  <br />
                  신청 전 꼭 알아야 할<br />
                  5가지 핵심 포인트
                </div>
              </div>
            </div>
            {/* 본문 미리보기 */}
            <div className="text-[11px] font-bold text-gray-800 mb-1.5 leading-snug">
              중소기업 정책자금 신청 전 꼭 알아야 할 5가지 핵심 포인트
            </div>
            <div className="text-[10px] text-gray-500 leading-relaxed">
              2025년 정부 정책자금 총 규모는 26조 5천억원입니다. 운전자금 최대
              5억원, 시설자금 최대 60억원까지 지원되며 금리는 연 2.99%~3.39%
              수준입니다...
            </div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-50">
              <span className="text-[9px] text-gray-400">2분 전</span>
              <span className="text-[9px] text-gray-300">·</span>
              <span className="text-[9px] text-blue-500">자세히 보기</span>
            </div>
          </div>
        </div>

        {/* 인스타그램 피드 */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-pink-500" />
              <span className="text-[11px] font-semibold text-gray-600">
                인스타그램
              </span>
            </div>
          </div>
          {/* 인스타 헤더 */}
          <div className="flex items-center gap-2 px-3 py-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-bold"
              style={{
                background: "linear-gradient(45deg, #f09433, #dc2743, #bc1888)",
                color: "#fff",
              }}
            >
              YNJ
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-800">ynj_biz</div>
              <div className="text-[9px] text-gray-400">
                기업인증·자금확보 전문
              </div>
            </div>
          </div>
          {/* 카드형 이미지 */}
          <div
            className="mx-3 aspect-square rounded-lg relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            }}
          >
            <div className="absolute inset-0 flex flex-col justify-between p-3">
              <div>
                <div className="text-[9px] font-bold text-blue-600 mb-1">
                  📢 정책자금 소식
                </div>
                <div className="text-[12px] sm:text-[13px] font-extrabold text-gray-900 leading-tight">
                  2025년 2분기
                  <br />
                  정책자금 금리
                  <br />
                  <span style={{ color: "#2563eb" }}>연 2.99%~3.39%</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-blue-500" />
                  <span className="text-[9px] text-gray-600">
                    운전자금 최대 5억원
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-blue-500" />
                  <span className="text-[9px] text-gray-600">
                    시설자금 최대 60억원
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-blue-500" />
                  <span className="text-[9px] text-gray-600">
                    지방소재기업 70억원
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* 인스타 액션바 */}
          <div className="px-3 py-2">
            <div className="flex items-center gap-3 mb-1.5">
              <svg
                className="w-4 h-4 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <MessageCircle className="w-4 h-4 text-gray-700" />
              <svg
                className="w-4 h-4 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </div>
            <div className="text-[10px] text-gray-800">
              <span className="font-bold">ynj_biz</span>{" "}
              <span className="text-gray-600">
                2025년 2분기 정책자금 금리가 확정되었습니다. 중소기업 대표님들께
                꼭 필요한 정보, 저장해두세요 📌
              </span>
            </div>
            <div className="text-[9px] text-gray-400 mt-1">
              #정책자금 #중소기업 #자금확보 #기업자금
            </div>
          </div>
        </div>

        {/* 쓰레드 */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border-b border-gray-100">
            <svg
              className="w-3.5 h-3.5 text-gray-800"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.083.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.136 1.41-2.824.856-.588 2.053-.907 3.462-.924.965-.012 1.86.084 2.68.283-.071-.63-.268-1.14-.59-1.53-.43-.52-1.103-.803-2.004-.842l-.016-.001c-.86 0-1.86.26-2.27.72l-1.563-1.313c.77-.915 2.076-1.526 3.49-1.526h.036c1.45.063 2.58.556 3.36 1.462.674.783 1.073 1.835 1.189 3.13.56.173 1.063.402 1.502.69 1.322.868 2.18 2.146 2.481 3.7.339 1.744.028 3.844-1.534 5.395-1.86 1.85-4.16 2.638-7.44 2.66zm-.84-8.94c-.97.018-1.725.208-2.24.564-.437.3-.508.634-.49.933.035.612.558 1.27 1.792 1.27h.18c1.074-.06 1.834-.462 2.395-1.265.337-.481.577-1.073.72-1.773-.788-.18-1.62-.268-2.357-.268v.34z" />
            </svg>
            <span className="text-[11px] font-semibold text-gray-600">
              쓰레드
            </span>
          </div>
          <div className="p-3">
            {/* 쓰레드 프로필 */}
            <div className="flex items-start gap-2.5">
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ background: "#1a1a2e", color: "#fff" }}
                >
                  YNJ
                </div>
                <div className="w-0.5 flex-1 bg-gray-200 min-h-[40px]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[11px] font-bold text-gray-900">
                    ynj_biz
                  </span>
                  <svg
                    className="w-3 h-3 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[9px] text-gray-400">2시간</span>
                </div>
                <div className="text-[11px] sm:text-xs text-gray-700 leading-relaxed">
                  기업인증 컨설팅을 하면서 정말 많은 대표님들을 만납니다.
                </div>
                <div className="text-[11px] sm:text-xs text-gray-700 leading-relaxed mt-1.5">
                  벤처인증도 받고, 연구소도 설립했는데... 막상 운전자금이
                  부족해서 사업 확장을 못 하시는 분들이 정말 많더라고요.
                </div>
                <div className="text-[11px] sm:text-xs text-gray-700 leading-relaxed mt-1.5">
                  인증은 받았는데 자금 연결이 안 되니까, 그 노력이 빛을 못 보는
                  거죠. 그게 너무 안타까워서 정책자금 쪽도 직접 공부하고
                  연구했습니다.
                </div>
                <div className="text-[11px] sm:text-xs text-gray-700 leading-relaxed mt-1.5">
                  이제는 인증부터 자금확보까지 한 번에 도움드릴 수 있게
                  됐습니다. 혼자 고민하지 마시고 편하게 연락 주세요 🙏
                </div>
                {/* 쓰레드 액션바 */}
                <div className="flex items-center gap-4 mt-2.5 pt-2 border-t border-gray-50">
                  <svg
                    className="w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
                  <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                  <svg
                    className="w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-violet-500 font-medium bg-violet-50 rounded-full px-3 py-1">
          <RefreshCw className="w-3 h-3" />
          매일 오전 9시 자동 발행
        </span>
      </div>
    </div>
  );
}

export default function ProposalPage() {
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

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
          <DaangnAdMockup />
        </div>

        {/* 서비스 2: 홈페이지 리뉴얼 */}
        <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-8 relative">
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <span
              className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold bg-blue-600"
              style={{ color: "#fff" }}
            >
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
          <ul className="space-y-2.5 sm:space-y-3 mb-1">
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
          <RenewalVisual />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 sm:p-4 mt-5">
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
          <AutoPostVisual />
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
            원하시는 스타일을 선택해 주세요. 카드를 클릭하면 미리보기가
            확대됩니다.
          </p>

          {/* 시안 그리드 - 축소 iframe 썸네일 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
                {/* 축소된 iframe 미리보기 */}
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
                  <div
                    className="absolute inset-0"
                    style={{
                      width: "400%",
                      height: "400%",
                      transform: "scale(0.25)",
                      transformOrigin: "top left",
                    }}
                  >
                    <iframe
                      src={site.url}
                      className="w-full h-full border-0"
                      title={`${site.name} 미리보기`}
                      loading="lazy"
                      tabIndex={-1}
                      style={{ pointerEvents: "none" }}
                    />
                  </div>
                  {/* 클릭 오버레이 */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center z-10">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 bg-white/90 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>미리보기</span>
                    </div>
                  </div>
                  {selectedSite === site.url && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center z-10">
                      <Check
                        className="w-3.5 h-3.5"
                        style={{ color: "#fff" }}
                      />
                    </div>
                  )}
                </div>
                <div className="p-2.5 sm:p-3 border-t border-gray-100">
                  <div className="font-semibold text-xs sm:text-sm text-gray-800">
                    {site.name}
                  </div>
                  <div className="text-[11px] sm:text-xs text-gray-400">
                    {site.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 선택된 시안 확대 미리보기 */}
          {selectedSite && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm sm:text-base text-gray-700">
                  {sampleSites.find((s) => s.url === selectedSite)?.name}{" "}
                  미리보기
                </h3>
                <div className="flex items-center gap-2">
                  <a
                    href={selectedSite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    새 탭에서 보기
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setSelectedSite(null)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-inner">
                <iframe
                  src={selectedSite}
                  className="w-full h-[500px] sm:h-[600px] md:h-[700px]"
                  title="홈페이지 시안 미리보기"
                />
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="text-center py-6 sm:py-8 text-gray-400 text-xs sm:text-sm">
          폴라애드 · 대표 이재호 · 본 문서는 업무 진행 안내를 위해 제공됩니다.
        </div>
      </div>
    </div>
  );
}
