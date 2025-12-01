'use client'

import { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Clock, ArrowRight, CheckCircle2, Gift, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function UrgencyCTASection() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    useEffect(() => {
        // Set deadline to December 31, 2025 23:59:59
        const deadline = new Date('2025-12-31T23:59:59')

        const timer = setInterval(() => {
            const now = new Date()
            const difference = deadline.getTime() - now.getTime()

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                })
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <section className="py-20 lg:py-32 bg-primary-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <div className="container relative z-10">
                {/* Timer Card */}
                <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-red-100 text-red-600 font-bold mb-8 animate-pulse">
                        <Clock className="w-5 h-5 shrink-0" />
                        <span className="text-sm sm:text-base">마감 임박: 12월 프로모션 종료까지</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-12 leading-tight break-keep">
                        지금 시작하지 않으면,<br />
                        <span className="text-primary-600">경쟁사에게 DB를 뺏깁니다.</span>
                    </h2>

                    <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto mb-12">
                        {[
                            { label: '일', value: timeLeft.days },
                            { label: '시간', value: timeLeft.hours },
                            { label: '분', value: timeLeft.minutes },
                            { label: '초', value: timeLeft.seconds }
                        ].map((item, i) => (
                            <div key={i} className="bg-gray-900 rounded-xl sm:rounded-2xl p-2 sm:p-4">
                                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-mono mb-1">
                                    {String(item.value).padStart(2, '0')}
                                </div>
                                <div className="text-[10px] sm:text-xs text-gray-400">{item.label}</div>
                            </div>
                        ))}
                    </div>

                    <Button variant="primary" size="xl" className="w-full sm:w-auto shadow-xl shadow-primary-500/30 text-sm sm:text-base" href="/contact">
                        <span className="break-keep">선착순 혜택 받고 무료 상담 신청하기</span>
                        <ArrowRight className="w-5 h-5 ml-2 shrink-0" />
                    </Button>
                </div>

                {/* Benefit Summary - Golden Aurora Effect */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
                    {/* Golden Aurora Animation */}
                    <motion.div
                        className="absolute inset-0 opacity-30 pointer-events-none"
                        animate={{
                            background: [
                                "radial-gradient(circle at 0% 0%, rgba(234, 179, 8, 0.2) 0%, transparent 50%)",
                                "radial-gradient(circle at 100% 100%, rgba(234, 179, 8, 0.2) 0%, transparent 50%)",
                                "radial-gradient(circle at 0% 0%, rgba(234, 179, 8, 0.2) 0%, transparent 50%)"
                            ]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-amber-500/5 to-yellow-500/5 opacity-50"></div>

                    {/* Golden Border Glow */}
                    <div className="absolute inset-0 border border-yellow-500/30 rounded-3xl box-border"></div>

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 shrink-0">
                            <Gift className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white break-keep">선착순 10개사 한정 혜택</h3>
                    </div>

                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 relative z-10">
                        <li className="flex flex-col gap-1.5 sm:gap-2 bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500 flex-shrink-0" />
                                <span className="text-white font-medium text-sm sm:text-base break-keep">홈페이지 1년 유지보수</span>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-400 pl-6 sm:pl-7 break-keep">간단 수정 지원 (페이지 제작 제외)</span>
                        </li>
                        <li className="flex flex-col gap-1.5 sm:gap-2 bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500 flex-shrink-0" />
                                <span className="text-white font-medium text-sm sm:text-base break-keep">커스텀 디자인 지원</span>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-400 pl-6 sm:pl-7 break-keep">기본 2회 + 추가 3회 (총 5회)</span>
                        </li>
                        <li className="flex flex-col gap-1.5 sm:gap-2 bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500 flex-shrink-0" />
                                <span className="text-white font-medium text-sm sm:text-base break-keep">인쇄물 디자인+제작</span>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-400 pl-6 sm:pl-7 break-keep">명함, 대봉투, 계약서 풀패키지</span>
                        </li>
                        <li className="flex flex-col gap-1.5 sm:gap-2 bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500 flex-shrink-0" />
                                <span className="text-white font-medium text-sm sm:text-base break-keep">도메인/호스팅 포함</span>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-400 pl-6 sm:pl-7 break-keep">월 서버비 5만원 초과 시 별도</span>
                        </li>
                        <li className="flex flex-col gap-1.5 sm:gap-2 bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500 flex-shrink-0" />
                                <span className="text-white font-medium text-sm sm:text-base break-keep">Meta 광고 자동화 <span className="text-yellow-500">2년</span></span>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-400 pl-6 sm:pl-7 break-keep">10명 한정 (그 외 1년 제공)</span>
                        </li>
                        <li className="flex flex-col gap-1.5 sm:gap-2 bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500 flex-shrink-0" />
                                <span className="text-white font-medium text-sm sm:text-base break-keep">프리미엄 광고 관리</span>
                            </div>
                            <ul className="text-xs sm:text-sm text-gray-400 list-disc list-inside pl-6 sm:pl-7 space-y-0.5">
                                <li className="break-keep">주간/월간 리포트 & 설정 지원</li>
                                <li className="break-keep">실시간 알림 & 문자 자동 발송</li>
                            </ul>
                        </li>
                    </ul>

                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 relative z-10">
                        <div className="flex items-start gap-2 text-[11px] sm:text-xs text-gray-500 mb-1">
                            <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="break-keep">광고비는 광고주 직접 결제이며, 광고 소재는 직접 제작하여 전달해주셔야 합니다.</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
