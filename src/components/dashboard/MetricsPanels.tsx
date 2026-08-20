import { Activity } from 'lucide-react'
import { Bar } from './Bar'
import { SectionHeading } from './SectionHeading'
import { StatusBadge } from './StatusBadge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { SERVER_STATUS } from '@/lib/status'
import { formatGb, formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ApiEndpoint, DashboardData, Database, Queue } from '@/types/dashboard'

function DatabasesCard({ databases }: { databases: Database[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Bases de datos</CardTitle>
                <CardDescription>Conexiones, latencia de consulta y replicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                {databases.map((db) => {
                    const usage = Math.round((db.connections / db.connectionsLimit) * 100)
                    const meta = SERVER_STATUS[db.status]
                    return (
                        <div key={db.id} className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="num truncate text-sm font-medium text-ink">
                                        {db.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {db.engine} · {formatGb(db.sizeGb)}
                                    </p>
                                </div>
                                <StatusBadge meta={meta} pulse={db.status === 'critical'} />
                            </div>
                            <div className="flex items-center gap-2">
                                <Bar
                                    value={usage}
                                    tone={
                                        usage >= 90
                                            ? 'bg-danger'
                                            : usage >= 70
                                              ? 'bg-warning'
                                              : 'bg-signal'
                                    }
                                />
                                <span className="num whitespace-nowrap text-xs text-neutral">
                                    {db.connections}/{db.connectionsLimit}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <span>
                                    <span className="num text-ink">{db.queryLatencyMs} ms</span>{' '}
                                    query
                                </span>
                                <span>
                                    <span className="num text-ink">{db.slowQueries}</span> lentas
                                </span>
                                <span>
                                    <span className="num text-ink">{db.replicationLagSec} s</span>{' '}
                                    lag
                                </span>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}

function QueuesCard({ queues }: { queues: Queue[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Colas de trabajo</CardTitle>
                <CardDescription>Jobs activos, en espera y fallidos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                {queues.map((queue) => {
                    const meta = SERVER_STATUS[queue.status]
                    return (
                        <div key={queue.id} className="space-y-1.5">
                            <div className="flex items-center justify-between gap-3">
                                <p className="num truncate text-sm font-medium text-ink">
                                    {queue.name}
                                </p>
                                <StatusBadge meta={meta} pulse={queue.status === 'critical'} />
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <span>
                                    <span className="num text-ink">{queue.active}</span> activos
                                </span>
                                <span>
                                    <span className="num text-ink">{queue.waiting}</span> en espera
                                </span>
                                <span>
                                    <span className={cn('num', queue.failed > 0 && 'text-danger')}>
                                        {queue.failed}
                                    </span>{' '}
                                    fallidos
                                </span>
                            </div>
                            <p className="num text-xs text-faint">
                                {queue.throughputPerMin}/min · {queue.consumers} consumidores
                            </p>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}

function ApisCard({ apis }: { apis: ApiEndpoint[] }) {
    return (
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>APIs</CardTitle>
                <CardDescription>
                    Latencia, tráfico, tasa de errores y disponibilidad por endpoint
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0 sm:px-2">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Endpoint</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Latencia</TableHead>
                            <TableHead className="hidden text-right sm:table-cell">RPM</TableHead>
                            <TableHead className="hidden text-right md:table-cell">
                                Errores
                            </TableHead>
                            <TableHead className="hidden text-right lg:table-cell">
                                Disponibilidad
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {apis.map((api) => (
                            <TableRow key={api.id}>
                                <TableCell>
                                    <span className="flex items-center gap-2 whitespace-nowrap">
                                        <span className="num rounded border px-1.5 py-0.5 text-[10px] font-medium text-neutral">
                                            {api.method}
                                        </span>
                                        <span className="num font-medium text-ink">{api.path}</span>
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge meta={SERVER_STATUS[api.status]} />
                                </TableCell>
                                <TableCell className="num whitespace-nowrap text-right">
                                    {api.latencyMs} ms
                                </TableCell>
                                <TableCell className="num hidden whitespace-nowrap text-right sm:table-cell">
                                    {formatNumber(api.requestsPerMin)}
                                </TableCell>
                                <TableCell
                                    className={cn(
                                        'num hidden whitespace-nowrap text-right md:table-cell',
                                        api.errorRatePct >= 1 && 'text-danger',
                                    )}
                                >
                                    {api.errorRatePct} %
                                </TableCell>
                                <TableCell className="num hidden whitespace-nowrap text-right lg:table-cell">
                                    {api.availabilityPct} %
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export function MetricsPanels({ data }: { data: DashboardData }) {
    return (
        <section>
            <SectionHeading
                id="metrics"
                icon={Activity}
                title="Métricas de uso"
                description="Uso de bases de datos, rendimiento de APIs y estado de las colas de trabajo."
            />
            <div className="mt-6 grid gap-6 md:grid-cols-2">
                <DatabasesCard databases={data.databases} />
                <QueuesCard queues={data.queues} />
                <ApisCard apis={data.apis} />
            </div>
        </section>
    )
}
