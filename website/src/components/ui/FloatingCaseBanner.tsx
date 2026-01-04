'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Gem, X, ChevronRight } from 'lucide-react'

const caseHighlights = [
  { industry: '경영컨설팅', plan: 'Premium', planPrice: '220만', leads: '150건/월', conversion: '10%' },
  { industry: '인테리어', plan: 'Premium', planPrice: '220만', leads: '239건/월', conversion: '4%' },
  { industry: '직업교육', plan: 'Pro', planPrice: '110만', leads: '100건/월', conversion: '10%' },
]

const planStyles = {
  Premium: {
    headerBg: 'bg-gradient-to-r from-amber-600 to-amber-500',
    icon: Crown,
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    accent: 'text-amber-400',
  },
  Pro: {
    headerBg: 'bg-gradient-to-r from-emerald-600 to-emerald-500',
    icon: Gem,
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    accent: 'text-emerald-400',
  },
}

export function FloatingCaseBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const pathname = usePathname()
  const router = useRouter()

  const isServicePage = pathname === '/service'

  useEffect(() => {
    // 스크롤 시 표시
    const handleScroll = () => {
      if (window.scrollY > 300 && !isDismissed) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDismissed])

  // 케이스 자동 전환 (3초)
  useEffect(() => {
    if (!isVisible) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % caseHighlights.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [isVisible])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }

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

  if (isDismissed) return null

  const current = caseHighlights[currentIndex]
  const style = planStyles[current.plan as keyof typeof planStyles]
  const PlanIcon = style.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed right-4 bottom-24 md:bottom-8 z-40 hidden sm:block"
        >
          <div className="relative bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden w-[240px]">
            {/* 닫기 버튼 */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors z-10"
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 상품 티어 헤더 - 가장 눈에 띄게 */}
            <div className={`${style.headerBg} px-4 py-3`}>
              <div className="flex items-center gap-2">
                <PlanIcon className="w-5 h-5 text-white" />
                <div>
                  <span className="text-white text-sm font-bold">{current.plan} 이용 고객 사례</span>
                  <span className="text-white/80 text-xs ml-1.5">({current.planPrice}/월)</span>
                </div>
              </div>
            </div>

            {/* 케이스 데이터 */}
            <button onClick={handleClick} className="block w-full p-4 hover:bg-gray-800/50 transition-colors text-left">
              {/* 업종 */}
              <div className="mb-3">
                <span className="text-sm font-medium text-white">{current.industry}</span>
                <span className="text-xs text-gray-500 ml-1">업종</span>
              </div>
              
              {/* 성과 지표 */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">월 DB 수집</span>
                <span className="text-sm font-bold text-white">{current.leads}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">전환율</span>
                <span className={`text-sm font-bold ${style.accent}`}>{current.conversion}</span>
              </div>

              {/* 인디케이터 */}
              <div className="flex justify-center gap-1.5 mt-4">
                {caseHighlights.map((item, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === currentIndex 
                        ? item.plan === 'Premium' ? 'bg-amber-500' : 'bg-emerald-500'
                        : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>

              {/* CTA */}
              <div className={`flex items-center justify-center gap-1 mt-3 text-xs ${style.accent} font-medium`}>
                <span>상세 성과 보기</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
