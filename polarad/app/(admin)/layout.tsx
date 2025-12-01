import Link from "next/link";
import { Users, Key, Bell, LayoutDashboard, Settings, UserCircle, Package, FileSignature } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 사이드바 */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {/* 로고 */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              Polarad
            </span>
          </Link>
        </div>

        {/* 네비게이션 */}
        <nav className="p-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            대시보드
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <UserCircle className="w-5 h-5" />
            사용자 관리
          </Link>

          <Link
            href="/admin/contracts"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FileSignature className="w-5 h-5" />
            계약 관리
          </Link>

          <Link
            href="/admin/workflows"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Package className="w-5 h-5" />
            워크플로우 관리
          </Link>

          <Link
            href="/admin/clients"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Users className="w-5 h-5" />
            클라이언트 관리
          </Link>

          <Link
            href="/admin/tokens"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Key className="w-5 h-5" />
            토큰/인증 관리
          </Link>

          <Link
            href="/admin/notifications"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Bell className="w-5 h-5" />
            알림 관리
          </Link>

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
              설정
            </Link>
          </div>
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="pl-64">
        {/* 헤더 */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Polarad 마케팅 패키지 - 통합 관리 시스템
          </div>
        </header>

        {/* 콘텐츠 영역 */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
