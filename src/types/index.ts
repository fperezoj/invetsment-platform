// ─── KYC / Risk Profile ───────────────────────────────────────────────────────

export type RiskProfile = 'conservador' | 'moderado' | 'balanceado' | 'crecimiento' | 'agresivo'

/** Three-bucket label used on the KYC result screen only. */
export type KycProfile3 = 'conservador' | 'moderado' | 'agresivo'

export type KycDimension = 'capacidad' | 'apetito'

export type KycSubdimension =
  | 'horizonte_temporal'
  | 'situacion_patrimonial'
  | 'liquidez'
  | 'tolerancia_perdidas'
  | 'experiencia_inversora'
  | 'expectativa_retorno'

export interface KycOption {
  label: string
  score: 0 | 1 | 2 | 3 | 4
}

export interface KycQuestion {
  id: string
  dimension: KycDimension
  subdimension: KycSubdimension
  text: string
  options: KycOption[]
}

/** Raw answer: maps questionId → option score (0–4). */
export type KycAnswers = Record<string, number>

export interface KycScores {
  capacidad: number                               // 0–100
  apetito: number                                 // 0–100
  efectivo: number                                // 0–100, gap-corrected
  brecha: number                                  // |capacidad – apetito|
  tieneBrecha: boolean                            // brecha > BRECHA_THRESHOLD
  subdimensiones: Record<KycSubdimension, number> // 0–100 each
}

export interface KycAssessment {
  scores: KycScores
  perfil: RiskProfile         // 5-level, used by SAA / benchmarks
  perfil3: KycProfile3        // 3-level display label
  answers: KycAnswers
  completedAt: string
}

// ─── Client ──────────────────────────────────────────────────────────────────

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  rfc: string
  aum: number           // Assets Under Management in MXN
  currency: 'MXN' | 'USD'
  profile: RiskProfile
  kycCompletedAt: string
  advisor: string
  tags: string[]
}

// ─── Asset Allocation ─────────────────────────────────────────────────────────

export interface AssetClass {
  id: string
  name: string
  category: 'renta_fija' | 'renta_variable' | 'alternativos' | 'efectivo'
  color: string
}

export interface AllocationWeight {
  assetClassId: string
  weight: number        // 0–100
  minWeight: number
  maxWeight: number
}

export interface Benchmark {
  id: string
  name: string
  profile: RiskProfile
  allocations: AllocationWeight[]
  expectedReturn: number   // annual %
  volatility: number       // annual %
  sharpe: number
  createdAt: string
  updatedAt: string
}

// ─── Mesa de Dinero ──────────────────────────────────────────────────────────

export type TacticalView = 'overweight' | 'neutral' | 'underweight'

export interface TacticalBlock {
  id: string
  assetClassId: string
  view: TacticalView
  reason: string
  magnitude: number    // deviation in pp from SAA
  updatedAt: string
  analyst: string
}

export interface TacticalPortfolio {
  id: string
  name: string
  baselineBenchmarkId: string
  blocks: TacticalBlock[]
  version: number
  publishedAt: string
}

// ─── Optimizador Táctico ─────────────────────────────────────────────────────

export interface Position {
  assetClassId: string
  ticker: string
  instrument: string
  currentWeight: number
  targetWeight: number
  currentValue: number   // MXN
}

export interface TradeProposal {
  id: string
  clientId: string
  ticker: string
  instrument: string
  action: 'buy' | 'sell' | 'hold'
  currentWeight: number
  targetWeight: number
  deltaWeight: number
  estimatedAmount: number  // MXN
  reason: string
}

export interface ClientPortfolio {
  clientId: string
  positions: Position[]
  totalValue: number
  lastUpdated: string
  benchmarkId: string
  tacticalPortfolioId: string
}

// ─── IPS ─────────────────────────────────────────────────────────────────────

export interface IpsSection {
  id: string
  title: string
  content: string
}

export interface IpsDocument {
  id: string
  clientId: string
  version: number
  status: 'borrador' | 'revision' | 'aprobado' | 'vigente'
  sections: IpsSection[]
  createdAt: string
  updatedAt: string
  approvedAt?: string
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  id: string
  label: string
  path: string
  icon: string
  description: string
}
