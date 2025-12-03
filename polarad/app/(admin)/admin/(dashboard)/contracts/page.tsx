"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileSignature,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Contract {
  id: string;
  contractNumber: string;
  companyName: string;
  ceoName: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  monthlyFee: number;
  contractPeriod: number;
  totalAmount: number;
  createdAt: string;
  approvedAt: string | null;
  package: {
    displayName: string;
  };
  user: {
    clientName: string;
  };
}

interface Stats {
  total: number;
  pending: number;
  submitted: number;
  approved: number;
  active: number;
  rejected: number;
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

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchContracts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);

      const res = await fetch(`/api/admin/contracts?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setContracts(data.contracts);
      setStats(data.stats);
    } catch (error) {
      console.error("계약 목록 조회 오류:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleApprove = async (id: string) => {
    if (!confirm("이 계약을 승인하시겠습니까?")) return;

    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/contracts/${id}/approve`, {
        method: "POST",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "승인 실패");
      }

      alert("계약이 승인되었습니다. 이메일로 계약서가 발송됩니다.");
      fetchContracts();
    } catch (error) {
      alert(error instanceof Error ? error.message : "승인 처리 중 오류가 발생했습니다");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("거절 사유를 입력해주세요:");
    if (reason === null) return;

    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/contracts/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "거절 실패");
      }

      alert("계약이 거절되었습니다.");
      fetchContracts();
    } catch (error) {
      alert(error instanceof Error ? error.message : "거절 처리 중 오류가 발생했습니다");
    } finally {
      setProcessingId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount) + "원";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">계약 관리</h1>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">전체</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">승인 대기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.submitted || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">승인됨</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.approved || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">진행중</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.active || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">거절됨</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.rejected || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">대기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="회사명, 계약번호 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none"
          >
            <option value="">전체 상태</option>
            <option value="SUBMITTED">승인 대기</option>
            <option value="APPROVED">승인됨</option>
            <option value="ACTIVE">진행중</option>
            <option value="REJECTED">거절됨</option>
            <option value="EXPIRED">만료</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      {/* 계약 목록 */}
      <Card>
        <CardContent className="p-0">
          {contracts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileSignature className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>계약 내역이 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">계약번호</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">회사명</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">패키지</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">금액</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">요청일</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-4">
                        <span className="font-mono text-sm">{contract.contractNumber}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{contract.companyName}</p>
                          <p className="text-sm text-gray-500">{contract.ceoName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm">{contract.package.displayName}</span>
                        <p className="text-xs text-gray-500">{contract.contractPeriod}개월</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium">{formatCurrency(contract.monthlyFee)}/월</p>
                        <p className="text-xs text-gray-500">총 {formatCurrency(contract.totalAmount)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={STATUS_COLORS[contract.status]}>
                          {STATUS_LABELS[contract.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-500">{formatDate(contract.createdAt)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {contract.status === "SUBMITTED" && (
                            <>
                              <button
                                onClick={() => handleApprove(contract.id)}
                                disabled={processingId === contract.id}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                title="승인"
                              >
                                {processingId === contract.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(contract.id)}
                                disabled={processingId === contract.id}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="거절"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {["APPROVED", "ACTIVE", "EXPIRED"].includes(contract.status) && (
                            <a
                              href={`/api/contracts/${contract.id}/pdf`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="PDF 다운로드"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                          <a
                            href={`/admin/contracts/${contract.id}`}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="상세보기"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
