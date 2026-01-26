'use client'

import { useRef, useState } from 'react'
import { Monitor, Bell, BarChart3, CheckCircle2, XCircle, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { AuroraBackground } from '../ui/AuroraBackground'

export default function SolutionSection() {
    const ref = useRef(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    const y1 = useTransform(scrollYProgress, [0, 1], [0, 200])
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -150])
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 45])

    const features = [
        {
            icon: <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />,
            title: "Kakao Login",
            titleKo: "카카오 로그인",
            desc: "본인 인증된 정확한 연락처만 수집합니다. 스팸 접수를 원천 차단합니다.",
            items: ["본인 인증 연락처", "스팸 필터링", "진성 고객만 수집"]
        },
        {
            icon: <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-primary-400" />,
            title: "Telegram Alert",
            titleKo: "텔레그램 알림",
            desc: "새 접수가 들어오면 즉시 텔레그램으로 알림을 받습니다. 빠른 응대가 가능합니다.",
            items: ["실시간 접수 알림", "고객 정보 즉시 확인", "빠른 응대 가능"]
        },
        {
            icon: <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />,
            title: "Dashboard",
            titleKo: "실시간 대시보드",
            desc: "접수 현황을 한눈에 파악할 수 있는 전용 대시보드가 제공됩니다.",
            items: ["접수 목록 관리", "상태 변경 기능", "통계 및 분석"]
        }
    ]

    return (
        <section ref={ref} className="relative py-20 lg:py-32 bg-gray-900 text-white overflow-hidden">
            {/* Aurora Background Effect */}
            <AuroraBackground color="purple" intensity="low" />

            {/* Parallax Floating Shapes */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    style={{ y: y1, rotate }}
                    className="absolute top-20 left-10 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"
                />
                <motion.div
                    style={{ y: y2, rotate: rotate }}
                    className="absolute bottom-40 right-20 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"
                />
                {/* Glassmorphism Shapes */}
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, 10, 0]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 right-10 w-20 h-20 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 rotate-12"
                />
                <motion.div
                    animate={{
                        y: [0, -30, 0],
                        rotate: [0, -15, 0]
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-1/3 left-20 w-16 h-16 bg-white/5 backdrop-blur-lg rounded-full border border-white/10"
                />
            </div>

            <div className="container relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl lg:text-5xl font-bold mb-6 leading-tight break-keep text-white"
                    >
                        월 3만원으로<br />
                        <span className="text-primary-400">DB 접수 자동화</span>를 시작하세요
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-400 break-keep text-balance"
                    >
                        리드 수집 랜딩페이지 + 카카오 로그인 + 텔레그램 알림 + 대시보드까지<br />
                        <span className="text-white font-bold">소상공인을 위한 DB접수 랜딩 서비스</span>입니다.
                    </motion.p>
                </div>

                {/* 3 Pillars - Desktop */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-8 mb-20">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            whileHover={{ y: -10 }}
                            className="bg-gray-800 border border-white/5 rounded-2xl p-8 hover:border-primary-500/30 transition-colors group relative z-10"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gray-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <div className="mb-3">
                                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                                <span className="text-sm text-white">{feature.titleKo}</span>
                            </div>
                            <p className="text-gray-400 mb-6 leading-relaxed text-sm">{feature.desc}</p>
                            <ul className="space-y-3">
                                {feature.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* 3 Pillars - Mobile Slider */}
                <div className="lg:hidden mb-16 relative">
                    <div className="overflow-hidden">
                        <motion.div
                            className="flex"
                            animate={{ x: `-${currentIndex * 100}%` }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            {features.map((feature, idx) => (
                                <div key={idx} className="w-full flex-shrink-0 px-2">
                                    <div className="bg-gray-800 border border-white/5 rounded-2xl p-6 relative z-10">
                                        <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center mb-4">
                                            {feature.icon}
                                        </div>
                                        <div className="mb-3">
                                            <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                                            <span className="text-xs text-white">{feature.titleKo}</span>
                                        </div>
                                        <p className="text-gray-400 mb-5 leading-relaxed text-sm break-keep">{feature.desc}</p>
                                        <ul className="space-y-2">
                                            {feature.items.map((item, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <button
                            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                            disabled={currentIndex === 0}
                            className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                            aria-label="이전"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex gap-2">
                            {features.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                        idx === currentIndex ? 'bg-primary-500' : 'bg-gray-600'
                                    }`}
                                    aria-label={`${idx + 1}번째로 이동`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentIndex(Math.min(features.length - 1, currentIndex + 1))}
                            disabled={currentIndex === features.length - 1}
                            className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                            aria-label="다음"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Comparison Table */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800 rounded-3xl border border-white/10 p-4 sm:p-8 lg:p-12 overflow-hidden relative"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-accent-500"></div>

                    {/* 제목 - 그리드 밖으로 이동 */}
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8 text-white text-center lg:text-left pt-2">왜 폴라애드인가?</h3>

                    {/* 모바일용 컴팩트 비교 테이블 */}
                    <div className="lg:hidden">
                        <div className="overflow-x-auto -ml-1">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-2 pl-1 text-gray-400 font-medium w-[30%]">항목</th>
                                        <th className="text-left py-2 text-primary-400 font-bold w-[35%]">폴라애드</th>
                                        <th className="text-left py-2 text-gray-500 font-medium w-[35%]">일반 폼</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr>
                                        <td className="py-3 pl-1 text-gray-300">스팸 차단</td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-1 text-primary-400">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span className="text-xs font-medium">카카오 인증</span>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <XCircle className="w-4 h-4" />
                                                <span className="text-xs">스팸 다수</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 pl-1 text-gray-300">알림</td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-1 text-primary-400">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span className="text-xs font-medium">실시간 알림</span>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <XCircle className="w-4 h-4" />
                                                <span className="text-xs">수동 확인</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 pl-1 text-gray-300">비용</td>
                                        <td className="py-3">
                                            <div className="flex flex-col items-start gap-0.5">
                                                <div className="flex items-center gap-1 text-primary-400">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span className="text-xs font-medium">월 3만원</span>
                                                </div>
                                                <span className="text-[10px] text-gray-500 pl-5">1년결제 36만원</span>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <XCircle className="w-4 h-4" />
                                                <span className="text-xs">별도 개발비</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 데스크톱용 기존 레이아웃 */}
                    <div className="hidden lg:grid lg:grid-cols-2 gap-12">
                        <div>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-700/50 border border-white/5">
                                    <span className="text-gray-300">스팸 차단</span>
                                    <div className="flex items-center gap-2 font-bold text-primary-400">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span>카카오 로그인 인증</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-700/50 border border-white/5">
                                    <span className="text-gray-300">접수 알림</span>
                                    <div className="flex items-center gap-2 font-bold text-primary-400">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span>텔레그램 실시간 알림</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-700/50 border border-white/5">
                                    <span className="text-gray-300">비용</span>
                                    <div className="flex flex-col items-end gap-0.5">
                                        <div className="flex items-center gap-2 font-bold text-primary-400">
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>월 3만원 (1년결제 36만원)</span>
                                        </div>
                                        <span className="text-xs text-gray-500">수정 건당 3만원</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500/5 blur-2xl rounded-full"></div>
                            <h3 className="text-2xl font-bold mb-8 text-gray-500">일반 폼 빌더</h3>
                            <div className="space-y-6 opacity-70">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 border-dashed">
                                    <span className="text-gray-500">스팸 차단</span>
                                    <div className="flex items-center gap-2 font-bold text-gray-500">
                                        <XCircle className="w-5 h-5" />
                                        <span>스팸 접수 다수</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 border-dashed">
                                    <span className="text-gray-500">접수 알림</span>
                                    <div className="flex items-center gap-2 font-bold text-gray-500">
                                        <XCircle className="w-5 h-5" />
                                        <span>수동으로 확인 필요</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 border-dashed">
                                    <span className="text-gray-500">비용</span>
                                    <div className="flex items-center gap-2 font-bold text-gray-500">
                                        <XCircle className="w-5 h-5" />
                                        <span>별도 개발비 필요</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 비용 안내 */}
                    <div className="mt-10 pt-8 border-t border-white/10">
                        <div className="space-y-4">
                            {/* 가격 안내 */}
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-gray-300 text-sm break-keep">
                                        <span className="text-white font-semibold">DB접수 랜딩 서비스 월 3만원</span> (VAT별도, 1년결제 36만원)
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        랜딩페이지 + 카카오 로그인 + 텔레그램 알림 + 대시보드
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                        수정 필요 시 건당 3만원 / 1년 후 연장: 월 1만원
                                    </p>
                                </div>
                            </div>

                            {/* 타겟 안내 */}
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
                                <span className="text-lg">🎯</span>
                                <div>
                                    <p className="text-primary-400 font-bold text-sm">소상공인 맞춤형 솔루션</p>
                                    <p className="text-gray-400 text-sm mt-1 break-keep">
                                        복잡한 설정 없이 <span className="text-white font-semibold">5~7일 내 제작 완료</span>
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                        카카오 앱 설정, 텔레그램 연동 모두 대행
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    )
}
