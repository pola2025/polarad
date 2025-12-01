'use client'

import { motion } from 'framer-motion'

interface AuroraBackgroundProps {
  /** 오로라 색상 (기본: 파란색-보라색) */
  color?: 'blue' | 'purple' | 'cyan' | 'mixed'
  /** 강도 (기본: medium) */
  intensity?: 'low' | 'medium' | 'high'
  /** 추가 클래스 */
  className?: string
}

export function AuroraBackground({
  color = 'mixed',
  intensity = 'medium',
  className = ''
}: AuroraBackgroundProps) {

  // 색상 설정
  const colorMap = {
    blue: 'rgba(59, 130, 246, 0.4)',
    purple: 'rgba(139, 92, 246, 0.4)',
    cyan: 'rgba(6, 182, 212, 0.4)',
    mixed: 'rgba(99, 102, 241, 0.35)'
  }

  // 강도에 따른 불투명도
  const intensityMap = {
    low: 0.6,
    medium: 1,
    high: 1.4
  }

  const baseColor = colorMap[color]
  const opacityMultiplier = intensityMap[intensity]

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* 메인 오로라 빛무리 - 하나의 큰 그라디언트 */}
      <motion.div
        className="absolute"
        style={{
          width: '150%',
          height: '120%',
          left: '-25%',
          top: '-10%',
          background: `
            radial-gradient(ellipse 80% 60% at 50% 50%,
              ${baseColor} 0%,
              rgba(139, 92, 246, 0.25) 25%,
              rgba(6, 182, 212, 0.15) 50%,
              transparent 70%
            )
          `,
          filter: 'blur(80px)',
          opacity: opacityMultiplier,
        }}
        animate={{
          x: ['-20%', '20%', '-10%', '15%', '-20%'],
          y: ['-15%', '10%', '-5%', '15%', '-15%'],
          scale: [1, 1.15, 0.95, 1.1, 1],
          opacity: [
            0.3 * opacityMultiplier,
            0.6 * opacityMultiplier,
            0.4 * opacityMultiplier,
            0.7 * opacityMultiplier,
            0.3 * opacityMultiplier
          ],
        }}
        transition={{
          duration: 25,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      />

      {/* 보조 빛무리 - 반대 방향으로 이동 */}
      <motion.div
        className="absolute"
        style={{
          width: '100%',
          height: '100%',
          left: '0%',
          top: '0%',
          background: `
            radial-gradient(ellipse 60% 50% at 30% 70%,
              rgba(168, 85, 247, 0.3) 0%,
              rgba(59, 130, 246, 0.2) 40%,
              transparent 70%
            )
          `,
          filter: 'blur(60px)',
          opacity: opacityMultiplier * 0.7,
        }}
        animate={{
          x: ['30%', '-20%', '25%', '-15%', '30%'],
          y: ['20%', '-10%', '15%', '-20%', '20%'],
          scale: [0.9, 1.1, 1, 1.15, 0.9],
          opacity: [
            0.2 * opacityMultiplier,
            0.5 * opacityMultiplier,
            0.3 * opacityMultiplier,
            0.6 * opacityMultiplier,
            0.2 * opacityMultiplier
          ],
        }}
        transition={{
          duration: 30,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop',
          delay: 5,
        }}
      />

      {/* 비네팅 효과 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,7,18,0.6)_80%,rgba(3,7,18,0.9)_100%)]" />
    </div>
  )
}
