import { useState } from 'react'
import { FileText, Download, CheckCircle, Clock, Edit3, Eye } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ipsDocs } from '@/data/ips'
import { clients } from '@/data/clients'
import { formatDate, cn } from '@/lib/utils'
import type { IpsDocument } from '@/types'

const statusConfig: Record<IpsDocument['status'], { label: string; badge: 'success' | 'warning' | 'info' | 'default'; icon: typeof CheckCircle }> = {
  vigente:  { label: 'Vigente',  badge: 'success', icon: CheckCircle },
  aprobado: { label: 'Aprobado', badge: 'info',    icon: CheckCircle },
  revision: { label: 'Revisión', badge: 'warning',  icon: Clock },
  borrador: { label: 'Borrador', badge: 'default',  icon: Edit3 },
}

export default function IpsPage() {
  const [selectedDocId, setSelectedDocId] = useState<string>(ipsDocs[0]?.id ?? '')
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('preview')

  const doc = ipsDocs.find(d => d.id === selectedDocId)
  const docClient = doc ? clients.find(c => c.id === doc.clientId) : null

  const clientsWithoutIps = clients.filter(c => !ipsDocs.some(d => d.clientId === c.id))

  return (
    <div>
      <Header
        title="IPS — Investment Policy Statement"
        subtitle="Gestión de documentos de política de inversión"
      />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doc list */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Documentos existentes</p>
            {ipsDocs.map(d => {
              const c = clients.find(cl => cl.id === d.clientId)
              const cfg = statusConfig[d.status]
              const Icon = cfg.icon
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDocId(d.id)}
                  className={cn(
                    'w-full text-left p-3 rounded-xl border transition-all',
                    selectedDocId === d.id
                      ? 'border-brand-400 bg-brand-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-brand-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{c?.name}</p>
                        <p className="text-xs text-slate-400">v{d.version} · {formatDate(d.updatedAt)}</p>
                      </div>
                    </div>
                    <Badge variant={cfg.badge}>
                      <Icon size={9} className="mr-1" />
                      {cfg.label}
                    </Badge>
                  </div>
                </button>
              )
            })}

            {clientsWithoutIps.length > 0 && (
              <>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide pt-2">Sin IPS</p>
                {clientsWithoutIps.map(c => (
                  <div key={c.id} className="p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{c.name.split(' ').slice(0, 2).join(' ')}</p>
                      <p className="text-xs text-slate-400 capitalize">{c.profile}</p>
                    </div>
                    <Button size="sm" variant="secondary">Crear</Button>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Doc viewer */}
          <div className="lg:col-span-2 space-y-4">
            {doc && docClient ? (
              <>
                {/* Toolbar */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{docClient.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={statusConfig[doc.status].badge}>{statusConfig[doc.status].label}</Badge>
                      <span className="text-xs text-slate-400">Versión {doc.version}</span>
                      {doc.approvedAt && (
                        <span className="text-xs text-slate-400">Aprobado: {formatDate(doc.approvedAt)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setPreviewMode('preview')}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors',
                          previewMode === 'preview' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-50',
                        )}
                      >
                        <Eye size={11} />
                        Vista previa
                      </button>
                      <button
                        onClick={() => setPreviewMode('edit')}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors',
                          previewMode === 'edit' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-50',
                        )}
                      >
                        <Edit3 size={11} />
                        Editar
                      </button>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Download size={12} />
                      PDF
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <Card>
                  <CardContent className="pt-6 pb-8">
                    {previewMode === 'preview' ? (
                      <div className="space-y-6 max-w-prose">
                        <div className="text-center pb-4 border-b border-slate-200">
                          <p className="text-xs font-medium text-brand-600 uppercase tracking-widest">Investment Policy Statement</p>
                          <h1 className="text-xl font-bold text-slate-900 mt-1">{docClient.name}</h1>
                          <p className="text-xs text-slate-400 mt-1">
                            Elaborado: {formatDate(doc.createdAt)} · Actualizado: {formatDate(doc.updatedAt)}
                          </p>
                        </div>
                        {doc.sections.map(section => (
                          <div key={section.id}>
                            <h3 className="text-sm font-bold text-slate-800 mb-2">{section.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{section.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {doc.sections.map(section => (
                          <div key={section.id} className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-700">{section.title}</label>
                            <textarea
                              defaultValue={section.content}
                              rows={4}
                              className="w-full text-sm text-slate-700 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                            />
                          </div>
                        ))}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm">Guardar cambios</Button>
                          <Button variant="secondary" size="sm">Enviar a revisión</Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-sm text-slate-500">Selecciona un documento para verlo</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
