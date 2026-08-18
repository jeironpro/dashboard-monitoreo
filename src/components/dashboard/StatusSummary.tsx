import { AlertOctagon, AlertTriangle, CheckCircle2, Server, type LucideIcon } from 'lucide-react'
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber'
import { SERVER_STATUS } from '@/lib/status'
import { cn } from '@/lib/utils'
import type { DashboardData, ServerStatus, Summary } from '@/types/dashboard'

function overallStatus(summary: Summary): ServerStatus {
  if (summary.critical > 0) return 'critical'
  if (summary.degraded > 0) return 'degraded'
  return 'operational'
}

interface KpiCardProps {
  label: string
  value: number
  hint: string
  icon: LucideIcon
  iconClass: string
}

function KpiCard({ label, value, hint, icon: Icon, iconClass }: KpiCardProps) {
  const animated = useAnimatedNumber(value)
  return (
    <div data-reveal className="rounded-md border bg-card p-5 shadow-[var(--shadow-whisper)]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className={cn('size-4', iconClass)} aria-hidden="true" />
      </div>
      <div className="num mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
        {animated}
      </div>
      <div className="mt-1 text-xs text-faint">{hint}</div>
    </div>
  )
}

export function StatusSummary({ data }: { data: DashboardData }) {
  const overall = overallStatus(data.summary)
  const meta = SERVER_STATUS[overall]

  return (
    <div className="mt-6 space-y-6">
      {/* Banda de estado global */}
      <div data-reveal className="flex flex-col gap-3 rounded-md border bg-card p-5 shadow-[var(--shadow-whisper)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className={cn('size-2.5 rounded-full', meta.dot)} aria-hidden="true" />
          <div>
            <p className="font-display text-base font-semibold text-ink">
              Estado: {meta.label}
            </p>
            <p className="text-sm text-muted-foreground">
              {overall === 'operational' && 'Todos los servicios responden dentro de los umbrales.'}
              {overall === 'degraded' && 'Algunos servicios presentan latencia o errores por encima de lo esperado.'}
              {overall === 'critical' && 'Hay al menos un servicio caído que requiere atención inmediata.'}
            </p>
          </div>
        </div>
        <p className="num text-xs text-faint">
          {data.summary.totalServers} nodos monitorizados · {data.environment}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Servidores"
          value={data.summary.totalServers}
          hint="Nodos monitorizados"
          icon={Server}
          iconClass="text-signal"
        />
        <KpiCard
          label="Operativos"
          value={data.summary.operational}
          hint="Sin incidencias activas"
          icon={CheckCircle2}
          iconClass="text-success"
        />
        <KpiCard
          label="Degradados"
          value={data.summary.degraded}
          hint="Rendimiento reducido"
          icon={AlertTriangle}
          iconClass="text-warning"
        />
        <KpiCard
          label="Críticos"
          value={data.summary.critical}
          hint="Requieren atención"
          icon={AlertOctagon}
          iconClass="text-danger"
        />
      </div>
    </div>
  )
}
