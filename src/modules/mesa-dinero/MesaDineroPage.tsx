import { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { tacticalPortfolio } from '@/data/tacticalPortfolio'
import { assetClassMap } from '@/data/assetClasses'
import { formatDate, cn } from '@/lib/utils'
import type { TacticalView, TacticalBlock } from '@/types'

const viewConfig: Record<TacticalView, { label: string; icon: typeof TrendingUp; color: string; bg: string; badge: 'success' | 'danger' | 'default' }> = {
  overweight:  { label: 'Sobreponderar', icon: TrendingUp,   color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', badge: 'success' },
  neutral:     { label: 'Neutral',        icon: Minus,        color: 'text-slate-500',   bg: 'bg-slate-50 border-slate-200',     badge: 'default' },
  underweight: { label: 'Subponderar',    icon: TrendingDown, color: 'text-red-500',     bg: 'bg-red-50 border-red-200',         badge: 'danger' },
}

function TacticalBlockCard({ block }: { block: TacticalBlock }) {
  const ac = assetClassMap[block.assetClassId]
  const cfg = viewConfig[block.view]
  const Icon = cfg.icon

  return (
    <div className={cn('rounded-xl border p-4 space-y-3 transition-all hover:shadow-sm', cfg.bg)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: ac?.color }} />
          <span className="text-sm font-semibold text-slate-800">{ac?.name}</span>
        </div>
        <Badge variant={cfg.badge}>{cfg.label}</Badge>
      </div>

      <div className="flex items-center gap-2">
        <Icon size={14} className={cfg.color} />
        <span className={cn('text-xs font-bold', cfg.color)}>
          {block.magnitude > 0 ? `+${block.magnitude}pp` : block.magnitude < 0 ? `${block.magnitude}pp` : '0pp'}
        </span>
        <span className="text-xs text-slate-400">vs SAA</span>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">{block.reason}</p>

      <div className="flex items-center justify-between pt-1 border-t border-current/10">
        <span className="text-[10px] text-slate-400">{block.analyst}</span>
        <span className="text-[10px] text-slate-400">{formatDate(block.updatedAt)}</span>
      </div>
    </div>
  )
}

export default function MesaDineroPage() {
  const [filter, setFilter] = useState<TacticalView | 'all'>('all')

  const filtered = filter === 'all'
    ? tacticalPortfolio.blocks
    : tacticalPortfolio.blocks.filter(b => b.view === filter)

  const counts = {
    overweight:  tacticalPortfolio.blocks.filter(b => b.view === 'overweight').length,
    neutral:     tacticalPortfolio.blocks.filter(b => b.view === 'neutral').length,
    underweight: tacticalPortfolio.blocks.filter(b => b.view === 'underweight').length,
  }

  return (
    <div>
      <Header
        title="Mesa de Dinero"
        subtitle="Vistas tácticas del comité de inversión"
      />
      <div className="p-6 space-y-6">
        {/* Meta info */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">{tacticalPortfolio.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Publicado: {formatDate(tacticalPortfolio.publishedAt)} · Versión {tacticalPortfolio.version}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <TrendingUp size={12} />
                  {counts.overweight} sobreponderar
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Minus size={12} />
                  {counts.neutral} neutral
                </div>
                <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                  <TrendingDown size={12} />
                  {counts.underweight} subponderar
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter buttons */}
        <div className="flex gap-2">
          {(['all', 'overweight', 'neutral', 'underweight'] as const).map(v => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                filter === v
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300',
              )}
            >
              {v === 'all' ? 'Todos' : viewConfig[v].label}
              {v !== 'all' && <span className="ml-1 opacity-70">({counts[v]})</span>}
            </button>
          ))}
          <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 border border-slate-200 transition-colors">
            <RefreshCw size={11} />
            Actualizar
          </button>
        </div>

        {/* Blocks grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(block => (
            <TacticalBlockCard key={block.id} block={block} />
          ))}
        </div>
      </div>
    </div>
  )
}
