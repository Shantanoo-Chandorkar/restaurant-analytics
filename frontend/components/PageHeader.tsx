'use client'

import DateRangePicker from './DateRangePicker'
import ComparisonDropdown from './ComparisonDropdown'

interface Props {
  title: string
}

export default function PageHeader({ title }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <div className="flex flex-wrap items-center gap-3">
        <DateRangePicker />
        <ComparisonDropdown />
      </div>
    </div>
  )
}
