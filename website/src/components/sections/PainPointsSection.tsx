'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, XCircle, TrendingDown, DollarSign } from 'lucide-react'
import { Card } from '../ui/Card'
import { motion, useSpring, useTransform } from 'framer-motion'

// 숫자 애니메이션 컴포넌트
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
    const spring = useSpring(value, { stiffness: 100, damping: 30 })
    const display = useTransform(spring, (v) => Math.floor(v).toLocaleString())
    const [displayValue, setDisplayValue] = useState(value.toLocaleString())

    useEffect(() => {
        spring.set(value)
        const unsubscribe = display.on('change', (v) => setDisplayValue(v))
        return () => unsubscribe()
    }, [value, spring, display])

    return <>{displayValue}{suffix}</>
}

export default function PainPointsSection() {
    const [dbCost, setDbCost] = useState(50000)
    const [callCount, setCallCount] = useState(100)

    const totalCost = dbCost * callCount
    const wastedCost = totalCost * 0.95 // Assuming 95% failure rate

    return (
        <section className="py-20 lg:py-32 bg-white overflow-hidden">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-50 text-red-600 text-sm font-bold mb-6"
                    >
                        <AlertTriangle className="w-4 h-4" />
                        <span>경고: 귀하의 마케팅 예산이 새고 있습니다</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight break-keep"
                    >
                        건당 5만원 주고 산 DB,<br />
                        <span className="text-red-600">95%는 버려지고 있다는 사실</span>을 아십니까?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-600 break-keep text-balance"
                    >
                        &ldquo;전화하면 결번이거나 관심 없다고 합니다.&rdquo;<br />
                        당신의 영업력이 문제가 아닙니다. <span className="font-bold text-gray-900">오염된 DB 시스템</span>이 문제입니다.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left: The Trap Visualization */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex items-start gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-red-200 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                <XCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">중복 판매된 &lsquo;공용 DB&rsquo;</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    나에게만 온 DB가 아닙니다. 이미 3~4곳의 경쟁사가 먼저 전화를 돌린 후 남은 &lsquo;찌꺼기&rsquo;일 확률이 높습니다.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="flex items-start gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-red-200 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                <TrendingDown className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">떨어지는 영업 사기</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    하루 종일 거절당하는 영업팀. 단순 반복 콜 업무로 인한 직무 소진(Burnout)은 결국 퇴사로 이어집니다.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="flex items-start gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-red-200 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">밑 빠진 독에 물 붓기</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    DB 구매 비용은 매달 발생하지만, 남는 자산은 없습니다. 마케팅 대행사의 배만 불려주는 구조입니다.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: The Cost Calculator (The "Bleeding Neck") */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full"></div>
                        <Card className="relative bg-white border-2 border-red-100 shadow-2xl p-8">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900">매월 버려지는 비용 계산기</h3>
                                <p className="text-sm text-gray-500 mt-2">귀하의 현재 상황을 입력해보세요</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">DB 건당 구매 단가</label>
                                    <div className="relative">
                                        <input
                                            type="range"
                                            min="10000"
                                            max="100000"
                                            step="5000"
                                            value={dbCost}
                                            onChange={(e) => setDbCost(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                                        />
                                        <div className="mt-2 text-right font-bold text-gray-900">{dbCost.toLocaleString()}원</div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">월 구매 수량</label>
                                    <div className="relative">
                                        <input
                                            type="range"
                                            min="50"
                                            max="500"
                                            step="10"
                                            value={callCount}
                                            onChange={(e) => setCallCount(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                                        />
                                        <div className="mt-2 text-right font-bold text-gray-900">{callCount}건</div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm sm:text-base text-gray-600">총 지출 비용</span>
                                        <span className="text-sm sm:text-base font-semibold text-gray-900">
                                            <AnimatedNumber value={totalCost} suffix="원" />
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 text-red-600">
                                        <span className="text-sm sm:text-base font-bold">공중분해되는 비용 (95%)</span>
                                        <span className="text-xl sm:text-2xl font-bold">
                                            <AnimatedNumber value={wastedCost} suffix="원" />
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-4 text-center">
                                        * 일반적인 공용 DB의 유효 전환율(5%) 기준
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
