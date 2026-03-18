import { useState, useCallback } from 'react'
import { Header } from '@/components/layout/Header'
import { KycQuestionnaire } from './KycQuestionnaire'
import { KycResult } from './KycResult'
import { buildAssessment } from '@/lib/kycScoring'
import { kycQuestions } from '@/data/kyc'
import type { KycAnswers, KycAssessment } from '@/types'

type Step = 'questionnaire' | 'result'

export default function KycPage() {
  const [step, setStep] = useState<Step>('questionnaire')
  const [answers, setAnswers] = useState<KycAnswers>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [assessment, setAssessment] = useState<KycAssessment | null>(null)

  const handleAnswer = useCallback((questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }))
  }, [])

  const handleNext = useCallback(() => {
    if (currentIndex < kycQuestions.length - 1) {
      setCurrentIndex(i => i + 1)
    } else {
      const result = buildAssessment(answers)
      setAssessment(result)
      setStep('result')
    }
  }, [currentIndex, answers])

  const handleBack = useCallback(() => {
    setCurrentIndex(i => Math.max(0, i - 1))
  }, [])

  const handleReset = useCallback(() => {
    setAnswers({})
    setCurrentIndex(0)
    setAssessment(null)
    setStep('questionnaire')
  }, [])

  const subtitle =
    step === 'questionnaire'
      ? `Bloque ${currentIndex < 5 ? '1 — Capacidad' : '2 — Apetito'} · Pregunta ${currentIndex + 1} de ${kycQuestions.length}`
      : assessment
      ? `Resultado · Perfil ${assessment.perfil3.charAt(0).toUpperCase() + assessment.perfil3.slice(1)}`
      : ''

  return (
    <div>
      <Header
        title="KYC — Perfil de Riesgo"
        subtitle={subtitle}
      />
      <div className="p-6 max-w-2xl mx-auto">
        {step === 'questionnaire' ? (
          <KycQuestionnaire
            answers={answers}
            currentIndex={currentIndex}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onBack={handleBack}
          />
        ) : (
          assessment && (
            <KycResult
              assessment={assessment}
              onReset={handleReset}
            />
          )
        )}
      </div>
    </div>
  )
}
