import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ComparisonType = 'none' | 'previous_period' | 'previous_year'

interface ComparisonStore {
  type: ComparisonType
  setType: (t: ComparisonType) => void
}

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set) => ({
      type: 'none',
      setType: (type) => set({ type }),
    }),
    { name: 'comparison-store' }
  )
)
