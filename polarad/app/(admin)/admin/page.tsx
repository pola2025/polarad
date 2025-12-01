"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Key,
  Bell,
  AlertTriangle,
  UserCircle,
  Package,
  FileText,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";
import { formatDate, getDaysUntilExpiry } from "@/lib/utils";
import Link from "next/link";

interface DashboardStats {
  total: number;
  active: number;
  tokenExpiring: number;
  authRequired: number;
  telegramEnabled: number;
}

interface TokenStats {
  expiring: number;
  expired: number;
  authRequired: number;
  critical: number;
}

interface ExpiringClient {
  id: string;
  clientId: string;
  clientName: string;
  tokenExpiresAt: string | null;
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  submissionComplete: number;
}

interface WorkflowStats {
  total: number;
  pending: number;
  inProgress: number;
  designUploaded: number;
  orderRequested: number;
  completed: number;
  shipped: number;
}

interface RecentWorkflow {
  id: string;
  type: string;
  status: string;
  updatedAt: string;
  user: {
    clientName: string;
  };
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
  SUBMITTED: "자료제출",
  IN_PROGRESS: "진행중",
  DESIGN_UPLOADED: "시안완료",
  ORDER_REQUESTED: "발주요청",
  ORDER_APPROVED: "발주승인",
  COMPLETED: "제작완료",
  SHIPPED: "발송완료",
  CANCELLED: "취소",
};

export default function DashboardPage() {
  const [clientStats, setClientStats] = useState<DashboardStats | null>(null);
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null);
  const [expiringClients, setExpiringClients] = useState<ExpiringClient[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [workflowStats, setWorkflowStats] = useState<WorkflowStats | null>(null);
  const [recentWorkflows, setRecentWorkflows] = useState<RecentWorkflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 병렬로 데이터 조회
        const [clientRes, tokenRes, userRes, workflowRes] = await Promise.all([
          fetch("/api/clients?limit=1"),
          fetch("/api/tokens"),
          fetch("/api/users?limit=1"),
          fetch("/api/workflows?limit=5"),
        ]);

        const [clientData, tokenData, userData, workflowData] = await Promise.all([
          clientRes.json(),
          tokenRes.json(),
          userRes.json(),
          workflowRes.json(),
        ]);

        if (clientData.success) {
          setClientStats(clientData.stats);
        }

        if (tokenData.success) {
          setTokenStats(tokenData.stats);
          setExpiringClients(tokenData.data.expiring.slice(0, 5));
        }

        if (userData.success) {
          setUserStats(userData.stats);
        }

        if (workflowData.success) {
          setWorkflowStats(workflowData.stats);
          setRecentWorkflows(workflowData.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        대시보드
      </h1>

      {/* 사용자 & 워크플로우 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Link href="/admin/users">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 사용자</CardTitle>
              <UserCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats?.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                활성: {userStats?.active || 0}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">자료 제출 완료</CardTitle>
              <FileText className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {userStats?.submissionComplete || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {userStats?.total ? Math.round((userStats.submissionComplete / userStats.total) * 100) : 0}% 완료
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/workflows?status=IN_PROGRESS">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">진행중</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {workflowStats?.inProgress || 0}
              </div>
              <p className="text-xs text-muted-foreground">워크플로우</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/workflows?status=DESIGN_UPLOADED">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">시안 확인 대기</CardTitle>
              <Package className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {workflowStats?.designUploaded || 0}
              </div>
              <p className="text-xs text-muted-foreground">고객 확인 필요</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/workflows?status=ORDER_REQUESTED">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">발주 대기</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {workflowStats?.orderRequested || 0}
              </div>
              <p className="text-xs text-muted-foreground">승인 필요</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/workflows?status=COMPLETED">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">배송 대기</CardTitle>
              <Truck className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {workflowStats?.completed || 0}
              </div>
              <p className="text-xs text-muted-foreground">발송 필요</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 클라이언트 & 토큰 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 클라이언트</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              활성: {clientStats?.active || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">토큰 만료 임박</CardTitle>
            <Key className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {tokenStats?.expiring || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              긴급: {tokenStats?.critical || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">재인증 필요</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {tokenStats?.authRequired || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              만료됨: {tokenStats?.expired || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">텔레그램 연동</CardTitle>
            <Bell className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clientStats?.telegramEnabled || 0}
            </div>
            <p className="text-xs text-muted-foreground">알림 활성화</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 워크플로우 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">최근 워크플로우</CardTitle>
            <Link
              href="/admin/workflows"
              className="text-sm text-blue-600 hover:underline"
            >
              전체보기
            </Link>
          </CardHeader>
          <CardContent>
            {recentWorkflows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                워크플로우가 없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {recentWorkflows.map((workflow) => (
                  <Link
                    key={workflow.id}
                    href={`/admin/workflows/${workflow.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {workflow.user.clientName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {WORKFLOW_TYPE_LABELS[workflow.type] || workflow.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          workflow.status === "COMPLETED" || workflow.status === "SHIPPED"
                            ? "success"
                            : workflow.status === "ORDER_REQUESTED"
                            ? "warning"
                            : "info"
                        }
                      >
                        {WORKFLOW_STATUS_LABELS[workflow.status] || workflow.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(workflow.updatedAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 토큰 만료 임박 목록 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">토큰 만료 임박</CardTitle>
            <Link
              href="/admin/tokens"
              className="text-sm text-blue-600 hover:underline"
            >
              전체보기
            </Link>
          </CardHeader>
          <CardContent>
            {expiringClients.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                토큰 만료 임박 클라이언트가 없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {expiringClients.map((client) => {
                  const days = getDaysUntilExpiry(client.tokenExpiresAt);
                  return (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {client.clientName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {client.clientId}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            days !== null && days <= 3
                              ? "error"
                              : days !== null && days <= 7
                              ? "warning"
                              : "info"
                          }
                        >
                          {days !== null ? `${days}일 남음` : "날짜 없음"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(client.tokenExpiresAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
