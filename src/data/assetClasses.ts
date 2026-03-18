import type { AssetClass } from '@/types'

export const assetClasses: AssetClass[] = [
  { id: 'cetes',        name: 'CETES / Fondeo',         category: 'efectivo',         color: '#94a3b8' },
  { id: 'bonos_mx',     name: 'Bonos México',            category: 'renta_fija',       color: '#60a5fa' },
  { id: 'bonos_usd',    name: 'Bonos USD IG',            category: 'renta_fija',       color: '#3b82f6' },
  { id: 'bonos_em',     name: 'Deuda EM',                category: 'renta_fija',       color: '#2563eb' },
  { id: 'acciones_mx',  name: 'Acciones México',         category: 'renta_variable',   color: '#34d399' },
  { id: 'acciones_usa', name: 'Acciones EE.UU.',         category: 'renta_variable',   color: '#10b981' },
  { id: 'acciones_int', name: 'Acciones Internacional',  category: 'renta_variable',   color: '#059669' },
  { id: 'acciones_em',  name: 'Acciones EM',             category: 'renta_variable',   color: '#047857' },
  { id: 'reits',        name: 'REITs / Fibras',          category: 'alternativos',     color: '#f59e0b' },
  { id: 'commodities',  name: 'Commodities',             category: 'alternativos',     color: '#d97706' },
  { id: 'pe',           name: 'Private Equity',          category: 'alternativos',     color: '#b45309' },
]

export const assetClassMap = Object.fromEntries(assetClasses.map(a => [a.id, a]))
