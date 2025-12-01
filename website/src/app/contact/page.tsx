'use client'

import { motion } from 'framer-motion'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { EstimatorCalculator } from '@/components/sections/EstimatorCalculator'
import { ContactFormSection } from '@/components/sections/ContactFormSection'
import { ContactInfoSection } from '@/components/sections/ContactInfoSection'
import { BusinessHoursSection } from '@/components/sections/BusinessHoursSection'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { MessageSquare, Clock, CheckCircle2, Phone, Mail, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: '홈', url: 'https://polarad.co.kr' },
          { name: '상담신청', url: 'https://polarad.co.kr/contact' }
        ]}
      />

      <main className="min-h-screen bg-gray-950 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[auto] lg:min-h-[calc(100vh-7rem)] pt-28 pb-12 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-950 text-white -mt-24 md:-mt-28">
          {/* Aurora Background Effect */}
          <AuroraBackground color="mixed" intensity="medium" />

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>

          <div className="container relative z-10 px-4">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-24">
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-white/5 border border-white/10 text-accent-400 text-xs lg:text-sm font-semibold mb-4 lg:mb-6 backdrop-blur-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span>무료 상담 신청</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl sm:text-3xl lg:text-6xl font-bold text-white mb-4 lg:mb-6 leading-tight tracking-tight break-keep"
                >
                  궁금한 점이 있으신가요?<br />
                  <span className="text-primary-400">편하게 문의</span>하세요
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-sm lg:text-xl text-gray-300 mb-5 lg:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 break-keep"
                >
                  견적 계산부터 상담 신청까지 한 번에.<br className="hidden md:block" />
                  <span className="text-white font-semibold">1영업일 내</span> 담당자가 직접 연락드립니다.
                </motion.p>

                {/* 특징 리스트 - 모바일에서 숨김 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="hidden sm:flex justify-center lg:justify-start mb-6 lg:mb-8"
                >
                  <div className="flex flex-row gap-4 lg:gap-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 text-green-400 flex-shrink-0" />
                      <span className="text-xs lg:text-sm">상담 무료</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 text-green-400 flex-shrink-0" />
                      <span className="text-xs lg:text-sm">1영업일 응답</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 text-green-400 flex-shrink-0" />
                      <span className="text-xs lg:text-sm">1:1 맞춤</span>
                    </div>
                  </div>
                </motion.div>

                {/* 통계 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="grid grid-cols-3 gap-3 lg:gap-8 mb-6 lg:mb-10 max-w-xs lg:max-w-md mx-auto lg:mx-0"
                >
                  <div className="text-center lg:text-left">
                    <div className="text-xl lg:text-3xl font-bold text-primary-400">98%</div>
                    <div className="text-[10px] lg:text-sm text-gray-400">응답률</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-xl lg:text-3xl font-bold text-primary-400">4시간</div>
                    <div className="text-[10px] lg:text-sm text-gray-400">평균 응답</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-xl lg:text-3xl font-bold text-primary-400">500+</div>
                    <div className="text-[10px] lg:text-sm text-gray-400">상담 완료</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start"
                >
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-xl shadow-primary-900/20 border border-primary-500/50 whitespace-nowrap text-sm lg:text-base" href="#contact-form">
                    지금 상담 신청하기
                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 ml-2" />
                  </Button>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 text-sm lg:text-base" href="/service">
                    서비스 먼저 보기
                  </Button>
                </motion.div>
              </div>

              {/* Right Visual - 상담 안내 카드 (모바일에서 간소화) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex-1 w-full max-w-[400px] lg:max-w-none"
              >
                <div className="relative bg-gray-900 rounded-xl lg:rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 lg:px-6 py-2.5 lg:py-4 border-b border-white/5 bg-gray-800/50">
                    <div className="flex gap-1.5 lg:gap-2">
                      <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                      <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                      <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <div className="text-[10px] lg:text-xs text-gray-400 font-mono">Contact Guide</div>
                  </div>

                  {/* Content */}
                  <div className="p-4 lg:p-8 space-y-4 lg:space-y-6">
                    {/* 상담 절차 */}
                    <div>
                      <h3 className="text-sm lg:text-lg font-semibold text-white mb-2.5 lg:mb-4 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5 text-primary-400" />
                        상담 절차
                      </h3>
                      <div className="space-y-2 lg:space-y-3">
                        <div className="flex items-center gap-2 lg:gap-3">
                          <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 text-xs lg:text-sm font-bold shrink-0">1</div>
                          <div className="text-gray-300 text-xs lg:text-sm">상담 신청서 작성</div>
                        </div>
                        <div className="flex items-center gap-2 lg:gap-3">
                          <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 text-xs lg:text-sm font-bold shrink-0">2</div>
                          <div className="text-gray-300 text-xs lg:text-sm">담당자 배정 및 연락</div>
                        </div>
                        <div className="flex items-center gap-2 lg:gap-3">
                          <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 text-xs lg:text-sm font-bold shrink-0">3</div>
                          <div className="text-gray-300 text-xs lg:text-sm">맞춤 견적 및 제안서 전달</div>
                        </div>
                      </div>
                    </div>

                    {/* 구분선 */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* 영업시간 - 모바일 간소화 */}
                    <div>
                      <h3 className="text-sm lg:text-lg font-semibold text-white mb-2 lg:mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-amber-400" />
                        영업시간
                      </h3>
                      <div className="space-y-1.5 lg:space-y-2 text-xs lg:text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">평일</span>
                          <span className="text-white">09:00 - 18:00</span>
                        </div>
                        <div className="hidden lg:flex justify-between">
                          <span className="text-gray-400">점심시간</span>
                          <span className="text-white">12:00 - 13:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">주말/공휴일</span>
                          <span className="text-gray-500">휴무</span>
                        </div>
                      </div>
                    </div>

                    {/* 구분선 */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* 연락처 */}
                    <div>
                      <h3 className="text-sm lg:text-lg font-semibold text-white mb-2 lg:mb-4 flex items-center gap-2">
                        <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
                        연락처
                      </h3>
                      <div className="space-y-2 lg:space-y-3">
                        <a href="tel:032-345-9834" className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                          <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                          <span className="text-white text-xs lg:text-sm">032-345-9834</span>
                        </a>
                        <a href="mailto:mkt@polarad.co.kr" className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                          <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                          <span className="text-white text-xs lg:text-sm">mkt@polarad.co.kr</span>
                        </a>
                      </div>
                    </div>

                    {/* 안내 배지 */}
                    <div className="flex flex-wrap gap-2">
                      <div className="inline-flex items-center gap-1 lg:gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] lg:text-xs">
                        <Shield className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                        개인정보 보호
                      </div>
                      <div className="inline-flex items-center gap-1 lg:gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] lg:text-xs">
                        <Zap className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                        빠른 응답
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section id="contact-form" className="py-12 lg:py-20 px-4 bg-gray-100">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8 lg:mb-12"
              >
                <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-4 break-keep">
                  견적 계산 & 상담 신청
                </h2>
                <p className="text-gray-600 text-sm lg:text-lg max-w-2xl mx-auto break-keep">
                  예상 견적을 확인하고 상담을 신청하세요
                </p>
              </motion.div>

              {/* Estimator + Contact Form */}
              <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 mb-8 lg:mb-12">
                <EstimatorCalculator />
                <ContactFormSection />
              </div>

              {/* Additional Info - 2 Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
                <ContactInfoSection />
                <BusinessHoursSection />
              </div>

              {/* FAQ - 간단 버전 */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm">
                <h3 className="text-base lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">자주 묻는 질문</h3>
                <div className="space-y-2 lg:space-y-3">
                  <details className="group">
                    <summary className="flex justify-between items-center gap-2 cursor-pointer text-gray-900 font-medium text-xs lg:text-sm hover:text-primary-600">
                      <span>올인원 패키지에 무엇이 포함되나요?</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform text-xs">▼</span>
                    </summary>
                    <p className="mt-2 text-xs lg:text-sm text-gray-600 pl-0">
                      홈페이지 제작(10페이지), Meta 광고 자동화, 인쇄물 4종, 도메인+호스팅 1년 무료가 포함됩니다.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="flex justify-between items-center gap-2 cursor-pointer text-gray-900 font-medium text-xs lg:text-sm hover:text-primary-600">
                      <span>제작 기간은 얼마나 걸리나요?</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform text-xs">▼</span>
                    </summary>
                    <p className="mt-2 text-xs lg:text-sm text-gray-600 pl-0">
                      기획서 확정 후 홈페이지 30~45일, 인쇄물 7~10일, 광고 설정 5~7일 소요됩니다.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="flex justify-between items-center gap-2 cursor-pointer text-gray-900 font-medium text-xs lg:text-sm hover:text-primary-600">
                      <span>환불이 가능한가요?</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform text-xs">▼</span>
                    </summary>
                    <p className="mt-2 text-xs lg:text-sm text-gray-600 pl-0">
                      제작 시작 전 전액 환불 가능, 제작 후에는 품질 하자 시에만 가능합니다.
                    </p>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
