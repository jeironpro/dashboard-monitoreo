import { describe, expect, it } from 'vitest'
import { computeSummary, loadMockData } from './index'
import type { Server } from '@/types/dashboard'

function serverStub(id: string, status: Server['status']): Server {
  return {
    id,
    name: id,
    hostname: `${id}.local`,
    region: 'eu-west-1',
    role: 'nodo',
    status,
    uptimePct: 99,
    latencyMs: 10,
    cpuPct: 10,
    memoryPct: 10,
    diskPct: 10,
    sparkline: [1, 2, 3],
    lastIncident: 0,
  }
}

describe('loadMockData', () => {
  const now = Date.parse('2026-08-18T12:00:00Z')

  it('ancla updatedAt al instante dado', () => {
    expect(loadMockData(now).updatedAt).toBe(now)
  })

  it('calcula un resumen coherente con los servidores', () => {
    const data = loadMockData(now)
    expect(data.summary).toEqual(computeSummary(data.servers))
    expect(data.summary.totalServers).toBe(8)
  })

  it('re-ancla los timestamps de logs y alertas al pasado respecto a now', () => {
    const data = loadMockData(now)
    for (const log of data.errorLogs) {
      expect(log.timestamp).toBeLessThanOrEqual(now)
    }
    for (const alert of data.securityAlerts) {
      expect(alert.timestamp).toBeLessThanOrEqual(now)
    }
  })
})

describe('computeSummary', () => {
  it('clasifica los servidores por estado', () => {
    const servers: Server[] = [
      serverStub('a', 'operational'),
      serverStub('b', 'operational'),
      serverStub('c', 'degraded'),
      serverStub('d', 'critical'),
      serverStub('e', 'maintenance'),
    ]

    expect(computeSummary(servers)).toEqual({
      totalServers: 5,
      operational: 2,
      degraded: 1,
      critical: 1,
    })
  })
})
