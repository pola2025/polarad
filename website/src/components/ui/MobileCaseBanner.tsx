'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { X, TrendingUp } from 'lucide-react'

const caseData = [
  { industry: '경영컨설팅', adBudget: '320만', leads: '150건', conversion: '16건 계약' },
  { industry: '인테리어', adBudget: '320만', leads: '239건', conversion: '10건 계약' },
  { industry: '직업교육', adBudget: '200만', leads: '100건', conversion: '10명 등록' },
]

export function MobileCaseBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const pathname = usePathname()
  const router = useRouter()

  const isServicePage = pathname === '/service'

  useEffect(() => {
    // 스크롤 시 표시
    const handleScroll = () => {
      if (window.scrollY > 200 && !isDismissed) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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

  return (
    <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 px-3 pb-2">
      <button
        onClick={handleClick}
        className="w-full bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg overflow-hidden text-left"
      >
        <div className="flex items-center">
          {/* 왼쪽: 라벨 */}
          <div className="bg-primary-600 px-3 py-3 flex flex-col items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white mb-0.5" />
            <span className="text-[10px] text-white font-medium">실제사례</span>
          </div>

          {/* 중간: 데이터 */}
          <div className="flex-1 px-3 py-2">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs text-primary-400 font-semibold">{current.industry}</span>
              {/* 인디케이터 */}
              <div className="flex gap-1 ml-auto">
                {caseData.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 rounded-full ${i === currentIndex ? 'bg-primary-400' : 'bg-gray-600'}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <div>
                <span className="text-gray-500">광고비 </span>
                <span className="text-white font-medium">{current.adBudget}</span>
              </div>
              <div className="text-gray-600">|</div>
              <div>
                <span className="text-gray-500">DB </span>
                <span className="text-white font-medium">{current.leads}</span>
              </div>
              <div className="text-gray-600">|</div>
              <div>
                <span className="text-gray-500">전환 </span>
                <span className="text-primary-400 font-semibold">{current.conversion}</span>
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
            className="px-3 py-3 text-gray-500 hover:text-white"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </button>
    </div>
  )
}
