import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { benchmarks } from '@/data/benchmarks'
import { assetClassMap } from '@/data/assetClasses'
import { profileLabels, profileColors } from '@/data/kyc'
import { formatPercent } from '@/lib/utils'
import type { RiskProfile } from '@/types'

const categoryLabels: Record<string, string> = {
  efectivo:        'Efectivo',
  renta_fija:      'Renta Fija',
  renta_variable:  'Renta Variable',
  alternativos:    'Alternativos',
}

const categoryColors: Record<string, string> = {
  efectivo:       '#94a3b8',
  renta_fija:     '#3b82f6',
  renta_variable: '#10b981',
  alternativos:   '#f59e0b',
}

export default function BenchmarkPage() {
  const [selectedProfile, setSelectedProfile] = useState<RiskProfile>('balanceado')
  const benchmark = benchmarks.find(b => b.profile === selectedProfile)!

  const pieData = benchmark.allocations
    .filter(a => a.weight > 0)
    .map(a => ({
      name: assetClassMap[a.assetClassId]?.name ?? a.assetClassId,
      value: a.weight,
      color: assetClassMap[a.assetClassId]?.color ?? '#ccc',
      category: assetClassMap[a.assetClassId]?.category ?? 'efectivo',
    }))

  const categoryTotals = pieData.reduce<Record<string, number>>((acc, d) => {
    acc[d.category] = (acc[d.category] ?? 0) + d.value
    return acc
  }, {})

  const radarData = benchmarks.map(b => ({
    profile: profileLabels[b.profile],
    retorno: b.expectedReturn,
    riesgo:  b.volatility,
    sharpe:  b.sharpe * 10,
  }))

  return (
    <div>
      <Header
        title="Benchmark SAA"
        subtitle="Asignación Estratégica de Activos por perfil de riesgo"
      />
      <div className="p-6 space-y-6">
        {/* Profile selector */}
        <div className="flex gap-2 flex-wrap">
          {benchmarks.map(b => (
            <button
              key={b.profile}
              onClick={() => setSelectedProfile(b.profile)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                selectedProfile === b.profile
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
              }`}
            >
              {profileLabels[b.profile]}
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Benchmark</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{benchmark.name}</p>
              <span className={`mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${profileColors[benchmark.profile]}`}>
                {profileLabels[benchmark.profile]}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Retorno Esperado</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{formatPercent(benchmark.expectedReturn)}</p>
              <p className="text-xs text-slate-400 mt-1">anual</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Volatilidad</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{formatPercent(benchmark.volatility)}</p>
              <p className="text-xs text-slate-400 mt-1">desviación std anual</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Sharpe Ratio</p>
              <p className="text-2xl font-bold text-brand-600 mt-1">{benchmark.sharpe.toFixed(2)}</p>
              <p className="text-xs text-slate-400 mt-1">retorno / riesgo</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie chart */}
          <Card>
            <CardHeader><CardTitle>Distribución por Clase de Activo</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-slate-600 truncate">{d.name}</span>
                    <span className="text-xs font-semibold text-slate-700 ml-auto">{d.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Allocation table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pesos y Rangos</CardTitle>
                <div className="flex gap-2">
                  {Object.entries(categoryTotals).map(([cat, total]) => (
                    <Badge key={cat} className="text-[10px]" style={{ backgroundColor: `${categoryColors[cat]}20`, color: categoryColors[cat] }}>
                      {categoryLabels[cat]}: {total}%
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">Clase de Activo</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">Peso</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">Mín</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">Máx</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmark.allocations.filter(a => a.weight > 0 || a.maxWeight > 0).map(alloc => {
                    const ac = assetClassMap[alloc.assetClassId]
                    return (
                      <tr key={alloc.assetClassId} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ac?.color }} />
                            <span className="text-slate-700 text-xs">{ac?.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold text-slate-800">{alloc.weight}%</td>
                        <td className="px-4 py-2.5 text-right text-slate-400 text-xs">{alloc.minWeight}%</td>
                        <td className="px-4 py-2.5 text-right text-slate-400 text-xs">{alloc.maxWeight}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Radar comparison */}
        <Card>
          <CardHeader><CardTitle>Comparativa de Perfiles</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="profile" tick={{ fontSize: 11 }} />
                <Radar name="Retorno" dataKey="retorno" stroke="#2952f5" fill="#2952f5" fillOpacity={0.15} />
                <Radar name="Riesgo"  dataKey="riesgo"  stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.10} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
