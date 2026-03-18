import { AlertTriangle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  CURRENCIES,
  type Currency,
  saaCurrencyExposure,
  SAA_MXN_EXPOSURE,
  fxForwardPair,
  fxAchievableRange,
} from '@/data/mesaDinero'
import { cn } from '@/lib/utils'

interface MonedasTabProps {
  fxTargets: Record<Currency, number>
  onChange:  (targets: Record<Currency, number>) => void
}

// Derive MXN exposure as residual
function derivedMxn(targets: Record<Currency, number>): number {
  const nonMxnSum = CURRENCIES.reduce((s, c) => s + targets[c], 0)
  return 100 - nonMxnSum
}

// Check if a target is outside the achievable range
function isOutOfRange(currency: Currency, target: number): boolean {
  const [min, max] = fxAchievableRange[currency]
  return target < min || target > max
}

const CURRENCY_LABELS: Record<Currency | 'MXN', string> = {
  MXN: 'Peso Mexicano',
  USD: 'Dólar EE.UU.',
  EUR: 'Euro',
  JPY: 'Yen Japonés',
  GBP: 'Libra Esterlina',
}

const CURRENCY_FLAGS: Record<Currency | 'MXN', string> = {
  MXN: '🇲🇽',
  USD: '🇺🇸',
  EUR: '🇪🇺',
  JPY: '🇯🇵',
  GBP: '🇬🇧',
}

export function MonedasTab({ fxTargets, onChange }: MonedasTabProps) {
  const mxnTarget  = derivedMxn(fxTargets)
  const mxnDelta   = mxnTarget - SAA_MXN_EXPOSURE
  const mxnWarning = mxnTarget < 10  // below minimum MXN floor

  const handleChange = (currency: Currency, value: number) => {
    onChange({ ...fxTargets, [currency]: value })
  }

  return (
    <div className="space-y-4">
      {/* Info bar */}
      <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
        <Info size={13} className="text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed">
          Exposición cambiaria SAA calculada sobre el benchmark <strong>Balanceado</strong>.
          El peso mexicano (MXN) se calcula automáticamente como residual (100&nbsp;%&nbsp;−&nbsp;Σ&nbsp;otras).
          Las columnas <em>Forward</em> muestran el contrato FX necesario para alcanzar el target.
        </p>
      </div>

      {/* Main currency table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Exposición por moneda</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Table header */}
          <div className="grid grid-cols-[160px_1fr_80px_80px_160px_32px] gap-x-3 px-6 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            <span>Moneda</span>
            <span>Target&nbsp;(deslizar)</span>
            <span className="text-right">SAA&nbsp;%</span>
            <span className="text-right">Delta</span>
            <span className="text-center">Forward requerido</span>
            <span />
          </div>

          {/* Non-MXN rows */}
          {CURRENCIES.map(currency => {
            const saa    = saaCurrencyExposure[currency]
            const target = fxTargets[currency]
            const delta  = target - saa
            const outOfRange = isOutOfRange(currency, target)
            const [rangeMin, rangeMax] = fxAchievableRange[currency]

            // Forward description
            const pair       = fxForwardPair[currency]
            const forwardAbs = Math.abs(delta)
            const direction  = delta > 0 ? 'compra' : delta < 0 ? 'venta' : null

            return (
              <div
                key={currency}
                className={cn(
                  'grid grid-cols-[160px_1fr_80px_80px_160px_32px] gap-x-3 px-6 py-3 border-b border-slate-50 items-center',
                  outOfRange && 'bg-rose-50/60',
                )}
              >
                {/* Currency label */}
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{CURRENCY_FLAGS[currency]}</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{currency}</p>
                    <p className="text-[10px] text-slate-400">{CURRENCY_LABELS[currency]}</p>
                  </div>
                </div>

                {/* Slider */}
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={rangeMin}
                    max={rangeMax}
                    step={0.5}
                    value={target}
                    onChange={e => handleChange(currency, parseFloat(e.target.value))}
                    className="flex-1 h-5 appearance-none bg-transparent cursor-pointer accent-brand-600
                      [&::-webkit-slider-runnable-track]:h-1.5
                      [&::-webkit-slider-runnable-track]:rounded-full
                      [&::-webkit-slider-runnable-track]:bg-slate-200
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-3.5
                      [&::-webkit-slider-thumb]:h-3.5
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-brand-600
                      [&::-webkit-slider-thumb]:shadow
                    "
                  />
                  <span className="text-xs font-bold text-slate-700 tabular-nums w-10 text-right">
                    {target.toFixed(1)}&nbsp;%
                  </span>
                </div>

                {/* SAA % */}
                <div className="text-right">
                  <span className="text-xs text-slate-500 tabular-nums">{saa.toFixed(1)}&nbsp;%</span>
                </div>

                {/* Delta */}
                <div className="text-right">
                  <span className={cn(
                    'text-xs font-semibold tabular-nums',
                    delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-red-500' : 'text-slate-400',
                  )}>
                    {delta > 0 ? '+' : ''}{delta.toFixed(1)}&nbsp;pp
                  </span>
                </div>

                {/* Forward required */}
                <div className="text-center">
                  {Math.abs(delta) < 0.1 ? (
                    <span className="text-[10px] text-slate-400">Sin forward</span>
                  ) : (
                    <div className={cn(
                      'inline-flex flex-col items-center px-2 py-1 rounded text-[10px] font-medium',
                      outOfRange
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200',
                    )}>
                      <span className="font-bold">{pair} {direction}</span>
                      <span className="text-[9px]">{forwardAbs.toFixed(1)}&nbsp;% del portafolio</span>
                    </div>
                  )}
                </div>

                {/* Alert icon */}
                <div className="flex items-center justify-center">
                  {outOfRange && (
                    <AlertTriangle size={13} className="text-rose-500" aria-label="Target fuera del rango alcanzable" />
                  )}
                </div>
              </div>
            )
          })}

          {/* MXN derived row */}
          <div className={cn(
            'grid grid-cols-[160px_1fr_80px_80px_160px_32px] gap-x-3 px-6 py-3 items-center',
            mxnWarning ? 'bg-amber-50/60' : 'bg-slate-50/60',
          )}>
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">{CURRENCY_FLAGS['MXN']}</span>
              <div>
                <p className="text-xs font-semibold text-slate-800">MXN</p>
                <p className="text-[10px] text-slate-400">{CURRENCY_LABELS['MXN']}</p>
              </div>
            </div>

            {/* Visual bar (read-only) */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-300',
                    mxnWarning ? 'bg-amber-400' : 'bg-slate-400',
                  )}
                  style={{ width: `${Math.max(0, Math.min(100, mxnTarget))}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-600 tabular-nums w-10 text-right">
                {mxnTarget.toFixed(1)}&nbsp;%
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 tabular-nums">
                {SAA_MXN_EXPOSURE.toFixed(1)}&nbsp;%
              </span>
            </div>

            <div className="text-right">
              <span className={cn(
                'text-xs font-semibold tabular-nums',
                mxnDelta > 0 ? 'text-emerald-600' : mxnDelta < 0 ? 'text-red-500' : 'text-slate-400',
              )}>
                {mxnDelta > 0 ? '+' : ''}{mxnDelta.toFixed(1)}&nbsp;pp
              </span>
            </div>

            <div className="text-center">
              <span className="text-[10px] text-slate-400 italic">Residual</span>
            </div>
            <div className="flex items-center justify-center">
              {mxnWarning && (
                <AlertTriangle size={13} className="text-amber-500" aria-label="MXN por debajo del mínimo requerido" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert list */}
      {(CURRENCIES.some(c => isOutOfRange(c, fxTargets[c])) || mxnWarning) && (
        <div className="space-y-2">
          {CURRENCIES.filter(c => isOutOfRange(c, fxTargets[c])).map(currency => {
            const [min, max] = fxAchievableRange[currency]
            const target     = fxTargets[currency]
            const pair       = fxForwardPair[currency]
            const delta      = target - saaCurrencyExposure[currency]
            const direction  = delta > 0 ? 'compra' : 'venta'
            return (
              <div key={currency} className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
                <AlertTriangle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-rose-800">
                    Target {currency} fuera del rango alcanzable [{min}&nbsp;%,&nbsp;{max}&nbsp;%]
                  </p>
                  <p className="text-xs text-rose-700 mt-0.5">
                    Para alcanzar {target.toFixed(1)}&nbsp;% se requiere {pair}&nbsp;<strong>{direction}</strong>{' '}
                    por {Math.abs(delta).toFixed(1)}&nbsp;% del portafolio — supera el límite de overlay permitido.
                    Considere reducir el target o solicitar autorización especial.
                  </p>
                </div>
              </div>
            )
          })}

          {mxnWarning && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                Exposición MXN derivada ({mxnTarget.toFixed(1)}&nbsp;%) por debajo del piso mínimo de 10&nbsp;%.
                Reduzca el target de otras monedas para incrementar la exposición en MXN.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
