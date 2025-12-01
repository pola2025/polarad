'use client'

import { motion } from 'framer-motion'

export default function AuroraTestSection() {
    const bubbles = [
        { size: 450, x: '15%', y: '20%', color: 'rgba(59, 130, 246, 0.7)', duration: 20, delay: 0 },
        { size: 350, x: '70%', y: '60%', color: 'rgba(139, 92, 246, 0.65)', duration: 25, delay: 2 },
        { size: 400, x: '80%', y: '15%', color: 'rgba(6, 182, 212, 0.6)', duration: 22, delay: 4 },
        { size: 300, x: '25%', y: '70%', color: 'rgba(168, 85, 247, 0.65)', duration: 18, delay: 1 },
        { size: 250, x: '50%', y: '40%', color: 'rgba(99, 102, 241, 0.55)', duration: 24, delay: 3 },
    ]

    return (
        <section className="py-24 lg:py-32 relative overflow-hidden min-h-[600px]">
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

            {/* Glassmorphism Card Layer */}
            <div className="absolute inset-0 backdrop-blur-[100px]"></div>

            {/* Subtle noise texture */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,7,18,0.5)_90%)]"></div>

            {/* Content */}
            <div className="container relative z-10">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Glassmorphism Bubbles
                    </h2>
                    <p className="text-gray-300">
                        글래스모피즘 빛 버블 배경
                    </p>
                </div>
            </div>
        </section>
    )
}
