'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, X, ChevronRight } from 'lucide-react'

const caseHighlights = [
  { industry: '경영컨설팅', leads: '150건/월', conversion: '10%' },
  { industry: '인테리어', leads: '239건/월', conversion: '4%' },
  { industry: '직업교육', leads: '100건/월', conversion: '10%' },
]

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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed right-4 bottom-24 md:bottom-8 z-40 hidden sm:block"
        >
          <div className="relative bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden w-[220px]">
            {/* 닫기 버튼 */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors z-10"
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 헤더 */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-semibold">실제 성과 데이터</span>
              </div>
            </div>

            {/* 케이스 데이터 */}
            <button onClick={handleClick} className="block w-full p-4 hover:bg-gray-800/50 transition-colors text-left">
              <div className="mb-3">
                <span className="text-xs text-gray-400">{current.industry}</span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">월 DB</span>
                <span className="text-sm font-bold text-white">{current.leads}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">전환율</span>
                <span className="text-sm font-bold text-primary-400">{current.conversion}</span>
              </div>

              {/* 인디케이터 */}
              <div className="flex justify-center gap-1.5 mt-3">
                {caseHighlights.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === currentIndex ? 'bg-primary-500' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center justify-center gap-1 mt-3 text-xs text-primary-400 font-medium">
                <span>자세히 보기</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
