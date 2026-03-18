import { AlertTriangle, CheckCircle, RotateCcw, ChevronRight, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  profile3Labels,
  profile3Colors,
  profileLabels,
  subdimensionLabels,
} from '@/data/kyc'
import { BRECHA_THRESHOLD, scoreTier } from '@/lib/kycScoring'
import { cn } from '@/lib/utils'
import type { KycAssessment, KycSubdimension } from '@/types'

interface KycResultProps {
  assessment: KycAssessment
  onReset: () => void
}

// Ordered list keeps Capacidad subdims before Apetito subdims
const SUBDIM_ORDER: KycSubdimension[] = [
  'horizonte_temporal',
  'situacion_patrimonial',
  'liquidez',
  'tolerancia_perdidas',
  'experiencia_inversora',
  'expectativa_retorno',
]

const SUBDIM_DIMENSION: Record<KycSubdimension, 'capacidad' | 'apetito'> = {
  horizonte_temporal:    'capacidad',
  situacion_patrimonial: 'capacidad',
  liquidez:              'capacidad',
  tolerancia_perdidas:   'apetito',
  experiencia_inversora: 'apetito',
  expectativa_retorno:   'apetito',
}

export function KycResult({ assessment, onReset }: KycResultProps) {
  const navigate = useNavigate()
  const { scores, perfil, perfil3 } = assessment
  const p3cfg = profile3Colors[perfil3]

  return (
    <div className="space-y-5">
      {/* ── Score comparison panel ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Scores por dimensión</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Capacidad */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">
                Capacidad
              </span>
              <span className="text-xs text-slate-400">
                {scoreTier(scores.capacidad)} · {scores.capacidad} / 100
              </span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 bg-brand-500"
                style={{ width: `${scores.capacidad}%` }}
              />
            </div>
          </div>

          {/* Apetito */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                Apetito
              </span>
              <span className="text-xs text-slate-400">
                {scoreTier(scores.apetito)} · {scores.apetito} / 100
              </span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 bg-emerald-500"
                style={{ width: `${scores.apetito}%` }}
              />
            </div>
          </div>

          {/* Gap indicator */}
          <div className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border',
            scores.tieneBrecha
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-slate-50 border-slate-200 text-slate-500',
          )}>
            <Info size={13} className="shrink-0" />
            <span>
              Brecha Capacidad – Apetito:{' '}
              <strong>{scores.brecha} pp</strong>
              {scores.tieneBrecha
                ? ` — supera el umbral de ${BRECHA_THRESHOLD} pp`
                : ` — dentro del umbral de ${BRECHA_THRESHOLD} pp`}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ── Gap alert ─────────────────────────────────────────────────────── */}
      {scores.tieneBrecha && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 flex gap-3">
          <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-amber-800">
              Brecha entre Capacidad y Apetito detectada
            </p>
            <p className="text-xs text-amber-700 leading-relaxed">
              La diferencia entre el score de Capacidad ({scores.capacidad}) y el de Apetito ({scores.apetito}) es
              de <strong>{scores.brecha} puntos</strong>, lo que supera el umbral de {BRECHA_THRESHOLD} pp.
              Se aplica corrección conservadora: el perfil se asigna usando el score más bajo
              de las dos dimensiones ({Math.min(scores.capacidad, scores.apetito)} pts).
            </p>
          </div>
        </div>
      )}

      {/* ── Effective profile ─────────────────────────────────────────────── */}
      <Card>
        <CardContent className="py-5">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Effective score gauge */}
            <div className="text-center">
              <div className={cn(
                'w-24 h-24 rounded-full flex flex-col items-center justify-center border-4',
                scores.tieneBrecha ? 'border-amber-400' : 'border-brand-400',
              )}>
                <span className="text-3xl font-black text-slate-800 leading-none">
                  {scores.efectivo}
                </span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">
                  efectivo
                </span>
              </div>
              {scores.tieneBrecha && (
                <p className="text-[9px] text-amber-600 font-medium mt-1 text-center">
                  corregido
                </p>
              )}
            </div>

            {/* Profile details */}
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div>
                <p className="text-xs text-slate-500 mb-1">Perfil asignado</p>
                <span className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-lg font-bold border',
                  p3cfg.bg, p3cfg.text, p3cfg.border,
                )}>
                  <CheckCircle size={16} />
                  {profile3Labels[perfil3]}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Perfil detallado (SAA):{' '}
                <span className="font-semibold text-slate-600">{profileLabels[perfil]}</span>
              </p>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Score efectivo {scores.efectivo}/100
                {scores.tieneBrecha
                  ? ' — ajustado por brecha conservadora'
                  : ' — promedio de Capacidad y Apetito'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Subdimension breakdown ────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Desglose por subdimensión</CardTitle>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-400 inline-block" />
                Capacidad
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Apetito
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          {SUBDIM_ORDER.map(sd => {
            const score = scores.subdimensiones[sd]
            const dim   = SUBDIM_DIMENSION[sd]
            return (
              <div key={sd} className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'w-1.5 h-1.5 rounded-full shrink-0',
                      dim === 'capacidad' ? 'bg-brand-400' : 'bg-emerald-400',
                    )} />
                    <span className="text-xs font-medium text-slate-600">
                      {subdimensionLabels[sd]}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 tabular-nums">
                    {score}
                    <span className="text-slate-400 font-normal">/100</span>
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      dim === 'capacidad'
                        ? score <= 33 ? 'bg-blue-400'   : score <= 66 ? 'bg-brand-400'   : 'bg-brand-500'
                        : score <= 33 ? 'bg-rose-400'   : score <= 66 ? 'bg-amber-400'   : 'bg-emerald-500',
                    )}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onReset} className="flex-1">
          <RotateCcw size={13} />
          Reiniciar
        </Button>
        <Button className="flex-1" onClick={() => navigate('/benchmark-saa')}>
          Ver Benchmark SAA
          <ChevronRight size={13} />
        </Button>
      </div>
    </div>
  )
}
