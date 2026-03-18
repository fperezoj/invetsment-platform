import { AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { assetClassMap } from '@/data/assetClasses'
import { regions, STANDALONE_SECTORS, MAX_SECTOR_MAGNITUDE } from '@/data/mesaDinero'
import { rebalanceRegion, forceBalance, regionSum } from '@/lib/rebalance'
import { cn } from '@/lib/utils'

interface SectoresTabProps {
  views:    Record<string, number>
  onChange: (views: Record<string, number>) => void
}

// ─── Sector Slider ────────────────────────────────────────────────────────────

interface SectorSliderProps {
  assetClassId: string
  value:        number
  regionColor:  string
  onChange:     (value: number) => void
}

function SectorSlider({ assetClassId, value, regionColor, onChange }: SectorSliderProps) {
  const ac = assetClassMap[assetClassId]
  const abs = Math.abs(value)

  // Determine display color
  const sign = value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral'
  const signColor = {
    positive: 'text-emerald-600',
    negative: 'text-red-500',
    neutral:  'text-slate-400',
  }[sign]

  const signLabel = value > 0 ? `+${value}` : value === 0 ? '0' : `${value}`

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ac?.color }} />
          <span className="text-xs font-medium text-slate-700 truncate">{ac?.name ?? assetClassId}</span>
        </div>
        <span className={cn('text-sm font-bold tabular-nums shrink-0 w-10 text-right', signColor)}>
          {signLabel} pp
        </span>
      </div>

      {/* Track with zero-centered visual */}
      <div className="relative flex items-center gap-2">
        <span className="text-[9px] text-slate-400 w-5 text-right shrink-0">
          {-MAX_SECTOR_MAGNITUDE}
        </span>

        <div className="relative flex-1 h-5 flex items-center">
          {/* Background track */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-1.5 bg-slate-100 rounded-full" />
            {/* Zero marker */}
            <div className="absolute left-1/2 -translate-x-px w-0.5 h-3 bg-slate-300 rounded-full" />
          </div>

          {/* Filled portion — centered at 50% of the track */}
          <div className="absolute inset-0 flex items-center">
            {value !== 0 && (
              <div
                className={cn(
                  'absolute h-1.5 rounded-full transition-all duration-150',
                  value > 0 ? 'bg-emerald-500' : 'bg-red-400',
                )}
                style={
                  value > 0
                    ? { left: '50%', width: `${(value / MAX_SECTOR_MAGNITUDE) * 50}%` }
                    : { right: '50%', width: `${(abs / MAX_SECTOR_MAGNITUDE) * 50}%` }
                }
              />
            )}
          </div>

          {/* Range input */}
          <input
            type="range"
            min={-MAX_SECTOR_MAGNITUDE}
            max={MAX_SECTOR_MAGNITUDE}
            step={0.5}
            value={value}
            onChange={e => onChange(parseFloat(e.target.value))}
            className="relative w-full h-5 appearance-none bg-transparent cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:shadow-sm
              [&::-webkit-slider-thumb]:transition-colors
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border-2
              [&::-moz-range-thumb]:border-slate-400
            "
            style={{ '--thumb-color': regionColor } as React.CSSProperties}
          />
        </div>

        <span className="text-[9px] text-slate-400 w-5 shrink-0">
          +{MAX_SECTOR_MAGNITUDE}
        </span>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SectoresTab({ views, onChange }: SectoresTabProps) {
  const handleSlide = (regionIds: string[], changedId: string, newValue: number) => {
    onChange(rebalanceRegion(views, changedId, newValue, regionIds))
  }

  const handleAutoBalance = (regionIds: string[]) => {
    onChange(forceBalance(views, regionIds))
  }

  return (
    <div className="space-y-4">
      {/* Standalone efectivo */}
      {STANDALONE_SECTORS.map(id => {
        const ac = assetClassMap[id]
        return (
          <Card key={id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ac?.color }} />
                  {ac?.name ?? id}
                </CardTitle>
                <span className="text-[10px] text-slate-400">Sin restricción de balance</span>
              </div>
            </CardHeader>
            <CardContent>
              <SectorSlider
                assetClassId={id}
                value={views[id] ?? 0}
                regionColor="#94a3b8"
                onChange={val => onChange({ ...views, [id]: val })}
              />
            </CardContent>
          </Card>
        )
      })}

      {/* Regions */}
      {regions.map(region => {
        const sum     = regionSum(views, region.sectorIds)
        const balanced = Math.abs(sum) < 0.01

        return (
          <Card key={region.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: region.color }} />
                  <CardTitle>{region.label}</CardTitle>
                </div>

                <div className="flex items-center gap-2">
                  {/* Region sum indicator */}
                  <div className={cn(
                    'flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border',
                    balanced
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200',
                  )}>
                    {balanced ? (
                      <>Σ = 0 ✓</>
                    ) : (
                      <>
                        <AlertCircle size={10} />
                        Σ = {sum > 0 ? `+${sum.toFixed(1)}` : sum.toFixed(1)} pp
                      </>
                    )}
                  </div>

                  {/* Auto-balance button — only shown when unbalanced */}
                  {!balanced && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleAutoBalance(region.sectorIds)}
                      className="h-6 px-2 text-[10px]"
                    >
                      <RefreshCw size={9} />
                      Auto-balancear
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {region.sectorIds.map(sectorId => (
                <SectorSlider
                  key={sectorId}
                  assetClassId={sectorId}
                  value={views[sectorId] ?? 0}
                  regionColor={region.color}
                  onChange={val => handleSlide(region.sectorIds, sectorId, val)}
                />
              ))}

              {/* Unbalanced warning */}
              {!balanced && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                  <AlertCircle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-700 leading-relaxed">
                    La región no está balanceada (Σ = {sum.toFixed(1)} pp).
                    Use el botón <strong>Auto-balancear</strong> o ajuste los sliders manualmente.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
