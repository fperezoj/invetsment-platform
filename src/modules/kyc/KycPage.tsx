import { useState } from 'react'
import { CheckCircle, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { kycQuestions, scoreToProfile, profileLabels, profileColors } from '@/data/kyc'
import { benchmarkByProfile } from '@/data/benchmarks'
import { cn, formatPercent } from '@/lib/utils'
import type { KycAnswer } from '@/types'

type Step = 'form' | 'result'

export default function KycPage() {
  const [answers, setAnswers] = useState<KycAnswer[]>([])
  const [current, setCurrent] = useState(0)
  const [step, setStep] = useState<Step>('form')

  const question = kycQuestions[current]
  const selectedValue = answers.find(a => a.questionId === question.id)?.value

  const select = (value: number) => {
    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== question.id)
      return [...filtered, { questionId: question.id, value }]
    })
  }

  const next = () => {
    if (current < kycQuestions.length - 1) setCurrent(c => c + 1)
    else setStep('result')
  }

  const back = () => {
    if (current > 0) setCurrent(c => c - 1)
  }

  const reset = () => {
    setAnswers([])
    setCurrent(0)
    setStep('form')
  }

  const totalScore = answers.reduce((sum, a) => sum + a.value, 0)
  const profile = step === 'result' ? scoreToProfile(totalScore) : null
  const benchmark = profile ? benchmarkByProfile[profile] : null

  const sections = [...new Set(kycQuestions.map(q => q.section))]
  const progressPct = (answers.length / kycQuestions.length) * 100

  return (
    <div>
      <Header
        title="KYC — Perfil de Riesgo"
        subtitle="Cuestionario de conocimiento del cliente"
      />
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {step === 'form' ? (
          <>
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Pregunta {current + 1} de {kycQuestions.length}</span>
                <span>{answers.length} respondidas</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div
                  className="bg-brand-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {sections.map(sec => (
                  <span key={sec} className="text-xs text-slate-400">{sec}</span>
                ))}
              </div>
            </div>

            {/* Question card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                    {question.section}
                  </span>
                </div>
                <p className="mt-3 text-base font-semibold text-slate-800">{question.text}</p>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {question.options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => select(opt.value)}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all',
                      selectedValue === opt.value
                        ? 'border-brand-500 bg-brand-50 text-brand-800'
                        : 'border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-slate-50',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="secondary" onClick={back} disabled={current === 0}>
                <ChevronLeft size={14} />
                Anterior
              </Button>
              <Button onClick={next} disabled={!selectedValue}>
                {current === kycQuestions.length - 1 ? 'Ver Resultado' : 'Siguiente'}
                <ChevronRight size={14} />
              </Button>
            </div>

            {/* Side indicators */}
            <div className="flex gap-1.5 justify-center flex-wrap">
              {kycQuestions.map((_, idx) => {
                const answered = answers.find(a => a.questionId === kycQuestions[idx].id)
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={cn(
                      'w-6 h-6 rounded text-xs font-medium transition-colors',
                      idx === current
                        ? 'bg-brand-600 text-white'
                        : answered
                        ? 'bg-brand-100 text-brand-700'
                        : 'bg-slate-100 text-slate-400',
                    )}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          /* Result */
          profile && benchmark && (
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto">
                    <CheckCircle size={32} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Puntaje total: {totalScore} / {kycQuestions.length * 5}</p>
                    <h2 className="text-2xl font-bold text-slate-900">Perfil {profileLabels[profile]}</h2>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${profileColors[profile]}`}>
                    {profileLabels[profile]}
                  </span>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Retorno esperado', value: formatPercent(benchmark.expectedReturn), positive: true },
                  { label: 'Volatilidad',       value: formatPercent(benchmark.volatility),   positive: false },
                  { label: 'Sharpe Ratio',      value: benchmark.sharpe.toFixed(2),           positive: true },
                ].map(stat => (
                  <Card key={stat.label}>
                    <CardContent className="pt-4 text-center">
                      <p className="text-xs text-slate-500">{stat.label}</p>
                      <p className={`text-xl font-bold mt-1 ${stat.positive ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {stat.value}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader><CardTitle>Asignación Estratégica Sugerida: {benchmark.name}</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {benchmark.allocations.filter(a => a.weight > 0).map(alloc => (
                    <div key={alloc.assetClassId} className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 w-36 shrink-0">{alloc.assetClassId}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-brand-500 h-2 rounded-full"
                          style={{ width: `${alloc.weight}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 w-10 text-right">{alloc.weight}%</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={reset} className="flex-1">
                  <RotateCcw size={14} />
                  Reiniciar cuestionario
                </Button>
                <Button className="flex-1" onClick={() => window.location.href = '/benchmark-saa'}>
                  Ver Benchmark SAA
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
