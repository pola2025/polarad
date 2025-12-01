import { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
  className?: string
  fullWidth?: boolean
}

type ButtonProps = BaseButtonProps &
  (
    | ({ href: string } & { onClick?: never; type?: never })
    | ({ href?: never } & ButtonHTMLAttributes<HTMLButtonElement>)
  )

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  fullWidth = false,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-300 rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group'

  const variants = {
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/30
      active:scale-95 active:bg-primary-700
    `,
    secondary: `
      bg-white text-primary-900 border-2 border-neutral-200
      hover:border-primary-500 hover:text-primary-600 hover:-translate-y-0.5
      active:scale-95 active:bg-neutral-50
    `,
    outline: `
      bg-transparent text-primary-600 border-2 border-primary-600
      hover:bg-primary-50 hover:-translate-y-0.5
      active:scale-95
    `,
    ghost: `
      bg-transparent text-neutral-600
      hover:bg-neutral-100 hover:text-neutral-900
      active:scale-95
    `,
    glow: `
      bg-accent-500 text-white
      shadow-[0_0_20px_rgba(245,158,11,0.5)]
      hover:bg-accent-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.8)] hover:-translate-y-0.5
      active:scale-95 border border-accent-400
      animate-pulse-slow
    `
  }

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
    xl: 'h-16 px-10 text-xl'
  }

  const widthClass = fullWidth ? 'w-full' : ''

  const combinedClassName = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    widthClass,
    className
  )

  const content = (
    <>
      {/* Shine effect for primary and glow variants */}
      {(variant === 'primary' || variant === 'glow') && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  )

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={combinedClassName}>
        {content}
      </Link>
    )
  }

  return (
    <button
      className={combinedClassName}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  )
}
