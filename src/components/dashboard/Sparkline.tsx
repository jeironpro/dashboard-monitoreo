interface SparklineProps {
    values: number[]
    width?: number
    height?: number
    stroke?: string
    className?: string
}

/** Mini-gráfico de línea SVG (latencia histórica por servidor). */
export function Sparkline({
    values,
    width = 96,
    height = 28,
    stroke = 'var(--color-accent)',
    className,
}: SparklineProps) {
    const max = Math.max(...values, 1)
    const min = Math.min(...values, 0)
    const range = max - min || 1
    const step = values.length > 1 ? width / (values.length - 1) : 0

    const points = values
        .map((v, i) => {
            const x = i * step
            const y = height - ((v - min) / range) * (height - 4) - 2
            return `${x.toFixed(1)},${y.toFixed(1)}`
        })
        .join(' ')

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className={className}
            aria-hidden="true"
        >
            <polyline
                points={points}
                fill="none"
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
