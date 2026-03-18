import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function StatCard({ label, value, sub, trend, className }: StatCardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 shadow-sm p-5', className)}>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      {sub && (
        <p className={cn(
          'mt-1 text-xs font-medium',
          trend === 'up'   && 'text-emerald-600',
          trend === 'down' && 'text-red-500',
          !trend           && 'text-slate-400',
        )}>
          {sub}
        </p>
      )}
    </div>
  )
}
