import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { loadMockData } from '@/data'
import { jitter, useDashboardData } from './useDashboardData'

describe('jitter', () => {
  const now = Date.parse('2026-08-18T10:00:00Z')

  it('mantiene la estructura y los límites de la telemetría', () => {
    const initial = loadMockData(now)
    const next = jitter(initial, now + 3000, 1)

    expect(next.servers).toHaveLength(initial.servers.length)
    expect(next.latencyHistory).toHaveLength(initial.latencyHistory.length)
    expect(next.updatedAt).toBe(now + 3000)

    for (const server of next.servers) {
      expect(server.latencyMs).toBeGreaterThanOrEqual(5)
      expect(server.cpuPct).toBeGreaterThanOrEqual(1)
      expect(server.cpuPct).toBeLessThanOrEqual(99)
      expect(server.sparkline).toHaveLength(12)
    }
  })

  it('añade un log nuevo cada 3 ticks', () => {
    const initial = loadMockData(now)
    const next = jitter(initial, now + 9000, 3)

    expect(next.errorLogs.length).toBe(initial.errorLogs.length + 1)
    expect(next.errorLogs[0].id).toMatch(/^log-live-/)
    expect(next.errorLogs[0].status).toBe('new')
  })

  it('recorta la lista de logs a 12 entradas', () => {
    let data = loadMockData(now)
    for (let tick = 3; tick <= 300; tick += 3) {
      data = jitter(data, now + tick * 1000, tick)
    }
    expect(data.errorLogs.length).toBe(12)
  })
})

describe('useDashboardData', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('devuelve datos iniciales con resumen coherente', () => {
    const { result } = renderHook(() => useDashboardData(3000))
    expect(result.current.data.summary.totalServers).toBe(8)
    expect(result.current.data.servers).toHaveLength(8)
  })

  it('refresca la telemetría en cada intervalo', () => {
    const { result } = renderHook(() => useDashboardData(3000))
    const first = result.current.data.updatedAt

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.data.updatedAt).toBeGreaterThan(first)
  })

  it('refresh restablece los datos', () => {
    const { result } = renderHook(() => useDashboardData(3000))

    act(() => {
      result.current.refresh()
    })

    expect(result.current.data.errorLogs.length).toBeGreaterThan(0)
    expect(result.current.data.servers).toHaveLength(8)
  })
})
