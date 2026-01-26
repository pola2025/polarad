import Link from 'next/link';
import { requireAuth, getDashboardStats } from '@/lib/content-studio';
import {
  LayoutDashboard,
  Lightbulb,
  FileText,
  Globe,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { label: '대시보드', href: '/content-studio', icon: LayoutDashboard },
  { label: '주제 관리', href: '/content-studio/topics', icon: Lightbulb },
  { label: '블로그 콘텐츠', href: '/content-studio/blog', icon: FileText },
  { label: '웹페이지 게시', href: '/content-studio/web', icon: Globe },
  { label: '설정', href: '/content-studio/settings', icon: Settings },
];

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { client } = await requireAuth();
  const stats = await getDashboardStats(client.id);

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* 사이드바 */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
        {/* 로고 */}
        <div className="p-6 border-b border-neutral-200">
          <Link href="/content-studio" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <span className="font-semibold text-neutral-800">Content Studio</span>
          </Link>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const badge =
                item.href === '/content-studio/topics'
                  ? stats.pendingTopics
                  : item.href === '/content-studio/blog'
                    ? stats.draftContents
                    : undefined;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {badge !== undefined && badge > 0 && (
                      <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 사용자 정보 */}
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
              <span className="text-neutral-600 font-medium text-sm">
                {client.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {client.name}
              </p>
              <p className="text-xs text-neutral-500 truncate">{client.email}</p>
            </div>
          </div>
          <form action="/api/content-studio/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </form>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
