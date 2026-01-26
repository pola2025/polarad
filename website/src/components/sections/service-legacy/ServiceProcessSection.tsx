'use client'

import { motion } from 'framer-motion'
import {
    MessageSquare, FileCheck, CreditCard, Rocket,
    Settings, CheckCircle, ArrowRight
} from 'lucide-react'
import { AuroraBackground } from '@/components/ui/AuroraBackground'

const steps = [
    {
        step: 1,
        icon: MessageSquare,
        title: '상담 신청',
        description: '문의 폼 또는 전화로 상담 신청',
        duration: '즉시',
        color: 'primary'
    },
    {
        step: 2,
        icon: FileCheck,
        title: '기획 확정',
        description: '요구사항 정리 및 기획서 확정',
        duration: '3~5일',
        color: 'blue'
    },
    {
        step: 3,
        icon: CreditCard,
        title: '계약 & 결제',
        description: '계약서 작성 및 결제 진행',
        duration: '1일',
        color: 'emerald'
    },
    {
        step: 4,
        icon: Settings,
        title: '제작 진행',
        description: '인쇄물·홈페이지·광고 동시 제작',
        duration: '15~25일',
        color: 'amber'
    },
    {
        step: 5,
        icon: CheckCircle,
        title: '검수 & 수정',
        description: '고객 검수 후 피드백 반영',
        duration: '7일',
        color: 'purple'
    },
    {
        step: 6,
        icon: Rocket,
        title: '오픈 & 런칭',
        description: '모든 서비스 오픈 및 인수인계',
        duration: '완료',
        color: 'rose'
    }
]

export default function ServiceProcessSection() {
    return (
        <section className="py-20 lg:py-28 bg-gray-900 overflow-hidden relative">
            {/* Aurora Background Effect */}
            <AuroraBackground color="cyan" intensity="low" />

            <div className="container relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 break-keep">
                        진행 프로세스
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto break-keep">
                        상담부터 오픈까지,<br className="sm:hidden" />
                        체계적인 프로세스로 진행됩니다
                    </p>
                </motion.div>

                {/* Desktop Process Flow - 3x2 카드 형태 */}
                <div className="hidden lg:grid grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        const colorClasses = {
                            primary: 'bg-primary-500/10 border-primary-500/30 text-primary-400',
                            blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
                            emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
                            amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
                            purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
                            rose: 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        }
                        const iconColors = {
                            primary: 'bg-primary-500/20 text-primary-400',
                            blue: 'bg-blue-500/20 text-blue-400',
                            emerald: 'bg-emerald-500/20 text-emerald-400',
                            amber: 'bg-amber-500/20 text-amber-400',
                            purple: 'bg-purple-500/20 text-purple-400',
                            rose: 'bg-rose-500/20 text-rose-400'
                        }
                        const colors = colorClasses[step.color as keyof typeof colorClasses]
                        const iconColor = iconColors[step.color as keyof typeof iconColors]

                        return (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative rounded-2xl border p-6 ${colors} backdrop-blur-sm overflow-hidden`}
                            >
                                {/* 배경 번호 - 큰 반투명 숫자 */}
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[120px] font-bold text-white/[0.04] leading-none pointer-events-none select-none">
                                    {step.step}
                                </div>

                                {/* Header */}
                                <div className="relative z-10 flex items-center gap-4 mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${iconColor} flex items-center justify-center`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{step.title}</h3>
                                        <span className="text-xs text-gray-400">{step.duration}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="relative z-10 text-sm text-gray-300 break-keep">{step.description}</p>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Mobile Process Flow */}
                <div className="lg:hidden max-w-md mx-auto">
                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-blue-500 to-emerald-500 opacity-30" />

                        {/* Steps */}
                        <div className="space-y-6">
                            {steps.map((step, index) => {
                                const Icon = step.icon
                                const colorClasses = {
                                    primary: 'bg-primary-500/20 text-primary-400 border-primary-500/40',
                                    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
                                    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
                                    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
                                    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
                                    rose: 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                }
                                const colors = colorClasses[step.color as keyof typeof colorClasses]

                                return (
                                    <motion.div
                                        key={step.step}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative flex gap-4"
                                    >
                                        {/* Icon */}
                                        <div className="relative z-10 shrink-0">
                                            <div className={`w-12 h-12 rounded-full ${colors} border flex items-center justify-center`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="pt-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-gray-500">STEP {step.step}</span>
                                                <span className="px-2 py-0.5 rounded-full bg-gray-800 text-xs text-gray-300">
                                                    {step.duration}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-white mb-1">{step.title}</h3>
                                            <p className="text-sm text-gray-400 break-keep">{step.description}</p>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Total Duration */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center space-y-2"
                >
                    <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 rounded-full bg-primary-500/10 border border-primary-500/30">
                        <span className="text-gray-300 text-xs sm:text-sm lg:text-base whitespace-nowrap">총 예상 소요기간</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 shrink-0" />
                        <span className="text-sm sm:text-base lg:text-lg font-bold text-primary-400 whitespace-nowrap">30일 이내 완료 목표</span>
                    </div>
                    <p className="text-xs sm:text-sm text-white">* 클라이언트 피드백에 따라 기간은 연장될 수 있습니다.</p>
                </motion.div>
            </div>
        </section>
    )
}
