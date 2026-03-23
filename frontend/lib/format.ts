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
