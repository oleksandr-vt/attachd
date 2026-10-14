import Link from 'next/link'
import type { MouseEventHandler, ReactNode } from 'react'

type AppButtonProps = {
  href?: string
  label?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'tertiary'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  showArrow?: boolean
  className?: string
  onClick?: MouseEventHandler<HTMLElement>
  children?: ReactNode
}

const sizeClasses = {
  sm: 'px-5 py-3 text-sm',
  md: 'px-7 py-3.5 text-[15px]',
  lg: 'px-9 py-4.5 text-[17px]',
}

const variantClasses = {
  primary: 'bg-terra text-cream hover:-translate-y-px hover:bg-terra-dk',
  secondary: 'border border-border bg-sec-bg text-dark hover:-translate-y-px hover:border-soft-muted hover:bg-white',
  outline: 'border border-border bg-white text-dark hover:-translate-y-px hover:border-soft-muted',
  tertiary: 'border border-border bg-white text-muted hover:-translate-y-px hover:border-soft-muted hover:text-dark',
}

export default function AppButton({
  href = '',
  label = '',
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  showArrow = false,
  className,
  onClick,
  children,
}: AppButtonProps) {
  const rootClassName = [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200',
    'disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0',
    disabled ? 'pointer-events-none opacity-55' : '',
    sizeClasses[size],
    variantClasses[variant],
    className,
  ].filter(Boolean).join(' ')

  const content = (
    <>
      <span>{children ?? label}</span>
      {showArrow && <span aria-hidden="true">&rarr;</span>}
    </>
  )

  if (href && !/^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <Link href={href} className={rootClassName} aria-disabled={disabled || undefined} onClick={onClick}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={rootClassName} aria-disabled={disabled || undefined} onClick={onClick}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} disabled={disabled} className={rootClassName} onClick={onClick}>
      {content}
    </button>
  )
}
