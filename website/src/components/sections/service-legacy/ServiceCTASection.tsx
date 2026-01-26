'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const bubbles = [
    { size: 450, x: '10%', y: '15%', color: 'rgba(59, 130, 246, 0.6)', duration: 20, delay: 0 },
    { size: 350, x: '75%', y: '55%', color: 'rgba(37, 99, 235, 0.55)', duration: 25, delay: 2 },
    { size: 400, x: '85%', y: '10%', color: 'rgba(96, 165, 250, 0.5)', duration: 22, delay: 4 },
    { size: 300, x: '20%', y: '65%', color: 'rgba(59, 130, 246, 0.55)', duration: 18, delay: 1 },
    { size: 280, x: '50%', y: '35%', color: 'rgba(37, 99, 235, 0.45)', duration: 24, delay: 3 },
]

export default function ServiceCTASection() {
    return (
        <section className="py-24 lg:py-32 relative overflow-hidden">
            {/* Dark Base */}
            <div className="absolute inset-0 bg-gray-950"></div>

            {/* Glassmorphism Bubbles */}
            <div className="absolute inset-0 overflow-hidden">
                {bubbles.map((bubble, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: bubble.size,
                            height: bubble.size,
                            left: bubble.x,
                            top: bubble.y,
                            background: `radial-gradient(circle at 30% 30%, ${bubble.color}, transparent 70%)`,
                            filter: 'blur(40px)',
                        }}
                        animate={{
                            x: [0, 50, -30, 20, 0],
                            y: [0, -40, 30, -20, 0],
                            scale: [1, 1.1, 0.95, 1.05, 1],
                        }}
                        transition={{
                            duration: bubble.duration,
                            ease: 'easeInOut',
                            repeat: Infinity,
                            delay: bubble.delay,
                        }}
                    />
                ))}
            </div>

            {/* Glassmorphism Layer */}
            <div className="absolute inset-0 backdrop-blur-[100px]"></div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,7,18,0.5)_90%)]"></div>

            <div className="container relative z-10">
                <div className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 break-keep leading-tight">
                            24시간 일하는<br />
                            <span className="text-primary-400">온라인 영업사원</span>을 만나보세요
                        </h2>
                        <p className="text-lg text-gray-300 mb-10 break-keep">
                            더 이상 고객을 찾아다니지 마세요.<br />
                            고객이 당신을 찾아오게 만듭니다.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-center"
                    >
                        <Button
                            variant="primary"
                            size="xl"
                            className="w-full sm:w-auto shadow-xl shadow-primary-900/30"
                            href="/contact"
                        >
                            무료 상담 신청
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-400"
                    >
                        <span>✓ 상담 무료</span>
                        <span>✓ 견적 무료</span>
                        <span>✓ 맞춤 컨설팅</span>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
