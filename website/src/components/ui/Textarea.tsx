import { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  helperText?: string
  variant?: 'dark' | 'light'
}

export function Textarea({
  label,
  id,
  error,
  helperText,
  required = false,
  className = '',
  variant = 'dark',
  ...props
}: TextareaProps) {
  const variantStyles = {
    dark: {
      label: 'text-text-secondary',
      textarea: 'bg-dark-800 text-text-primary border-dark-600 placeholder:text-text-muted focus:border-neon-cyan-500 focus:shadow-neon-cyan',
      helper: 'text-text-tertiary'
    },
    light: {
      label: 'text-gray-700',
      textarea: 'bg-gray-50 text-gray-900 border-gray-300 placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
      helper: 'text-gray-500'
    }
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={`block text-sm font-medium ${variantStyles[variant].label}`}
      >
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>

      <textarea
        id={id}
        className={`
          w-full px-3 py-2.5 lg:px-4 lg:py-3
          text-sm lg:text-base
          border rounded-lg
          transition-all duration-300
          resize-vertical
          focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          min-w-0
          ${variantStyles[variant].textarea}
          ${error ? 'border-error-500 focus:border-error-500 focus:shadow-[0_0_10px_rgba(255,51,102,0.3)]' : ''}
          ${className}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...props}
      />

      {error && (
        <p id={`${id}-error`} className="text-sm text-error-500 flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={`${id}-helper`} className={`text-sm ${variantStyles[variant].helper}`}>
          {helperText}
        </p>
      )}
    </div>
  )
}
