// Metadatos de estado/severidad: color + etiqueta + icono. Nunca dependen solo del color.

import type { AlertSeverity, LogLevel, ServerStatus } from '@/types/dashboard'

export interface StatusMeta {
  label: string
  /** Clase de color de texto (Tailwind). */
  text: string
  /** Clase de color del punto indicador (Tailwind). */
  dot: string
  /** Clase de fondo suave para chips (Tailwind). */
  soft: string
}

export const SERVER_STATUS: Record<ServerStatus, StatusMeta> = {
  operational: {
    label: 'Operativo',
    text: 'text-success',
    dot: 'bg-success',
    soft: 'bg-success-soft',
  },
  degraded: {
    label: 'Degradado',
    text: 'text-warning',
    dot: 'bg-warning',
    soft: 'bg-warning-soft',
  },
  critical: {
    label: 'Crítico',
    text: 'text-danger',
    dot: 'bg-danger',
    soft: 'bg-danger-soft',
  },
  maintenance: {
    label: 'Mantenimiento',
    text: 'text-neutral',
    dot: 'bg-neutral',
    soft: 'bg-paper-3',
  },
}

export const LOG_LEVEL: Record<LogLevel, StatusMeta> = {
  critical: {
    label: 'Crítico',
    text: 'text-danger',
    dot: 'bg-danger',
    soft: 'bg-danger-soft',
  },
  error: {
    label: 'Error',
    text: 'text-danger',
    dot: 'bg-danger',
    soft: 'bg-danger-soft',
  },
  warning: {
    label: 'Advertencia',
    text: 'text-warning',
    dot: 'bg-warning',
    soft: 'bg-warning-soft',
  },
  exception: {
    label: 'Excepción',
    text: 'text-signal',
    dot: 'bg-signal',
    soft: 'bg-signal-soft',
  },
}

export const ALERT_SEVERITY: Record<AlertSeverity, StatusMeta> = {
  critical: {
    label: 'Crítico',
    text: 'text-danger',
    dot: 'bg-danger',
    soft: 'bg-danger-soft',
  },
  high: {
    label: 'Alto',
    text: 'text-warning',
    dot: 'bg-warning',
    soft: 'bg-warning-soft',
  },
  medium: {
    label: 'Medio',
    text: 'text-signal',
    dot: 'bg-signal',
    soft: 'bg-signal-soft',
  },
  low: {
    label: 'Bajo',
    text: 'text-neutral',
    dot: 'bg-neutral',
    soft: 'bg-paper-3',
  },
}
