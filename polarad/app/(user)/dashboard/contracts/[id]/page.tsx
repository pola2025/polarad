"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building,
  User,
  Package,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  Download,
  Clock,
  Loader2,
  CreditCard,
  History,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ContractDetail {
  id: string;
  contractNumber: string;
  companyName: string;
  ceoName: string;
  businessNumber: string;
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  monthlyFee: number;
  setupFee: number;
  contractPeriod: number;
  totalAmount: number;
  startDate: string | null;
  endDate: string | null;
  additionalNotes: string | null;
  clientSignature: string | null;
  signedAt: string | null;
  createdAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
  emailSentAt: string | null;
  package: {
    id: string;
    name: string;
    displayName: string;
    price: number;
    description: string;
    features: string[];
  };
  logs: Array<{
    id: string;
    fromStatus: string | null;
    toStatus: string;
    note: string | null;
    createdAt: string;
  }>;
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

const STATUS_MESSAGES: Record<string, { icon: React.ReactNode; message: string; color: string }> = {
  PENDING: {
    icon: <Clock className="w-5 h-5" />,
    message: "계약 요청이 제출 대기 중입니다.",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  SUBMITTED: {
    icon: <Clock className="w-5 h-5" />,
    message: "계약서가 제출되었습니다. 관리자 승인을 기다리고 있습니다.",
    color: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  APPROVED: {
    icon: <CheckCircle className="w-5 h-5" />,
    message: "계약이 승인되었습니다. 이메일로 계약서가 발송되었습니다.",
    color: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  },
  REJECTED: {
    icon: <XCircle className="w-5 h-5" />,
    message: "계약이 거절되었습니다. 아래 사유를 확인해주세요.",
    color: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  },
  ACTIVE: {
    icon: <CheckCircle className="w-5 h-5" />,
    message: "계약이 진행 중입니다.",
    color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  },
  EXPIRED: {
    icon: <AlertCircle className="w-5 h-5" />,
    message: "계약이 만료되었습니다. 연장이 필요하시면 새로운 계약을 요청해주세요.",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  CANCELLED: {
    icon: <XCircle className="w-5 h-5" />,
    message: "계약이 취소되었습니다.",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
};

export default function UserContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContract = useCallback(async () => {
    try {
      const res = await fetch(`/api/contracts/${params.id}`);
      if (!res.ok) {
        if (res.status === 404) {
          alert("계약을 찾을 수 없습니다");
          router.push("/dashboard/contracts");
          return;
        }
        throw new Error("Failed to fetch");
      }
      const data = await res.json();
      setContract(data.contract);
    } catch (error) {
      console.error("계약 상세 조회 오류:", error);
      alert("계약 정보를 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

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

  if (!contract) {
    return null;
  }

  const statusInfo = STATUS_MESSAGES[contract.status];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/contracts")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              계약 상세
            </h1>
            <p className="text-sm text-gray-500 font-mono">{contract.contractNumber}</p>
          </div>
        </div>
        <Badge variant={STATUS_COLORS[contract.status]} className="text-sm px-3 py-1">
          {STATUS_LABELS[contract.status]}
        </Badge>
      </div>

      {/* 상태 메시지 */}
      <div className={`flex items-center gap-3 p-4 rounded-xl ${statusInfo.color}`}>
        {statusInfo.icon}
        <span className="font-medium">{statusInfo.message}</span>
      </div>

      {/* 거절 사유 (거절된 경우) */}
      {contract.status === "REJECTED" && contract.rejectReason && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="py-4">
            <div className="flex items-start gap-2">
              <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium text-red-700 dark:text-red-400">거절 사유</p>
                <p className="text-red-600 dark:text-red-300">{contract.rejectReason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 계약 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5" />
            계약 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InfoItem icon={<Package className="w-4 h-4" />} label="패키지" value={contract.package.displayName} />
              <InfoItem icon={<Calendar className="w-4 h-4" />} label="계약 기간" value={`${contract.contractPeriod}개월`} />
              <InfoItem icon={<CreditCard className="w-4 h-4" />} label="월 서비스 비용" value={formatCurrency(contract.monthlyFee)} />
            </div>
            <div className="space-y-4">
              <InfoItem label="총 계약 금액" value={formatCurrency(contract.totalAmount)} highlight />
              {contract.startDate && (
                <InfoItem label="계약 시작일" value={formatDate(contract.startDate)} />
              )}
              {contract.endDate && (
                <InfoItem label="계약 종료일" value={formatDate(contract.endDate)} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 사업자 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building className="w-5 h-5" />
            사업자 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <InfoItem label="상호" value={contract.companyName} />
            <InfoItem label="대표자" value={contract.ceoName} />
            <InfoItem label="사업자등록번호" value={contract.businessNumber} />
            <div className="md:col-span-2">
              <InfoItem icon={<MapPin className="w-4 h-4" />} label="주소" value={contract.address} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 담당자 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5" />
            담당자 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <InfoItem label="담당자명" value={contract.contactName} />
            <InfoItem icon={<Phone className="w-4 h-4" />} label="연락처" value={contract.contactPhone} />
            <div className="md:col-span-2">
              <InfoItem icon={<Mail className="w-4 h-4" />} label="이메일" value={contract.contactEmail} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 추가 요청사항 */}
      {contract.additionalNotes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">추가 요청사항</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {contract.additionalNotes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 처리 이력 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="w-5 h-5" />
            처리 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <TimelineItem
              label="계약 요청"
              date={contract.createdAt}
              status="completed"
            />
            {contract.signedAt && (
              <TimelineItem
                label="전자 서명 완료"
                date={contract.signedAt}
                status="completed"
              />
            )}
            {contract.approvedAt && (
              <TimelineItem
                label="관리자 승인"
                date={contract.approvedAt}
                status="completed"
              />
            )}
            {contract.rejectedAt && (
              <TimelineItem
                label="계약 거절"
                date={contract.rejectedAt}
                status="error"
              />
            )}
            {contract.emailSentAt && (
              <TimelineItem
                label="계약서 이메일 발송"
                date={contract.emailSentAt}
                status="completed"
              />
            )}
            {contract.status === "SUBMITTED" && (
              <TimelineItem
                label="승인 대기 중"
                date=""
                status="pending"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* PDF 다운로드 버튼 */}
      {["APPROVED", "ACTIVE", "EXPIRED"].includes(contract.status) && (
        <div className="flex justify-center">
          <a
            href={`/api/contracts/${contract.id}/pdf`}
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
          >
            <Download className="w-5 h-5" />
            계약서 PDF 다운로드
          </a>
        </div>
      )}
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
  highlight,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className={`flex items-center gap-1.5 ${highlight ? "text-xl font-bold text-blue-600" : "text-gray-900 dark:text-white"}`}>
        {icon}
        {value}
      </p>
    </div>
  );
}

function TimelineItem({
  label,
  date,
  status,
}: {
  label: string;
  date: string;
  status: "completed" | "pending" | "error";
}) {
  const styles = {
    completed: {
      dot: "bg-green-500",
      line: "border-green-500",
    },
    pending: {
      dot: "bg-yellow-500 animate-pulse",
      line: "border-gray-300 dark:border-gray-600 border-dashed",
    },
    error: {
      dot: "bg-red-500",
      line: "border-red-500",
    },
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${styles[status].dot}`} />
        <div className={`w-0 h-6 border-l-2 ${styles[status].line}`} />
      </div>
      <div className="flex-1 -mt-0.5">
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        {date && <p className="text-sm text-gray-500">{formatDate(date)}</p>}
        {status === "pending" && !date && (
          <p className="text-sm text-yellow-600">처리 대기 중...</p>
        )}
      </div>
    </div>
  );
}
