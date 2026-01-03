'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Target, Building2, GraduationCap, Hammer } from 'lucide-react'

const caseStudies = [
    {
        icon: Building2,
        industry: '경영컨설팅',
        plan: 'Pro',
        planPrice: '110만',
        color: 'emerald',
        metrics: {
            adBudget: '약 320만원/월',
            leads: '150건/월',
            conversion: '16건 계약',
            conversionRate: '10.7%',
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
        plan: 'Premium',
        planPrice: '220만',
        color: 'blue',
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
        badge: 'bg-emerald-900/50 text-emerald-400 border-emerald-700',
        highlight: 'text-emerald-400',
    },
    amber: {
        bg: 'bg-amber-950/30',
        border: 'border-amber-800/50',
        icon: 'text-amber-400',
        iconBg: 'bg-amber-900/50',
        badge: 'bg-amber-900/50 text-amber-400 border-amber-700',
        highlight: 'text-amber-400',
    },
    blue: {
        bg: 'bg-blue-950/30',
        border: 'border-blue-800/50',
        icon: 'text-blue-400',
        iconBg: 'bg-blue-900/50',
        badge: 'bg-blue-900/50 text-blue-400 border-blue-700',
        highlight: 'text-blue-400',
    },
}

export default function ServiceCaseStudySection() {
    return (
        <section className="py-20 lg:py-28 bg-gray-900">
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
                        POLARAD 고객사의 실제 광고 운영 결과입니다
                    </p>
                </motion.div>

                {/* Case Study Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {caseStudies.map((caseStudy, index) => {
                        const Icon = caseStudy.icon
                        const colors = colorClasses[caseStudy.color as keyof typeof colorClasses]

                        return (
                            <motion.div
                                key={caseStudy.industry}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`rounded-2xl border ${colors.border} ${colors.bg} p-6 lg:p-8`}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
                                            <Icon className={`w-6 h-6 ${colors.icon}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{caseStudy.industry}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded border ${colors.badge}`}>
                                                {caseStudy.plan} ({caseStudy.planPrice})
                                            </span>
                                        </div>
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
                                        <span className={`font-bold ${colors.highlight}`}>{caseStudy.metrics.conversionRate}</span>
                                    </div>
                                </div>

                                {/* Highlight */}
                                <div className={`mt-6 pt-4 border-t border-gray-800 flex items-center gap-2 ${colors.highlight}`}>
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-sm font-medium">{caseStudy.highlight}</span>
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
                    <p className="text-gray-500 text-sm">
                        * DB 생성 성과는 광고 소재 퀄리티와 광고비에 따라 달라질 수 있습니다.<br />
                        POLARAD는 DB 판매 서비스가 아닌, 자체 DB 생성 시스템 구축 서비스입니다.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
