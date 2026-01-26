'use client'

import { Button } from '../ui/Button'
import { ArrowRight, CheckCircle2, MessageCircle, Bell, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function UrgencyCTASection() {
    return (
        <section className="py-20 lg:py-32 bg-primary-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <div className="container relative z-10">
                {/* Main CTA Card */}
                <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary-100 text-primary-600 font-bold mb-8">
                        <span className="text-sm sm:text-base">소상공인 맞춤형 리드 수집 솔루션</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight break-keep">
                        스팸 없이, 진성 고객만<br />
                        <span className="text-primary-600">자동으로 수집하세요</span>
                    </h2>

                    <div className="max-w-2xl mx-auto mb-10">
                        <p className="text-gray-600 text-lg break-keep">
                            카카오 로그인으로 인증된 고객만 접수받고,<br className="hidden sm:block" />
                            텔레그램으로 실시간 알림을 받으세요.
                        </p>
                    </div>

                    {/* Price Display */}
                    <div className="bg-gray-50 rounded-2xl p-6 mb-10 max-w-md mx-auto">
                        <div className="text-sm text-gray-500 mb-2">DB 접수 랜딩 서비스</div>
                        <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                            월 3<span className="text-2xl">만원</span>
                        </div>
                        <div className="text-sm text-gray-500">VAT별도 / 1년결제 36만원</div>
                    </div>

                    <Button variant="primary" size="xl" className="w-full sm:w-auto shadow-xl shadow-primary-500/30 text-sm sm:text-base" href="/contact">
                        <span className="break-keep">무료 상담 신청하기</span>
                        <ArrowRight className="w-5 h-5 ml-2 shrink-0" />
                    </Button>
                </div>

                {/* Feature Summary */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                    {/* Primary Aurora Animation */}
                    <motion.div
                        className="absolute inset-0 opacity-30 pointer-events-none"
                        animate={{
                            background: [
                                "radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)",
                                "radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)",
                                "radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)"
                            ]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-blue-500/5 to-primary-500/5 opacity-50"></div>

                    {/* Border Glow */}
                    <div className="absolute inset-0 border border-primary-500/30 rounded-3xl box-border"></div>

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white break-keep">올인원 패키지에 모두 포함</h3>
                    </div>

                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 relative z-10">
                        <li className="flex flex-col gap-1.5 sm:gap-2 bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-2">
                                <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500 flex-shrink-0" />
                                <span className="text-white font-medium text-sm sm:text-base break-keep">카카오 로그인</span>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-400 pl-6 sm:pl-7 break-keep">스팸 차단, 본인 인증된 연락처</span>
                        </li>
                        <li className="flex flex-col gap-1.5 sm:gap-2 bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 sm:w-5 h-4 sm:h-5 text-primary-400 flex-shrink-0" />
                                <span className="text-white font-medium text-sm sm:text-base break-keep">텔레그램 알림</span>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-400 pl-6 sm:pl-7 break-keep">접수 즉시 실시간 알림 발송</span>
                        </li>
                        <li className="flex flex-col gap-1.5 sm:gap-2 bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0" />
                                <span className="text-white font-medium text-sm sm:text-base break-keep">대시보드</span>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-400 pl-6 sm:pl-7 break-keep">접수 목록 관리 + 통계 분석</span>
                        </li>
                    </ul>

                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 relative z-10">
                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-gray-400">
                            <span>✓ 5~7일 내 제작 완료</span>
                            <span>✓ 1년 운영 포함</span>
                            <span>✓ 수정 건당 3만원</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
