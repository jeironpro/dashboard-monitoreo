import { useEffect, useMemo, useRef } from 'react'
import { drawLine } from '@/lib/anime'
import { formatMs } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { TimeRange } from '@/components/layout/time-range'
import type { LatencyPoint } from '@/types/dashboard'

const RANGE_POINTS: Record<TimeRange, number> = { '1h': 2, '6h': 6, '24h': 24, '7d': 24 }

const W = 640
const H = 240
const PAD_X = 46
const PAD_Y = 16

interface LatencyChartProps {
    points: LatencyPoint[]
    range: TimeRange
    className?: string
}

export function LatencyChart({ points, range, className }: LatencyChartProps) {
    const lineRef = useRef<SVGPathElement>(null)
    const visible = useMemo(() => points.slice(-RANGE_POINTS[range]), [points, range])

    const chart = useMemo(() => {
        const n = visible.length
        const innerW = W - PAD_X * 2
        const innerH = H - PAD_Y * 2
        const maxV = Math.max(...visible.map((p) => Math.max(p.avg, p.p95)), 1) * 1.15
        const x = (i: number) => (n <= 1 ? PAD_X + innerW / 2 : PAD_X + (i / (n - 1)) * innerW)
        const y = (v: number) => PAD_Y + (1 - v / maxV) * innerH

        const toPath = (coords: ReadonlyArray<readonly [number, number]>) =>
            coords
                .map(([cx, cy], i) => `${i === 0 ? 'M' : 'L'}${cx.toFixed(1)},${cy.toFixed(1)}`)
                .join(' ')

        const avgCoords = visible.map((p, i) => [x(i), y(p.avg)] as const)
        const p95Coords = visible.map((p, i) => [x(i), y(p.p95)] as const)
        const avgPath = toPath(avgCoords)
        const p95Path = toPath(p95Coords)
        const areaPath = `${avgPath} L${x(n - 1).toFixed(1)},${(PAD_Y + innerH).toFixed(1)} L${x(0).toFixed(1)},${(PAD_Y + innerH).toFixed(1)} Z`

        const grid = [0, 0.33, 0.66, 1].map((f) => ({
            y: PAD_Y + (1 - f) * innerH,
            label: formatMs(maxV * f),
        }))

        const labelEvery = Math.max(1, Math.floor((n - 1) / 5))
        const rawLabels = visible
            .map((p, i) => ({ x: x(i), t: p.t, i }))
            .filter((_, i) => i % labelEvery === 0 || i === n - 1)
        // Evita etiquetas duplicadas cuando dos ticks en vivo caen en el mismo minuto.
        const xLabels = rawLabels.filter((label, i, arr) => i === 0 || label.t !== arr[i - 1].t)

        return { avgPath, p95Path, areaPath, grid, xLabels }
    }, [visible])

    useEffect(() => {
        if (lineRef.current) drawLine(lineRef.current)
    }, [])

    return (
        <div
            data-reveal
            className={cn(
                'rounded-md border bg-card p-5 shadow-[var(--shadow-whisper)]',
                className,
            )}
        >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                    <h3 className="font-display text-base font-semibold text-ink">Latencia</h3>
                    <p className="text-sm text-muted-foreground">
                        Promedio y percentil 95 de la flota
                    </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-signal" aria-hidden="true" />
                        Media
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-0.5 w-4 rounded bg-danger" aria-hidden="true" />
                        p95
                    </span>
                </div>
            </div>

            <div className="mt-4">
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="w-full"
                    role="img"
                    aria-label="Gráfico de latencia promedio y percentil 95 en el tiempo"
                >
                    {chart.grid.map((g) => (
                        <g key={g.y}>
                            <line
                                x1={PAD_X}
                                x2={W - PAD_X}
                                y1={g.y}
                                y2={g.y}
                                stroke="var(--color-rule)"
                                strokeWidth="1"
                            />
                            <text
                                x={PAD_X - 8}
                                y={g.y + 3}
                                textAnchor="end"
                                fontSize="10"
                                fill="var(--color-neutral)"
                                className="num"
                            >
                                {g.label}
                            </text>
                        </g>
                    ))}

                    {chart.xLabels.map((label) => (
                        <text
                            key={`${label.i}-${label.t}`}
                            x={label.x}
                            y={H - 4}
                            textAnchor="middle"
                            fontSize="10"
                            fill="var(--color-neutral)"
                            className="num"
                        >
                            {label.t}
                        </text>
                    ))}

                    <path d={chart.areaPath} fill="var(--color-accent-soft)" opacity="0.7" />
                    <path
                        ref={lineRef}
                        d={chart.avgPath}
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d={chart.p95Path}
                        fill="none"
                        stroke="var(--color-danger)"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    )
}
