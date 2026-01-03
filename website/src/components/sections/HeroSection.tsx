'use client'

import { useRef, useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { ArrowRight, TrendingUp, Users, Database, ShieldCheck } from 'lucide-react'
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, useInView } from 'framer-motion'
import { AuroraBackground } from '../ui/AuroraBackground'
import { FloatingLines } from '../ui/FloatingLines'

// 카운팅 애니메이션 컴포넌트
function CountUp({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    useEffect(() => {
        if (!isInView) return

        let startTime: number
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(easeOut * end))

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }
        requestAnimationFrame(animate)
    }, [isInView, end, duration])

    return <span ref={ref}>{count}{suffix}</span>
}

export default function HeroSection() {
    const ref = useRef(null)
    const { scrollY } = useScroll()

    // Parallax for background
    const y1 = useTransform(scrollY, [0, 500], [0, 200])
    const y2 = useTransform(scrollY, [0, 500], [0, -150])

    // 3D Tilt Effect
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - left) / width - 0.5
        const y = (e.clientY - top) / height - 0.5
        mouseX.set(x)
        mouseY.set(y)
    }

    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 })
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 })
    const brightness = useSpring(useTransform(mouseY, [-0.5, 0.5], [1.2, 0.8]), { stiffness: 150, damping: 20 })

    return (
        <section ref={ref} className="relative min-h-[calc(100vh-6rem)] lg:min-h-[calc(100vh-7rem)] pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-950 text-white perspective-1000 -mt-24 md:-mt-28">
            {/* Aurora Background Effect */}
            <AuroraBackground color="mixed" intensity="medium" />

            {/* Floating Lines Effect */}
            <FloatingLines 
                linesGradient={['#E945F5', '#2F4BC0', '#E945F5']}
                animationSpeed={1}
                interactive={true}
                bendRadius={5}
                bendStrength={-0.5}
                mouseDamping={0.05}
                parallax={true}
                parallaxStrength={0.2}
                className="z-[1]"
            />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="container relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Left Content - The Wake Up Call */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-400 text-sm font-semibold mb-8 backdrop-blur-sm"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            <span>상위 1% 컨설팅 법인의 영업 비밀</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight tracking-tight break-keep text-balance"
                        >
                            아직도 <span className="text-red-500">남들이 버린 DB</span>에<br />
                            전화를 돌리고 계십니까?
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg lg:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 break-keep text-balance"
                        >
                            누구나 접근 가능한 공용 DB로는 더 이상 승산이 없습니다.<br className="hidden md:block" />
                            <span className="text-white font-semibold">자체 DB 생산 시스템</span>을 구축하여 시장을 독점하십시오.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
                        >
                            <Button variant="primary" size="xl" className="w-full sm:w-auto shadow-xl shadow-primary-900/20 border border-primary-500/50 whitespace-nowrap" href="/contact">
                                내 기업에 맞는 시스템 진단받기
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-400 sm:pl-4">
                                <div className="flex -space-x-2">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-950 flex items-center justify-center text-xs text-white">
                                            <Users className="w-4 h-4" />
                                        </div>
                                    ))}
                                </div>
                                <span className="whitespace-nowrap">다른 대표님들은<br />이미 도입중</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Visual - The Result (Dashboard) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="flex-1 w-full max-w-[600px] lg:max-w-none relative perspective-1000"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{ perspective: 1000 }}
                    >
                        <motion.div
                            style={{
                                rotateX,
                                rotateY,
                                filter: useMotionTemplate`brightness(${brightness})`
                            }}
                            className="relative bg-dark-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden group transform-style-3d"
                        >
                            {/* Glow Effect on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                            {/* Dashboard Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-dark-800/50 backdrop-blur-md">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                </div>
                                <div className="text-xs text-gray-400 font-mono">PolaAd_Sales_System_v2.0</div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-6 lg:p-8 space-y-6">
                                {/* Stats Row */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <div className="bg-dark-800/50 rounded-xl p-3 sm:p-4 border border-white/5">
                                        <div className="text-gray-300 text-xs sm:text-sm mb-1">금일 유입 DB</div>
                                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-end gap-1 sm:gap-2">
                                            <CountUp end={42} suffix="건" duration={1.5} />
                                            <span className="text-[10px] sm:text-xs text-green-400 font-medium mb-0.5 sm:mb-1 flex items-center">
                                                <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" /> +12%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-dark-800/50 rounded-xl p-3 sm:p-4 border border-white/5">
                                        <div className="text-gray-300 text-xs sm:text-sm mb-1">미팅 성사율</div>
                                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-end gap-1 sm:gap-2">
                                            <CountUp end={38} suffix="%" duration={1.5} />
                                            <span className="text-[10px] sm:text-xs text-green-400 font-medium mb-0.5 sm:mb-1 flex items-center">
                                                <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" /> +5.4%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Graph Visual (Simplified) */}
                                <div className="bg-dark-800/30 rounded-xl p-4 border border-white/5 h-48 relative flex items-end justify-between gap-2">
                                    {/* Bars */}
                                    {[30, 45, 35, 55, 48, 62, 75].map((height, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                            className="w-full bg-primary-900/30 rounded-t-sm relative group overflow-hidden"
                                        >
                                            <div className="absolute bottom-0 left-0 w-full bg-primary-500 transition-all duration-1000 ease-out" style={{ height: '100%', opacity: 0.6 + (i * 0.05) }}></div>
                                            {/* Tooltip */}
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-dark-950 text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                {height * 2} Leads
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Trend Line Overlay */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
                                        <motion.path
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.5, delay: 1 }}
                                            d="M0 140 C 50 130, 100 110, 150 120 S 250 80, 300 90 S 400 50, 500 20"
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                        />
                                    </svg>
                                </div>

                                {/* Incoming Lead Notification */}
                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 2 }}
                                    className="flex items-center gap-4 bg-primary-900/20 border border-primary-500/30 rounded-lg p-3"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                                        <Database className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-white">신규 DB가 접수되었습니다</div>
                                        <div className="text-xs text-primary-200">방금 전 • 제조업 • 매출 100억 이상</div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
