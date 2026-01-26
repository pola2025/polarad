'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Crown, Gem, Building2, GraduationCap, Hammer } from 'lucide-react'

const caseStudies = [
    {
        icon: Building2,
        industry: '경영컨설팅',
        plan: 'Premium',
        planPrice: '220만',
        color: 'amber',
        metrics: {
            adBudget: '약 320만원/월',
            leads: '150건/월',
            conversion: '15건 계약',
            conversionRate: '10%',
            costPerLead: '약 2.1만원',
        },
        highlight: '높은 계약 전환율',
    },
    {
        icon: Hammer,
        industry: '인테리어/리모델링',
        plan: 'Premium',
        planPrice: '220만',
        color: 'amber',
        metrics: {
            adBudget: '약 320만원/월',
            leads: '239건/월',
            conversion: '9-10건 계약',
            conversionRate: '4%',
            costPerLead: '약 1.3만원',
        },
        highlight: '대량 DB 확보',
    },
    {
        icon: GraduationCap,
        industry: '직업기술교육',
        plan: 'Pro',
        planPrice: '110만',
        color: 'emerald',
        metrics: {
            adBudget: '약 200만원/월',
            leads: '100건/월',
            conversion: '10명 수강등록',
            conversionRate: '10%',
            costPerLead: '약 2만원',
        },
        highlight: '안정적 수강 전환',
    },
]

const colorClasses = {
    emerald: {
        bg: 'bg-emerald-950/30',
        border: 'border-emerald-800/50',
        icon: 'text-emerald-400',
        iconBg: 'bg-emerald-900/50',
        headerBg: 'bg-gradient-to-r from-emerald-600 to-emerald-500',
        highlight: 'text-emerald-400',
        planIcon: Gem,
    },
    amber: {
        bg: 'bg-amber-950/30',
        border: 'border-amber-800/50',
        icon: 'text-amber-400',
        iconBg: 'bg-amber-900/50',
        headerBg: 'bg-gradient-to-r from-amber-600 to-amber-500',
        highlight: 'text-amber-400',
        planIcon: Crown,
    },
}

export default function ServiceCaseStudySection() {
    return (
        <section id="case-study" className="py-20 lg:py-28 bg-gray-900 scroll-mt-20">
            <div className="container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 break-keep">
                        실제 <span className="text-primary-400">성과 데이터</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto break-keep">
                        폴라애드 고객사의<br className="sm:hidden" />
                        실제 광고 운영 결과입니다
                    </p>
                </motion.div>

                {/* Case Study Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {caseStudies.map((caseStudy, index) => {
                        const Icon = caseStudy.icon
                        const colors = colorClasses[caseStudy.color as keyof typeof colorClasses]
                        const PlanIcon = colors.planIcon

                        return (
                            <motion.div
                                key={caseStudy.industry}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`rounded-2xl border ${colors.border} overflow-hidden`}
                            >
                                {/* 상품 티어 헤더 - 한 줄 배치 */}
                                <div className={`${colors.headerBg} px-4 sm:px-6 py-3`}>
                                    <div className="flex items-center justify-between whitespace-nowrap">
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <PlanIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
                                            <span className="text-white font-bold text-sm sm:text-lg">{caseStudy.plan}</span>
                                            <span className="text-white/70 text-[11px] sm:text-sm">이용 고객 사례</span>
                                        </div>
                                        <span className="text-white/90 text-[11px] sm:text-sm font-medium bg-white/20 px-2 py-0.5 sm:py-1 rounded-full">
                                            {caseStudy.planPrice}
                                        </span>
                                    </div>
                                </div>

                                {/* 카드 본문 */}
                                <div className={`${colors.bg} p-6 lg:p-8`}>
                                    {/* 업종 정보 */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
                                            <Icon className={`w-6 h-6 ${colors.icon}`} />
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500">업종</span>
                                            <h3 className="text-lg font-bold text-white">{caseStudy.industry}</h3>
                                        </div>
                                    </div>

                                    {/* Metrics */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                            <span className="text-gray-500 text-sm">월 광고비</span>
                                            <span className="text-white font-medium">{caseStudy.metrics.adBudget}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                            <span className="text-gray-500 text-sm">월 DB 수집</span>
                                            <span className="text-white font-medium">{caseStudy.metrics.leads}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                            <span className="text-gray-500 text-sm">DB 단가</span>
                                            <span className="text-white font-medium">{caseStudy.metrics.costPerLead}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                            <span className="text-gray-500 text-sm">전환</span>
                                            <span className="text-white font-medium">{caseStudy.metrics.conversion}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-500 text-sm">전환율</span>
                                            <span className={`font-bold text-lg ${colors.highlight}`}>{caseStudy.metrics.conversionRate}</span>
                                        </div>
                                    </div>

                                    {/* Highlight */}
                                    <div className={`mt-6 pt-4 border-t border-gray-800 flex items-center gap-2 ${colors.highlight}`}>
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-sm font-medium">{caseStudy.highlight}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Notice */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-10 text-center"
                >
                    <p className="text-gray-500 text-sm leading-relaxed">
                        * DB 생성 성과는 광고 소재 퀄리티와<br className="sm:hidden" />
                        광고비에 따라 달라질 수 있습니다.
                    </p>
                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                        폴라애드는 DB 판매 서비스가 아닌,<br className="sm:hidden" />
                        자체 DB 생성 시스템 구축 서비스입니다.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
