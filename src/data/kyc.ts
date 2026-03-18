import type { KycQuestion, KycSubdimension, RiskProfile, KycProfile3 } from '@/types'

// ─── Questions ────────────────────────────────────────────────────────────────
// 10 questions total: 5 Capacidad + 5 Apetito
// Each option scored 0–4; block max = 5 × 4 = 20 → normalized to 0–100.
//
// Capacidad subdimensions:
//   horizonte_temporal    → q_cap_1, q_cap_2  (2q, max 8)
//   situacion_patrimonial → q_cap_3, q_cap_4  (2q, max 8)
//   liquidez              → q_cap_5            (1q, max 4)
//
// Apetito subdimensions:
//   tolerancia_perdidas   → q_apt_1, q_apt_2  (2q, max 8)
//   experiencia_inversora → q_apt_3, q_apt_4  (2q, max 8)
//   expectativa_retorno   → q_apt_5            (1q, max 4)

export const kycQuestions: KycQuestion[] = [
  // ── Bloque 1: CAPACIDAD ────────────────────────────────────────────────────

  {
    id: 'q_cap_1',
    dimension: 'capacidad',
    subdimension: 'horizonte_temporal',
    text: '¿En cuánto tiempo planea necesitar la mayor parte de esta inversión?',
    options: [
      { label: 'Menos de 1 año',   score: 0 },
      { label: '1 a 2 años',       score: 1 },
      { label: '3 a 5 años',       score: 2 },
      { label: '5 a 10 años',      score: 3 },
      { label: 'Más de 10 años',   score: 4 },
    ],
  },
  {
    id: 'q_cap_2',
    dimension: 'capacidad',
    subdimension: 'horizonte_temporal',
    text: '¿Con qué frecuencia necesitará realizar retiros de esta inversión?',
    options: [
      { label: 'Mensualmente',                  score: 0 },
      { label: 'Cada semestre',                 score: 1 },
      { label: 'Una vez al año',                score: 2 },
      { label: 'Solo ante emergencias',         score: 3 },
      { label: 'No planeo ningún retiro',       score: 4 },
    ],
  },
  {
    id: 'q_cap_3',
    dimension: 'capacidad',
    subdimension: 'situacion_patrimonial',
    text: '¿Qué porcentaje de su patrimonio total representa esta inversión?',
    options: [
      { label: 'Más del 75 %',       score: 0 },
      { label: 'Entre 50 y 75 %',    score: 1 },
      { label: 'Entre 25 y 50 %',    score: 2 },
      { label: 'Entre 10 y 25 %',    score: 3 },
      { label: 'Menos del 10 %',     score: 4 },
    ],
  },
  {
    id: 'q_cap_4',
    dimension: 'capacidad',
    subdimension: 'situacion_patrimonial',
    text: '¿Cómo describiría la estabilidad de sus ingresos actuales?',
    options: [
      { label: 'Muy inestables o sin ingresos',          score: 0 },
      { label: 'Variables con alta incertidumbre',       score: 1 },
      { label: 'Moderados con cierta variación',         score: 2 },
      { label: 'Bastante estables',                      score: 3 },
      { label: 'Muy estables y predecibles',             score: 4 },
    ],
  },
  {
    id: 'q_cap_5',
    dimension: 'capacidad',
    subdimension: 'liquidez',
    text: '¿Podría cubrir 6 meses de gastos personales sin necesitar retirar de esta inversión?',
    options: [
      { label: 'No — dependo de esta inversión para gastos corrientes', score: 0 },
      { label: 'Solo podría cubrir 1 o 2 meses',                       score: 1 },
      { label: 'Podría cubrir 3 a 4 meses con ajuste',                 score: 2 },
      { label: 'Sí, con algún esfuerzo',                               score: 3 },
      { label: 'Sí, completamente sin ningún problema',                score: 4 },
    ],
  },

  // ── Bloque 2: APETITO ─────────────────────────────────────────────────────

  {
    id: 'q_apt_1',
    dimension: 'apetito',
    subdimension: 'tolerancia_perdidas',
    text: 'Si su portafolio bajara un 20 % en un mes, ¿cuál sería su reacción más probable?',
    options: [
      { label: 'Vendería todo de inmediato',                           score: 0 },
      { label: 'Vendería una parte para reducir la exposición',        score: 1 },
      { label: 'No haría nada y esperaría la recuperación',           score: 2 },
      { label: 'Compraría un poco más aprovechando el precio',         score: 3 },
      { label: 'Compraría significativamente más',                     score: 4 },
    ],
  },
  {
    id: 'q_apt_2',
    dimension: 'apetito',
    subdimension: 'tolerancia_perdidas',
    text: '¿Qué pérdida máxima acumulada en un año podría aceptar sin cambiar su estrategia?',
    options: [
      { label: 'Ninguna — cualquier pérdida me genera angustia',  score: 0 },
      { label: 'Hasta un 5 %',                                    score: 1 },
      { label: 'Entre 5 y 15 %',                                  score: 2 },
      { label: 'Entre 15 y 30 %',                                 score: 3 },
      { label: 'Más del 30 %',                                    score: 4 },
    ],
  },
  {
    id: 'q_apt_3',
    dimension: 'apetito',
    subdimension: 'experiencia_inversora',
    text: '¿Cómo describiría su experiencia previa invirtiendo?',
    options: [
      { label: 'Ninguna — solo cuentas bancarias o CETES',                  score: 0 },
      { label: 'Limitada — fondos de inversión conservadores',              score: 1 },
      { label: 'Intermedia — acciones y bonos individuales',                score: 2 },
      { label: 'Avanzada — ETFs, divisas y productos estructurados',        score: 3 },
      { label: 'Profesional — portafolios complejos con derivados',         score: 4 },
    ],
  },
  {
    id: 'q_apt_4',
    dimension: 'apetito',
    subdimension: 'experiencia_inversora',
    text: '¿Ha vivido un mercado bajista severo (caída > 25 %) con dinero propio en riesgo?',
    options: [
      { label: 'No, nunca he invertido en mercados volátiles',             score: 0 },
      { label: 'Sí, y vendí con pérdida para salir',                      score: 1 },
      { label: 'Sí, no hice nada y esperé hasta la recuperación',         score: 2 },
      { label: 'Sí, y aproveché para incrementar mi posición',            score: 3 },
      { label: 'Sí, varias veces y lo gestiono con disciplina',           score: 4 },
    ],
  },
  {
    id: 'q_apt_5',
    dimension: 'apetito',
    subdimension: 'expectativa_retorno',
    text: '¿Qué rendimiento anual esperaría razonablemente de esta inversión?',
    options: [
      { label: 'Similar a CETES (≈ 10–11 % anual)',         score: 0 },
      { label: 'CETES + 2 a 3 % (≈ 13–14 %)',              score: 1 },
      { label: 'CETES + 4 a 6 % (≈ 15–17 %)',              score: 2 },
      { label: 'Doble dígito bajo (12–16 % real anual)',    score: 3 },
      { label: 'Doble dígito alto o más (> 16 % real)',     score: 4 },
    ],
  },
]

// ─── Dimension / subdimension metadata ────────────────────────────────────────

export const dimensionLabels: Record<string, string> = {
  capacidad: 'Capacidad',
  apetito:   'Apetito',
}

export const subdimensionLabels: Record<KycSubdimension, string> = {
  horizonte_temporal:    'Horizonte temporal',
  situacion_patrimonial: 'Situación patrimonial',
  liquidez:              'Liquidez',
  tolerancia_perdidas:   'Tolerancia a pérdidas',
  experiencia_inversora: 'Experiencia inversora',
  expectativa_retorno:   'Expectativa de retorno',
}

// ─── Profile mappings (also used by BenchmarkPage and DashboardPage) ──────────

export const profileLabels: Record<RiskProfile, string> = {
  conservador:  'Conservador',
  moderado:     'Moderado',
  balanceado:   'Balanceado',
  crecimiento:  'Crecimiento',
  agresivo:     'Agresivo',
}

export const profileColors: Record<RiskProfile, string> = {
  conservador:  'bg-blue-100 text-blue-800',
  moderado:     'bg-teal-100 text-teal-800',
  balanceado:   'bg-green-100 text-green-800',
  crecimiento:  'bg-amber-100 text-amber-800',
  agresivo:     'bg-red-100 text-red-800',
}

export const profile3Labels: Record<KycProfile3, string> = {
  conservador: 'Conservador',
  moderado:    'Moderado',
  agresivo:    'Agresivo',
}

export const profile3Colors: Record<KycProfile3, { bg: string; text: string; border: string }> = {
  conservador: { bg: 'bg-blue-50',   text: 'text-blue-800',   border: 'border-blue-200' },
  moderado:    { bg: 'bg-teal-50',   text: 'text-teal-800',   border: 'border-teal-200' },
  agresivo:    { bg: 'bg-rose-50',   text: 'text-rose-800',   border: 'border-rose-200' },
}
