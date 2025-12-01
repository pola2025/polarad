'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
    Printer,
    Globe,
    BarChart3,
    CreditCard,
    FileText,
    BadgeCheck,
    Monitor,
    Target,
    Zap
} from 'lucide-react'

// 카운팅 애니메이션 컴포넌트
function CountUp({ end, prefix = '', suffix = '', duration = 2 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    useEffect(() => {
        if (!isInView) return

        let startTime: number
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(easeOut * end))

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }
        requestAnimationFrame(animate)
    }, [isInView, end, duration])

    return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

export default function ServiceOverviewSection() {
    return (
        <section className="py-20 lg:py-28 bg-gray-50 overflow-hidden">
            <div className="container">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-4"
                    >
                        원스톱 영업 인프라 구축
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 break-keep leading-tight"
                    >
                        오프라인부터 온라인까지,<br />
                        <span className="text-primary-600">영업에 필요한 모든 것</span>을 한 번에
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 text-base sm:text-lg break-keep leading-relaxed"
                    >
                        따로따로 맡기면 시간과 비용이 낭비됩니다.<br />
                        폴라애드가 영업 인프라를 통합 구축해드립니다.
                    </motion.p>
                </div>

                {/* Two Column Cards */}
                <div className="grid lg:grid-cols-2 gap-8">

                    {/* Card 1: 오프라인 영업 최적화 */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-8 shadow-sm hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center gap-3 mb-5 sm:mb-6">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                <Printer className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">오프라인 영업 최적화</h3>
                                <p className="text-xs sm:text-sm text-gray-500">인쇄물 일원화 제작</p>
                            </div>
                        </div>

                        <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 break-keep">
                            영업 현장에서 필요한 인쇄물을 통일된 디자인으로 한 번에 제작합니다.
                            브랜드 일관성을 유지하면서 발주 관리까지 간소화됩니다.
                        </p>

                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-lg bg-gray-50">
                                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
                                <span className="text-sm font-medium text-gray-700">명함</span>
                            </div>
                            <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-lg bg-gray-50">
                                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
                                <span className="text-sm font-medium text-gray-700">대봉투</span>
                            </div>
                            <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-lg bg-gray-50">
                                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
                                <span className="text-sm font-medium text-gray-700">계약서</span>
                            </div>
                            <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-lg bg-gray-50">
                                <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
                                <span className="text-sm font-medium text-gray-700">명찰</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2: 온라인 영업 최적화 */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-8 shadow-sm hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center gap-3 mb-5 sm:mb-6">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">온라인 영업 최적화</h3>
                                <p className="text-xs sm:text-sm text-gray-500">디지털 마케팅 통합 운영</p>
                            </div>
                        </div>

                        <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 break-keep">
                            홈페이지부터 광고, 고객 접수까지 온라인 영업에 필요한 시스템을
                            한 번에 구축하여 24시간 자동으로 잠재고객을 발굴합니다.
                        </p>

                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-gray-50">
                                <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 shrink-0" />
                                <div className="flex flex-wrap items-center gap-x-2">
                                    <span className="text-sm font-medium text-gray-700">홈페이지 제작</span>
                                    <span className="text-xs text-gray-500">랜딩페이지 + 회사소개</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-gray-50">
                                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 shrink-0" />
                                <div className="flex flex-wrap items-center gap-x-2">
                                    <span className="text-sm font-medium text-gray-700">Meta 광고 설정</span>
                                    <span className="text-xs text-gray-500">Facebook/Instagram 타겟 광고</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-gray-50">
                                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 shrink-0" />
                                <div className="flex flex-wrap items-center gap-x-2">
                                    <span className="text-sm font-medium text-gray-700">접수 자동화</span>
                                    <span className="text-xs text-gray-500">리드 수집 + 알림 연동</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Reporting System Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-12"
                >
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">실시간 마케팅 리포팅</h3>
                            <p className="text-sm text-gray-500">전용 대시보드로 광고 성과를 한눈에</p>
                        </div>
                    </div>

                    {/* Dashboard Mockup */}
                    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                        {/* Dashboard Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <span className="text-gray-400 text-sm font-mono">Meta Ads Dashboard</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="px-2 py-1 bg-gray-800 rounded">2025.11.24 - 2025.11.30</span>
                            </div>
                        </div>

                        {/* Dashboard Content */}
                        <div className="p-4 sm:p-6">
                            {/* KPI Cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                                <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700/50">
                                    <div className="text-gray-400 text-[10px] sm:text-xs mb-1">총 지출</div>
                                    <div className="text-sm sm:text-lg lg:text-2xl font-bold text-white">
                                        <CountUp end={2847000} prefix="₩" duration={1.8} />
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-emerald-400 mt-1">예산 대비 94.9%</div>
                                </div>
                                <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700/50">
                                    <div className="text-gray-400 text-[10px] sm:text-xs mb-1">DB 수집</div>
                                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                                        <CountUp end={127} suffix="건" duration={1.5} />
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-emerald-400 mt-1">+23% vs 지난주</div>
                                </div>
                                <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700/50">
                                    <div className="text-gray-400 text-[10px] sm:text-xs mb-1">DB당 단가</div>
                                    <div className="text-sm sm:text-lg lg:text-2xl font-bold text-white">
                                        <CountUp end={22417} prefix="₩" duration={1.6} />
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-emerald-400 mt-1">목표 달성</div>
                                </div>
                                <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700/50">
                                    <div className="text-gray-400 text-[10px] sm:text-xs mb-1">노출수</div>
                                    <div className="text-sm sm:text-lg lg:text-2xl font-bold text-white">
                                        <CountUp end={284521} duration={1.8} />
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-gray-400 mt-1">도달 156,892</div>
                                </div>
                            </div>

                            {/* Chart Area */}
                            <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/50">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-gray-300">일별 DB 수집 추이</span>
                                    <div className="flex gap-4 text-xs">
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                                            <span className="text-gray-400">DB 수집</span>
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                            <span className="text-gray-400">지출</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Bar Chart Mockup */}
                                <div className="h-40 flex items-end justify-between gap-2">
                                    {[
                                        { day: '월', db: 65, spend: 70 },
                                        { day: '화', db: 80, spend: 75 },
                                        { day: '수', db: 45, spend: 50 },
                                        { day: '목', db: 90, spend: 85 },
                                        { day: '금', db: 70, spend: 80 },
                                        { day: '토', db: 55, spend: 45 },
                                        { day: '일', db: 40, spend: 35 },
                                    ].map((item, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                            <div className="w-full flex gap-1 items-end justify-center h-32">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    whileInView={{ height: `${item.db}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                                                    className="w-3 bg-primary-500 rounded-t"
                                                />
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    whileInView={{ height: `${item.spend}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.8, delay: 0.7 + i * 0.1 }}
                                                    className="w-3 bg-emerald-500/60 rounded-t"
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500">{item.day}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Note */}
                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500">* 실제 대시보드 예시 화면입니다.<br className="sm:hidden" /> 고객사별 전용 대시보드가 제공됩니다.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
