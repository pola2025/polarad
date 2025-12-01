import Link from "next/link";
import { Users, Key, Bell, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* 헤더 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Polarad 마케팅 패키지
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            클라이언트 관리 시스템
          </p>
        </div>

        {/* 기능 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* 클라이언트 관리 */}
          <Link href="/dashboard/clients" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 card-hover">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                클라이언트 관리
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                광고 클라이언트 정보 조회, 등록, 수정
              </p>
            </div>
          </Link>

          {/* 토큰/인증 관리 */}
          <Link href="/dashboard/tokens" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 card-hover">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Key className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                토큰/인증 관리
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Meta API 토큰 상태 및 갱신 관리
              </p>
            </div>
          </Link>

          {/* 알림 관리 */}
          <Link href="/dashboard/notifications" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 card-hover">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                <Bell className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                알림 관리
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                텔레그램 알림 발송 및 이력 조회
              </p>
            </div>
          </Link>

          {/* 대시보드 */}
          <Link href="/dashboard" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 card-hover">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                대시보드
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                전체 현황 및 통계 보기
              </p>
            </div>
          </Link>
        </div>

        {/* 요약 정보 */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              시스템 개요
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  -
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  활성 클라이언트
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  -
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  토큰 만료 임박
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  -
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  오늘 발송 알림
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
