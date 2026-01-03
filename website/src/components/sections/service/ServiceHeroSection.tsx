'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Target, TrendingUp, Users, Zap, BarChart3, ChevronLeft, ChevronRight as ChevronRightIcon, Clock, Gift } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { useState, useEffect } from 'react'

// 회전 캐러셀 카드 데이터
const carouselCards = [
    {
        title: "Meta 광고를 꼭 집행해야 하는 이유",
        icon: Target,
        points: [
            "정밀 타겟팅으로 잠재고객만 공략",
            "광고비 대비 최고의 전환율",
            "실시간 성과 측정 및 최적화",
            "A/B 테스트로 최적 광고 소재 발굴",
            "리타겟팅으로 이탈 고객 재유입",
            "업종별 맞춤 광고 전략 수립"
        ],
        stat: { value: "320%", label: "평균 ROAS" },
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        title: "온라인 광고로 영업 전략을 전환해야 하는 이유",
        icon: Zap,
        points: [
            "콜드콜 거부율 85% 시대",
            "고객이 먼저 연락하는 구조",
            "24시간 자동 리드 수집",
            "영업사원 인건비 절감 효과",
            "관심 고객만 필터링되어 유입",
            "데이터 기반 영업 의사결정"
        ],
        stat: { value: "5배", label: "영업 효율 향상" },
        gradient: "from-purple-500 to-pink-500"
    },
    {
        title: "자체 DB 시스템이 필수인 이유",
        icon: Users,
        points: [
            "공용 DB = 경쟁 과열 = 수익 하락",
            "독점 DB = 독점 시장 = 높은 마진",
            "내 고객은 내가 직접 생산",
            "고객 행동 데이터 축적 및 분석",
            "재구매 유도 마케팅 가능",
            "장기적 자산으로 기업 가치 상승"
        ],
        stat: { value: "38%", label: "미팅 성사율" },
        gradient: "from-amber-500 to-orange-500"
    },
    {
        title: "지금 시작하지 않으면 늦는 이유",
        icon: BarChart3,
        points: [
            "온라인 광고 비용 매년 15% 상승",
            "선점 효과: 먼저 시작한 기업이 독식",
            "경쟁사는 이미 전환 중",
            "고객의 구매 여정이 온라인으로 이동",
            "늦을수록 시장 진입 비용 증가",
            "초기 데이터 축적이 성패 좌우"
        ],
        stat: { value: "15%↑", label: "연간 광고비 상승률" },
        gradient: "from-green-500 to-emerald-500"
    }
]

// 3D 턴테이블 캐러셀 컴포넌트
function TurntableCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlay, setIsAutoPlay] = useState(true)
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)
    const cardCount = carouselCards.length
    const radius = 180 // 회전 반경 (줄여서 겹침 증가)

    useEffect(() => {
        if (!isAutoPlay) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % cardCount)
        }, 8000) // 8초 (멈춤 3초 + 전환)

        return () => clearInterval(interval)
    }, [isAutoPlay, cardCount])

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % cardCount)
    }

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + cardCount) % cardCount)
    }

    // 터치 스와이프 핸들러
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX)
        setIsAutoPlay(false)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 50) {
            goToNext()
        }
        if (touchStart - touchEnd < -50) {
            goToPrev()
        }
        setIsAutoPlay(true)
    }

    return (
        <div
            className="relative w-full h-[400px] sm:h-[580px] lg:h-[620px]"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* 3D 캐러셀 컨테이너 - preserve-3d 제거로 blur 방지 */}
            <div
                className="relative w-full h-full flex items-center justify-center"
            >
                <div
                    className="relative w-[360px] h-[360px] sm:w-[480px] sm:h-[520px] lg:w-[520px] lg:h-[560px]"
                >
                    {carouselCards.map((card, index) => {
                        // 각 카드의 회전 각도 계산
                        const angle = ((index - currentIndex) * (360 / cardCount))
                        const radian = (angle * Math.PI) / 180

                        // Z축 깊이와 X축 위치 계산
                        const translateZ = Math.cos(radian) * radius
                        const translateX = Math.sin(radian) * radius * 0.8

                        // 가시성 및 투명도 계산
                        const isActive = index === currentIndex
                        const normalizedAngle = ((angle % 360) + 360) % 360
                        const isBehind = normalizedAngle > 90 && normalizedAngle < 270

                        // 앞에 있는 카드는 완전 선명, 뒤로 갈수록만 흐리게
                        const depthRatio = (translateZ + radius) / (radius * 2) // 0~1 범위
                        const opacity = isActive ? 1 : isBehind ? 0.15 : 0.4 + depthRatio * 0.4
                        const scale = isActive ? 1.08 : 0.6 + depthRatio * 0.25
                        // 활성 카드는 blur 없음, 비활성만 blur
                        const blur = isActive ? 0 : isBehind ? 6 : 0

                        const IconComponent = card.icon

                        return (
                            <motion.div
                                key={index}
                                className="absolute top-0 left-0 w-full h-full cursor-pointer"
                                style={{
                                    zIndex: isActive ? 20 : Math.round(depthRatio * 10),
                                    // 3D blur 방지: preserve-3d 제거, will-change 추가
                                    willChange: 'transform, opacity',
                                    backfaceVisibility: 'hidden',
                                }}
                                animate={{
                                    x: Math.round(translateX),
                                    scale,
                                    opacity,
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 80,
                                    damping: 25,
                                    mass: 1.2,
                                }}
                                onClick={() => setCurrentIndex(index)}
                            >
                                <div
                                    className={`relative w-full h-full rounded-2xl border overflow-hidden flex flex-col ${
                                        isActive
                                            ? 'border-white/50 bg-gray-900'
                                            : 'border-white/10 bg-gray-900/60'
                                    }`}
                                    style={{
                                        boxShadow: isActive
                                            ? '0 30px 60px -15px rgba(0, 0, 0, 0.7), 0 0 80px rgba(255, 255, 255, 0.2)'
                                            : '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
                                        // perspective(1px)로 GPU 가속 + blur 방지
                                        transform: 'perspective(1px) translateZ(0)',
                                        WebkitFontSmoothing: 'antialiased',
                                        filter: isBehind ? 'blur(4px) brightness(0.6)' : 'none',
                                    }}
                                >
                                    {/* 그라디언트 오버레이 */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-10`} />

                                    {/* 배경 번호 - 큰 반투명 숫자 */}
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[180px] sm:text-[280px] lg:text-[320px] font-bold text-white/[0.03] leading-none pointer-events-none select-none">
                                        {index + 1}
                                    </div>

                                    {/* 헤더 - 아이콘 + 타이틀 */}
                                    <div className="px-3 py-2 sm:px-5 sm:py-3 border-b border-white/10 bg-gray-800/50">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg shrink-0`}>
                                                <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                            </div>
                                            <h3 className="flex-1 text-[13px] sm:text-base lg:text-lg font-bold text-white leading-tight break-keep whitespace-nowrap">
                                                {card.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* 콘텐츠 */}
                                    <div className="px-4 pt-3 pb-3 sm:px-7 sm:pt-5 sm:pb-3 lg:px-8 lg:pt-6 lg:pb-4 flex flex-col flex-1">
                                        <div className="space-y-2 sm:space-y-3">
                                            {card.points.map((point, i) => (
                                                <div key={i} className="flex items-start gap-2 sm:gap-3">
                                                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1.5 sm:mt-2 rounded-full bg-gradient-to-br ${card.gradient} shrink-0`} />
                                                    <span className="text-gray-200 break-keep text-sm sm:text-base lg:text-lg leading-snug sm:leading-relaxed">{point}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* 통계 하이라이트 - 모바일: 10px 간격, PC: 하단 고정 */}
                                        <div className={`bg-gradient-to-br ${card.gradient} rounded-xl p-3 sm:p-6 mt-2.5 sm:mt-auto`}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-xl sm:text-4xl lg:text-5xl font-bold text-white">{card.stat.value}</div>
                                                    <div className="text-white/80 text-[10px] sm:text-base lg:text-lg">{card.stat.label}</div>
                                                </div>
                                                <div className="w-8 h-8 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-white/20 flex items-center justify-center">
                                                    <TrendingUp className="w-4 h-4 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 활성 카드 글로우 */}
                                    {isActive && (
                                        <div className="absolute inset-0 rounded-2xl pointer-events-none">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-transparent to-white/20 rounded-2xl blur-xl opacity-50" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* 네비게이션 컨트롤 */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4">
                <button
                    onClick={goToPrev}
                    className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* 인디케이터 */}
                <div className="flex gap-2">
                    {carouselCards.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentIndex
                                    ? 'w-8 bg-white'
                                    : 'w-2 bg-white/30 hover:bg-white/50'
                            }`}
                        />
                    ))}
                </div>

                <button
                    onClick={goToNext}
                    className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}



export default function ServiceHeroSection() {
    return (
        <section className="relative min-h-[calc(100vh-6rem)] lg:min-h-[calc(100vh-7rem)] pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-950 text-white perspective-1000 -mt-24 md:-mt-28">
            {/* Aurora Background Effect */}
            <AuroraBackground color="mixed" intensity="medium" />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="container relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Left Content - 메인과 동일한 레이아웃 */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold mb-8 backdrop-blur-sm"
                        >
                            <Gift className="w-4 h-4" />
                            <span>1월 프로모션 진행 중</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight tracking-tight break-keep text-balance"
                        >
                            온라인 영업 시스템<br />
                            <span className="text-primary-400">30만원</span>부터 시작
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg lg:text-xl text-gray-300 mb-6 leading-relaxed max-w-2xl mx-auto lg:mx-0 break-keep text-balance"
                        >
                            랜딩페이지부터 홈페이지+Meta 광고까지<br className="hidden md:block" />
                            <span className="text-white font-semibold">필요한 만큼만</span> 선택하세요.
                        </motion.p>

                        {/* 티어별 가격 안내 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.25 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 mb-8 max-w-2xl mx-auto lg:mx-0"
                        >
                            {/* 4개 티어 간단 안내 */}
                            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center mb-4">
                                <div className="flex flex-col items-center">
                                    <div className="text-gray-400 text-[10px] sm:text-xs mb-1">Basic</div>
                                    <div className="text-white font-bold text-sm sm:text-lg">30<span className="text-gray-400 text-[10px] sm:text-xs">만</span></div>
                                    <div className="text-gray-500 text-[9px] sm:text-xs">랜딩 1P</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="text-gray-400 text-[10px] sm:text-xs mb-1">Normal</div>
                                    <div className="text-white font-bold text-sm sm:text-lg">60<span className="text-gray-400 text-[10px] sm:text-xs">만</span></div>
                                    <div className="text-gray-500 text-[9px] sm:text-xs">+Meta 세팅</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="text-gray-400 text-[10px] sm:text-xs mb-1">Pro</div>
                                    <div className="text-white font-bold text-sm sm:text-lg">110<span className="text-gray-400 text-[10px] sm:text-xs">만</span></div>
                                    <div className="text-gray-500 text-[9px] sm:text-xs">홈페이지 5P</div>
                                </div>
                                <div className="flex flex-col items-center relative">
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded text-white font-semibold">BEST</div>
                                    <div className="text-amber-400 text-[10px] sm:text-xs mb-1 mt-1">Premium</div>
                                    <div className="text-amber-400 font-bold text-sm sm:text-lg">220<span className="text-[10px] sm:text-xs">만</span></div>
                                    <div className="text-gray-500 text-[9px] sm:text-xs">홈페이지 10P</div>
                                </div>
                            </div>

                            {/* 프로모션 하이라이트 */}
                            <div className="pt-3 border-t border-white/10 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-lg p-3 -mx-1">
                                <div className="flex items-center justify-center gap-2 text-center">
                                    <Clock className="w-4 h-4 text-amber-400" />
                                    <span className="text-amber-400 text-xs sm:text-sm font-semibold">1/31까지 Premium</span>
                                    <span className="text-white font-bold text-lg sm:text-xl">165<span className="text-gray-400 text-xs">만원</span></span>
                                    <span className="text-gray-400 text-xs">+ 1년 자동화</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
                        >
                            <Button
                                variant="primary"
                                size="xl"
                                className="w-full sm:w-auto shadow-xl shadow-primary-900/20 border border-primary-500/50 whitespace-nowrap"
                                href="/contact"
                            >
                                무료 상담 신청
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Button
                                variant="outline"
                                size="xl"
                                className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
                                href="#details"
                            >
                                상세 내용 보기
                            </Button>
                        </motion.div>
                    </div>

                    {/* Right Visual - 3D 턴테이블 캐러셀 */}
                    <div className="flex-1 w-full max-w-[550px] lg:max-w-[600px]">
                        <TurntableCarousel />
                    </div>

                </div>
            </div>
        </section>
    )
}
