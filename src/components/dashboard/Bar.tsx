import { cn } from '@/lib/utils'

interface BarProps {
  value: number
  /** Clase de color del relleno (Tailwind), p. ej. `bg-success`. */
  tone: string
  className?: string
}

/** Barra de progreso minimalista (uso de CPU/RAM/disco, conexiones de BD). */
export function Bar({ value, tone, className }: BarProps) {
  return (
    <div className={cn('h-1.5 flex-1 overflow-hidden rounded-full bg-paper-3', className)}>
      <div className={cn('h-full rounded-full', tone)} style={{ width: `${value}%` }} />
    </div>
  )
}
