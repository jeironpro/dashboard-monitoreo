export type TimeRange = '1h' | '6h' | '24h' | '7d'

export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  '1h': 'Última hora',
  '6h': 'Últimas 6 horas',
  '24h': 'Últimas 24 horas',
  '7d': 'Últimos 7 días',
}
