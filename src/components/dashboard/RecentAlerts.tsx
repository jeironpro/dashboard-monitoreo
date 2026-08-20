import { ArrowUpRight } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { ALERT_SEVERITY } from '@/lib/status'
import { timeAgo } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { DashboardData } from '@/types/dashboard'

/** Lista compacta de las alertas más recientes (columna derecha de la visión general). */
export function RecentAlerts({ data }: { data: DashboardData }) {
    const recent = [...data.securityAlerts].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5)

    return (
        <div
            data-reveal
            className="flex flex-col rounded-md border bg-card p-5 shadow-[var(--shadow-whisper)]"
        >
            <div className="flex items-baseline justify-between gap-3">
                <div>
                    <h3 className="font-display text-base font-semibold text-ink">
                        Alertas recientes
                    </h3>
                    <p className="text-sm text-muted-foreground">Últimos eventos de seguridad</p>
                </div>
                <a
                    href="#security"
                    className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-signal hover:text-signal-strong"
                >
                    Ver todas
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
            </div>

            <ul className="mt-4 flex-1 divide-y">
                {recent.map((alert) => (
                    <li key={alert.id} className="flex items-start gap-3 py-2.5">
                        <span
                            className={cn(
                                'mt-1.5 size-1.5 shrink-0 rounded-full',
                                ALERT_SEVERITY[alert.severity].dot,
                            )}
                            data-pulse={alert.severity === 'critical' || undefined}
                            aria-hidden="true"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ink">{alert.type}</p>
                            <p className="num mt-0.5 text-xs text-faint">
                                {timeAgo(alert.timestamp, data.updatedAt)}
                            </p>
                        </div>
                        <StatusBadge meta={ALERT_SEVERITY[alert.severity]} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
