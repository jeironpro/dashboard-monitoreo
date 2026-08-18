import { useEffect, useRef } from 'react'
import {
  AlertOctagon,
  AlertTriangle,
  BellRing,
  Info,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { StatusBadge } from './StatusBadge'
import { pulseIndicators } from '@/lib/anime'
import { ALERT_SEVERITY } from '@/lib/status'
import { timeAgo } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AlertSeverity, AlertStatus, DashboardData, SecurityAlert } from '@/types/dashboard'

const SEVERITY_ORDER: Record<AlertSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

const SEVERITY_ICON: Record<AlertSeverity, LucideIcon> = {
  critical: AlertOctagon,
  high: AlertTriangle,
  medium: BellRing,
  low: Info,
}

const ALERT_STATUS: Record<AlertStatus, { label: string; cls: string }> = {
  open: { label: 'Abierta', cls: 'text-danger' },
  investigating: { label: 'En investigación', cls: 'text-warning' },
  resolved: { label: 'Resuelta', cls: 'text-success' },
}

function AlertRow({ alert, now }: { alert: SecurityAlert; now: number }) {
  const meta = ALERT_SEVERITY[alert.severity]
  const Icon = SEVERITY_ICON[alert.severity]
  const status = ALERT_STATUS[alert.status]

  return (
    <div className="rounded-md border bg-card p-5 shadow-[var(--shadow-whisper)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span className={cn('grid size-9 shrink-0 place-items-center rounded-md', meta.soft, meta.text)}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-ink">{alert.type}</p>
            <StatusBadge meta={meta} pulse={alert.severity === 'critical'} />
            <span className="num text-xs text-faint">{timeAgo(alert.timestamp, now)}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-faint">
            <span className="num">{alert.source}</span>
            <span className={cn('font-medium', status.cls)}>{status.label}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SecurityAlerts({ data }: { data: DashboardData }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rootRef.current) pulseIndicators(rootRef.current)
  }, [])

  const sorted = [...data.securityAlerts].sort(
    (a, b) =>
      SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || b.timestamp - a.timestamp,
  )

  const counts = (['critical', 'high', 'medium', 'low'] as AlertSeverity[]).reduce(
    (acc, severity) => {
      acc[severity] = data.securityAlerts.filter((a) => a.severity === severity).length
      return acc
    },
    {} as Record<AlertSeverity, number>,
  )

  return (
    <section>
      <SectionHeading
        id="security"
        icon={ShieldAlert}
        title="Alertas de seguridad"
        description="Eventos y fallos de seguridad ordenados por severidad."
        actions={
          <div className="flex flex-wrap gap-2">
            {(['critical', 'high', 'medium', 'low'] as AlertSeverity[]).map((severity) => (
              <span
                key={severity}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                  ALERT_SEVERITY[severity].soft,
                  ALERT_SEVERITY[severity].text,
                )}
              >
                <span className={cn('size-1.5 rounded-full', ALERT_SEVERITY[severity].dot)} aria-hidden="true" />
                {counts[severity]}
              </span>
            ))}
          </div>
        }
      />

      <div ref={rootRef} className="mt-6 space-y-3">
        {sorted.map((alert) => (
          <AlertRow key={alert.id} alert={alert} now={data.updatedAt} />
        ))}
      </div>
    </section>
  )
}
