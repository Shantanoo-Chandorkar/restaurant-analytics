import type { ComparisonType } from '@/store/useComparisonStore'

export interface ComparisonDates {
  compStart: string
  compEnd: string
}

export function getComparisonDates(
  startDate: string,
  endDate: string,
  type: ComparisonType
): ComparisonDates | null {
  if (type === 'none') return null

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (type === 'previous_year') {
    const compStart = new Date(start)
    compStart.setFullYear(compStart.getFullYear() - 1)
    const compEnd = new Date(end)
    compEnd.setFullYear(compEnd.getFullYear() - 1)
    return {
      compStart: compStart.toISOString().slice(0, 10),
      compEnd: compEnd.toISOString().slice(0, 10),
    }
  }

  // previous_period: shift back by duration days
  const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const compEnd = new Date(start)
  compEnd.setDate(compEnd.getDate() - 1)
  const compStart = new Date(compEnd)
  compStart.setDate(compStart.getDate() - (duration - 1))

  return {
    compStart: compStart.toISOString().slice(0, 10),
    compEnd: compEnd.toISOString().slice(0, 10),
  }
}

export function formatDateRange(start: string, end: string): string {
  const s = new Date(start)
  const e = new Date(end)
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  return `${s.toLocaleDateString('en-IN', opts)} – ${e.toLocaleDateString('en-IN', opts)}`
}
