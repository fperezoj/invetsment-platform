/**
 * mesaDinero.ts
 * Mock data, configuration and constants for the Mesa de Dinero module.
 *
 * FX currency exposure is derived from the Balanceado SAA benchmark
 * using per-asset-class currency allocation weights.
 */

// ─── Sector regions ────────────────────────────────────────────────────────────
// Each region groups asset classes; the auto-balance rule applies within
// each region: Σ magnitude_i = 0 per region.

export interface Region {
  id:        string
  label:     string
  color:     string   // Tailwind color for visual accent
  sectorIds: string[] // assetClassId[]
}

export const regions: Region[] = [
  {
    id:        'renta_fija',
    label:     'Renta Fija',
    color:     '#3b82f6',
    sectorIds: ['bonos_mx', 'bonos_usd', 'bonos_em'],
  },
  {
    id:        'renta_variable',
    label:     'Renta Variable',
    color:     '#10b981',
    sectorIds: ['acciones_mx', 'acciones_usa', 'acciones_int', 'acciones_em'],
  },
  {
    id:        'alternativos',
    label:     'Alternativos',
    color:     '#f59e0b',
    sectorIds: ['reits', 'commodities', 'pe'],
  },
]

// The efectivo category (cetes) has a single sector — no balance constraint.
export const STANDALONE_SECTORS = ['cetes']

// ─── Initial sector views (each region sums to 0) ─────────────────────────────
// Intentional bets set by the committee for illustration.
export const initialSectorViews: Record<string, number> = {
  cetes:        0,
  bonos_mx:     2,   // RF: +2 −2 +0 = 0 ✓
  bonos_usd:   -2,
  bonos_em:     0,
  acciones_mx:  3,   // RV: +3 −1 −2 +0 = 0 ✓
  acciones_usa: -1,
  acciones_int: -2,
  acciones_em:  0,
  reits:        -1,  // Alt: −1 +2 −1 = 0 ✓
  commodities:  2,
  pe:           -1,
}

// ─── Tracking error factors ────────────────────────────────────────────────────
// Approximate TE contribution (% annualized) per pp of active weight in that
// asset class, used by the simplified TE formula in rebalance.ts.
export const teFactor: Record<string, number> = {
  cetes:        0.03,
  bonos_mx:     0.06,
  bonos_usd:    0.10,
  bonos_em:     0.12,
  acciones_mx:  0.20,
  acciones_usa: 0.18,
  acciones_int: 0.22,
  acciones_em:  0.25,
  reits:        0.15,
  commodities:  0.18,
  pe:           0.10,
}

// ─── FX currencies ────────────────────────────────────────────────────────────
// MXN is the portfolio base currency and is computed as residual:
//   MXN_exposure = 100 − Σ other_targets

export const CURRENCIES = ['USD', 'EUR', 'JPY', 'GBP'] as const
export type Currency = typeof CURRENCIES[number]

/**
 * SAA currency exposure for the Balanceado benchmark (% of total portfolio).
 * Derived from: Σ alloc.weight × currencyWeight_of_assetClass
 *
 * Underlying per-asset FX weights (internal reference):
 *   cetes(5):        MXN 100%
 *   bonos_mx(10):    MXN 100%
 *   bonos_usd(10):   USD 100%
 *   bonos_em(5):     USD 70%, EUR 20%, EM 10%
 *   acciones_mx(15): MXN 90%, USD 10%
 *   acciones_usa(25):USD 100%
 *   acciones_int(15):EUR 40%, USD 20%, JPY 20%, GBP 10%, EM 10%
 *   acciones_em(8):  USD 60%, EM 40%
 *   reits(4):        MXN 50%, USD 50%
 *   commodities(3):  USD 100%
 *   pe(0):           —
 *
 * → MXN residual ≈ 33.5%  USD ≈ 53.0%  EUR ≈ 7.5%  JPY ≈ 3.0%  GBP ≈ 1.5%
 */
export const saaCurrencyExposure: Record<Currency, number> = {
  USD: 53.0,
  EUR:  7.5,
  JPY:  3.0,
  GBP:  1.5,
}

// Derived MXN = 100 − (53 + 7.5 + 3 + 1.5) = 35%
export const SAA_MXN_EXPOSURE =
  100 - Object.values(saaCurrencyExposure).reduce((s, v) => s + v, 0)

/** FX forward pairs for hedging against MXN (the base). */
export const fxForwardPair: Record<Currency, string> = {
  USD: 'USDMXN',
  EUR: 'EURMXN',
  JPY: 'JPYMXN',
  GBP: 'GBPMXN',
}

/**
 * Achievable target range [min%, max%] for each non-MXN currency.
 * Min = 0 (fully hedged — can't go short without leverage).
 * Max = SAA exposure + 10pp speculative overlay.
 */
export const fxAchievableRange: Record<Currency, [number, number]> = {
  USD: [0, Math.round(saaCurrencyExposure.USD + 10)],  // [0, 63]
  EUR: [0, Math.round(saaCurrencyExposure.EUR + 10)],  // [0, 18]
  JPY: [0, Math.round(saaCurrencyExposure.JPY + 10)],  // [0, 13]
  GBP: [0, Math.round(saaCurrencyExposure.GBP + 10)],  // [0, 12]
}

/** Initial FX targets = SAA exposure (no active FX tilt). */
export const initialFxTargets: Record<Currency, number> = {
  ...saaCurrencyExposure,
}

// ─── Constraints ──────────────────────────────────────────────────────────────
export const MAX_SECTOR_MAGNITUDE = 5    // pp — slider hard limit
export const MAX_TE_IMPLIED       = 3.0  // % annualized implied TE budget
export const MIN_MXN_EXPOSURE     = 10   // % minimum MXN (regulatory floor)
