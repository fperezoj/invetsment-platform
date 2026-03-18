// ─── KYC / Risk Profile ───────────────────────────────────────────────────────

export type RiskProfile = 'conservador' | 'moderado' | 'balanceado' | 'crecimiento' | 'agresivo'

export interface KycQuestion {
  id: string
  section: string
  text: string
  options: { label: string; value: number }[]
}

export interface KycAnswer {
  questionId: string
  value: number
}

export interface KycResult {
  totalScore: number
  profile: RiskProfile
  answers: KycAnswer[]
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
