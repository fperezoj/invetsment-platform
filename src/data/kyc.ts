import type { KycQuestion, RiskProfile } from '@/types'

export const kycQuestions: KycQuestion[] = [
  {
    id: 'q1',
    section: 'Horizonte de inversión',
    text: '¿En cuánto tiempo planea necesitar la mayor parte de sus inversiones?',
    options: [
      { label: 'Menos de 1 año',      value: 1 },
      { label: '1 a 3 años',          value: 2 },
      { label: '3 a 5 años',          value: 3 },
      { label: '5 a 10 años',         value: 4 },
      { label: 'Más de 10 años',      value: 5 },
    ],
  },
  {
    id: 'q2',
    section: 'Horizonte de inversión',
    text: '¿Cuál es su objetivo principal de inversión?',
    options: [
      { label: 'Preservar capital',                value: 1 },
      { label: 'Generar ingreso corriente',         value: 2 },
      { label: 'Balance entre ingreso y crecimiento', value: 3 },
      { label: 'Crecimiento de capital a largo plazo', value: 4 },
      { label: 'Maximizar rendimiento',            value: 5 },
    ],
  },
  {
    id: 'q3',
    section: 'Tolerancia al riesgo',
    text: 'Si su portafolio bajara un 20% en un mes, ¿qué haría?',
    options: [
      { label: 'Vendería todo inmediatamente',          value: 1 },
      { label: 'Vendería una parte para reducir el riesgo', value: 2 },
      { label: 'No haría nada y esperaría',              value: 3 },
      { label: 'Compraría un poco más aprovechando el precio', value: 4 },
      { label: 'Compraría significativamente más',       value: 5 },
    ],
  },
  {
    id: 'q4',
    section: 'Tolerancia al riesgo',
    text: '¿Cuál de las siguientes frases describe mejor su actitud hacia el riesgo?',
    options: [
      { label: 'Prefiero no perder aunque gane poco',       value: 1 },
      { label: 'Acepto pérdidas pequeñas por ganancias moderadas', value: 2 },
      { label: 'Balanceo riesgo y retorno por igual',       value: 3 },
      { label: 'Acepto volatilidad alta para crecer más',   value: 4 },
      { label: 'Busco máximo retorno sin importar el riesgo', value: 5 },
    ],
  },
  {
    id: 'q5',
    section: 'Situación financiera',
    text: '¿Qué porcentaje de sus activos totales representa esta inversión?',
    options: [
      { label: 'Más del 75%',     value: 1 },
      { label: '50 – 75%',        value: 2 },
      { label: '25 – 50%',        value: 3 },
      { label: '10 – 25%',        value: 4 },
      { label: 'Menos del 10%',   value: 5 },
    ],
  },
  {
    id: 'q6',
    section: 'Situación financiera',
    text: '¿Cómo calificaría la estabilidad de sus ingresos actuales?',
    options: [
      { label: 'Muy inestables o sin ingresos',    value: 1 },
      { label: 'Algo variables',                   value: 2 },
      { label: 'Moderadamente estables',           value: 3 },
      { label: 'Bastante estables',                value: 4 },
      { label: 'Muy estables y predecibles',       value: 5 },
    ],
  },
  {
    id: 'q7',
    section: 'Conocimiento financiero',
    text: '¿Cómo describiría su experiencia invirtiendo?',
    options: [
      { label: 'Ninguna (depósitos bancarios únicamente)',          value: 1 },
      { label: 'Limitada (fondos de inversión sencillos)',          value: 2 },
      { label: 'Intermedia (acciones y bonos)',                     value: 3 },
      { label: 'Avanzada (derivados, divisas, ETFs)',               value: 4 },
      { label: 'Profesional (portafolios complejos)',               value: 5 },
    ],
  },
  {
    id: 'q8',
    section: 'Conocimiento financiero',
    text: '¿Con qué frecuencia monitorea sus inversiones?',
    options: [
      { label: 'Nunca',                     value: 1 },
      { label: 'Anualmente',                value: 2 },
      { label: 'Trimestralmente',           value: 3 },
      { label: 'Mensualmente',              value: 4 },
      { label: 'Diariamente o más',         value: 5 },
    ],
  },
]

export const scoreToProfile = (score: number): RiskProfile => {
  if (score <= 14) return 'conservador'
  if (score <= 20) return 'moderado'
  if (score <= 26) return 'balanceado'
  if (score <= 32) return 'crecimiento'
  return 'agresivo'
}

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
