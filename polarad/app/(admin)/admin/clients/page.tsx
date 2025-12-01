"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Plus, RefreshCw } from "lucide-react";
import { formatDate, getDaysUntilExpiry, getAuthStatusLabel } from "@/lib/utils";
import type { ClientListItem } from "@/types/client";

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  async function fetchClients() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (search) params.set("search", search);

      const res = await fetch(`/api/clients?${params}`);
      const data = await res.json();

      if (data.success) {
        setClients(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Clients fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClients();
  }, [pagination.page]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchClients();
  }

  function getStatusBadge(client: ClientListItem) {
    if (client.authStatus === "AUTH_REQUIRED") {
      return <Badge variant="error">재인증 필요</Badge>;
    }
    if (client.authStatus === "TOKEN_EXPIRED") {
      return <Badge variant="error">토큰 만료</Badge>;
    }

    const days = getDaysUntilExpiry(client.tokenExpiresAt);
    if (days !== null && days <= 3) {
      return <Badge variant="error">{days}일 남음</Badge>;
    }
    if (days !== null && days <= 7) {
      return <Badge variant="warning">{days}일 남음</Badge>;
    }
    if (days !== null && days <= 14) {
      return <Badge variant="info">{days}일 남음</Badge>;
    }

    return <Badge variant="success">정상</Badge>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          클라이언트 관리
        </h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          새 클라이언트
        </Button>
      </div>

      {/* 검색 */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="클라이언트명, 이메일, ID로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="secondary">
              검색
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearch("");
                fetchClients();
              }}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 클라이언트 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            클라이언트 목록 ({pagination.total}건)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : clients.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              등록된 클라이언트가 없습니다.
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
                      이메일
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      광고 계정
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      토큰 만료
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      상태
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      알림
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{client.clientName}</p>
                          <p className="text-sm text-muted-foreground">
                            {client.clientId}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{client.email}</td>
                      <td className="py-3 px-4 text-sm">
                        {client.metaAdAccountId || "-"}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {formatDate(client.tokenExpiresAt)}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(client)}</td>
                      <td className="py-3 px-4">
                        {client.telegramEnabled ? (
                          <Badge variant="success">활성</Badge>
                        ) : (
                          <Badge variant="secondary">비활성</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 페이지네이션 */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                이전
              </Button>
              <span className="text-sm text-muted-foreground">
                {pagination.page} / {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                다음
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
