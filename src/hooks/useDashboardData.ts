import { useCallback, useEffect, useRef, useState } from 'react'
import { loadMockData } from '@/data'
import type { DashboardData, ErrorLog, LatencyPoint } from '@/types/dashboard'

// Mensajes que van rotando como si llegaran nuevos logs en vivo.
const LIVE_LOG_POOL: Array<Pick<ErrorLog, 'level' | 'service' | 'message' | 'source'>> = [
  {
    level: 'error',
    service: 'api-gateway',
    message: 'Timeout aguas arriba: el upstream no respondió en 5 s',
    source: 'api-edge-02',
  },
  {
    level: 'warning',
    service: 'worker',
    message: 'Cola webhooks acumulando: 120 jobs en espera',
    source: 'worker-celery-02',
  },
  {
    level: 'error',
    service: 'auth-svc',
    message: 'Error de conexión al proveedor de identidad',
    source: 'auth-svc-01',
  },
  {
    level: 'warning',
    service: 'db-replica',
    message: 'Consulta lenta (2.1 s) detectada en metrics_rollup',
    source: 'pg-replica',
  },
]

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

function timeLabel(now: number): string {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now)
}

/** Aplica una pequeña variación a la telemetría para simular actualizaciones en vivo. */
function jitter(prev: DashboardData, now: number, tick: number): DashboardData {
  const servers = prev.servers.map((s) => {
    const latency = clamp(s.latencyMs + rand(-6, 6), 5, 2000)
    return {
      ...s,
      latencyMs: Math.round(latency),
      cpuPct: Math.round(clamp(s.cpuPct + rand(-3, 3), 1, 99)),
      memoryPct: Math.round(clamp(s.memoryPct + rand(-1, 1), 5, 99)),
      sparkline: [...s.sparkline.slice(1), Math.round(clamp(latency + rand(-8, 8), 5, 2000))],
    }
  })

  const avgLatency = Math.round(servers.reduce((a, s) => a + s.latencyMs, 0) / servers.length)
  const p95Latency = Math.round(Math.max(...servers.map((s) => s.latencyMs)) * 1.35)
  const nextPoint: LatencyPoint = { t: timeLabel(now), avg: avgLatency, p95: p95Latency }
  const latencyHistory = [...prev.latencyHistory.slice(1), nextPoint]

  const apis = prev.apis.map((a) => ({
    ...a,
    latencyMs: Math.round(clamp(a.latencyMs + rand(-5, 5), 8, 2000)),
    errorRatePct: Math.round(clamp(a.errorRatePct + rand(-0.2, 0.2), 0, 30) * 10) / 10,
  }))

  const databases = prev.databases.map((d) => ({
    ...d,
    connections: Math.round(clamp(d.connections + rand(-2, 2), 1, d.connectionsLimit)),
    queryLatencyMs: Math.round(clamp(d.queryLatencyMs + rand(-2, 2), 2, 2000)),
  }))

  const queues = prev.queues.map((q) => ({
    ...q,
    active: Math.round(clamp(q.active + rand(-2, 2), 0, 500)),
    waiting: Math.round(clamp(q.waiting + rand(-20, 20), 0, 20000)),
    failed: Math.round(clamp(q.failed + rand(-1, 1), 0, 500)),
  }))

  // Cada 3 ticks entra un log nuevo (rotando el pool completo) y se recorta a 12 filas.
  const errorLogs =
    tick > 0 && tick % 3 === 0
      ? [
          {
            id: `log-live-${now}`,
            timestamp: now,
            occurrences: Math.ceil(rand(1, 9)),
            status: 'new' as const,
            ...LIVE_LOG_POOL[Math.floor(tick / 3) % LIVE_LOG_POOL.length],
          },
          ...prev.errorLogs,
        ].slice(0, 12)
      : prev.errorLogs

  return {
    ...prev,
    updatedAt: now,
    summary: prev.summary,
    servers,
    latencyHistory,
    apis,
    databases,
    queues,
    errorLogs,
  }
}

export function useDashboardData(intervalMs = 3000): {
  data: DashboardData
  refresh: () => void
} {
  const [data, setData] = useState<DashboardData>(() => loadMockData())
  const tickRef = useRef(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      tickRef.current += 1
      setData((prev) => jitter(prev, Date.now(), tickRef.current))
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])

  const refresh = useCallback(() => {
    tickRef.current = 0
    setData(loadMockData())
  }, [])

  return { data, refresh }
}
