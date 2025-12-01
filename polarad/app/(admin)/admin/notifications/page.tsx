"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Bell, Send, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface NotificationLog {
  id: string;
  clientId: string;
  notificationType: string;
  channel: string;
  message: string | null;
  status: string;
  errorMessage: string | null;
  sentAt: string;
  client: {
    clientId: string;
    clientName: string;
  };
}

interface TodayStats {
  sent: number;
  failed: number;
  total: number;
}

const notificationTypeLabels: Record<string, string> = {
  TOKEN_EXPIRY_CRITICAL: "토큰 만료 긴급",
  TOKEN_EXPIRY_WARNING: "토큰 만료 경고",
  TOKEN_EXPIRY_NOTICE: "토큰 만료 알림",
  AUTH_REQUIRED: "재인증 필요",
  SERVICE_EXPIRING: "서비스 만료 임박",
  SERVICE_EXPIRED: "서비스 만료",
  WELCOME: "환영 메시지",
  REPORT_DAILY: "일일 리포트",
  REPORT_WEEKLY: "주간 리포트",
  CUSTOM: "커스텀 알림",
};

export default function NotificationsPage() {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  async function fetchLogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications?limit=50");
      const data = await res.json();

      if (data.success) {
        setLogs(data.data);
        setTodayStats(data.todayStats);
      }
    } catch (error) {
      console.error("Notifications fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function sendBatchNotifications() {
    if (!confirm("토큰 만료 및 서비스 만료 알림을 일괄 발송하시겠습니까?")) {
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/notifications/send-batch", {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        alert(data.message);
        fetchLogs();
      } else {
        alert(data.error || "알림 발송에 실패했습니다.");
      }
    } catch (error) {
      console.error("Send batch error:", error);
      alert("알림 발송 중 오류가 발생했습니다.");
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          알림 관리
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchLogs}>
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
          <Button onClick={sendBatchNotifications} disabled={sending}>
            <Send className="w-4 h-4 mr-2" />
            {sending ? "발송 중..." : "일괄 알림 발송"}
          </Button>
        </div>
      </div>

      {/* 오늘 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">오늘 발송</CardTitle>
            <Bell className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">전체 알림 수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">성공</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {todayStats?.sent || 0}
            </div>
            <p className="text-xs text-muted-foreground">정상 발송</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">실패</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {todayStats?.failed || 0}
            </div>
            <p className="text-xs text-muted-foreground">발송 실패</p>
          </CardContent>
        </Card>
      </div>

      {/* 알림 로그 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">알림 발송 이력</CardTitle>
          <CardDescription>최근 50건의 알림 발송 이력입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : logs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              알림 발송 이력이 없습니다.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      클라이언트
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      알림 유형
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      채널
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      상태
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      발송 시간
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{log.client.clientName}</p>
                          <p className="text-sm text-muted-foreground">
                            {log.client.clientId}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {notificationTypeLabels[log.notificationType] ||
                          log.notificationType}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{log.channel}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        {log.status === "SENT" || log.status === "DELIVERED" ? (
                          <Badge variant="success">성공</Badge>
                        ) : log.status === "FAILED" ? (
                          <Badge variant="error">실패</Badge>
                        ) : (
                          <Badge variant="secondary">{log.status}</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {formatDateTime(log.sentAt)}
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
