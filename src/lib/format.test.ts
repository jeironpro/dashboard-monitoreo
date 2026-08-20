import { describe, expect, it } from 'vitest'
import {
    formatDateTime,
    formatGb,
    formatMs,
    formatNumber,
    formatTime,
    formatUptime,
    timeAgo,
} from './format'

describe('formatMs', () => {
    it('muestra milisegundos bajo 1000', () => {
        expect(formatMs(38)).toBe('38 ms')
        expect(formatMs(486)).toBe('486 ms')
    })

    it('convierte a segundos con un decimal entre 1000 y 9999', () => {
        expect(formatMs(1200)).toBe('1.2 s')
    })

    it('redondea a segundos enteros desde 10000', () => {
        expect(formatMs(12000)).toBe('12 s')
    })
})

describe('formatUptime', () => {
    it('usa dos decimales', () => {
        expect(formatUptime(99.99)).toBe('99.99 %')
    })
})

describe('formatNumber', () => {
    it('agrupa miles con separador es-ES', () => {
        expect(formatNumber(1240)).toBe('1.240')
        expect(formatNumber(1850000)).toBe('1.850.000')
    })
})

describe('formatGb', () => {
    it('mantiene GB bajo 1000', () => {
        expect(formatGb(412)).toBe('412 GB')
    })

    it('convierte a TB desde 1000', () => {
        expect(formatGb(1840)).toBe('1.8 TB')
    })
})

describe('formatTime', () => {
    it('devuelve una hora en formato HH:MM:SS', () => {
        const epoch = new Date('2026-08-18T10:30:45').getTime()
        expect(formatTime(epoch)).toContain(':')
    })
})

describe('formatDateTime', () => {
    it('incluye día, mes y año', () => {
        const epoch = new Date('2026-08-18T10:30:45').getTime()
        const out = formatDateTime(epoch)
        expect(out).toContain('2026')
        expect(out).toContain('ago')
    })
})

describe('timeAgo', () => {
    const now = 1_000_000_000

    it('devuelve «ahora» para menos de 5 s', () => {
        expect(timeAgo(now - 3000, now)).toBe('ahora')
    })

    it('devuelve segundos', () => {
        expect(timeAgo(now - 40_000, now)).toBe('hace 40 s')
    })

    it('devuelve minutos', () => {
        expect(timeAgo(now - 5 * 60_000, now)).toBe('hace 5 min')
    })

    it('devuelve horas', () => {
        expect(timeAgo(now - 3 * 3_600_000, now)).toBe('hace 3 h')
    })

    it('devuelve días', () => {
        expect(timeAgo(now - 2 * 86_400_000, now)).toBe('hace 2 d')
    })
})
