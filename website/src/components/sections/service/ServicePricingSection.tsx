'use client'

import { motion } from 'framer-motion'
import { Check, X, Star, Zap, Rocket, Crown, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Feature {
    text: string
    included: boolean
    highlight?: boolean
}

interface Tier {
    name: string
    price: string
    description: string
    icon: typeof Star
    color: 'gray' | 'blue' | 'emerald' | 'amber'
    features: Feature[]
    cta: string
    popular: boolean
}

const tiers: Tier[] = [
    {
        name: 'Basic',
        price: '30',
        description: '브랜딩 채널만 필요한 분',
        icon: Star,
        color: 'gray',
        features: [
            { text: '랜딩페이지 1P (4섹션)', included: true },
            { text: '입력폼 연동', included: true },
            { text: '반응형 디자인', included: true },
            { text: '도메인 제공', included: false },
            { text: 'Meta 광고 세팅', included: false },
            { text: 'Meta 자동화', included: false },
        ],
        cta: '상담 신청',
        popular: false,
    },
    {
        name: 'Normal',
        price: '60',
        description: '광고 테스트를 시작하는 분',
        icon: Zap,
        color: 'blue',
        features: [
            { text: '랜딩페이지 1P (4섹션)', included: true },
            { text: '입력폼 연동', included: true },
            { text: '반응형 디자인', included: true },
            { text: '도메인 1년 제공', included: true },
            { text: 'Meta 광고 세팅 1회', included: true },
            { text: 'Meta 자동화', included: false },
        ],
        cta: '상담 신청',
        popular: false,
    },
    {
        name: 'Pro',
        price: '110',
        description: '본격 온라인 진출을 원하는 분',
        icon: Rocket,
        color: 'emerald',
        features: [
            { text: '홈페이지 5P (섹션 무제한)', included: true },
            { text: '입력폼 연동', included: true },
            { text: '반응형 디자인', included: true },
            { text: '도메인 1년 제공', included: true },
            { text: 'Meta 광고 세팅 1회', included: true },
            { text: 'Meta 자동화', included: false },
        ],
        cta: '상담 신청',
        popular: false,
    },
    {
        name: 'Premium',
        price: '220',
        description: '풀 구성이 필요한 분',
        icon: Crown,
        color: 'amber',
        features: [
            { text: '홈페이지 10P (섹션 무제한)', included: true },
            { text: '입력폼 연동', included: true },
            { text: '반응형 디자인', included: true },
            { text: '도메인 1년 제공', included: true },
            { text: 'Meta 광고 세팅 1회', included: true },
            { text: 'Meta 자동화 6개월', included: true, highlight: true },
        ],
        cta: '상담 신청',
        popular: true,
    },
]

const colorClasses = {
    gray: {
        bg: 'bg-gray-800/50',
        border: 'border-gray-700',
        icon: 'text-gray-400',
        iconBg: 'bg-gray-700/50',
        badge: 'bg-gray-700 text-gray-300',
    },
    blue: {
        bg: 'bg-blue-950/30',
        border: 'border-blue-800/50',
        icon: 'text-blue-400',
        iconBg: 'bg-blue-900/50',
        badge: 'bg-blue-900 text-blue-300',
    },
    emerald: {
        bg: 'bg-emerald-950/30',
        border: 'border-emerald-800/50',
        icon: 'text-emerald-400',
        iconBg: 'bg-emerald-900/50',
        badge: 'bg-emerald-900 text-emerald-300',
    },
    amber: {
        bg: 'bg-amber-950/30',
        border: 'border-amber-700/50',
        icon: 'text-amber-400',
        iconBg: 'bg-amber-900/50',
        badge: 'bg-amber-900 text-amber-300',
    },
}

export default function ServicePricingSection() {
    return (
        <section className="py-20 lg:py-28 bg-gray-950">
            <div className="container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 break-keep">
                        비즈니스에 맞는 <span className="text-primary-400">플랜</span>을 선택하세요
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto break-keep">
                        30만원부터 시작하는 온라인 영업 시스템
                    </p>
                </motion.div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tiers.map((tier, index) => {
                        const Icon = tier.icon
                        const colors = colorClasses[tier.color as keyof typeof colorClasses]

                        return (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative rounded-2xl border ${colors.border} ${colors.bg} p-6 flex flex-col ${
                                    tier.popular ? 'ring-2 ring-amber-500/50' : ''
                                }`}
                            >
                                {/* Popular Badge */}
                                {tier.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="bg-amber-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                                            추천
                                        </span>
                                    </div>
                                )}

                                {/* Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
                                        <Icon className={`w-5 h-5 ${colors.icon}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                                        <p className="text-xs text-gray-500">{tier.description}</p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white">{tier.price}</span>
                                        <span className="text-gray-400">만원</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">VAT 포함</p>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-6 flex-1">
                                    {tier.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            {feature.included ? (
                                                <Check className={`w-4 h-4 mt-0.5 shrink-0 ${feature.highlight ? 'text-amber-400' : 'text-emerald-400'}`} />
                                            ) : (
                                                <X className="w-4 h-4 mt-0.5 shrink-0 text-gray-600" />
                                            )}
                                            <span className={`text-sm ${feature.included ? (feature.highlight ? 'text-amber-300 font-medium' : 'text-gray-300') : 'text-gray-600'}`}>
                                                {feature.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <Button
                                    variant={tier.popular ? 'primary' : 'outline'}
                                    size="md"
                                    className={`w-full ${!tier.popular ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : ''}`}
                                    href="/contact"
                                >
                                    {tier.cta}
                                </Button>
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
                        * 호스팅은 제공 항목에 포함되지 않습니다 (무료 호스팅 활용 가능). 모든 상품은 광고 소재 확인 후 진행됩니다.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
