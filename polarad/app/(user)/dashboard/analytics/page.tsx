"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  DollarSign,
  Users,
  Loader2,
  AlertCircle,
  RefreshCw,
  Calendar,
} from "lucide-react";

interface MetricCard {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
}

interface CampaignData {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  cpc: number;
}

interface AnalyticsData {
  summary: {
    impressions: MetricCard;
    clicks: MetricCard;
    spend: MetricCard;
    conversions: MetricCard;
  };
  campaigns: CampaignData[];
  lastUpdated: string;
}

// 데모 데이터 (실제 연동 전)
const DEMO_DATA: AnalyticsData = {
  summary: {
    impressions: {
      label: "노출수",
      value: "124,532",
      change: 12.5,
      changeLabel: "전주 대비",
    },
    clicks: {
      label: "클릭수",
      value: "3,847",
      change: 8.2,
      changeLabel: "전주 대비",
    },
    spend: {
      label: "광고비",
      value: "₩485,200",
      change: -3.1,
      changeLabel: "전주 대비",
    },
    conversions: {
      label: "전환수",
      value: "156",
      change: 15.7,
      changeLabel: "전주 대비",
    },
  },
  campaigns: [
    {
      id: "1",
      name: "브랜드 인지도 캠페인",
      status: "ACTIVE",
      impressions: 45230,
      clicks: 1234,
      spend: 185000,
      conversions: 45,
      ctr: 2.73,
      cpc: 150,
    },
    {
      id: "2",
      name: "리드 생성 캠페인",
      status: "ACTIVE",
      impressions: 32150,
      clicks: 987,
      spend: 142000,
      conversions: 67,
      ctr: 3.07,
      cpc: 144,
    },
    {
      id: "3",
      name: "리타겟팅 캠페인",
      status: "PAUSED",
      impressions: 28400,
      clicks: 856,
      spend: 98200,
      conversions: 34,
      ctr: 3.01,
      cpc: 115,
    },
    {
      id: "4",
      name: "신규 고객 유치",
      status: "ACTIVE",
      impressions: 18752,
      clicks: 770,
      spend: 60000,
      conversions: 10,
      ctr: 4.11,
      cpc: 78,
    },
  ],
  lastUpdated: new Date().toISOString(),
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "진행중",
  PAUSED: "일시중지",
  COMPLETED: "종료",
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  PAUSED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  COMPLETED: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400",
};

function formatNumber(num: number): string {
  return num.toLocaleString("ko-KR");
}

function formatCurrency(num: number): string {
  return `₩${num.toLocaleString("ko-KR")}`;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("7d");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: 실제 API 연동
      // const res = await fetch(`/api/user/analytics?range=${dateRange}`);
      // const result = await res.json();

      // 데모 데이터 사용 (실제 연동 전)
      await new Promise((resolve) => setTimeout(resolve, 500));
      setData(DEMO_DATA);
    } catch (err) {
      setError("데이터를 불러오는데 실패했습니다.");
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const summaryCards = [
    { ...data.summary.impressions, icon: Eye, color: "blue" },
    { ...data.summary.clicks, icon: MousePointer, color: "green" },
    { ...data.summary.spend, icon: DollarSign, color: "purple" },
    { ...data.summary.conversions, icon: Users, color: "orange" },
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            광고 성과
          </h1>
          <p className="text-sm text-gray-500">
            마지막 업데이트:{" "}
            {new Date(data.lastUpdated).toLocaleString("ko-KR")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[
              { value: "7d", label: "7일" },
              { value: "14d", label: "14일" },
              { value: "30d", label: "30일" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  dateRange === option.value
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            onClick={fetchAnalytics}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="새로고침"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-200">
              데모 데이터입니다
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Meta/Naver 광고 계정 연동 후 실제 광고 성과 데이터가 표시됩니다.
              연동 문의는 관리자에게 연락해 주세요.
            </p>
          </div>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const isPositive = card.change >= 0;

          return (
            <div
              key={card.label}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${card.color}-100 dark:bg-${card.color}-900/30`}
                >
                  <Icon
                    className={`w-5 h-5 text-${card.color}-600 dark:text-${card.color}-400`}
                  />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{Math.abs(card.change)}%</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* 캠페인 목록 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            캠페인 성과
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  캠페인명
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  상태
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  노출수
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  클릭수
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  CTR
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  CPC
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  광고비
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  전환수
                </th>
              </tr>
            </thead>
            <tbody>
              {data.campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                >
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {campaign.name}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        STATUS_STYLES[campaign.status]
                      }`}
                    >
                      {STATUS_LABELS[campaign.status]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                    {formatNumber(campaign.impressions)}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                    {formatNumber(campaign.clicks)}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                    {campaign.ctr.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(campaign.cpc)}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(campaign.spend)}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                    {formatNumber(campaign.conversions)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 하단 안내 */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
        <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          더 자세한 리포트는 매주 월요일에 이메일로 발송됩니다.
        </p>
      </div>
    </div>
  );
}
