import { create } from 'zustand'

interface FilterStore {
  search: string
  sortBy: string
  sortDirection: 'asc' | 'desc'
  cuisine: string
  location: string
  setSearch: (v: string) => void
  setSortBy: (v: string) => void
  setSortDirection: (v: 'asc' | 'desc') => void
  setCuisine: (v: string) => void
  setLocation: (v: string) => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  search: '',
  sortBy: 'name',
  sortDirection: 'asc',
  cuisine: '',
  location: '',
  setSearch: (search) => set({ search }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortDirection: (sortDirection) => set({ sortDirection }),
  setCuisine: (cuisine) => set({ cuisine }),
  setLocation: (location) => set({ location }),
}))
