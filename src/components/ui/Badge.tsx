import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
  style?: React.CSSProperties
}

const variantStyles: Record<string, string> = {
  default:  'bg-slate-100 text-slate-700',
  success:  'bg-emerald-100 text-emerald-800',
  warning:  'bg-amber-100 text-amber-800',
  danger:   'bg-red-100 text-red-800',
  info:     'bg-blue-100 text-blue-800',
}

export function Badge({ children, variant = 'default', className, style }: BadgeProps) {
  return (
    <span style={style} className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', variantStyles[variant], className)}>
      {children}
    </span>
  )
}
