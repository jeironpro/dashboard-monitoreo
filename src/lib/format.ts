// Formateadores de valores para el dashboard (es-ES).

export function formatMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)} ms`
  return `${(ms / 1000).toFixed(ms < 10000 ? 1 : 0)} s`
}

export function formatNumber(value: number): string {
  // useGrouping explícito: el ICU por defecto no agrupa números de 4 dígitos en es-ES.
  return new Intl.NumberFormat('es-ES', {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatUptime(pct: number): string {
  return `${pct.toFixed(2)} %`
}

export function formatGb(gb: number): string {
  if (gb >= 1000) return `${(gb / 1000).toFixed(1)} TB`
  return `${gb} GB`
}

export function formatTime(epoch: number): string {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(epoch)
}

export function timeAgo(epoch: number, now: number): string {
  const diff = Math.max(0, now - epoch)
  const s = Math.floor(diff / 1000)
  if (s < 5) return 'ahora'
  if (s < 60) return `hace ${s} s`
  const m = Math.floor(s / 60)
  if (m < 60) return `hace ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `hace ${h} h`
  const d = Math.floor(h / 24)
  return `hace ${d} d`
}
