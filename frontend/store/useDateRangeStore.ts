import { create } from 'zustand'

interface DateRangeStore {
  startDate: string
  endDate: string
  setStartDate: (d: string) => void
  setEndDate: (d: string) => void
}

export const useDateRangeStore = create<DateRangeStore>((set) => ({
  startDate: '2025-06-22',
  endDate: '2025-06-28',
  setStartDate: (startDate) => set({ startDate }),
  setEndDate: (endDate) => set({ endDate }),
}))
