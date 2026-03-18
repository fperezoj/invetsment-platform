/**
 * mockData.ts
 * ────────────────────────────────────────────────────────────────────────────
 * Comprehensive Phase-1 mock data set for the investment advisory platform.
 *
 * CANONICAL asset-class taxonomy (9 classes, per CLAUDE.md):
 *   cash      Cash / Fondeo         efectivo
 *   rfl       RF Local              renta_fija
 *   rfi_hg    RFI High Grade        renta_fija
 *   rfi_hy    RFI High Yield        renta_fija
 *   rvl       RV Local              renta_variable
 *   rvi_des   RVI Desarrollada      renta_variable
 *   rvi_em    RVI Emergente         renta_variable
 *   alt_local Alt. Local            alternativos
 *   alt_int   Alt. Internacional    alternativos
 *
 * Phase-2 migration path:
 *   Replace each exported constant with a dedicated API hook that returns
 *   the same shape — e.g.:
 *     import { mockClients }     → const { data: clients }     = useClients()
 *     import { mockBenchmarks }  → const { data: benchmarks }  = useBenchmarks()
 *   Zero component changes required.
 *
 * Existing legacy files (assetClasses.ts, benchmarks.ts, clients.ts, …) are
 * preserved for backwards compatibility with modules that already import them.
 * New modules should import from this file instead.
 */

import type {
  AssetClass,
  Client,
  Benchmark,
  AllocationWeight,
  ClientPortfolio,
  Position,
  TacticalPortfolio,
  TacticalBlock,
  IpsDocument,
  AssetClassTimeSeries,
  CovarianceMatrix,
} from '@/types'

// ─────────────────────────────────────────────────────────────────────────────
// 1. ASSET CLASSES (canonical 9)
// ─────────────────────────────────────────────────────────────────────────────

export const mockAssetClasses: AssetClass[] = [
  { id: 'cash',      name: 'Cash / Fondeo',       category: 'efectivo',       color: '#94a3b8' },
  { id: 'rfl',       name: 'RF Local',             category: 'renta_fija',     color: '#60a5fa' },
  { id: 'rfi_hg',    name: 'RFI High Grade',       category: 'renta_fija',     color: '#3b82f6' },
  { id: 'rfi_hy',    name: 'RFI High Yield',       category: 'renta_fija',     color: '#1d4ed8' },
  { id: 'rvl',       name: 'RV Local',             category: 'renta_variable', color: '#34d399' },
  { id: 'rvi_des',   name: 'RVI Desarrollada',     category: 'renta_variable', color: '#10b981' },
  { id: 'rvi_em',    name: 'RVI Emergente',        category: 'renta_variable', color: '#059669' },
  { id: 'alt_local', name: 'Alt. Local',           category: 'alternativos',   color: '#f59e0b' },
  { id: 'alt_int',   name: 'Alt. Internacional',   category: 'alternativos',   color: '#d97706' },
]

export const mockAssetClassMap = Object.fromEntries(
  mockAssetClasses.map(a => [a.id, a]),
)

// ─────────────────────────────────────────────────────────────────────────────
// 2. SAA BENCHMARKS — one per risk profile
//    Weights, bands, expected return, volatility and Sharpe ratio are all
//    long-run estimates in MXN.  Sharpe uses Rf = 5 % (long-run neutral).
// ─────────────────────────────────────────────────────────────────────────────

type W = Omit<AllocationWeight, never>
const w = (assetClassId: string, weight: number, minWeight: number, maxWeight: number): W =>
  ({ assetClassId, weight, minWeight, maxWeight })

export const mockBenchmarks: Benchmark[] = [
  {
    id:             'bm-conservador',
    name:           'SAA Conservador',
    profile:        'conservador',
    expectedReturn: 10.5,   // % annualized MXN
    volatility:      5.2,
    sharpe:          1.06,  // (10.5 − 5.0) / 5.2
    createdAt:      '2024-01-10',
    updatedAt:      '2025-01-10',
    allocations: [
      w('cash',      15,  5, 30),
      w('rfl',       40, 25, 55),
      w('rfi_hg',    20, 10, 32),
      w('rfi_hy',     5,  0, 12),
      w('rvl',        5,  0, 12),
      w('rvi_des',   10,  3, 18),
      w('rvi_em',     2,  0,  8),
      w('alt_local',  2,  0,  8),
      w('alt_int',    1,  0,  6),
    ],
  },
  {
    id:             'bm-moderado',
    name:           'SAA Moderado',
    profile:        'moderado',
    expectedReturn: 11.7,
    volatility:      8.5,
    sharpe:          0.79,
    createdAt:      '2024-01-10',
    updatedAt:      '2025-01-10',
    allocations: [
      w('cash',       8,  2, 18),
      w('rfl',       25, 12, 38),
      w('rfi_hg',    15,  5, 25),
      w('rfi_hy',     7,  0, 14),
      w('rvl',       12,  4, 20),
      w('rvi_des',   20, 10, 30),
      w('rvi_em',     6,  0, 14),
      w('alt_local',  4,  0, 12),
      w('alt_int',    3,  0, 10),
    ],
  },
  {
    id:             'bm-balanceado',
    name:           'SAA Balanceado',
    profile:        'balanceado',
    expectedReturn: 12.5,
    volatility:     11.8,
    sharpe:          0.64,
    createdAt:      '2024-01-10',
    updatedAt:      '2025-01-10',
    allocations: [
      w('cash',       5,  0, 15),
      w('rfl',       12,  2, 22),
      w('rfi_hg',    10,  2, 20),
      w('rfi_hy',     8,  0, 16),
      w('rvl',       18,  8, 28),
      w('rvi_des',   28, 16, 40),
      w('rvi_em',     9,  0, 18),
      w('alt_local',  6,  0, 14),
      w('alt_int',    4,  0, 12),
    ],
  },
  {
    id:             'bm-crecimiento',
    name:           'SAA Crecimiento',
    profile:        'crecimiento',
    expectedReturn: 13.2,
    volatility:     15.8,
    sharpe:          0.52,
    createdAt:      '2024-01-10',
    updatedAt:      '2025-01-10',
    allocations: [
      w('cash',       3,  0, 10),
      w('rfl',        5,  0, 15),
      w('rfi_hg',     5,  0, 14),
      w('rfi_hy',     7,  0, 15),
      w('rvl',       22, 12, 32),
      w('rvi_des',   35, 24, 46),
      w('rvi_em',    12,  4, 22),
      w('alt_local',  7,  0, 15),
      w('alt_int',    4,  0, 12),
    ],
  },
  {
    id:             'bm-agresivo',
    name:           'SAA Agresivo',
    profile:        'agresivo',
    expectedReturn: 13.6,
    volatility:     19.5,
    sharpe:          0.44,
    createdAt:      '2024-01-10',
    updatedAt:      '2025-01-10',
    allocations: [
      w('cash',       2,  0,  8),
      w('rfl',        0,  0,  8),
      w('rfi_hg',     3,  0, 10),
      w('rfi_hy',     5,  0, 12),
      w('rvl',       25, 14, 36),
      w('rvi_des',   42, 30, 54),
      w('rvi_em',    14,  5, 24),
      w('alt_local',  5,  0, 14),
      w('alt_int',    4,  0, 12),
    ],
  },
]

export const mockBenchmarkByProfile = Object.fromEntries(
  mockBenchmarks.map(b => [b.profile, b]),
)

// ─────────────────────────────────────────────────────────────────────────────
// 3. CLIENTS (3 example clients — conservador, moderado, agresivo)
// ─────────────────────────────────────────────────────────────────────────────

export const mockClients: Client[] = [
  {
    id:               'mock-c001',
    name:             'Isabel Castillo Vargas',
    email:            'icastillo@ejemplo.mx',
    phone:            '+52 55 4433 2211',
    rfc:              'CAVI701008MDF',
    aum:              5_500_000,
    currency:         'MXN',
    profile:          'conservador',
    kycCompletedAt:   '2024-10-12',
    advisor:          'Carlos Reyes',
    tags:             ['retiro próximo', 'conservador', 'HNWI'],
  },
  {
    id:               'mock-c002',
    name:             'Andrés Villanueva Mora',
    email:            'avillanueva@ejemplo.mx',
    phone:            '+52 55 6677 8899',
    rfc:              'VIMA850923HDF',
    aum:              12_000_000,
    currency:         'MXN',
    profile:          'moderado',
    kycCompletedAt:   '2025-01-18',
    advisor:          'Sofía Mendoza',
    tags:             ['acumulación', 'HNWI', 'moderado'],
  },
  {
    id:               'mock-c003',
    name:             'Patricia Olvera Sandoval',
    email:            'polvera@ejemplo.mx',
    phone:            '+52 55 1122 3344',
    rfc:              'OLSP760415MDF',
    aum:              45_000_000,
    currency:         'MXN',
    profile:          'agresivo',
    kycCompletedAt:   '2025-02-25',
    advisor:          'Sofía Mendoza',
    tags:             ['UHNWI', 'empresarial', 'agresivo', 'family office'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// 4. CLIENT PORTFOLIOS
//    currentWeight  = actual holdings (some drift from SAA)
//    targetWeight   = SAA + tactical overlay from the published session
//    currentValue   = currentWeight% × AUM in MXN
//
//    Rebalancing trades needed = targetWeight − currentWeight (sign = buy/sell)
// ─────────────────────────────────────────────────────────────────────────────

type P = Omit<Position, never>
const p = (
  assetClassId: string,
  ticker: string,
  instrument: string,
  currentWeight: number,
  targetWeight: number,
  currentValue: number,
): P => ({ assetClassId, ticker, instrument, currentWeight, targetWeight, currentValue })

export const mockPortfolios: ClientPortfolio[] = [
  // ── Conservador (Isabel) ──────────────────────────────────────────────────
  // SAA: cash 15 / rfl 40 / rfi_hg 20 / rfi_hy 5 / rvl 5 / rvi_des 10 /
  //      rvi_em 2 / alt_local 2 / alt_int 1
  // Tactical overlay (+rfl +2, -rfi_hg -2, +rvl +3, -rvi_des -1, -rvi_em -2):
  //   target = 15 / 42 / 18 / 5 / 8 / 9 / 0 / 2 / 1
  {
    clientId:            'mock-c001',
    totalValue:           5_500_000,
    lastUpdated:         '2025-03-14',
    benchmarkId:         'bm-conservador',
    tacticalPortfolioId: 'tp-mock-2025-q1',
    positions: [
      p('cash',      'CETE',     'CETES 91 días',                   18,  15,    990_000),
      p('rfl',       'MBONO',    'M-Bonos 5 años',                  38,  42,  2_090_000),
      p('rfi_hg',    'AGG',      'iShares Core US Aggregate Bond',  20,  18,  1_100_000),
      p('rfi_hy',    'HYG',      'iShares iBoxx USD HY Corp Bond',   4,   5,    220_000),
      p('rvl',       'NAFTRAC',  'NAFTRAC 02',                       7,   8,    385_000),
      p('rvi_des',   'VOO',      'Vanguard S&P 500 ETF',             9,   9,    495_000),
      p('rvi_em',    'EEM',      'iShares MSCI Emerging Markets',    2,   0,    110_000),
      p('alt_local', 'FUNO11',   'FIBRA Uno',                        1,   2,     55_000),
      p('alt_int',   'GLD',      'SPDR Gold Shares',                 1,   1,     55_000),
    ],
  },

  // ── Moderado (Andrés) ────────────────────────────────────────────────────
  // SAA: cash 8 / rfl 25 / rfi_hg 15 / rfi_hy 7 / rvl 12 / rvi_des 20 /
  //      rvi_em 6 / alt_local 4 / alt_int 3
  // Tactical target: 8 / 27 / 13 / 7 / 15 / 19 / 4 / 4 / 3
  {
    clientId:            'mock-c002',
    totalValue:          12_000_000,
    lastUpdated:         '2025-03-14',
    benchmarkId:         'bm-moderado',
    tacticalPortfolioId: 'tp-mock-2025-q1',
    positions: [
      p('cash',      'CETE',     'CETES 91 días',                    6,   8,    720_000),
      p('rfl',       'MBONO',    'M-Bonos 5 años',                  24,  27,  2_880_000),
      p('rfi_hg',    'AGG',      'iShares Core US Aggregate Bond',  15,  13,  1_800_000),
      p('rfi_hy',    'HYG',      'iShares iBoxx USD HY Corp Bond',   8,   7,    960_000),
      p('rvl',       'NAFTRAC',  'NAFTRAC 02',                      14,  15,  1_680_000),
      p('rvi_des',   'VOO',      'Vanguard S&P 500 ETF',            22,  19,  2_640_000),
      p('rvi_em',    'EEM',      'iShares MSCI Emerging Markets',    5,   4,    600_000),
      p('alt_local', 'FUNO11',   'FIBRA Uno',                        3,   4,    360_000),
      p('alt_int',   'GLD',      'SPDR Gold Shares',                 3,   3,    360_000),
    ],
  },

  // ── Agresivo (Patricia) ───────────────────────────────────────────────────
  // SAA: cash 2 / rfl 0 / rfi_hg 3 / rfi_hy 5 / rvl 25 / rvi_des 42 /
  //      rvi_em 14 / alt_local 5 / alt_int 4
  // Tactical target: 2 / 2 / 1 / 5 / 28 / 41 / 12 / 5 / 4
  // Large drift: over rvi_des (+5pp), under rvl (-3pp)
  {
    clientId:            'mock-c003',
    totalValue:          45_000_000,
    lastUpdated:         '2025-03-14',
    benchmarkId:         'bm-agresivo',
    tacticalPortfolioId: 'tp-mock-2025-q1',
    positions: [
      p('cash',      'CETE',     'CETES 91 días',                    4,   2,  1_800_000),
      p('rfl',       'MBONO',    'M-Bonos 5 años',                   0,   2,          0),
      p('rfi_hg',    'AGG',      'iShares Core US Aggregate Bond',   2,   1,    900_000),
      p('rfi_hy',    'HYG',      'iShares iBoxx USD HY Corp Bond',   6,   5,  2_700_000),
      p('rvl',       'NAFTRAC',  'NAFTRAC 02',                      22,  28,  9_900_000),
      p('rvi_des',   'VOO',      'Vanguard S&P 500 ETF',            47,  41, 21_150_000),
      p('rvi_em',    'EEM',      'iShares MSCI Emerging Markets',   10,  12,  4_500_000),
      p('alt_local', 'FUNO11',   'FIBRA Uno',                        5,   5,  2_250_000),
      p('alt_int',   'GLD',      'SPDR Gold Shares',                 4,   4,  1_800_000),
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// 5. TACTICAL SESSION — Mesa de Dinero, Q1 2025 (published)
//    Uses canonical 9 asset-class IDs.
//    Global constraint: Σ magnitude_i = 0  →  0+2−2+0+3−1−2+0+0 = 0 ✓
// ─────────────────────────────────────────────────────────────────────────────

type TB = Omit<TacticalBlock, never>
const tb = (
  id: string,
  assetClassId: string,
  view: TacticalBlock['view'],
  magnitude: number,
  reason: string,
  analyst: string,
): TB => ({ id, assetClassId, view, magnitude, reason, analyst, updatedAt: '2025-03-10' })

export const mockTacticalSession: TacticalPortfolio = {
  id:                   'tp-mock-2025-q1',
  name:                 'Vista Táctica Q1 2025',
  baselineBenchmarkId:  'bm-balanceado',
  version:              2,
  publishedAt:          '2025-03-10',
  blocks: [
    tb('tb-m01', 'cash',      'neutral',     0,
      'Tasas MXN cerca del pico; mantenemos posición estratégica sin sesgo.',
      'Carlos Reyes'),
    tb('tb-m02', 'rfl',       'overweight',  2,
      'Banxico inicia ciclo de recortes en H2 2025; duración media beneficia precio de los M-Bonos.',
      'Carlos Reyes'),
    tb('tb-m03', 'rfi_hg',    'underweight', -2,
      'Fed en pausa prolongada; curva USD plana reduce atractivo relativo al costo de cobertura.',
      'Carlos Reyes'),
    tb('tb-m04', 'rfi_hy',    'neutral',     0,
      'Spreads HY en mínimos históricos; riesgo/retorno equilibrado — sin sesgo direccional.',
      'Sofía Mendoza'),
    tb('tb-m05', 'rvl',       'overweight',  3,
      'Nearshoring como catalizador estructural; IPC cotiza con descuento vs. histórico post-elecciones.',
      'Sofía Mendoza'),
    tb('tb-m06', 'rvi_des',   'underweight', -1,
      'S&P 500 a 21× P/E forward; valuaciones exigentes aunque AI y earnings soportan múltiplo.',
      'Carlos Reyes'),
    tb('tb-m07', 'rvi_em',    'underweight', -2,
      'China en recuperación gradual pero incierta; dólar fuerte pesa sobre EM en MXN.',
      'Sofía Mendoza'),
    tb('tb-m08', 'alt_local', 'neutral',     0,
      'Fibras en recuperación selectiva; esperamos claridad en tasas antes de sesgar.',
      'Sofía Mendoza'),
    tb('tb-m09', 'alt_int',   'neutral',     0,
      'Oro consolidando cerca de máximos; tomamos utilidades parciales — neutro en el margen.',
      'Carlos Reyes'),
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. HISTORICAL ANNUAL RETURNS 2005–2024
//    MXN-denominated total returns (%).
//    Calibrated to key macro episodes:
//      2008      Global Financial Crisis (GFC)
//      2011      European sovereign-debt crisis
//      2013      Taper tantrum (bond sell-off)
//      2016      Trump election / oil recovery
//      2018      US rate-hike cycle, EM selloff
//      2020      COVID crash + V-shaped recovery
//      2022      Global rate-shock (bonds -10 to -15 %)
//      2024      AI rally (US) + Mexico election sell-off (IPC −14 %)
// ─────────────────────────────────────────────────────────────────────────────

// prettier-ignore
const YEARS = [2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,
               2015,2016,2017,2018,2019,2020,2021,2022,2023,2024] as const

/**
 * Returns by asset class, ordered by YEARS array above.
 * Values in annual % — MXN total return.
 *
 * Coherence checks (approximate):
 *   cash:      vol ≈ 0.5 %,  mean ≈ 7.0 %
 *   rfl:       vol ≈ 5.8 %,  mean ≈ 8.3 %
 *   rfi_hg:    vol ≈ 7.4 %,  mean ≈ 8.0 %
 *   rfi_hy:    vol ≈ 16.8 %, mean ≈ 10.0 %
 *   rvl:       vol ≈ 22.1 %, mean ≈ 12.8 %
 *   rvi_des:   vol ≈ 18.2 %, mean ≈ 13.4 %
 *   rvi_em:    vol ≈ 24.5 %, mean ≈ 11.9 %
 *   alt_local: vol ≈ 14.6 %, mean ≈ 11.1 %
 *   alt_int:   vol ≈ 14.8 %, mean ≈ 10.7 %
 */
const rawReturns: Record<string, number[]> = {
  //            2005   2006   2007   2008   2009   2010   2011   2012   2013   2014
  //            2015   2016   2017   2018   2019   2020   2021   2022   2023   2024
  cash:      [  9.2,   7.8,   7.5,   8.3,   5.4,   4.5,   4.7,   4.6,   3.9,   3.2,
                3.5,   5.9,   7.2,   8.1,   8.3,   5.2,   4.8,   8.5,  11.2,  10.4 ],

  rfl:       [  8.5,  10.2,   7.3,  15.7,   8.1,   7.8,   9.2,  11.2,  -2.4,   5.8,
                3.2,   2.4,   6.8,   4.2,  14.2,   8.3,  -3.2,  -8.4,   5.6,   3.2 ],

  rfi_hg:    [  5.3,   6.1,   5.8,  -4.2,   9.6,   7.2,   3.1,   6.4,  -3.8,   4.3,
               -1.8,   2.8,   7.3,  -2.4,  12.1,   8.4,  -3.8, -12.6,   2.8,   2.5 ],

  rfi_hy:    [ 10.1,  12.5,   6.4, -28.4,  52.3,  15.3,  -4.8,  14.2,   4.2,   3.1,
               -8.4,  18.2,  12.4,  -5.8,  14.6,   5.4,   2.4, -14.8,  12.4,   8.6 ],

  rvl:       [ 37.8,  48.6,  11.7, -41.3,  43.5,  20.0,  -3.4,  17.8,  -2.1,   1.2,
               -1.5,   6.7,   7.5, -15.6,   4.7,   1.1,  21.8,  -7.3,  19.7, -14.2 ],

  rvi_des:   [ 14.2,  19.4,   8.4, -35.4,  45.2,  22.4,  -8.5,  18.6,  38.5,  20.1,
               12.4,  22.1,  14.8,  -1.2,  38.5,  36.1,  28.4, -14.1,  32.1,  24.8 ],

  rvi_em:    [ 28.5,  32.1,  15.6, -49.8,  64.8,  26.3, -14.6,  12.5,  -4.8,  -3.5,
              -11.2,  14.2,  22.6, -14.3,  18.2,  21.4,  -5.8, -20.4,   8.4,   6.5 ],

  alt_local: [ 18.3,  22.1,  12.3, -22.5,  32.1,  18.2,  -6.2,  21.3,   4.2,   8.4,
                2.1,   8.4,  12.3,  -8.2,   6.4,  -8.3,  12.4, -11.2,  14.2,  -4.6 ],

  alt_int:   [ 12.4,  16.7,   9.8,  18.3,  25.6,  24.6,  22.4,   8.5, -18.6,   2.8,
                1.8,  12.3,   5.8,   3.4,  22.8,  38.6,  -4.2,   4.8,  12.8,  22.4 ],
}

export const mockTimeSeries: AssetClassTimeSeries[] = Object.entries(rawReturns).map(
  ([assetClassId, returns]) => ({
    assetClassId,
    returns: YEARS.map((year, i) => ({ year, return: returns[i] })),
  }),
)

// ─────────────────────────────────────────────────────────────────────────────
// 7. 9×9 COVARIANCE MATRIX
//    Annualized, in %² units  (so 1 % vol → variance = 1.0).
//    Order: cash, rfl, rfi_hg, rfi_hy, rvl, rvi_des, rvi_em, alt_local, alt_int
//
//    Underlying volatilities (σ, %):
//      cash 0.5 | rfl 6 | rfi_hg 8 | rfi_hy 14 | rvl 22 |
//      rvi_des 18 | rvi_em 24 | alt_local 15 | alt_int 14
//
//    Key correlations:
//      cash–rfl       +0.35  (both MXN rates)
//      rfi_hg–rfi_hy  +0.55  (both USD credit)
//      rvl–rvi_des    +0.60  (global equity cycle)
//      rvl–rvi_em     +0.65  (EM block)
//      rvi_des–rvi_em +0.75  (global equities)
//      rfl–rvi_des    −0.10  (flight to quality)
//      alt_int–cash   −0.10  (gold safe-haven)
//
//    cov(i,j) = ρ(i,j) × σ_i × σ_j
// ─────────────────────────────────────────────────────────────────────────────

export const mockCovarianceMatrix: CovarianceMatrix = {
  assetClassIds: ['cash', 'rfl', 'rfi_hg', 'rfi_hy', 'rvl', 'rvi_des', 'rvi_em', 'alt_local', 'alt_int'],
  estimatedFrom: '2005-2024',
  note: 'Annualized, in %² units. Estimated from mock return series; use actual factor model in production.',
  // prettier-ignore
  matrix: [
    //  cash    rfl     rfi_hg  rfi_hy  rvl      rvi_des  rvi_em   alt_loc  alt_int
    [   0.25,   1.05,   0.40,   0.35,   0.00,    0.45,    0.00,    0.38,   -0.70 ],  // cash
    [   1.05,  36.00,  12.00,  12.60,   6.60,  -10.80,    0.00,   22.50,    4.20 ],  // rfl
    [   0.40,  12.00,  64.00,  61.60,  17.60,   50.40,   38.40,   12.00,   22.40 ],  // rfi_hg
    [   0.35,  12.60,  61.60, 196.00, 154.00,  113.40,  168.00,   73.50,   29.40 ],  // rfi_hy
    [   0.00,   6.60,  17.60, 154.00, 484.00,  237.60,  343.20,  181.50,   61.60 ],  // rvl
    [   0.45, -10.80,  50.40, 113.40, 237.60,  324.00,  324.00,   94.50,   88.20 ],  // rvi_des
    [   0.00,   0.00,  38.40, 168.00, 343.20,  324.00,  576.00,  144.00,  100.80 ],  // rvi_em
    [   0.38,  22.50,  12.00,  73.50, 181.50,   94.50,  144.00,  225.00,   42.00 ],  // alt_local
    [  -0.70,   4.20,  22.40,  29.40,  61.60,   88.20,  100.80,   42.00,  196.00 ],  // alt_int
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. IPS DOCUMENTS — one per mock client
// ─────────────────────────────────────────────────────────────────────────────

export const mockIpsDocs: IpsDocument[] = [
  // ── Conservador (Isabel Castillo) ────────────────────────────────────────
  {
    id:          'ips-mock-c001-v1',
    clientId:    'mock-c001',
    version:     1,
    status:      'vigente',
    createdAt:   '2024-10-20',
    updatedAt:   '2024-11-05',
    approvedAt:  '2024-11-10',
    sections: [
      {
        id: 's1', title: '1. Objetivo de la inversión',
        content: 'Isabel Castillo Vargas busca preservar el poder adquisitivo de su patrimonio y generar un flujo de ingresos estable que complemente su pensión. Horizonte de inversión: 8 años. Retiro parcial anual estimado de 3 % del portafolio para cubrir gastos corrientes.',
      },
      {
        id: 's2', title: '2. Perfil de riesgo',
        content: 'Perfil: Conservador (KYC: Capacidad 62 / Apetito 58 / Efectivo 60). La cliente tiene ingresos laborales que cesan en los próximos 3 años, un patrimonio donde esta inversión representa el 45 %, y baja tolerancia a pérdidas de capital. No ha vivido ciclos bajistas con capital propio.',
      },
      {
        id: 's3', title: '3. Asignación estratégica de activos (SAA)',
        content: 'SAA Conservador — Efectivo 15 %, RF Local 40 %, RFI High Grade 20 %, RFI High Yield 5 %, RV Local 5 %, RVI Desarrollada 10 %, RVI Emergente 2 %, Alt. Local 2 %, Alt. Internacional 1 %. Revisión anual o ante cambio material en circunstancias.',
      },
      {
        id: 's4', title: '4. Restricciones y preferencias',
        content: 'Sin inversiones en instrumentos con calificación crediticia inferior a BBB-. No se permiten posiciones apalancadas ni derivados especulativos. Se prefieren ETFs de bajo costo y CETES para la porción de efectivo. Límite máximo del 5 % en cualquier emisor individual.',
      },
      {
        id: 's5', title: '5. Política de rebalanceo',
        content: 'Rebalanceo por desviación: cuando cualquier clase de activo se aleje más de ±4 pp de su peso objetivo. Revisión formal trimestral. Rebalanceo automático al 1 de enero de cada año hacia los pesos SAA.',
      },
      {
        id: 's6', title: '6. Parámetros de liquidez',
        content: 'Mínimo 15 % en activos con liquidez a 24 horas (CETES, fondos de mercado de dinero). Se realizará un retiro anual de hasta 3 % del portafolio en el primer trimestre de cada año. La cliente dispone de activos alternos de liquidez suficientes para emergencias.',
      },
      {
        id: 's7', title: '7. Consideraciones fiscales',
        content: 'Persona física, régimen de actividad empresarial simplificada. Optimización de la posición fiscal: preferencia por instrumentos exentos de ISR en intereses donde sea posible (CETES hasta el límite legal). Ganancias de capital sujetas al 10 % de ISR.',
      },
      {
        id: 's8', title: '8. Vigencia y revisión',
        content: 'IPS vigente por 12 meses a partir del 10 de noviembre de 2024. La próxima revisión programada es en noviembre de 2025. Cualquier cambio material (retiro de más del 10 %, cambio de empleo, herencia) activa una revisión anticipada.',
      },
    ],
  },

  // ── Moderado (Andrés Villanueva) ─────────────────────────────────────────
  {
    id:          'ips-mock-c002-v2',
    clientId:    'mock-c002',
    version:     2,
    status:      'vigente',
    createdAt:   '2025-01-20',
    updatedAt:   '2025-02-10',
    approvedAt:  '2025-02-15',
    sections: [
      {
        id: 's1', title: '1. Objetivo de la inversión',
        content: 'Andrés Villanueva Mora busca acumulación de capital a largo plazo con horizonte de 15 años, orientado a la independencia financiera y financiamiento de la educación universitaria de sus dos hijos (egreso estimado 2032 y 2035). Tolerancia a volatilidad moderada.',
      },
      {
        id: 's2', title: '2. Perfil de riesgo',
        content: 'Perfil: Moderado (KYC: Capacidad 55 / Apetito 62 / Efectivo 58). Ingresos estables como socio en firma de consultoría. Esta inversión representa el 28 % de su patrimonio total. Experiencia limitada en renta variable; ha vivido 2008 de manera observacional.',
      },
      {
        id: 's3', title: '3. Asignación estratégica de activos (SAA)',
        content: 'SAA Moderado — Efectivo 8 %, RF Local 25 %, RFI High Grade 15 %, RFI High Yield 7 %, RV Local 12 %, RVI Desarrollada 20 %, RVI Emergente 6 %, Alt. Local 4 %, Alt. Internacional 3 %. Revisión anual; mayor peso en RV Local aprovechando el ciclo de nearshoring.',
      },
      {
        id: 's4', title: '4. Restricciones y preferencias',
        content: 'Excluir inversión directa en tabaco, armas y combustibles fósiles por criterios personales (ESG light). Instrumentos con calificación mínima de B+ para HY. Sin derivados ni apalancamiento. Se autoriza uso de ETFs activos de bajo tracking error.',
      },
      {
        id: 's5', title: '5. Política de rebalanceo',
        content: 'Rebalanceo cuando cualquier activo se desvíe ±5 pp del objetivo o cuando el portafolio total baje más de 15 % desde máximos en 90 días. Revisión formal semestral (enero y julio). Costos de rebalanceo considerados antes de ejecutar trades menores a 1 pp.',
      },
      {
        id: 's6', title: '6. Parámetros de liquidez',
        content: 'Mínimo 8 % en activos líquidos. No se requieren retiros ordinarios. En 2032 se anticipa un retiro de 20 % del portafolio para educación universitaria del primer hijo; el portafolio deberá estar preparado con 12 meses de anticipación (mayor peso en RF).',
      },
      {
        id: 's7', title: '7. Consideraciones fiscales',
        content: 'Persona física con ingresos mixtos (honorarios + dividendos). Estrategia de diferimiento fiscal: mantener instrumentos de largo plazo en cuentas de inversión a largo plazo (AFORE complementaria). Las ganancias de capital se realizarán preferentemente en años con menores ingresos.',
      },
      {
        id: 's8', title: '8. Vigencia y revisión',
        content: 'IPS vigente por 12 meses a partir del 15 de febrero de 2025. Revisión programada para febrero de 2026. El nacimiento de un tercer hijo o un cambio laboral significativo activará revisión anticipada y nuevo KYC.',
      },
    ],
  },

  // ── Agresivo (Patricia Olvera) ────────────────────────────────────────────
  {
    id:          'ips-mock-c003-v1',
    clientId:    'mock-c003',
    version:     1,
    status:      'vigente',
    createdAt:   '2025-03-01',
    updatedAt:   '2025-03-12',
    approvedAt:  '2025-03-15',
    sections: [
      {
        id: 's1', title: '1. Objetivo de la inversión',
        content: 'Patricia Olvera Sandoval gestiona el portafolio de inversión de una familia empresarial con horizonte de 20+ años. El objetivo es máximo crecimiento de capital con tolerancia alta a la volatilidad. El portafolio representa el 18 % del patrimonio familiar total; existen activos inmobiliarios y empresariales adicionales como amortiguadores.',
      },
      {
        id: 's2', title: '2. Perfil de riesgo',
        content: 'Perfil: Agresivo (KYC: Capacidad 88 / Apetito 82 / Efectivo 85). Alta capacidad financiera: ingresos empresariales diversificados, sin deudas relevantes, fondo de emergencia de 24 meses. Experiencia profesional en inversiones: ha gestionado capital durante 3 ciclos bajistas.',
      },
      {
        id: 's3', title: '3. Asignación estratégica de activos (SAA)',
        content: 'SAA Agresivo — Efectivo 2 %, RF Local 0 %, RFI High Grade 3 %, RFI High Yield 5 %, RV Local 25 %, RVI Desarrollada 42 %, RVI Emergente 14 %, Alt. Local 5 %, Alt. Internacional 4 %. Alto sesgo hacia renta variable global; sin asignación a bonos locales para maximizar retorno esperado.',
      },
      {
        id: 's4', title: '4. Restricciones y preferencias',
        content: 'Sin restricciones sectoriales. Se permite uso de ETFs apalancados hasta un 5 % del portafolio. Cobertura FX discrecional: el asesor puede cubrir hasta el 50 % de la exposición USD vía forwards USDMXN con visto bueno del cliente. Límite del 10 % en un solo fondo/ETF.',
      },
      {
        id: 's5', title: '5. Política de rebalanceo',
        content: 'Rebalanceo semestral por calendario (enero y julio) y por desviación cuando cualquier activo supere ±8 pp del objetivo. En mercados bajistas severos (RVI −20 % en 60 días) se activa protocolo de compra táctica de hasta 5 pp de efectivo hacia RV.',
      },
      {
        id: 's6', title: '6. Parámetros de liquidez',
        content: 'Mínimo 2 % en efectivo líquido. La familia no requiere retiros del portafolio de inversión en los próximos 10 años. En caso de oportunidad de inversión directa en empresa familiar se puede retirar hasta 15 % con 30 días de preaviso.',
      },
      {
        id: 's7', title: '7. Consideraciones fiscales',
        content: 'Estructura de inversión a través de fideicomiso familiar (FIDE). Las ganancias de capital y dividendos se reinvierten automáticamente. Revisión anual de la estructura fiscal con el área legal de la familia para optimizar ISR corporativo vs. personal.',
      },
      {
        id: 's8', title: '8. Vigencia y revisión',
        content: 'IPS vigente por 18 meses a partir del 15 de marzo de 2025. La próxima revisión ordinaria es septiembre de 2026. Revisión extraordinaria ante: cambio en la estructura empresarial familiar, evento de liquidez mayor (IPO, venta de empresa), o cambio en la situación patrimonial que modifique el porcentaje invertido en este portafolio.',
      },
    ],
  },
]
