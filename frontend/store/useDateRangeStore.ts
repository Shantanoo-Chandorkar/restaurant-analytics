import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function lastSevenDays(): { startDate: string; endDate: string } {
  const fmt = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 6)
  return { startDate: fmt(start), endDate: fmt(end) }
}

interface DateRangeStore {
  startDate: string
  endDate: string
  setStartDate: (d: string) => void
  setEndDate: (d: string) => void
}

export const useDateRangeStore = create<DateRangeStore>()(
  persist(
    (set) => ({
      ...lastSevenDays(),
      setStartDate: (startDate) => set({ startDate }),
      setEndDate: (endDate) => set({ endDate }),
    }),
    { name: 'date-range-store' }
  )
)
