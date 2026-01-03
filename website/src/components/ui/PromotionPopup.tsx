'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { X, Gift, Clock, Sparkles, ChevronRight } from 'lucide-react'

interface PromotionPopupProps {
  onClose?: () => void
}

const STORAGE_KEY = 'polarad_promo_hide_until'
const PROMOTION_END_DATE = new Date('2026-01-31T23:59:59+09:00')

export function PromotionPopup({ onClose }: PromotionPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hideToday, setHideToday] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const ctaButtonRef = useRef<HTMLButtonElement>(null)

  // 팝업 표시 여부 확인
  useEffect(() => {
    const hideUntil = localStorage.getItem(STORAGE_KEY)
    const now = new Date().getTime()

    // 프로모션 기간 종료 체크
    if (now > PROMOTION_END_DATE.getTime()) {
      return
    }

    if (hideUntil && now < parseInt(hideUntil)) {
      return
    }

    // 약간의 딜레이 후 팝업 표시
    const timer = setTimeout(() => setIsOpen(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  // ESC 키로 닫기
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') handleClose()
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape])

  // 닫기 처리
  const handleClose = () => {
    if (hideToday) {
      // 오늘 하루 보지 않기: 자정까지
      const tomorrow = new Date()
      tomorrow.setHours(24, 0, 0, 0)
      localStorage.setItem(STORAGE_KEY, tomorrow.getTime().toString())
    }
    setIsOpen(false)
    onClose?.()
  }

  // CTA 버튼 마우스 이동 효과
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ctaButtonRef.current) return
    const rect = ctaButtonRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  // D-Day 계산
  const getDaysRemaining = () => {
    const now = new Date()
    const diff = PROMOTION_END_DATE.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  if (!isOpen) return null

  return (
    <>
      {/* CSS for rotating border animation */}
      <style jsx global>{`
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        .rotate-border-box {
          position: relative;
          /* background 삭제: 부모는 투명하게 */
          border-radius: 1rem;
          isolation: isolate;
        }

        /* 1. 가장 뒤에서 도는 회전판 (Spinner) */
        .rotate-border-box::before {
          content: "";
          position: absolute;
          inset: -3px;       /* 테두리 두께만큼 밖으로 */
          z-index: -2;       /* ★ 제일 뒤로 */
          background: conic-gradient(
            from var(--gradient-angle),
            #f3d060,
            #ff6b35,
            #A5282c,
            #f3d060
          );
          border-radius: inherit;
          animation: rotate-border 2.5s linear infinite;
        }

        /* 2. 회전판 위를 덮는 고정된 배경 (Cover Mask) */
        .rotate-border-box::after {
          content: "";
          position: absolute;
          inset: 0;          /* 박스 크기에 딱 맞춤 */
          z-index: -1;       /* 회전판보다 위, 글자보다 아래 */
          background: #0f1629; /* ★ 배경색을 여기로 */
          border-radius: inherit;
        }

        @keyframes rotate-border {
          0% { --gradient-angle: 0deg; }
          100% { --gradient-angle: 360deg; }
        }

        .neon-text {
          text-shadow:
            0 0 10px rgba(243, 208, 96, 0.5),
            0 0 20px rgba(243, 208, 96, 0.3),
            0 0 30px rgba(243, 208, 96, 0.2);
        }

        .spotlight-btn {
          position: relative;
          overflow: hidden;
        }

        .spotlight-btn::before {
          content: '';
          position: absolute;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .spotlight-btn:hover::before {
          opacity: 1;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(243, 208, 96, 0.4); }
          50% { box-shadow: 0 0 40px rgba(243, 208, 96, 0.6), 0 0 60px rgba(255, 107, 53, 0.3); }
        }

        .tier-card {
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .tier-card:hover {
          transform: translateY(-2px);
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal with rotating border */}
        <div className="relative z-10 rotate-border-box w-full max-w-lg animate-in fade-in zoom-in-95 duration-300">
          <div className="relative rounded-2xl bg-[#0f1629] p-6 sm:p-8">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all z-10"
              aria-label="닫기"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full px-4 py-1.5 mb-4">
                <Clock size={14} className="text-amber-400" />
                <span className="text-amber-300 text-sm font-medium">
                  D-{getDaysRemaining()} | 2026년 1월 31일까지
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 neon-text">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-500">
                  신년 특별 프로모션
                </span>
              </h2>
              <p className="text-gray-400 text-sm">
                선착순 한정 혜택을 놓치지 마세요!
              </p>
            </div>

            {/* Premium 프로모션 카드 */}
            <div className="mb-6">
              <div className="tier-card relative bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/40 rounded-xl p-5 hover:border-amber-400/60" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
                <div className="absolute -top-2 -right-2">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles size={12} />
                    선착순 10개
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Gift size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-amber-400 font-bold text-lg">Premium 패키지</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-gray-500 line-through text-sm">220만원</span>
                      <span className="text-2xl font-bold text-amber-300">165만원</span>
                      <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded">55만원 할인</span>
                    </div>
                    <ul className="space-y-1.5">
                      <li className="flex items-center gap-2 text-gray-300 text-sm">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                        홈페이지 10P + Meta 광고 세팅 + 도메인
                      </li>
                      <li className="flex items-center gap-2 text-white">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                        <span className="font-semibold text-amber-300">1년 마케팅 자동화 무료</span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-300 text-sm">
                        <span className="w-1.5 h-1.5 bg-amber-400/60 rounded-full" />
                        텔레그램 알림 + SMS 발송 포함
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 다른 티어 안내 */}
              <p className="text-center text-gray-500 text-xs mt-3">
                다른 티어: Basic 30만원 / Normal 60만원 / Pro 110만원
              </p>
            </div>

            {/* CTA Button with spotlight effect */}
            <button
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
              onClick={() => {
                handleClose()
                window.location.href = '/contact#contact-form'
              }}
              className="spotlight-btn w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
              style={{
                ['--mouse-x' as string]: `${mousePosition.x}px`,
                ['--mouse-y' as string]: `${mousePosition.y}px`,
              }}
            >
              <span
                className="absolute w-[150px] h-[150px] bg-[radial-gradient(circle,rgba(255,255,255,0.3)_0%,transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  left: mousePosition.x,
                  top: mousePosition.y,
                  transform: 'translate(-50%, -50%)',
                }}
              />
              <span className="relative z-10 text-lg">지금 상담 신청하기</span>
              <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Hide today checkbox */}
            <div className="mt-4 flex items-center justify-center">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={hideToday}
                  onChange={(e) => setHideToday(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-transparent text-amber-500 focus:ring-amber-500/30 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors">
                  오늘 하루 보지 않기
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
