'use client'

import { useDateRangeStore } from '@/store/useDateRangeStore'

export default function DateRangePicker() {
  const { startDate, endDate, setStartDate, setEndDate } = useDateRangeStore()

  return (
    <div className="flex items-center gap-2 text-sm">
      <label className="text-gray-500 font-medium">From</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="text-gray-500 font-medium">To</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
