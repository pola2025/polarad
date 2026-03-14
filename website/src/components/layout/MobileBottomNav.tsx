"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Briefcase,
  Grid3X3,
  FolderOpen,
  MessageSquare,
} from "lucide-react";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/service", label: "서비스", icon: Briefcase },
  { href: "/demo", label: "데모", icon: Grid3X3 },
  { href: "/portfolio", label: "포트폴리오", icon: FolderOpen },
  { href: "/contact", label: "상담신청", icon: MessageSquare },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] border-t border-white/[0.06] shadow-[0_-4px_20px_rgba(0,0,0,0.3)] safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors ${
                isActive
                  ? "text-[#c9a962]"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-1 ${isActive ? "stroke-[2.5]" : ""}`}
              />
              <span
                className={`text-[11px] ${isActive ? "font-semibold" : "font-medium"}`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#c9a962] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
