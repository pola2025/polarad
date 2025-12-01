"use client";

import Link from "next/link";
import { ShieldX, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900/30 rounded-full mb-6">
          <ShieldX className="w-8 h-8 text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          접근 권한이 없습니다
        </h1>

        <p className="text-gray-400 mb-8">
          이 페이지에 접근할 권한이 없습니다.<br />
          필요한 경우 상위 관리자에게 문의하세요.
        </p>

        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          대시보드로 돌아가기
        </Link>
      </div>
    </div>
  );
}
