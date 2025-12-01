import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  neonBorder?: boolean
  variant?: 'dark' | 'light'
}

export function Card({ children, className = '', hover = false, neonBorder = false, variant = 'dark' }: CardProps) {
  const hoverClass = hover ? 'hover:border-neon-cyan-500/50 hover:shadow-neon-cyan transition-all duration-300' : ''

  const variantStyles = {
    dark: {
      surface: 'surface-dark',
      border: neonBorder ? 'border-neon-cyan-500/30' : 'border-dark-600'
    },
    light: {
      surface: 'bg-white',
      border: 'border-gray-200'
    }
  }

  return (
    <div
      className={`
        ${variantStyles[variant].surface}
        rounded-xl
        border ${variantStyles[variant].border}
        p-4 lg:p-6
        ${variant === 'dark' ? 'backdrop-blur-sm' : 'shadow-sm'}
        ${hoverClass}
        overflow-hidden
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

interface CardTitleProps {
  children: ReactNode
  className?: string
  variant?: 'dark' | 'light'
}

export function CardTitle({ children, className = '', variant = 'dark' }: CardTitleProps) {
  const textColor = variant === 'light' ? 'text-gray-900' : 'text-text-primary'
  return <h3 className={`text-xl font-bold ${textColor} ${className}`}>{children}</h3>
}

interface CardContentProps {
  children: ReactNode
  className?: string
  variant?: 'dark' | 'light'
}

export function CardContent({ children, className = '', variant = 'dark' }: CardContentProps) {
  const textColor = variant === 'light' ? 'text-gray-600' : 'text-text-secondary'
  return <div className={`${textColor} ${className}`}>{children}</div>
}
