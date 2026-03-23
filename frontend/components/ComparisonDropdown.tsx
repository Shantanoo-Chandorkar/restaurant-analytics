'use client'

import { useComparisonStore, type ComparisonType } from '@/store/useComparisonStore'

const selectClass =
  'h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700'

export default function ComparisonDropdown() {
  const { type, setType } = useComparisonStore()

  return (
    <select
      value={type}
      onChange={(e) => setType(e.target.value as ComparisonType)}
      className={selectClass}
    >
      <option value="none">No comparison</option>
      <option value="previous_period">Previous period</option>
      <option value="previous_year">Previous year</option>
    </select>
  )
}
