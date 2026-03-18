/**
 * kycScoring.ts
 * Pure functions for the KYC risk-profile assessment.
 * No React imports — safe to test in isolation.
 */

import type {
  KycQuestion,
  KycAnswers,
  KycDimension,
  KycSubdimension,
  KycScores,
  KycAssessment,
  RiskProfile,
  KycProfile3,
} from '@/types'
import { kycQuestions } from '@/data/kyc'

// ─── Constants ────────────────────────────────────────────────────────────────

/** Gap between Capacidad and Apetito (in points, 0–100) that triggers the
 *  conservative correction.  Per CLAUDE.md: |cap – apt| > 25. */
export const BRECHA_THRESHOLD = 25

const SUBDIMENSIONS: KycSubdimension[] = [
  'horizonte_temporal',
  'situacion_patrimonial',
  'liquidez',
  'tolerancia_perdidas',
  'experiencia_inversora',
  'expectativa_retorno',
]

// ─── Normalization ────────────────────────────────────────────────────────────

/** Converts a raw sum of option scores (0–4 per question) to a 0–100 score. */
function normalize(raw: number, questionCount: number): number {
  if (questionCount === 0) return 0
  return Math.round((raw / (questionCount * 4)) * 100)
}

// ─── Block scoring ────────────────────────────────────────────────────────────

export function computeBlockScore(
  answers: KycAnswers,
  questions: KycQuestion[],
  dimension: KycDimension,
): number {
  const qs = questions.filter(q => q.dimension === dimension)
  const raw = qs.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0)
  return normalize(raw, qs.length)
}

// ─── Subdimension scoring ─────────────────────────────────────────────────────

export function computeSubdimScore(
  answers: KycAnswers,
  questions: KycQuestion[],
  subdimension: KycSubdimension,
): number {
  const qs = questions.filter(q => q.subdimension === subdimension)
  const raw = qs.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0)
  return normalize(raw, qs.length)
}

// ─── Full assessment ──────────────────────────────────────────────────────────

export function computeAllScores(answers: KycAnswers): KycScores {
  const capacidad = computeBlockScore(answers, kycQuestions, 'capacidad')
  const apetito   = computeBlockScore(answers, kycQuestions, 'apetito')
  const brecha    = Math.abs(capacidad - apetito)
  const tieneBrecha = brecha > BRECHA_THRESHOLD

  // Conservative correction: when the gap is too wide, the more cautious
  // dimension wins — we use min() rather than averaging, so the effective
  // profile is never more aggressive than the client's weakest dimension.
  const efectivo = tieneBrecha
    ? Math.min(capacidad, apetito)
    : Math.round((capacidad + apetito) / 2)

  const subdimensiones = Object.fromEntries(
    SUBDIMENSIONS.map(sd => [sd, computeSubdimScore(answers, kycQuestions, sd)])
  ) as Record<KycSubdimension, number>

  return { capacidad, apetito, efectivo, brecha, tieneBrecha, subdimensiones }
}

// ─── Profile assignment ───────────────────────────────────────────────────────

/**
 * Maps an effective 0–100 score to the 5-level RiskProfile used by the
 * SAA benchmarks and the rest of the platform.
 */
export function scoreToProfile5(score: number): RiskProfile {
  if (score <= 19) return 'conservador'
  if (score <= 39) return 'moderado'
  if (score <= 59) return 'balanceado'
  if (score <= 79) return 'crecimiento'
  return 'agresivo'
}

/**
 * Maps an effective 0–100 score to the 3-bucket label shown on the
 * KYC result screen.
 */
export function scoreToProfile3(score: number): KycProfile3 {
  if (score <= 33) return 'conservador'
  if (score <= 66) return 'moderado'
  return 'agresivo'
}

// ─── Full assessment builder ──────────────────────────────────────────────────

export function buildAssessment(answers: KycAnswers): KycAssessment {
  const scores  = computeAllScores(answers)
  const perfil  = scoreToProfile5(scores.efectivo)
  const perfil3 = scoreToProfile3(scores.efectivo)
  return {
    scores,
    perfil,
    perfil3,
    answers,
    completedAt: new Date().toISOString(),
  }
}

// ─── Helpers for UI ───────────────────────────────────────────────────────────

/** Returns a human-readable tier label for a 0–100 score. */
export function scoreTier(score: number): string {
  if (score <= 33) return 'Bajo'
  if (score <= 66) return 'Medio'
  return 'Alto'
}

/** Returns a Tailwind color class for a progress bar fill based on score. */
export function scoreBarColor(score: number): string {
  if (score <= 33) return 'bg-blue-500'
  if (score <= 66) return 'bg-amber-500'
  return 'bg-emerald-500'
}
