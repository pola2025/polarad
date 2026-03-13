"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FolderOpen,
  FileUp,
  Globe,
  BarChart3,
  MessageSquare,
  BookOpen,
  BookMarked,
  Megaphone,
  Eye,
  Newspaper,
  Lightbulb,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  icon: React.ElementType;
  defaultOpen: boolean;
  items: NavItem[];
}

type NavEntry = NavItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

const navigation: NavEntry[] = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  {
    label: "제작진행",
    icon: FolderOpen,
    defaultOpen: true,
    items: [
      { href: "/production/submit", label: "자료제출", icon: FileUp },
      { href: "/production/build", label: "홈페이지 제작", icon: Globe },
      { href: "/production/status", label: "제작현황", icon: BarChart3 },
    ],
  },
  { href: "/contact", label: "문의하기", icon: MessageSquare },
  {
    label: "가이드",
    icon: BookOpen,
    defaultOpen: false,
    items: [
      { href: "/guide/reference", label: "참고가이드", icon: BookMarked },
      { href: "/guide/meta-ads", label: "meta 광고", icon: Megaphone },
      { href: "/guide/review", label: "시안 확인", icon: Eye },
      { href: "/marketing-news", label: "마케팅소식", icon: Newspaper },
      {
        href: "/guide/content-tips",
        label: "콘텐츠 제작 Tip",
        icon: Lightbulb,
      },
    ],
  },
];

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(item.href));
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all group ${
        isActive
          ? "bg-[#c9a962]/15 text-[#c9a962]"
          : "text-[#999] hover:text-white hover:bg-white/5"
      }`}
      title={collapsed ? item.label : undefined}
    >
      <Icon
        className={`w-[18px] h-[18px] flex-shrink-0 ${
          isActive ? "text-[#c9a962]" : "text-[#666] group-hover:text-[#999]"
        }`}
      />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

function NavSection({
  group,
  collapsed,
}: {
  group: NavGroup;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const hasActiveChild = group.items.some(
    (item) =>
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(item.href)),
  );
  const [open, setOpen] = useState(group.defaultOpen || hasActiveChild);
  const Icon = group.icon;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
          hasActiveChild
            ? "text-[#c9a962]"
            : "text-[#888] hover:text-white hover:bg-white/5"
        }`}
        title={collapsed ? group.label : undefined}
      >
        <div className="flex items-center gap-3">
          <Icon
            className={`w-[18px] h-[18px] flex-shrink-0 ${
              hasActiveChild ? "text-[#c9a962]" : "text-[#666]"
            }`}
          />
          {!collapsed && <span>{group.label}</span>}
        </div>
        {!collapsed && (
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              open ? "rotate-0" : "-rotate-90"
            }`}
          />
        )}
      </button>
      {open && !collapsed && (
        <div className="ml-4 pl-3 border-l border-white/[0.06] mt-1 space-y-0.5">
          {group.items.map((item) => (
            <NavLink key={item.href} item={item} collapsed={false} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navigation.map((entry) =>
        isGroup(entry) ? (
          <NavSection key={entry.label} group={entry} collapsed={false} />
        ) : (
          <NavLink key={entry.href} item={entry} collapsed={false} />
        ),
      )}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 z-40 w-[220px] flex-col bg-[#141414] border-r border-white/[0.06]">
        {/* Logo */}
        <div className="flex items-center h-[60px] lg:h-[64px] px-5 border-b border-white/[0.06]">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/images/logo-pc.png"
              alt="Polarad"
              width={130}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>
        {navContent}
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[56px] px-4 bg-[#141414] border-b border-white/[0.06]">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src="/images/logo-mobile.png"
            alt="Polarad"
            width={120}
            height={36}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#999] hover:text-white transition-colors"
          aria-label="메뉴 열기"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed top-[56px] left-0 bottom-0 z-50 w-[260px] flex flex-col bg-[#141414] border-r border-white/[0.06] animate-slideIn">
            <div onClick={() => setMobileOpen(false)}>{navContent}</div>
          </aside>
        </>
      )}
    </>
  );
}
