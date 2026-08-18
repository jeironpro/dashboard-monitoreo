import { describe, expect, it } from 'vitest'
import { ALERT_SEVERITY, LOG_LEVEL, SERVER_STATUS } from './status'

describe('SERVER_STATUS', () => {
  it('cubre todos los estados del dominio', () => {
    expect(Object.keys(SERVER_STATUS).sort()).toEqual([
      'critical',
      'degraded',
      'maintenance',
      'operational',
    ])
  })

  it('cada estado define etiqueta y clases de color (nunca solo color)', () => {
    for (const meta of Object.values(SERVER_STATUS)) {
      expect(meta.label).toBeTruthy()
      expect(meta.text).toMatch(/^text-/)
      expect(meta.dot).toMatch(/^bg-/)
      expect(meta.soft).toMatch(/^bg-/)
    }
  })
})

describe('LOG_LEVEL', () => {
  it('cubre los niveles de log soportados', () => {
    expect(Object.keys(LOG_LEVEL).sort()).toEqual(['critical', 'error', 'exception', 'warning'])
  })
})

describe('ALERT_SEVERITY', () => {
  it('cubre las cuatro severidades', () => {
    expect(Object.keys(ALERT_SEVERITY).sort()).toEqual(['critical', 'high', 'low', 'medium'])
  })

  it('usa un tono de texto distinto por severidad', () => {
    const tones = Object.values(ALERT_SEVERITY).map((meta) => meta.text)
    expect(new Set(tones).size).toBe(4)
  })
})
