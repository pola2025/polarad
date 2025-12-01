'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Printer, Globe, Target, Check, ChevronLeft, ChevronRight } from 'lucide-react'

const packages = [
    {
        icon: Printer,
        title: '신뢰의 첫인상, 인쇄물',
        color: 'amber',
        items: [
            '명함 200매',
            '대봉투 500매',
            '계약서 500매',
            '명찰'
        ]
    },
    {
        icon: Globe,
        title: '24시간 영업사원, 홈페이지',
        color: 'blue',
        items: [
            '10페이지 이내',
            '반응형 디자인',
            '도메인 1년 무료',
            '호스팅 1년 무료'
        ]
    },
    {
        icon: Target,
        title: '실시간 잠재고객 발굴, 광고지원',
        color: 'emerald',
        items: [
            'Meta 광고 연동',
            '자동화 설정',
            '실시간 알림',
            '리포팅 대시보드'
        ]
    }
]

const colorClasses = {
    amber: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: 'text-amber-600',
        check: 'text-amber-600',
        iconBg: 'bg-amber-100'
    },
    blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        check: 'text-blue-600',
        iconBg: 'bg-blue-100'
    },
    emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: 'text-emerald-600',
        check: 'text-emerald-600',
        iconBg: 'bg-emerald-100'
    }
}

export default function ServicePackageSection() {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    return (
        <section id="details" className="py-20 lg:py-28 bg-white relative overflow-hidden">

            <div className="container relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 break-keep">
                        패키지에 포함된 <span className="text-primary-600">모든 것</span>
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto break-keep">
                        영업에 필요한 오프라인과 온라인 인프라를 한 번에 구축합니다
                    </p>
                </motion.div>

                {/* Mobile: Horizontal Scroll */}
                <div className="md:hidden relative">
                    {/* Scroll Buttons */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 shadow-md transition-colors"
                        aria-label="이전"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 shadow-md transition-colors"
                        aria-label="다음"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Scrollable Container */}
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 -mx-4 py-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                    >
                        {packages.map((pkg, index) => {
                            const Icon = pkg.icon
                            const colors = colorClasses[pkg.color as keyof typeof colorClasses]

                            return (
                                <motion.div
                                    key={pkg.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`bg-white border ${colors.border} rounded-2xl p-6 shadow-sm flex-shrink-0 w-[280px] snap-center transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                                >
                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`w-10 h-10 rounded-xl ${colors.iconBg} border ${colors.border} flex items-center justify-center shrink-0`}>
                                            <Icon className={`w-5 h-5 ${colors.icon}`} />
                                        </div>
                                        <h3 className="text-[13px] font-bold text-gray-900 whitespace-nowrap">{pkg.title}</h3>
                                    </div>

                                    {/* Items */}
                                    <ul className="space-y-3">
                                        {pkg.items.map((item) => (
                                            <li key={item} className="flex items-center gap-3 text-gray-700">
                                                <Check className={`w-5 h-5 ${colors.check} shrink-0`} />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Scroll Indicator */}
                    <div className="flex justify-center gap-2 mt-4">
                        <span className="text-xs text-gray-400">← 좌우로 스와이프 →</span>
                    </div>
                </div>

                {/* Desktop: Grid */}
                <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
                    {packages.map((pkg, index) => {
                        const Icon = pkg.icon
                        const colors = colorClasses[pkg.color as keyof typeof colorClasses]

                        return (
                            <motion.div
                                key={pkg.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-white border ${colors.border} rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-shadow`}
                            >
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-12 h-12 rounded-xl ${colors.iconBg} border ${colors.border} flex items-center justify-center shrink-0`}>
                                        <Icon className={`w-6 h-6 ${colors.icon}`} />
                                    </div>
                                    <h3 className="text-sm lg:text-base font-bold text-gray-900 whitespace-nowrap">{pkg.title}</h3>
                                </div>

                                {/* Items */}
                                <ul className="space-y-3">
                                    {pkg.items.map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-gray-700">
                                            <Check className={`w-5 h-5 ${colors.check} shrink-0`} />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
