import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { kycQuestions, dimensionLabels, subdimensionLabels } from '@/data/kyc'
import { cn } from '@/lib/utils'
import type { KycAnswers } from '@/types'

interface KycQuestionnaireProps {
  answers: KycAnswers
  currentIndex: number
  onAnswer: (questionId: string, score: number) => void
  onNext: () => void
  onBack: () => void
}

const CAPACIDAD_COUNT = kycQuestions.filter(q => q.dimension === 'capacidad').length
const APETITO_COUNT   = kycQuestions.filter(q => q.dimension === 'apetito').length
const TOTAL           = kycQuestions.length

const dimensionColors = {
  capacidad: { bar: 'bg-brand-500',   badge: 'bg-brand-50 text-brand-700 border-brand-200' },
  apetito:   { bar: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
}

export function KycQuestionnaire({
  answers,
  currentIndex,
  onAnswer,
  onNext,
  onBack,
}: KycQuestionnaireProps) {
  const question      = kycQuestions[currentIndex]
  const selectedScore = answers[question.id] ?? null
  const isAnswered    = selectedScore !== null
  const isLast        = currentIndex === TOTAL - 1

  // Per-block counts of answered questions
  const capacidadAnswered = kycQuestions
    .filter(q => q.dimension === 'capacidad')
    .filter(q => answers[q.id] !== undefined).length

  const apetitoAnswered = kycQuestions
    .filter(q => q.dimension === 'apetito')
    .filter(q => answers[q.id] !== undefined).length

  const capacidadPct = (capacidadAnswered / CAPACIDAD_COUNT) * 100
  const apetitoPct   = (apetitoAnswered   / APETITO_COUNT)   * 100

  const dimCfg = dimensionColors[question.dimension]

  return (
    <div className="space-y-5">
      {/* ── Dual-block progress bar ────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex gap-3">
          {/* Capacidad segment */}
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className={cn(
                'text-[10px] font-semibold uppercase tracking-wide',
                question.dimension === 'capacidad' ? 'text-brand-600' : 'text-slate-400',
              )}>
                Capacidad
              </span>
              <span className="text-[10px] text-slate-400 tabular-nums">
                {capacidadAnswered}/{CAPACIDAD_COUNT}
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-300"
                style={{ width: `${capacidadPct}%` }}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-slate-200 self-stretch mt-4" />

          {/* Apetito segment */}
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className={cn(
                'text-[10px] font-semibold uppercase tracking-wide',
                question.dimension === 'apetito' ? 'text-emerald-600' : 'text-slate-400',
              )}>
                Apetito
              </span>
              <span className="text-[10px] text-slate-400 tabular-nums">
                {apetitoAnswered}/{APETITO_COUNT}
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${apetitoPct}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 text-right">
          {Object.keys(answers).length} de {TOTAL} respondidas
        </p>
      </div>

      {/* ── Question card ──────────────────────────────────────────────────── */}
      <Card key={question.id}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-3">
            {/* Dimension badge */}
            <span className={cn(
              'text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border',
              dimCfg.badge,
            )}>
              {dimensionLabels[question.dimension]}
            </span>
            {/* Subdimension badge */}
            <span className="text-[10px] text-slate-400 font-medium">
              {subdimensionLabels[question.subdimension]}
            </span>
            {/* Question counter */}
            <span className="ml-auto text-[10px] font-semibold text-slate-400 tabular-nums">
              {currentIndex + 1} / {TOTAL}
            </span>
          </div>

          <p className="text-base font-semibold text-slate-800 leading-snug">
            {question.text}
          </p>
        </CardHeader>

        <CardContent className="space-y-2 pt-1">
          {question.options.map((opt) => (
            <button
              key={opt.score}
              onClick={() => onAnswer(question.id, opt.score)}
              className={cn(
                'w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all',
                selectedScore === opt.score
                  ? question.dimension === 'capacidad'
                    ? 'border-brand-500 bg-brand-50 text-brand-800 shadow-sm'
                    : 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50',
              )}
            >
              <span className={cn(
                'inline-flex items-center justify-center w-5 h-5 rounded-full border text-[10px] font-bold mr-3 shrink-0',
                selectedScore === opt.score
                  ? question.dimension === 'capacidad'
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-slate-300 text-slate-400',
              )}>
                {opt.score + 1}
              </span>
              {opt.label}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={onBack}
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={14} />
          Anterior
        </Button>

        {/* Question dot nav */}
        <div className="flex gap-1">
          {kycQuestions.map((q, idx) => {
            const answered = answers[q.id] !== undefined
            const isCurrent = idx === currentIndex
            return (
              <div
                key={q.id}
                title={`Pregunta ${idx + 1}`}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-all',
                  isCurrent
                    ? q.dimension === 'capacidad'
                      ? 'bg-brand-500 w-4'
                      : 'bg-emerald-500 w-4'
                    : answered
                    ? q.dimension === 'capacidad'
                      ? 'bg-brand-300'
                      : 'bg-emerald-300'
                    : 'bg-slate-200',
                )}
              />
            )
          })}
        </div>

        <Button onClick={onNext} disabled={!isAnswered}>
          {isLast ? 'Ver resultado' : 'Siguiente'}
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}
