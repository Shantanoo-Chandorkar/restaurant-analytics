import { create } from 'zustand'

export type ComparisonType = 'none' | 'previous_period' | 'previous_year'

interface ComparisonStore {
  type: ComparisonType
  setType: (t: ComparisonType) => void
}

export const useComparisonStore = create<ComparisonStore>((set) => ({
  type: 'none',
  setType: (type) => set({ type }),
}))
