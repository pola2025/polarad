'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface FloatingLinesProps {
  lineCount?: number
  colors?: string[]
  speed?: number
  strokeWidth?: number
  className?: string
}

export function FloatingLines({
  lineCount = 30,
  colors = ['#3b82f6', '#8b5cf6', '#06b6d4'],
  speed = 1,
  strokeWidth = 1,
  className = '',
}: FloatingLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate random paths for the lines
  const generatePath = (index: number, width: number, height: number) => {
    const startX = Math.random() * width
    const startY = Math.random() * height
    const endX = Math.random() * width
    const endY = Math.random() * height
    
    // Create smooth bezier curves
    const controlX1 = startX + (Math.random() - 0.5) * width * 0.5
    const controlY1 = startY + (Math.random() - 0.5) * height * 0.5
    const controlX2 = endX + (Math.random() - 0.5) * width * 0.5
    const controlY2 = endY + (Math.random() - 0.5) * height * 0.5
    
    return `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`
  }

  const lines = Array.from({ length: lineCount }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    opacity: 0.1 + Math.random() * 0.3,
    duration: (15 + Math.random() * 20) / speed,
    delay: Math.random() * 5,
  }))

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
      >
        <defs>
          {colors.map((color, i) => (
            <linearGradient
              key={`gradient-${i}`}
              id={`line-gradient-${i}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={color} stopOpacity="0" />
              <stop offset="50%" stopColor={color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        
        {lines.map((line) => (
          <motion.path
            key={line.id}
            d={generatePath(line.id, 1000, 1000)}
            stroke={`url(#line-gradient-${line.id % colors.length})`}
            strokeWidth={strokeWidth}
            fill="none"
            opacity={line.opacity}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, line.opacity, 0],
            }}
            transition={{
              duration: line.duration,
              delay: line.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
      
      {/* Glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950/50" />
    </div>
  )
}
