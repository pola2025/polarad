'use client'

import { motion, useMotionValue, useSpring, useMotionTemplate, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, Package, Printer, Globe, Target, TrendingUp, Users, Zap, BarChart3, Phone, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { useRef, useState, useEffect } from 'react'

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

// 마우스 추적 스포트라이트 + 흰색 글로우 가격 카드
function PriceHighlightCard() {
    const boxRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const spotlightX = useSpring(mouseX, { stiffness: 300, damping: 30 })
    const spotlightY = useSpring(mouseY, { stiffness: 300, damping: 30 })

    // useMotionTemplate으로 실시간 업데이트
    const spotlightBackground = useMotionTemplate`radial-gradient(600px circle at ${spotlightX}px ${spotlightY}px, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04) 30%, transparent 55%)`
    const softGlowBackground = useMotionTemplate`radial-gradient(400px circle at ${spotlightX}px ${spotlightY}px, rgba(255, 255, 255, 0.08), transparent 45%)`

    // 3D Tilt Effect
    const rotateX = useSpring(useTransform(mouseY, [0, 300], [5, -5]), { stiffness: 150, damping: 20 })
    const rotateY = useSpring(useTransform(mouseX, [0, 400], [-5, 5]), { stiffness: 150, damping: 20 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!boxRef.current) return
        const rect = boxRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        mouseX.set(x)
        mouseY.set(y)
    }

    const handleMouseLeave = () => {
        mouseX.set(200)
        mouseY.set(150)
        setIsHovered(false)
    }

    return (
        <motion.div
            ref={boxRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="relative w-full group"
            style={{ perspective: 1000 }}
        >
            {/* 흰색 글로우 후광 */}
            <div className="absolute -inset-4 rounded-3xl opacity-40 blur-2xl"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.08) 50%, transparent 70%)'
                }}
            />

            {/* 메인 카드 */}
            <motion.div
                style={{ rotateX, rotateY }}
                className="relative bg-gray-900/90 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.08)] transform-style-3d"
            >
                {/* 추적 스포트라이트 효과 */}
                <motion.div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                        background: spotlightBackground,
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.4s ease'
                    }}
                />
                <motion.div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                        background: softGlowBackground,
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.4s ease',
                        filter: 'blur(15px)'
                    }}
                />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gray-800/50">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <div className="text-xs text-gray-400 font-mono">All-in-One Package</div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8 relative z-20">
                    {/* 가격 영역 */}
                    <div className="text-center mb-6">
                        <div className="text-gray-400 text-sm mb-2">모든 것을 포함한 패키지 가격</div>
                        <div className="flex items-baseline justify-center gap-2 mb-1">
                            <span className="text-4xl lg:text-5xl font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">330</span>
                            <span className="text-xl text-gray-300">만원</span>
                        </div>
                        <div className="text-gray-500 text-xs">VAT 포함 / VAT 별도 300만원</div>
                    </div>

                    {/* 구분선 */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

                    {/* 포함 항목 상세 */}
                    <div className="space-y-3 mb-6">
                        {/* 인쇄물 */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                                <Printer className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-white text-sm font-medium">인쇄물 4종</div>
                                <div className="text-gray-500 text-xs truncate">명함 · 대봉투 · 계약서 · 명찰</div>
                            </div>
                        </div>
                        {/* 홈페이지 */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                                <Globe className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-white text-sm font-medium">홈페이지 10P</div>
                                <div className="text-gray-500 text-xs truncate">반응형 · 도메인 1년 · 호스팅 1년</div>
                            </div>
                        </div>
                        {/* 광고 */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                                <Target className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-white text-sm font-medium">광고 자동화</div>
                                <div className="text-gray-500 text-xs truncate">Meta 광고 · 실시간 알림 · 리포팅</div>
                            </div>
                        </div>
                    </div>

                    {/* 추가 혜택 */}
                    <div className="bg-primary-500/5 border border-primary-500/20 rounded-xl p-3">
                        <div className="flex items-center justify-center gap-4 text-xs">
                            <span className="text-primary-400">✓ 상담 무료</span>
                            <span className="text-primary-400">✓ 1:1 전담</span>
                            <span className="text-primary-400">✓ 빠른 납품</span>
                        </div>
                    </div>
                </div>

                {/* 상하단 글로우 라인 */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </motion.div>
        </motion.div>
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
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-400 text-sm font-semibold mb-8 backdrop-blur-sm"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>올인원 영업 솔루션</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight tracking-tight break-keep text-balance"
                        >
                            따로따로 맡기면<br />
                            <span className="text-red-500">시간과 비용이 2배</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg lg:text-xl text-gray-300 mb-6 leading-relaxed max-w-2xl mx-auto lg:mx-0 break-keep text-balance"
                        >
                            인쇄물, 홈페이지, 광고까지<br className="hidden md:block" />
                            <span className="text-white font-semibold">한 번에 해결</span>하세요.
                        </motion.p>

                        {/* 보강된 상세 설명 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.25 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 mb-8 max-w-2xl mx-auto lg:mx-0"
                        >
                            {/* 모바일: 한줄 정렬, 상세 내용 제외 */}
                            <div className="flex sm:hidden items-center justify-center gap-1.5 xs:gap-2 text-[10px] xs:text-xs text-gray-300 whitespace-nowrap">
                                <span className="flex items-center gap-0.5">
                                    <Printer className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-amber-400" />
                                    <span>인쇄물4종</span>
                                </span>
                                <span className="text-white/30">·</span>
                                <span className="flex items-center gap-0.5">
                                    <Globe className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-blue-400" />
                                    <span>홈페이지10P</span>
                                </span>
                                <span className="text-white/30">·</span>
                                <span className="flex items-center gap-0.5">
                                    <Target className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-emerald-400" />
                                    <span>Meta광고</span>
                                </span>
                            </div>

                            {/* 데스크탑: 아이콘 + 상세 내용 */}
                            <div className="hidden sm:grid grid-cols-3 gap-4 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                        <Printer className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold text-sm">인쇄물 4종</div>
                                        <div className="text-gray-500 text-xs">명함·봉투·계약서·명찰</div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                        <Globe className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold text-sm">홈페이지 10P</div>
                                        <div className="text-gray-500 text-xs">도메인+호스팅 1년</div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                        <Target className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold text-sm">Meta 광고</div>
                                        <div className="text-gray-500 text-xs">자동화+실시간 알림</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 text-center">
                                <span className="text-2xl font-bold text-white">330</span>
                                <span className="text-gray-400 ml-1">만원</span>
                                <span className="text-gray-500 text-xs ml-2">(VAT 포함)</span>
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
