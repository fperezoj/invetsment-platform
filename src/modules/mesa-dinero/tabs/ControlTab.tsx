import { CheckCircle2, XCircle, AlertTriangle, Send, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  regions,
  CURRENCIES,
  type Currency,
  fxAchievableRange,
  MAX_SECTOR_MAGNITUDE,
  MAX_TE_IMPLIED,
  MIN_MXN_EXPOSURE,
} from '@/data/mesaDinero'
import { computeImpliedTE, allRegionsBalanced, regionSum } from '@/lib/rebalance'
import { cn } from '@/lib/utils'

interface ControlTabProps {
  sectorViews: Record<string, number>
  fxTargets:   Record<Currency, number>
  onPublish:   () => void
  published:   boolean
}

function derivedMxn(targets: Record<Currency, number>): number {
  return 100 - CURRENCIES.reduce((s, c) => s + targets[c], 0)
}

interface ConstraintRow {
  id:       string
  label:    string
  detail:   string
  passed:   boolean
}

export function ControlTab({ sectorViews, fxTargets, onPublish, published }: ControlTabProps) {
  const te = computeImpliedTE(sectorViews)

  // ── Build constraint list ────────────────────────────────────────────────────
  const regionGroups  = regions.map(r => r.sectorIds)
  const allBalanced   = allRegionsBalanced(sectorViews, regionGroups)

  const unbalancedRegions = regions.filter(
    r => Math.abs(regionSum(sectorViews, r.sectorIds)) > 0.01,
  )

  const maxMag         = Math.max(...Object.values(sectorViews).map(Math.abs))
  const maxMagOk       = maxMag <= MAX_SECTOR_MAGNITUDE
  const teOk           = te <= MAX_TE_IMPLIED

  const mxnExposure    = derivedMxn(fxTargets)
  const mxnOk          = mxnExposure >= MIN_MXN_EXPOSURE

  const fxViolations   = CURRENCIES.filter(c => {
    const [min, max] = fxAchievableRange[c]
    return fxTargets[c] < min || fxTargets[c] > max
  })
  const fxOk = fxViolations.length === 0

  const constraints: ConstraintRow[] = [
    {
      id:     'region_balance',
      label:  'Balance regional',
      detail: allBalanced
        ? 'Todas las regiones suman 0 pp'
        : `${unbalancedRegions.map(r => r.label).join(', ')} sin balancear`,
      passed: allBalanced,
    },
    {
      id:     'max_magnitude',
      label:  'Desviación máxima por sector',
      detail: maxMagOk
        ? `Máximo actual: ${maxMag} pp ≤ ${MAX_SECTOR_MAGNITUDE} pp`
        : `${maxMag} pp supera el límite de ${MAX_SECTOR_MAGNITUDE} pp`,
      passed: maxMagOk,
    },
    {
      id:     'te_budget',
      label:  'Presupuesto de Tracking Error',
      detail: teOk
        ? `TE implícita: ${te.toFixed(2)} % ≤ ${MAX_TE_IMPLIED} %`
        : `TE implícita ${te.toFixed(2)} % supera el límite de ${MAX_TE_IMPLIED} %`,
      passed: teOk,
    },
    {
      id:     'fx_achievable',
      label:  'Targets FX alcanzables',
      detail: fxOk
        ? 'Todos los targets dentro del rango permitido'
        : `${fxViolations.join(', ')}: target fuera del rango de overlay`,
      passed: fxOk,
    },
    {
      id:     'min_mxn',
      label:  'Exposición mínima MXN',
      detail: mxnOk
        ? `MXN: ${mxnExposure.toFixed(1)} % ≥ ${MIN_MXN_EXPOSURE} %`
        : `MXN: ${mxnExposure.toFixed(1)} % por debajo del piso de ${MIN_MXN_EXPOSURE} %`,
      passed: mxnOk,
    },
  ]

  const allPassed      = constraints.every(c => c.passed)
  const violationCount = constraints.filter(c => !c.passed).length

  // ── TE gauge percentages ─────────────────────────────────────────────────────
  const tePct    = Math.min(100, (te / MAX_TE_IMPLIED) * 100)
  const teColor  = te < MAX_TE_IMPLIED * 0.7
    ? 'bg-emerald-500'
    : te < MAX_TE_IMPLIED
    ? 'bg-amber-400'
    : 'bg-rose-500'

  const teTextColor = te < MAX_TE_IMPLIED * 0.7
    ? 'text-emerald-600'
    : te < MAX_TE_IMPLIED
    ? 'text-amber-600'
    : 'text-rose-600'

  // Active weight summary for each region
  const regionStats = regions.map(r => ({
    ...r,
    sum:          regionSum(sectorViews, r.sectorIds),
    totalActive:  r.sectorIds.reduce((s, id) => s + Math.abs(sectorViews[id] ?? 0), 0),
    balanced:     Math.abs(regionSum(sectorViews, r.sectorIds)) < 0.01,
  }))

  return (
    <div className="space-y-4">
      {/* ── TE gauge ──────────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Activity size={14} className={teTextColor} />
            <CardTitle>Tracking Error implícita</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-end gap-3">
            <span className={cn('text-4xl font-black tabular-nums', teTextColor)}>
              {te.toFixed(2)}
            </span>
            <span className="text-sm text-slate-400 mb-1">%&nbsp;anualizado</span>
            <span className="text-xs text-slate-400 mb-1 ml-auto">
              Límite: {MAX_TE_IMPLIED}&nbsp;%
            </span>
          </div>

          {/* TE bar */}
          <div className="space-y-1">
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative">
              {/* Limit marker at 100% */}
              <div className="absolute inset-y-0 right-0 w-0.5 bg-slate-300" />
              <div
                className={cn('h-full rounded-full transition-all duration-500', teColor)}
                style={{ width: `${tePct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 %</span>
              <span
                className={cn(
                  'font-semibold',
                  tePct > 85 ? 'text-rose-600' : tePct > 65 ? 'text-amber-600' : 'text-slate-400',
                )}
              >
                {tePct.toFixed(0)}&nbsp;% del presupuesto
              </span>
              <span>{MAX_TE_IMPLIED}&nbsp;%</span>
            </div>
          </div>

          {/* Region breakdown */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {regionStats.map(r => (
              <div
                key={r.id}
                className={cn(
                  'text-center px-2 py-2 rounded-lg border text-xs',
                  r.balanced
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-amber-50 border-amber-200',
                )}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="font-semibold text-slate-700">{r.label}</span>
                </div>
                <p className="text-slate-500 text-[10px]">
                  Activo total: {r.totalActive}&nbsp;pp
                </p>
                <p className={cn('font-bold text-[10px]', r.balanced ? 'text-emerald-600' : 'text-amber-600')}>
                  Σ = {r.sum > 0 ? `+${r.sum.toFixed(1)}` : r.sum.toFixed(1)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Constraint checklist ──────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Restricciones</CardTitle>
            <span className={cn(
              'text-xs font-bold px-2 py-0.5 rounded-full',
              allPassed
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700',
            )}>
              {allPassed ? 'Todo OK' : `${violationCount} violación${violationCount > 1 ? 'es' : ''}`}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-1">
          {constraints.map(c => (
            <div
              key={c.id}
              className={cn(
                'flex items-start gap-3 px-3 py-2.5 rounded-lg border',
                c.passed
                  ? 'bg-emerald-50/60 border-emerald-100'
                  : 'bg-rose-50/60 border-rose-200',
              )}
            >
              <div className="shrink-0 mt-0.5">
                {c.passed
                  ? <CheckCircle2 size={14} className="text-emerald-500" />
                  : <XCircle     size={14} className="text-rose-500"    />
                }
              </div>
              <div>
                <p className={cn('text-xs font-semibold', c.passed ? 'text-emerald-800' : 'text-rose-800')}>
                  {c.label}
                </p>
                <p className={cn('text-[10px] mt-0.5', c.passed ? 'text-emerald-600' : 'text-rose-600')}>
                  {c.detail}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Publish section ───────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="py-5">
          {published ? (
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <CheckCircle2 size={32} className="text-emerald-500" />
              <div>
                <p className="text-sm font-bold text-emerald-800">Vista táctica publicada</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {!allPassed && (
                <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">
                  <AlertTriangle size={13} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-700">
                    No se puede publicar: hay <strong>{violationCount}</strong> restricción{violationCount > 1 ? 'es' : ''} violada{violationCount > 1 ? 's' : ''}.
                    Resuelva todos los problemas antes de publicar.
                  </p>
                </div>
              )}

              <Button
                className="w-full"
                disabled={!allPassed}
                onClick={onPublish}
              >
                <Send size={14} />
                {allPassed ? 'Publicar vista táctica' : 'Publicar (bloqueado)'}
              </Button>

              {allPassed && (
                <p className="text-[10px] text-center text-slate-400">
                  La publicación enviará la vista táctica al optimizador y la registrará con timestamp.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
