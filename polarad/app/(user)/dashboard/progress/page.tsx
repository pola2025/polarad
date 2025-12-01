"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  FileImage,
  Send,
  ChevronDown,
  ChevronUp,
  Loader2,
  ExternalLink,
  MessageSquare,
  X,
} from "lucide-react";

interface WorkflowLog {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  changedBy: string | null;
  note: string | null;
  createdAt: string;
}

interface Workflow {
  id: string;
  type: string;
  status: string;
  designUrl: string | null;
  finalUrl: string | null;
  courier: string | null;
  trackingNumber: string | null;
  revisionCount: number;
  revisionNote: string | null;
  adminNote: string | null;
  submittedAt: string | null;
  designStartedAt: string | null;
  designUploadedAt: string | null;
  orderRequestedAt: string | null;
  orderApprovedAt: string | null;
  completedAt: string | null;
  shippedAt: string | null;
  createdAt: string;
  logs: WorkflowLog[];
}

const WORKFLOW_TYPE_LABELS: Record<string, string> = {
  NAMECARD: "명함",
  NAMETAG: "명찰",
  CONTRACT: "계약서",
  ENVELOPE: "대봉투",
  WEBSITE: "홈페이지",
  BLOG: "블로그",
  META_ADS: "메타 광고",
  NAVER_ADS: "네이버 광고",
};

const WORKFLOW_STATUS_LABELS: Record<string, string> = {
  PENDING: "대기",
  SUBMITTED: "제출완료",
  IN_PROGRESS: "진행중",
  DESIGN_UPLOADED: "시안확인",
  ORDER_REQUESTED: "발주요청",
  ORDER_APPROVED: "발주승인",
  COMPLETED: "완료",
  SHIPPED: "발송완료",
  CANCELLED: "취소됨",
};

// 배송사별 조회 URL
const COURIER_URLS: Record<string, string> = {
  "CJ대한통운": "https://www.cjlogistics.com/ko/tool/parcel/tracking?gnbInvcNo=",
  "한진택배": "https://www.hanjin.com/kor/CMS/DeliveryMgr/WaybillResult.do?mession=open&tWaybillNo=",
  "롯데택배": "https://www.lotteglogis.com/home/reservation/tracking/linkView?InvNo=",
  "우체국택배": "https://service.epost.go.kr/trace.RetrieveDomRi498.postal?sid1=",
  "로젠택배": "https://www.ilogen.com/web/personal/trace/",
};

// 인쇄물 워크플로우 단계 (명함, 명찰, 계약서, 봉투)
const PRINT_WORKFLOW_STEPS = [
  { status: "PENDING", label: "대기", icon: Clock },
  { status: "SUBMITTED", label: "자료제출", icon: Send },
  { status: "IN_PROGRESS", label: "디자인", icon: FileImage },
  { status: "DESIGN_UPLOADED", label: "시안확인", icon: FileImage },
  { status: "ORDER_REQUESTED", label: "발주요청", icon: Package },
  { status: "ORDER_APPROVED", label: "발주승인", icon: CheckCircle },
  { status: "COMPLETED", label: "제작완료", icon: CheckCircle },
  { status: "SHIPPED", label: "배송", icon: Truck },
];

// 디지털 워크플로우 단계 (홈페이지, 블로그)
const DIGITAL_WORKFLOW_STEPS = [
  { status: "PENDING", label: "대기", icon: Clock },
  { status: "SUBMITTED", label: "자료제출", icon: Send },
  { status: "IN_PROGRESS", label: "디자인", icon: FileImage },
  { status: "DESIGN_UPLOADED", label: "시안확인", icon: FileImage },
  { status: "COMPLETED", label: "완료", icon: CheckCircle },
];

// 광고 워크플로우 단계 (메타 광고, 네이버 광고)
const ADS_WORKFLOW_STEPS = [
  { status: "PENDING", label: "대기", icon: Clock },
  { status: "SUBMITTED", label: "자료제출", icon: Send },
  { status: "IN_PROGRESS", label: "세팅중", icon: FileImage },
  { status: "COMPLETED", label: "운영중", icon: CheckCircle },
];

// 인쇄물 유형
const PRINT_TYPES = ["NAMECARD", "NAMETAG", "CONTRACT", "ENVELOPE"];
// 디지털 유형
const DIGITAL_TYPES = ["WEBSITE", "BLOG"];
// 광고 유형
const ADS_TYPES = ["META_ADS", "NAVER_ADS"];

function getWorkflowSteps(type: string) {
  if (DIGITAL_TYPES.includes(type)) return DIGITAL_WORKFLOW_STEPS;
  if (ADS_TYPES.includes(type)) return ADS_WORKFLOW_STEPS;
  return PRINT_WORKFLOW_STEPS;
}

function getStatusIndex(status: string, type: string): number {
  const steps = getWorkflowSteps(type);
  return steps.findIndex((step) => step.status === status);
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProgressPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [revisionModal, setRevisionModal] = useState<{
    open: boolean;
    workflowId: string | null;
  }>({ open: false, workflowId: null });
  const [revisionNote, setRevisionNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchWorkflows = useCallback(async () => {
    try {
      const res = await fetch("/api/user/workflows");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Failed to fetch");
      }
      const data = await res.json();
      if (data.success) {
        setWorkflows(data.data);
      }
    } catch (error) {
      console.error("Fetch workflows error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const handleApprove = async (workflowId: string) => {
    if (!confirm("시안을 승인하시겠습니까? 승인 후 발주가 진행됩니다.")) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/user/workflows/${workflowId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      const data = await res.json();

      if (data.success) {
        alert(data.message);
        fetchWorkflows();
      } else {
        alert(data.error || "승인 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Approve error:", error);
      alert("승인 처리 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevisionRequest = async () => {
    if (!revisionModal.workflowId || !revisionNote.trim()) {
      alert("수정 요청 내용을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/user/workflows/${revisionModal.workflowId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revision", revisionNote }),
      });
      const data = await res.json();

      if (data.success) {
        alert(data.message);
        setRevisionModal({ open: false, workflowId: null });
        setRevisionNote("");
        fetchWorkflows();
      } else {
        alert(data.error || "수정 요청 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Revision error:", error);
      alert("수정 요청 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const getTrackingUrl = (courier: string | null, trackingNumber: string | null): string | null => {
    if (!courier || !trackingNumber) return null;
    const baseUrl = COURIER_URLS[courier];
    if (!baseUrl) return null;
    return baseUrl + trackingNumber;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          진행 중인 작업이 없습니다
        </h2>
        <p className="text-gray-500">
          자료 제출이 완료되면 제작이 시작됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workflows.map((workflow) => {
        const isExpanded = expandedId === workflow.id;
        const workflowSteps = getWorkflowSteps(workflow.type);
        const currentStepIndex = getStatusIndex(workflow.status, workflow.type);
        const canApprove = workflow.status === "DESIGN_UPLOADED";
        const isDigital = DIGITAL_TYPES.includes(workflow.type);
        const isAds = ADS_TYPES.includes(workflow.type);

        return (
          <div
            key={workflow.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* 헤더 */}
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              onClick={() => setExpandedId(isExpanded ? null : workflow.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {WORKFLOW_TYPE_LABELS[workflow.type] || workflow.type}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(workflow.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    workflow.status === "COMPLETED" || workflow.status === "SHIPPED"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : workflow.status === "CANCELLED"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : workflow.status === "DESIGN_UPLOADED"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  {WORKFLOW_STATUS_LABELS[workflow.status] || workflow.status}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* 확장 영역 */}
            {isExpanded && (
              <div className="border-t border-gray-200 dark:border-gray-700">
                {/* 진행 단계 표시 */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex items-center justify-between overflow-x-auto pb-2">
                    {workflowSteps.map((step, index) => {
                      const StepIcon = step.icon;
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;

                      return (
                        <div key={step.status} className="flex items-center">
                          <div className="flex flex-col items-center min-w-[60px]">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isCurrent
                                  ? "bg-blue-600 text-white"
                                  : isCompleted
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                              }`}
                            >
                              {isCompleted && !isCurrent ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <StepIcon className="w-4 h-4" />
                              )}
                            </div>
                            <span
                              className={`text-xs mt-1 ${
                                isCurrent
                                  ? "text-blue-600 font-medium"
                                  : isCompleted
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                          {index < workflowSteps.length - 1 && (
                            <div
                              className={`w-8 h-0.5 mx-1 ${
                                index < currentStepIndex
                                  ? "bg-green-500"
                                  : "bg-gray-200 dark:bg-gray-700"
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 시안 확인 (DESIGN_UPLOADED 상태일 때) */}
                {canApprove && workflow.designUrl && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/10">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                          시안 확인이 필요합니다
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                          아래 시안을 확인하시고 승인 또는 수정 요청을 해주세요.
                          {isDigital && " 승인 후 바로 완료 처리됩니다."}
                          {!isDigital && !isAds && " 승인 후 발주가 진행됩니다."}
                          {workflow.revisionCount > 0 && (
                            <span className="ml-2 text-orange-600">
                              (수정 {workflow.revisionCount}회)
                            </span>
                          )}
                        </p>
                        <a
                          href={workflow.designUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-3"
                        >
                          <FileImage className="w-4 h-4" />
                          시안 보기
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(workflow.id)}
                            disabled={submitting}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {submitting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "승인"
                            )}
                          </button>
                          <button
                            onClick={() =>
                              setRevisionModal({ open: true, workflowId: workflow.id })
                            }
                            disabled={submitting}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                          >
                            수정 요청
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 배송 정보 */}
                {workflow.status === "SHIPPED" && workflow.courier && workflow.trackingNumber && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/10">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                          배송 정보
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300 mb-1">
                          택배사: {workflow.courier}
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                          운송장번호: {workflow.trackingNumber}
                        </p>
                        {getTrackingUrl(workflow.courier, workflow.trackingNumber) && (
                          <a
                            href={getTrackingUrl(workflow.courier, workflow.trackingNumber)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            배송 조회
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 관리자 메모 */}
                {workflow.adminNote && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          안내사항
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {workflow.adminNote}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 진행 이력 */}
                {workflow.logs.length > 0 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      진행 이력
                    </h4>
                    <div className="space-y-2">
                      {workflow.logs.slice(0, 5).map((log) => (
                        <div
                          key={log.id}
                          className="flex items-start gap-3 text-sm"
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="text-gray-900 dark:text-white">
                              {WORKFLOW_STATUS_LABELS[log.toStatus] || log.toStatus}
                            </span>
                            {log.note && (
                              <span className="text-gray-500 ml-2">
                                - {log.note}
                              </span>
                            )}
                            <span className="text-gray-400 ml-2">
                              {formatDate(log.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* 수정 요청 모달 */}
      {revisionModal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                수정 요청
              </h3>
              <button
                onClick={() => {
                  setRevisionModal({ open: false, workflowId: null });
                  setRevisionNote("");
                }}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                수정 요청 내용
              </label>
              <textarea
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                placeholder="수정이 필요한 부분을 구체적으로 알려주세요."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 justify-end">
              <button
                onClick={() => {
                  setRevisionModal({ open: false, workflowId: null });
                  setRevisionNote("");
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleRevisionRequest}
                disabled={submitting || !revisionNote.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "요청하기"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
