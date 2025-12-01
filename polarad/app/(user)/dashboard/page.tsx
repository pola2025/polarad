"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface SubmissionItem {
  name: string;
  completed: boolean;
}

interface Workflow {
  id: string;
  type: string;
  status: string;
  statusCode: string;
  designUrl: string | null;
  trackingNumber: string | null;
  courier: string | null;
}

interface DashboardData {
  user: {
    name: string;
    clientName: string;
    email: string;
  };
  submission: {
    total: number;
    completed: number;
    items: SubmissionItem[];
  };
  workflows: Workflow[];
}

function getStatusIcon(statusCode: string) {
  switch (statusCode) {
    case "COMPLETED":
    case "SHIPPED":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "IN_PROGRESS":
    case "DESIGN_UPLOADED":
    case "ORDER_REQUESTED":
    case "ORDER_APPROVED":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "PENDING":
    case "SUBMITTED":
      return <Clock className="w-4 h-4 text-gray-400" />;
    case "CANCELLED":
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    default:
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  }
}

function getStatusStyle(statusCode: string) {
  switch (statusCode) {
    case "COMPLETED":
    case "SHIPPED":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "IN_PROGRESS":
    case "DESIGN_UPLOADED":
    case "ORDER_REQUESTED":
    case "ORDER_APPROVED":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "CANCELLED":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
  }
}

export default function UserDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("/api/user/dashboard");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "데이터를 불러오는데 실패했습니다");
        }

        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

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
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const submissionProgress = Math.round(
    (data.submission.completed / data.submission.total) * 100
  );

  return (
    <div className="space-y-6">
      {/* 환영 메시지 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          안녕하세요, {data.user.name}님!
        </h1>
        <p className="text-blue-100">
          {data.user.clientName} - Polarad 마케팅 패키지
        </p>
      </div>

      {/* 빠른 액션 */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/dashboard/submissions"
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <p className="font-medium text-gray-900 dark:text-white">자료 제출</p>
          <p className="text-sm text-gray-500">
            {submissionProgress}% 완료
          </p>
        </Link>

        <Link
          href="/dashboard/progress"
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <p className="font-medium text-gray-900 dark:text-white">진행 현황</p>
          <p className="text-sm text-gray-500">제작 상태 확인</p>
        </Link>
      </div>

      {/* 자료 제출 현황 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            자료 제출 현황
          </h2>
          <span className="text-sm text-gray-500">
            {data.submission.completed}/{data.submission.total}
          </span>
        </div>
        <div className="p-4">
          {/* 프로그레스 바 */}
          <div className="mb-4">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${submissionProgress}%` }}
              />
            </div>
          </div>

          {/* 항목 리스트 */}
          <div className="space-y-2">
            {data.submission.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {item.name}
                </span>
                {item.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                )}
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/submissions"
            className="mt-4 block w-full text-center py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            자료 제출하기
          </Link>
        </div>
      </div>

      {/* 제작 진행 현황 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            제작 진행 현황
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(workflow.statusCode)}
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {workflow.type}
                </span>
              </div>
              <span
                className={`text-sm px-2.5 py-1 rounded-full ${getStatusStyle(
                  workflow.statusCode
                )}`}
              >
                {workflow.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
