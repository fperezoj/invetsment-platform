import type { ClientPortfolio } from '@/types'

export const clientPortfolios: ClientPortfolio[] = [
  {
    clientId: 'c001',
    totalValue: 12_500_000,
    lastUpdated: '2025-03-14',
    benchmarkId: 'b-balanceado',
    tacticalPortfolioId: 'tp-2025-q1',
    positions: [
      { assetClassId: 'cetes',        ticker: 'CETE',    instrument: 'CETES 91 días',        currentWeight: 6,  targetWeight: 5,  currentValue: 750_000 },
      { assetClassId: 'bonos_mx',     ticker: 'MBONO',   instrument: 'M-Bonos 5 años',       currentWeight: 9,  targetWeight: 13, currentValue: 1_125_000 },
      { assetClassId: 'bonos_usd',    ticker: 'USDIG',   instrument: 'ETF Bonos USD IG',     currentWeight: 12, targetWeight: 8,  currentValue: 1_500_000 },
      { assetClassId: 'bonos_em',     ticker: 'EMB',     instrument: 'iShares EMB',          currentWeight: 4,  targetWeight: 5,  currentValue: 500_000 },
      { assetClassId: 'acciones_mx',  ticker: 'NAFTRAC', instrument: 'NAFTRAC',              currentWeight: 13, targetWeight: 19, currentValue: 1_625_000 },
      { assetClassId: 'acciones_usa', ticker: 'VOO',     instrument: 'Vanguard S&P 500',     currentWeight: 26, targetWeight: 25, currentValue: 3_250_000 },
      { assetClassId: 'acciones_int', ticker: 'VXUS',    instrument: 'Vanguard Total Intl',  currentWeight: 17, targetWeight: 13, currentValue: 2_125_000 },
      { assetClassId: 'acciones_em',  ticker: 'VWO',     instrument: 'Vanguard EM',          currentWeight: 8,  targetWeight: 8,  currentValue: 1_000_000 },
      { assetClassId: 'reits',        ticker: 'VNQ',     instrument: 'Vanguard REITs',       currentWeight: 3,  targetWeight: 4,  currentValue: 375_000 },
      { assetClassId: 'commodities',  ticker: 'GLD',     instrument: 'SPDR Gold Shares',     currentWeight: 2,  targetWeight: 5,  currentValue: 250_000 },
    ],
  },
  {
    clientId: 'c002',
    totalValue: 4_800_000,
    lastUpdated: '2025-03-14',
    benchmarkId: 'b-conservador',
    tacticalPortfolioId: 'tp-2025-q1',
    positions: [
      { assetClassId: 'cetes',        ticker: 'CETE',    instrument: 'CETES 91 días',        currentWeight: 22, targetWeight: 20, currentValue: 1_056_000 },
      { assetClassId: 'bonos_mx',     ticker: 'MBONO',   instrument: 'M-Bonos 3 años',       currentWeight: 32, targetWeight: 38, currentValue: 1_536_000 },
      { assetClassId: 'bonos_usd',    ticker: 'USDIG',   instrument: 'ETF Bonos USD IG',     currentWeight: 22, targetWeight: 18, currentValue: 1_056_000 },
      { assetClassId: 'bonos_em',     ticker: 'EMB',     instrument: 'iShares EMB',          currentWeight: 4,  targetWeight: 5,  currentValue: 192_000 },
      { assetClassId: 'acciones_mx',  ticker: 'NAFTRAC', instrument: 'NAFTRAC',              currentWeight: 4,  targetWeight: 5,  currentValue: 192_000 },
      { assetClassId: 'acciones_usa', ticker: 'VOO',     instrument: 'Vanguard S&P 500',     currentWeight: 10, targetWeight: 10, currentValue: 480_000 },
      { assetClassId: 'acciones_int', ticker: 'VXUS',    instrument: 'Vanguard Total Intl',  currentWeight: 4,  targetWeight: 4,  currentValue: 192_000 },
      { assetClassId: 'acciones_em',  ticker: 'VWO',     instrument: 'Vanguard EM',          currentWeight: 2,  targetWeight: 0,  currentValue: 96_000 },
    ],
  },
]
