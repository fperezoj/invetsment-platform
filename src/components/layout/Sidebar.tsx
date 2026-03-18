import { NavLink } from 'react-router-dom'
import {
  ClipboardList,
  BarChart3,
  TrendingUp,
  Sliders,
  FileText,
  LayoutDashboard,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/',                    label: 'Dashboard',            icon: LayoutDashboard,  end: true },
  { path: '/kyc',                 label: 'KYC',                  icon: ClipboardList },
  { path: '/benchmark-saa',       label: 'Benchmark SAA',        icon: BarChart3 },
  { path: '/mesa-dinero',         label: 'Mesa de Dinero',       icon: TrendingUp },
  { path: '/optimizador-tactico', label: 'Optimizador Táctico',  icon: Sliders },
  { path: '/ips',                 label: 'IPS',                  icon: FileText },
]

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-slate-900 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-700/50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <BarChart3 size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">InvestPlatform</p>
            <p className="text-[10px] text-slate-400">Wealth Advisory</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white',
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-700/50">
        <p className="text-[10px] text-slate-500 text-center">v0.1.0 — Mock Data</p>
      </div>
    </aside>
  )
}
