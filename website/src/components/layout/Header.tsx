"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "홈" },
    { href: "/service", label: "서비스" },
    { href: "/demo", label: "데모" },
    { href: "/portfolio", label: "포트폴리오" },
    { href: "/contact", label: "상담신청" },
    { href: "/marketing-news", label: "마케팅 소식" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(26,26,26,0.95)] backdrop-blur-[20px] border-b border-[rgba(201,169,98,0.2)] min-h-[60px] md:min-h-[60px] lg:min-h-[64px]">
      <nav className="container h-[60px] md:h-[60px] lg:h-[64px] md:py-2 lg:py-3 flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="폴라애드 홈페이지"
          >
            {/* Mobile Logo */}
            <Image
              src="/images/logo-mobile.png"
              alt="Polarad 로고"
              width={150}
              height={45}
              className="h-10 w-auto md:hidden"
              priority
            />
            {/* PC Logo */}
            <Image
              src="/images/logo-pc.png"
              alt="Polarad 로고"
              width={160}
              height={48}
              className="hidden md:block h-10 lg:h-11 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7 lg:gap-8">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative transition-colors text-[13px] tracking-[1px] uppercase py-1 ${
                    isActive
                      ? "text-[#c9a962] font-semibold"
                      : "text-[#bbb] hover:text-[#c9a962]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-2 border border-[#c9a962] text-[#c9a962] rounded-sm text-[12px] tracking-[1.5px] uppercase font-semibold hover:bg-[#c9a962] hover:text-[#1a1a1a] transition-all"
              aria-label="상담신청"
            >
              상담신청
            </Link>
          </div>

          {/* Mobile: 마케팅소식 링크 */}
          <Link
            href="/marketing-news"
            className="md:hidden text-[#c9a962] text-sm font-medium px-3 py-2.5 min-h-[44px] flex items-center rounded-lg bg-[#c9a962]/10 border border-[#c9a962]/20 hover:bg-[#c9a962]/20 transition-colors"
          >
            마케팅소식
          </Link>
        </div>
      </nav>
    </header>
  );
}
