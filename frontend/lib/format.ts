const inr = new Intl.NumberFormat('en-IN')

/** Full currency: ₹1,23,456 */
export function formatCurrency(value: number): string {
  return '₹' + inr.format(Math.round(value))
}

/** Abbreviated currency: ₹34.5k */
export function formatCurrencyShort(value: number): string {
  if (value >= 1_000_000) return '₹' + (value / 1_000_000).toFixed(1) + 'M'
  if (value >= 1_000) return '₹' + (value / 1_000).toFixed(1) + 'k'
  return '₹' + inr.format(Math.round(value))
}

/** Convert 0-23 hour to "HH:00" */
export function formatHour(hour: number | null): string {
  if (hour === null) return '—'
  return String(hour).padStart(2, '0') + ':00'
}

/** Format ISO date string as "Mon D" (local time) */
export function fmtDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Generate a DailyRow skeleton for every day in [startDate, endDate] with zero values */
export function generateDateRange(startDate: string, endDate: string): { date: string; orders: number; revenue: number; aov: number; peak_hour: null }[] {
  const rows = []
  const current = new Date(startDate + 'T00:00:00')
  const end = new Date(endDate + 'T00:00:00')
  while (current <= end) {
    rows.push({
      date: current.toISOString().split('T')[0],
      orders: 0,
      revenue: 0,
      aov: 0,
      peak_hour: null,
    })
    current.setDate(current.getDate() + 1)
  }
  return rows
}
