import { useState, useCallback } from 'react'
import { BarChart2, DollarSign, Settings2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { SectoresTab }  from './tabs/SectoresTab'
import { MonedasTab }   from './tabs/MonedasTab'
import { ControlTab }   from './tabs/ControlTab'
import { initialSectorViews, initialFxTargets, type Currency } from '@/data/mesaDinero'
import { cn } from '@/lib/utils'

type Tab = 'sectores' | 'monedas' | 'control'

const tabs: { id: Tab; label: string; icon: typeof BarChart2 }[] = [
  { id: 'sectores', label: 'Sectores', icon: BarChart2  },
  { id: 'monedas',  label: 'Monedas',  icon: DollarSign },
  { id: 'control',  label: 'Control',  icon: Settings2  },
]

export default function MesaDineroPage() {
  const [activeTab,   setActiveTab]   = useState<Tab>('sectores')
  const [sectorViews, setSectorViews] = useState<Record<string, number>>(initialSectorViews)
  const [fxTargets,   setFxTargets]   = useState<Record<Currency, number>>(initialFxTargets)
  const [published,   setPublished]   = useState(false)

  const handleSectorChange = useCallback((views: Record<string, number>) => {
    setSectorViews(views)
    setPublished(false)   // any edit resets published state
  }, [])

  const handleFxChange = useCallback((targets: Record<Currency, number>) => {
    setFxTargets(targets)
    setPublished(false)
  }, [])

  const handlePublish = useCallback(() => {
    setPublished(true)
  }, [])

  return (
    <div>
      <Header
        title="Mesa de Dinero"
        subtitle="Construcción y publicación de la vista táctica del comité"
      />

      <div className="p-6 max-w-3xl mx-auto space-y-5">
        {/* ── Tab switcher ──────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all',
                activeTab === id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              )}
            >
              <Icon size={14} />
              {label}
              {/* Badge for Control tab to signal violations */}
              {id === 'control' && !published && (
                <span className="text-[9px] font-bold" />
              )}
            </button>
          ))}
        </div>

        {/* ── Tab content ───────────────────────────────────────────────────── */}
        {activeTab === 'sectores' && (
          <SectoresTab
            views={sectorViews}
            onChange={handleSectorChange}
          />
        )}
        {activeTab === 'monedas' && (
          <MonedasTab
            fxTargets={fxTargets}
            onChange={handleFxChange}
          />
        )}
        {activeTab === 'control' && (
          <ControlTab
            sectorViews={sectorViews}
            fxTargets={fxTargets}
            onPublish={handlePublish}
            published={published}
          />
        )}
      </div>
    </div>
  )
}
