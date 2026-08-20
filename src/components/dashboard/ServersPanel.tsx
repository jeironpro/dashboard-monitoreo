import { Server as ServerIcon } from 'lucide-react'
import { Bar } from './Bar'
import { SectionHeading } from './SectionHeading'
import { Sparkline } from './Sparkline'
import { StatusBadge } from './StatusBadge'
import { SERVER_STATUS } from '@/lib/status'
import { formatUptime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { DashboardData, Server, ServerStatus } from '@/types/dashboard'

function sparkStroke(status: ServerStatus): string {
    if (status === 'critical') return 'var(--color-danger)'
    if (status === 'degraded') return 'var(--color-warning)'
    return 'var(--color-accent)'
}

function latencyTone(ms: number): string {
    if (ms >= 250) return 'text-danger'
    if (ms >= 100) return 'text-warning'
    return 'text-success'
}

function UsageBar({ label, value }: { label: string; value: number }) {
    const tone = value >= 90 ? 'bg-danger' : value >= 75 ? 'bg-warning' : 'bg-success'
    return (
        <div className="flex items-center gap-2">
            <span className="w-8 shrink-0 text-[11px] font-medium uppercase tracking-[0.06em] text-faint">
                {label}
            </span>
            <Bar value={value} tone={tone} />
            <span className="num w-9 shrink-0 text-right text-xs text-neutral">{value}%</span>
        </div>
    )
}

function ServerCard({ server }: { server: Server }) {
    const meta = SERVER_STATUS[server.status]
    return (
        <div className="rounded-md border bg-card p-5 shadow-[var(--shadow-whisper)]">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.1fr)] md:items-center">
                {/* Identidad */}
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="num truncate text-base font-medium text-ink">
                            {server.name}
                        </span>
                        <span
                            className={cn('size-1.5 shrink-0 rounded-full', meta.dot)}
                            data-pulse={server.status === 'critical' || undefined}
                            aria-hidden="true"
                        />
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                        {server.role} · {server.region}
                    </p>
                    <p className="num truncate text-xs text-faint">{server.hostname}</p>
                </div>

                {/* Estado + uptime */}
                <div>
                    <StatusBadge meta={meta} pulse={server.status === 'critical'} />
                    <p className="num mt-1.5 text-xs text-faint">
                        uptime {formatUptime(server.uptimePct)}
                    </p>
                </div>

                {/* Latencia + sparkline */}
                <div className="flex items-center gap-3">
                    <div className="whitespace-nowrap">
                        <span
                            className={cn(
                                'num font-display text-lg font-semibold',
                                latencyTone(server.latencyMs),
                            )}
                        >
                            {server.latencyMs}
                        </span>
                        <span className="text-xs text-faint"> ms</span>
                    </div>
                    <Sparkline
                        values={server.sparkline}
                        stroke={sparkStroke(server.status)}
                        className="hidden sm:block"
                    />
                </div>

                {/* Uso */}
                <div className="space-y-2">
                    <UsageBar label="CPU" value={server.cpuPct} />
                    <UsageBar label="RAM" value={server.memoryPct} />
                    <UsageBar label="DISC" value={server.diskPct} />
                </div>
            </div>
        </div>
    )
}

export function ServersPanel({ data }: { data: DashboardData }) {
    return (
        <section>
            <SectionHeading
                id="servers"
                icon={ServerIcon}
                title="Servidores"
                description="Estado, uptime, latencia y uso de recursos de cada nodo de la flota."
            />
            <div className="mt-6 space-y-3">
                {data.servers.map((server) => (
                    <ServerCard key={server.id} server={server} />
                ))}
            </div>
        </section>
    )
}
