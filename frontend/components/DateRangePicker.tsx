'use client'

import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useDateRangeStore } from '@/store/useDateRangeStore'

function toLocalDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00')
}

function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function DateRangePicker() {
  const { startDate, endDate, setStartDate, setEndDate } = useDateRangeStore()

  const [localStart, setLocalStart] = useState<Date | null>(
    startDate ? toLocalDate(startDate) : null
  )
  const [localEnd, setLocalEnd] = useState<Date | null>(
    endDate ? toLocalDate(endDate) : null
  )

  function handleChange(dates: [Date | null, Date | null]) {
    const [s, e] = dates
    setLocalStart(s)
    setLocalEnd(e)
    if (s && e) {
      setStartDate(toDateString(s))
      setEndDate(toDateString(e))
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <DatePicker
        selectsRange
        startDate={localStart ?? undefined}
        endDate={localEnd ?? undefined}
        onChange={handleChange}
        dateFormat="MMM d, yyyy"
        placeholderText="Select date range"
        className="border border-slate-200 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-52 text-slate-700"
      />
    </div>
  )
}
