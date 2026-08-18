import { useState } from 'react'
import { ScrollText } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { StatusBadge } from './StatusBadge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LOG_LEVEL, LOG_STATUS } from '@/lib/status'
import { formatTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { DashboardData, ErrorLog, LogLevel } from '@/types/dashboard'

type LogFilter = 'all' | LogLevel

const FILTERS: Array<{ value: LogFilter; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'critical', label: 'Críticos' },
  { value: 'error', label: 'Errores' },
  { value: 'warning', label: 'Avisos' },
  { value: 'exception', label: 'Excepciones' },
]

function LogRow({ log }: { log: ErrorLog }) {
  const meta = LOG_LEVEL[log.level]
  const status = LOG_STATUS[log.status]
  return (
    <li className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:gap-4">
      <span className="num w-16 shrink-0 text-xs text-faint">{formatTime(log.timestamp)}</span>
      <StatusBadge meta={meta} className="self-start sm:self-center" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-ink" title={log.message}>
          {log.message}
        </p>
        <p className="num text-xs text-faint">
          {log.service} · {log.source}
        </p>
      </div>
      <span className="num w-fit shrink-0 self-start rounded-full bg-paper-3 px-2 py-0.5 text-xs text-neutral sm:self-center">
        ×{log.occurrences}
      </span>
      <span
        className={cn(
          'num w-fit shrink-0 self-start text-xs font-medium sm:w-16 sm:self-center sm:text-right',
          status.cls,
        )}
      >
        {status.label}
      </span>
    </li>
  )
}

function ExceptionsCard({ data }: { data: DashboardData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Excepciones destacadas</CardTitle>
        <CardDescription>Agrupadas por tipo y ocurrencias</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.exceptions.map((exception) => (
          <div key={exception.type} className="space-y-1">
            <div className="flex items-start justify-between gap-3">
              <p className="num min-w-0 truncate text-sm font-medium text-ink">{exception.type}</p>
              <span className="num shrink-0 rounded-full bg-danger-soft px-2 py-0.5 text-xs font-medium text-danger">
                ×{exception.count}
              </span>
            </div>
            <p className="truncate text-xs text-muted-foreground">{exception.message}</p>
            <p className="num truncate text-[11px] text-faint">{exception.file}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function LogsPanel({ data }: { data: DashboardData }) {
  const [filter, setFilter] = useState<LogFilter>('all')
  const filtered = filter === 'all' ? data.errorLogs : data.errorLogs.filter((l) => l.level === filter)

  return (
    <section>
      <SectionHeading
        id="logs"
        icon={ScrollText}
        title="Logs y excepciones"
        description="Registro de errores y excepciones de la plataforma, filtrable por nivel."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Errores recientes</CardTitle>
                <CardDescription>{filtered.length} registros en pantalla</CardDescription>
              </div>
              <Tabs value={filter} onValueChange={(v) => setFilter(v as LogFilter)}>
                <TabsList className="flex-wrap">
                  {FILTERS.map((f) => (
                    <TabsTrigger key={f.value} value={f.value}>
                      {f.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filtered.length > 0 ? (
              <ul className="divide-y">
                {filtered.map((log) => (
                  <LogRow key={log.id} log={log} />
                ))}
              </ul>
            ) : (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                No hay registros para este filtro.
              </p>
            )}
          </CardContent>
        </Card>

        <ExceptionsCard data={data} />
      </div>
    </section>
  )
}
