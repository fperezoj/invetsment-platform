import { Users, TrendingUp, FileText, DollarSign } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { clients } from '@/data/clients'
import { profileLabels, profileColors } from '@/data/kyc'
import { formatCurrency, formatDate } from '@/lib/utils'

const totalAum = clients.reduce((sum, c) => sum + c.aum, 0)

export default function DashboardPage() {
  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Resumen general de la plataforma"
      />
      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="AUM Total"
            value={formatCurrency(totalAum)}
            sub="+4.2% este mes"
            trend="up"
          />
          <StatCard
            label="Clientes Activos"
            value={String(clients.length)}
            sub="5 con IPS vigente"
            trend="neutral"
          />
          <StatCard
            label="Rendimiento Prom."
            value="11.4%"
            sub="vs 9.1% benchmark"
            trend="up"
          />
          <StatCard
            label="Operaciones Pendientes"
            value="3"
            sub="Trades por ejecutar"
            trend="neutral"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client list */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Clientes</CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Users size={12} />
                  {clients.length} clientes
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-6 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Cliente</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Perfil</th>
                    <th className="text-right px-6 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">AUM</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Asesor</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="font-medium text-slate-800">{client.name}</div>
                        <div className="text-xs text-slate-400">{client.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${profileColors[client.profile]}`}>
                          {profileLabels[client.profile]}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right font-mono text-slate-700">
                        {formatCurrency(client.aum)}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{client.advisor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Acciones Rápidas</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[
                  { icon: Users,      label: 'Nuevo KYC',             path: '/kyc',                  color: 'text-blue-600 bg-blue-50' },
                  { icon: TrendingUp, label: 'Ver Mesa de Dinero',     path: '/mesa-dinero',          color: 'text-green-600 bg-green-50' },
                  { icon: DollarSign, label: 'Generar Trades',         path: '/optimizador-tactico',  color: 'text-amber-600 bg-amber-50' },
                  { icon: FileText,   label: 'Crear IPS',              path: '/ips',                  color: 'text-purple-600 bg-purple-50' },
                ].map(({ icon: Icon, label, path, color }) => (
                  <a
                    key={path}
                    href={path}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                      <Icon size={14} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{label}</span>
                  </a>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Actividad Reciente</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { action: 'KYC completado',     client: 'C. Vega Morales',       date: '2025-02-08', badge: 'success' as const },
                  { action: 'IPS aprobado',        client: 'A. García Ruiz',        date: '2025-01-20', badge: 'info' as const },
                  { action: 'Vista táctica pub.',  client: 'Mesa Q1 2025',          date: '2025-01-08', badge: 'warning' as const },
                  { action: 'KYC completado',      client: 'R. Sánchez Torres',     date: '2025-01-20', badge: 'success' as const },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-700">{item.action}</p>
                      <p className="text-xs text-slate-400">{item.client} · {formatDate(item.date)}</p>
                    </div>
                    <Badge variant={item.badge} className="shrink-0">{item.badge === 'success' ? 'OK' : item.badge === 'info' ? 'Aprobado' : 'Nuevo'}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
