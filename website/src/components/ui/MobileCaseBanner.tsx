'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { X, Crown, Gem } from 'lucide-react'

const caseData = [
  { industry: '경영컨설팅', plan: 'Premium', planPrice: '220만', leads: '150건', conversion: '15건' },
  { industry: '인테리어', plan: 'Premium', planPrice: '220만', leads: '239건', conversion: '10건' },
  { industry: '직업교육', plan: 'Pro', planPrice: '110만', leads: '100건', conversion: '10건' },
]

const planStyles = {
  Premium: {
    bg: 'bg-gradient-to-r from-amber-600 to-amber-500',
    icon: Crown,
    indicatorActive: 'bg-amber-400',
    accent: 'text-amber-400',
  },
  Pro: {
    bg: 'bg-gradient-to-r from-emerald-600 to-emerald-500',
    icon: Gem,
    indicatorActive: 'bg-emerald-400',
    accent: 'text-emerald-400',
  },
}

export function MobileCaseBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  const isServicePage = pathname === '/service'

  // 페이지 이동 시 다시 표시
  useEffect(() => {
    setIsDismissed(false)
    setIsVisible(false)
  }, [pathname])

  useEffect(() => {
    // 스크롤 시 표시 + 흐림 효과
    const handleScroll = () => {
      if (window.scrollY > 200 && !isDismissed) {
        setIsVisible(true)
      }
      
      // 스크롤 중 흐리게
      setIsScrolling(true)
      
      // 기존 타이머 취소
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      // 스크롤 멈춤 감지 (150ms 후)
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [isDismissed])

  // 케이스 자동 전환 (4초)
  useEffect(() => {
    if (!isVisible) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % caseData.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isVisible])

  const handleClick = () => {
    if (isServicePage) {
      // 서비스 페이지에서는 스크롤
      const element = document.getElementById('case-study')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // 다른 페이지에서는 이동
      router.push('/service#case-study')
    }
  }

  if (isDismissed || !isVisible) return null

  const current = caseData[currentIndex]
  const style = planStyles[current.plan as keyof typeof planStyles]
  const PlanIcon = style.icon

  return (
    <div 
      className={`md:hidden fixed bottom-16 left-0 right-0 z-40 px-3 pb-2 transition-all duration-200 ${
        isScrolling ? 'opacity-40 blur-[1px]' : 'opacity-100 blur-0'
      }`}
    >
      {/* 상품 티어 뱃지 - 가장 눈에 띄게 */}
      <div className="flex justify-start mb-1">
        <div className={`inline-flex items-center gap-1.5 ${style.bg} px-3 py-1 rounded-t-lg`}>
          <PlanIcon className="w-3.5 h-3.5 text-white" />
          <span className="text-xs text-white font-bold">{current.plan}</span>
          <span className="text-[10px] text-white/80">이용 고객 사례</span>
        </div>
      </div>

      <button
        onClick={handleClick}
        className="w-full bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl rounded-tl-none shadow-lg overflow-hidden text-left"
      >
        <div className="flex items-center px-3 py-2.5">
          {/* 데이터 - 전체 가로폭 사용 */}
          <div className="flex-1">
            {/* 업종 + 인디케이터 */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-xs text-white font-semibold">{current.industry}</span>
              <span className="text-[10px] text-gray-500">업종</span>
              {/* 인디케이터 */}
              <div className="flex gap-1 ml-auto mr-2">
                {caseData.map((item, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i === currentIndex 
                        ? planStyles[item.plan as keyof typeof planStyles].indicatorActive 
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            {/* 성과 데이터 */}
            <div className="flex items-center gap-3 text-xs">
              <div>
                <span className="text-gray-500">DB </span>
                <span className="text-white font-medium">{current.leads}</span>
              </div>
              <div className="text-gray-600">→</div>
              <div>
                <span className="text-gray-500">전환 </span>
                <span className={`font-bold ${style.accent}`}>{current.conversion}</span>
              </div>
            </div>
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsDismissed(true)
            }}
            className="p-2 text-gray-500 hover:text-white"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </button>
    </div>
  )
}
