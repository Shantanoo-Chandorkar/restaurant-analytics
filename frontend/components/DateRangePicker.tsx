'use client'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useDateRangeStore } from '@/store/useDateRangeStore'

export default function DateRangePicker() {
  const { startDate, endDate, setStartDate, setEndDate } = useDateRangeStore()

  const start = startDate ? new Date(startDate) : null
  const end = endDate ? new Date(endDate) : null

  function handleChange(dates: [Date | null, Date | null]) {
    const [s, e] = dates
    if (s) setStartDate(s.toISOString().slice(0, 10))
    if (e) setEndDate(e.toISOString().slice(0, 10))
    if (!e) setEndDate(endDate) // keep existing end until user picks
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <DatePicker
        selectsRange
        startDate={start ?? undefined}
        endDate={end ?? undefined}
        onChange={handleChange}
        dateFormat="MMM d, yyyy"
        placeholderText="Select date range"
        className="border border-slate-200 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-52 text-slate-700"
      />
    </div>
  )
}
