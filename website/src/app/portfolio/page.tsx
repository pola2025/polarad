'use client'

import { useState, useEffect, useCallback } from 'react'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { Button } from '@/components/ui/Button'
import { ExternalLink, Briefcase, ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { motion, AnimatePresence } from 'framer-motion'

// 실제 제작 사례
const portfolioSites = [
  { id: 1, url: 'https://financialhealing.imweb.me/' },
  { id: 2, url: 'https://mjgood.imweb.me/' },
  { id: 3, url: 'https://jmbiz.imweb.me/' },
  { id: 4, url: 'https://ksupport-center.imweb.me/' },
  { id: 5, url: 'https://dkcenter.imweb.me/' },
  { id: 6, url: 'https://fpbiz.imweb.me/' },
]

export default function PortfolioPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentSlide((prev) => (prev + 1) % portfolioSites.length)
  }, [])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev - 1 + portfolioSites.length) % portfolioSites.length)
  }, [])

  // 자동 슬라이드 (5초마다)
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: '홈', url: 'https://polaad.co.kr' },
          { name: '포트폴리오', url: 'https://polaad.co.kr/portfolio' }
        ]}
      />

      <main className="min-h-screen bg-gray-950">
        {/* Hero Section - 메인/서비스와 동일한 레이아웃 */}
        <section className="relative min-h-[calc(100vh-6rem)] lg:min-h-[calc(100vh-7rem)] pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-950 text-white -mt-24 md:-mt-28">
          {/* Aurora Background Effect */}
          <AuroraBackground color="mixed" intensity="medium" />

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>

          <div className="container relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-400 text-sm font-semibold mb-6 backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>실제 제작 포트폴리오</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight break-keep text-balance"
                >
                  고객사의 성공을<br />
                  <span className="text-primary-400">직접 확인</span>하세요
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 break-keep text-balance"
                >
                  폴라애드가 제작한 실제 홈페이지입니다.<br className="hidden md:block" />
                  각 기업의 특성에 맞춘 <span className="text-white font-semibold">맞춤형 디자인</span>을 확인해보세요.
                </motion.p>

                {/* 특징 리스트 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="flex justify-center lg:justify-start mb-8"
                >
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">반응형 디자인</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">SEO 최적화</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">빠른 로딩 속도</span>
                    </div>
                  </div>
                </motion.div>

                {/* 통계 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="grid grid-cols-3 gap-4 sm:gap-8 mb-10 max-w-md mx-auto lg:mx-0"
                >
                  <div className="text-center lg:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-primary-400">50+</div>
                    <div className="text-xs sm:text-sm text-gray-400">제작 완료</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-primary-400">98%</div>
                    <div className="text-xs sm:text-sm text-gray-400">만족도</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-primary-400">30일</div>
                    <div className="text-xs sm:text-sm text-gray-400">평균 제작</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Button variant="primary" size="xl" className="w-full sm:w-auto shadow-xl shadow-primary-900/20 border border-primary-500/50 whitespace-nowrap" href="/contact">
                    무료 상담 신청
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button variant="outline" size="xl" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10" href="/service">
                    서비스 보기
                  </Button>
                </motion.div>
              </div>

              {/* Right Visual - 사이트 미리보기 슬라이더 (모바일: 슬라이드, 데스크탑: 첫번째 고정) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex-1 w-full max-w-[600px] lg:max-w-none"
              >
                <div className="relative bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                  {/* Browser Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gray-800/50">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <div className="text-xs text-gray-400 font-mono truncate max-w-[180px] sm:max-w-none">
                      <span className="lg:hidden">{portfolioSites[currentSlide].url.replace('https://', '').replace('/', '')}</span>
                      <span className="hidden lg:inline">financialhealing.imweb.me</span>
                    </div>
                  </div>

                  {/* Site Preview - 모바일: 슬라이드, 데스크탑: 고정 */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-white">
                    {/* 데스크탑: 첫번째 사이트 고정 */}
                    <div className="hidden lg:block absolute inset-0">
                      <iframe
                        src="https://financialhealing.imweb.me/"
                        className="absolute top-0 left-0 w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none"
                        title="Portfolio Preview"
                        loading="eager"
                      />
                    </div>

                    {/* 모바일: 슬라이드 */}
                    <div className="lg:hidden absolute inset-0">
                      <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                          key={currentSlide}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="absolute inset-0"
                        >
                          <iframe
                            src={portfolioSites[currentSlide].url}
                            className="absolute top-0 left-0 w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none"
                            title={`Portfolio Preview ${currentSlide + 1}`}
                            loading="eager"
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* 슬라이드 컨트롤 - 모바일만 */}
                  <div className="lg:hidden flex items-center justify-between px-4 py-3 border-t border-white/5 bg-gray-800/50">
                    <button
                      onClick={prevSlide}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label="이전 슬라이드"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>

                    {/* 인디케이터 */}
                    <div className="flex gap-2">
                      {portfolioSites.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setDirection(index > currentSlide ? 1 : -1)
                            setCurrentSlide(index)
                          }}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentSlide
                              ? 'bg-primary-500 w-6'
                              : 'bg-white/30 hover:bg-white/50'
                          }`}
                          aria-label={`슬라이드 ${index + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={nextSlide}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label="다음 슬라이드"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Portfolio Grid Section - 밝은 배경 */}
        <section className="py-20 lg:py-28 bg-gray-100 relative overflow-hidden">
          <div className="container relative z-10">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 break-keep">
                제작 포트폴리오
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto break-keep">
                클릭하면 실제 사이트로 이동합니다
              </p>
            </motion.div>

            {/* 안내 문구 */}
            <div className="max-w-4xl mx-auto mb-12 p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
              <ul className="space-y-2 text-sm sm:text-base text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-0.5">•</span>
                  <span>디자인 레이아웃이며 별도 커스텀 일부 가능</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-0.5">•</span>
                  <span>커스텀 내용이 많아지면 비용 추가</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-0.5">•</span>
                  <span>시안 사이트는 아임웹 기반이지만 제작은 <strong className="text-gray-900">개별 제작</strong>으로 진행 (아임웹 제작 아님)</span>
                </li>
              </ul>
            </div>

            {/* Portfolio Grid - 모바일: 좌우 스크롤, 태블릿/데스크탑: 그리드 */}
            {/* 모바일 좌우 스크롤 */}
            <div className="sm:hidden relative">
              {/* 좌측 스크롤 버튼 */}
              <button
                onClick={() => {
                  const container = document.getElementById('portfolio-scroll-container')
                  if (container) container.scrollBy({ left: -300, behavior: 'smooth' })
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 border border-gray-200 rounded-full shadow-lg hover:bg-white transition-colors"
                aria-label="이전"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>

              {/* 우측 스크롤 버튼 */}
              <button
                onClick={() => {
                  const container = document.getElementById('portfolio-scroll-container')
                  if (container) container.scrollBy({ left: 300, behavior: 'smooth' })
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 border border-gray-200 rounded-full shadow-lg hover:bg-white transition-colors"
                aria-label="다음"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>

              <div
                id="portfolio-scroll-container"
                className="-mx-4 px-4 overflow-x-auto scrollbar-hide"
              >
                <div className="flex gap-4 pb-4 px-6" style={{ width: 'max-content' }}>
                  {portfolioSites.map((site, index) => (
                    <motion.a
                      key={site.id}
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group relative block overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl flex-shrink-0"
                      style={{ width: '280px' }}
                    >
                      {/* 썸네일 */}
                      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                        <iframe
                          src={site.url}
                          className="absolute top-0 left-0 w-[300%] h-[300%] origin-top-left scale-[0.333] pointer-events-none"
                          title={`Portfolio site ${site.id}`}
                          loading="lazy"
                        />
                        {/* 탭 오버레이 */}
                        <div className="absolute inset-0 bg-gray-950/0 active:bg-gray-950/50 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 active:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-white font-medium bg-primary-500 px-4 py-2 rounded-full">
                            <ExternalLink className="w-4 h-4" />
                            <span>사이트 방문</span>
                          </div>
                        </div>
                      </div>

                      {/* URL 표시 */}
                      <div className="p-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                          <span className="truncate">{site.url.replace('https://', '').replace('/', '')}</span>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* 태블릿/데스크탑 그리드 */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {portfolioSites.map((site, index) => (
                <motion.a
                  key={site.id}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative block overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl"
                >
                  {/* 썸네일 - 반응형 최적화 */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                    <iframe
                      src={site.url}
                      className="absolute top-0 left-0 w-[250%] h-[250%] lg:w-[300%] lg:h-[300%] origin-top-left scale-[0.4] lg:scale-[0.333] pointer-events-none"
                      title={`Portfolio site ${site.id}`}
                      loading="lazy"
                    />
                    {/* 호버 오버레이 */}
                    <div className="absolute inset-0 bg-gray-950/0 group-hover:bg-gray-950/70 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-white font-medium bg-primary-500 px-4 py-2 rounded-full">
                        <ExternalLink className="w-4 h-4" />
                        <span>사이트 방문</span>
                      </div>
                    </div>
                  </div>

                  {/* URL 표시 */}
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-primary-500 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="truncate">{site.url.replace('https://', '').replace('/', '')}</span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 lg:py-28 px-4 overflow-hidden bg-gray-950">
          <AuroraBackground color="blue" intensity="medium" />
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-6 text-white break-keep"
              >
                다음 성공 사례의 주인공이 되세요
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-xl mb-10 text-gray-300 break-keep"
              >
                지금 바로 폴라애드와 함께 시작하세요
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button size="lg" variant="primary" href="/contact">
                  무료 상담 신청
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" href="/service" className="border-white/20 text-white hover:bg-white/10">
                  서비스 보기
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
