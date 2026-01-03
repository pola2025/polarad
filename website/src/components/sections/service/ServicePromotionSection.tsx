'use client'

import { motion } from 'framer-motion'
import { Clock, Gift, Users, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function ServicePromotionSection() {
    return (
        <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-950 via-amber-950/20 to-gray-950 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Promotion Card */}
                    <div className="relative bg-gray-900/80 backdrop-blur-sm border border-amber-500/30 rounded-3xl p-8 lg:p-12 overflow-hidden">
                        {/* Corner Badge */}
                        <div className="absolute top-0 right-0">
                            <div className="bg-amber-500 text-gray-900 text-sm font-bold px-6 py-2 rounded-bl-2xl">
                                한정 프로모션
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                            {/* Left: Info */}
                            <div className="flex-1 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-4">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Premium 특별 혜택</span>
                                </div>

                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 break-keep">
                                    1년 Meta 자동화<br />
                                    <span className="text-amber-400">무료 제공</span>
                                </h2>

                                <p className="text-gray-400 mb-6 break-keep">
                                    Premium 상품 구매 시, 정가 대비 55만원 할인 + <br className="hidden sm:block" />
                                    6개월 → 1년 자동화 업그레이드
                                </p>

                                {/* Benefits */}
                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <Clock className="w-4 h-4 text-amber-400" />
                                        <span>~1월 31일까지</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <Users className="w-4 h-4 text-amber-400" />
                                        <span>10개 기업 한정</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <Gift className="w-4 h-4 text-amber-400" />
                                        <span>132만원 가치</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Price */}
                            <div className="text-center">
                                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 lg:p-8">
                                    <div className="text-gray-500 text-sm mb-1">정가</div>
                                    <div className="text-gray-500 text-2xl line-through mb-2">220만원</div>
                                    
                                    <div className="text-amber-400 text-sm font-medium mb-1">프로모션가</div>
                                    <div className="flex items-baseline justify-center gap-1 mb-4">
                                        <span className="text-5xl lg:text-6xl font-bold text-white">165</span>
                                        <span className="text-xl text-gray-400">만원</span>
                                    </div>

                                    <p className="text-xs text-gray-500 mb-4">VAT 포함 / 1년 자동화 포함</p>

                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900"
                                        href="/contact"
                                    >
                                        프로모션 상담 신청
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Notice */}
                        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                            <p className="text-sm text-gray-500">
                                * 광고 소재 퀄리티 확인 후 진행 가능합니다. 소재 구성 코칭은 무료 제공됩니다.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
