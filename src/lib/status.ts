// Metadatos de estado/severidad: color + etiqueta + icono. Nunca dependen solo del color.

import type { AlertSeverity, AlertStatus, LogLevel, LogStatus, ServerStatus } from '@/types/dashboard'

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

/** Etiqueta de estados de ciclo de vida (logs y alertas): texto + color. */
export interface StatusLabel {
  label: string
  /** Clase de color de texto (Tailwind). */
  cls: string
}

export const LOG_STATUS: Record<LogStatus, StatusLabel> = {
  new: { label: 'Nuevo', cls: 'text-danger' },
  acknowledged: { label: 'Visto', cls: 'text-warning' },
  resolved: { label: 'Resuelto', cls: 'text-success' },
}

export const ALERT_STATUS: Record<AlertStatus, StatusLabel> = {
  open: { label: 'Abierta', cls: 'text-danger' },
  investigating: { label: 'En investigación', cls: 'text-warning' },
  resolved: { label: 'Resuelta', cls: 'text-success' },
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
