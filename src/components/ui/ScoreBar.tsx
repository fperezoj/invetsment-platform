import { cn } from '@/lib/utils'
import { scoreBarColor, scoreTier } from '@/lib/kycScoring'

interface ScoreBarProps {
  label: string
  score: number          // 0–100
  size?: 'sm' | 'md' | 'lg'
  showTier?: boolean
  showValue?: boolean
  className?: string
}

const heightMap = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }
const textMap   = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm' }

export function ScoreBar({
  label,
  score,
  size = 'md',
  showTier = false,
  showValue = true,
  className,
}: ScoreBarProps) {
  const clampedScore = Math.max(0, Math.min(100, score))
  const fillColor    = scoreBarColor(clampedScore)

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-baseline justify-between gap-2">
        <span className={cn('font-medium text-slate-600', textMap[size])}>
          {label}
        </span>
        <span className={cn('font-bold tabular-nums text-slate-800', textMap[size])}>
          {showValue && `${clampedScore}`}
          {showTier  && (
            <span className={cn('ml-1.5 font-normal text-slate-400', textMap[size])}>
              {scoreTier(clampedScore)}
            </span>
          )}
        </span>
      </div>

      <div className={cn('w-full bg-slate-100 rounded-full', heightMap[size])}>
        <div
          className={cn('rounded-full transition-all duration-500', heightMap[size], fillColor)}
          style={{ width: `${clampedScore}%` }}
        />
      </div>
    </div>
  )
}
