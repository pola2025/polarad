"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileSignature,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  Calendar,
  CreditCard,
  Package,
  Loader2,
  Plus,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface Contract {
  id: string;
  contractNumber: string;
  companyName: string;
  status: string;
  monthlyFee: number;
  contractPeriod: number;
  totalAmount: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
  package: {
    displayName: string;
  };
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "대기",
  SUBMITTED: "승인 대기",
  APPROVED: "승인됨",
  REJECTED: "거절됨",
  ACTIVE: "진행중",
  EXPIRED: "만료",
  CANCELLED: "취소",
};

const STATUS_COLORS: Record<string, "default" | "info" | "success" | "warning" | "error"> = {
  PENDING: "default",
  SUBMITTED: "warning",
  APPROVED: "success",
  REJECTED: "error",
  ACTIVE: "info",
  EXPIRED: "default",
  CANCELLED: "default",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-4 h-4" />,
  SUBMITTED: <Clock className="w-4 h-4" />,
  APPROVED: <CheckCircle className="w-4 h-4" />,
  REJECTED: <XCircle className="w-4 h-4" />,
  ACTIVE: <CheckCircle className="w-4 h-4" />,
  EXPIRED: <Clock className="w-4 h-4" />,
  CANCELLED: <XCircle className="w-4 h-4" />,
};

export default function UserContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContracts = useCallback(async () => {
    try {
      const res = await fetch("/api/contracts");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setContracts(data.contracts);
    } catch (error) {
      console.error("계약 목록 조회 오류:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount) + "원";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // 통계 계산
  const stats = {
    total: contracts.length,
    active: contracts.filter((c) => c.status === "ACTIVE").length,
    pending: contracts.filter((c) => ["PENDING", "SUBMITTED"].includes(c.status)).length,
    approved: contracts.filter((c) => c.status === "APPROVED").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">내 계약 현황</h1>
        <Link
          href="/dashboard/contract"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 계약 요청
        </Link>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <FileSignature className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500">전체 계약</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">진행중</p>
                <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">대기중</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">승인됨</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 계약 목록 */}
      {contracts.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <FileSignature className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                계약 내역이 없습니다
              </h3>
              <p className="text-gray-500 mb-6">
                새로운 계약을 요청하여 서비스를 시작하세요.
              </p>
              <Link
                href="/dashboard/contract"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                계약 요청하기
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => (
            <Card key={contract.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* 왼쪽: 기본 정보 */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <Package className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {contract.package.displayName}
                        </h3>
                        <Badge variant={STATUS_COLORS[contract.status]}>
                          {STATUS_ICONS[contract.status]}
                          <span className="ml-1">{STATUS_LABELS[contract.status]}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 font-mono mb-2">
                        {contract.contractNumber}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          {formatCurrency(contract.monthlyFee)}/월
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {contract.contractPeriod}개월
                        </span>
                        <span className="text-gray-400">
                          요청일: {formatDate(contract.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽: 액션 버튼 */}
                  <div className="flex items-center gap-2 ml-auto">
                    {["APPROVED", "ACTIVE", "EXPIRED"].includes(contract.status) && (
                      <a
                        href={`/api/contracts/${contract.id}/pdf`}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">PDF</span>
                      </a>
                    )}
                    <Link
                      href={`/dashboard/contracts/${contract.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">상세</span>
                    </Link>
                  </div>
                </div>

                {/* 거절 사유 (거절된 경우) */}
                {contract.status === "REJECTED" && contract.rejectReason && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-700 dark:text-red-400">거절 사유</p>
                        <p className="text-sm text-red-600 dark:text-red-300">{contract.rejectReason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 계약 기간 정보 (활성화된 경우) */}
                {contract.status === "ACTIVE" && contract.startDate && contract.endDate && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-blue-700 dark:text-blue-400">
                        <strong>계약 기간:</strong> {formatDate(contract.startDate)} ~ {formatDate(contract.endDate)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
