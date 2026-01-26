'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export function Header() {
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: '홈' },
    { href: '/service', label: '서비스' },
    { href: '/about', label: '회사소개' },
    { href: '/contact', label: '상담신청' },
    { href: '/marketing-news', label: '마케팅 소식' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5A623] md:bg-white/95 backdrop-blur-sm border-b border-gray-200 md:shadow-sm min-h-[60px] md:min-h-[60px] lg:min-h-[68px]">
      <nav className="container h-[60px] md:h-[60px] lg:h-[68px] md:py-2 lg:py-3 flex items-center">
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
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative transition-colors text-sm lg:text-base font-medium py-1 ${
                    isActive
                      ? 'text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contact"
              className="px-5 lg:px-6 py-2 lg:py-2.5 bg-accent text-white rounded-lg hover:bg-accent-600 transition-all hover:shadow-md font-semibold text-sm"
              aria-label="상담신청"
            >
              상담신청
            </Link>
          </div>

          {/* Mobile: 마케팅소식 링크 (하단 네비에 없는 메뉴) */}
          <Link
            href="/marketing-news"
            className="md:hidden text-white text-sm font-medium px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            마케팅소식
          </Link>
        </div>
      </nav>
    </header>
  )
}
