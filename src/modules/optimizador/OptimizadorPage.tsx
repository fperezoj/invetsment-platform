import { useState, useMemo } from 'react'
import { ArrowUpRight, ArrowDownRight, Minus, Download, CheckSquare } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { clients } from '@/data/clients'
import { clientPortfolios } from '@/data/portfolios'
import { benchmarkByProfile } from '@/data/benchmarks'
import { tacticalPortfolio } from '@/data/tacticalPortfolio'
import { assetClassMap } from '@/data/assetClasses'
import { formatCurrency, formatPercent, formatDate, cn } from '@/lib/utils'
import type { TradeProposal } from '@/types'

function computeTrades(clientId: string): TradeProposal[] {
  const portfolio = clientPortfolios.find(p => p.clientId === clientId)
  if (!portfolio) return []

  const client = clients.find(c => c.id === clientId)!
  const benchmark = benchmarkByProfile[client.profile]

  return portfolio.positions.map(pos => {
    const target = pos.targetWeight
    const delta = target - pos.currentWeight
    const action = delta > 0.5 ? 'buy' : delta < -0.5 ? 'sell' : 'hold'
    const tacView = tacticalPortfolio.blocks.find(b => b.assetClassId === pos.assetClassId)

    return {
      id: `tr-${clientId}-${pos.assetClassId}`,
      clientId,
      ticker: pos.ticker,
      instrument: pos.instrument,
      action: action as 'buy' | 'sell' | 'hold',
      currentWeight: pos.currentWeight,
      targetWeight: target,
      deltaWeight: delta,
      estimatedAmount: Math.abs(delta / 100) * portfolio.totalValue,
      reason: tacView?.reason ?? `Rebalanceo SAA ${benchmark.name}`,
    }
  }).filter(t => t.action !== 'hold')
}

const actionConfig = {
  buy:  { label: 'Compra', icon: ArrowUpRight,   color: 'text-emerald-600', bg: 'bg-emerald-50', badge: 'success' as const },
  sell: { label: 'Venta',  icon: ArrowDownRight,  color: 'text-red-500',    bg: 'bg-red-50',     badge: 'danger' as const },
  hold: { label: 'Hold',   icon: Minus,           color: 'text-slate-400',  bg: 'bg-slate-50',   badge: 'default' as const },
}

export default function OptimizadorPage() {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0].id)

  const client = clients.find(c => c.id === selectedClientId)!
  const portfolio = clientPortfolios.find(p => p.clientId === selectedClientId)
  const trades = useMemo(() => computeTrades(selectedClientId), [selectedClientId])

  const totalBuy  = trades.filter(t => t.action === 'buy').reduce((s, t) => s + t.estimatedAmount, 0)
  const totalSell = trades.filter(t => t.action === 'sell').reduce((s, t) => s + t.estimatedAmount, 0)

  const chartData = portfolio?.positions.map(pos => ({
    name: assetClassMap[pos.assetClassId]?.name?.split(' ').slice(-1)[0] ?? pos.assetClassId,
    actual:  pos.currentWeight,
    objetivo: pos.targetWeight,
    delta:   pos.targetWeight - pos.currentWeight,
  })) ?? []

  return (
    <div>
      <Header
        title="Optimizador Táctico"
        subtitle="Propuesta de trades por cliente"
      />
      <div className="p-6 space-y-6">
        {/* Client selector */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-medium text-slate-500 mr-2">Cliente:</span>
              {clients.filter(c => clientPortfolios.some(p => p.clientId === c.id)).map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClientId(c.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                    selectedClientId === c.id
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300',
                  )}
                >
                  {c.name.split(' ').slice(0, 2).join(' ')}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Client info */}
        {portfolio && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-slate-500">AUM</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(portfolio.totalValue)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-slate-500">Perfil</p>
                <p className="text-xl font-bold text-slate-900 mt-1 capitalize">{client.profile}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-slate-500">Compras estimadas</p>
                <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(totalBuy)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-slate-500">Ventas estimadas</p>
                <p className="text-xl font-bold text-red-500 mt-1">{formatCurrency(totalSell)}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Delta chart */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Desviación Actual vs Objetivo (%)</CardTitle>
                <p className="text-xs text-slate-400">Última actualización: {formatDate(portfolio!.lastUpdated)}</p>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
                  <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
                  <Bar dataKey="delta" name="Delta" fill="#2952f5" radius={[3, 3, 0, 0]}
                    label={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Trade proposals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Propuesta de Trades ({trades.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <Download size={12} />
                  Exportar
                </Button>
                <Button size="sm">
                  <CheckSquare size={12} />
                  Aprobar todos
                </Button>
              </div>
            </div>
          </CardHeader>
          {trades.length === 0 ? (
            <CardContent>
              <div className="text-center py-8 text-slate-400">
                <Minus size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No hay trades pendientes para este cliente.</p>
              </div>
            </CardContent>
          ) : (
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Instrumento</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-slate-500">Acción</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Actual</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Objetivo</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Delta</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-slate-500">Monto Est.</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map(trade => {
                    const cfg = actionConfig[trade.action]
                    const Icon = cfg.icon
                    return (
                      <tr key={trade.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="font-medium text-slate-800">{trade.ticker}</div>
                          <div className="text-xs text-slate-400">{trade.instrument}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded', cfg.bg, cfg.color)}>
                            <Icon size={11} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600 font-mono text-xs">
                          {formatPercent(trade.currentWeight)}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600 font-mono text-xs">
                          {formatPercent(trade.targetWeight)}
                        </td>
                        <td className={cn('px-4 py-3 text-right font-mono text-xs font-bold', cfg.color)}>
                          {trade.deltaWeight > 0 ? '+' : ''}{formatPercent(trade.deltaWeight)}
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-xs text-slate-700">
                          {formatCurrency(trade.estimatedAmount)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
