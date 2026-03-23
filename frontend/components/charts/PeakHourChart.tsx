'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { DailyRow } from '@/lib/types'
import { formatHour } from '@/lib/format'

export default function PeakHourChart({ data }: { data: DailyRow[] }) {
  const chartData = data.map((row) => ({
    ...row,
    peak_hour: row.peak_hour ?? 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis
          label={{ value: 'Hour', angle: -90, position: 'insideLeft', offset: 20, style: { fontSize: 11 } }}
          domain={[0, 23]}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          formatter={(v) => [formatHour(Number(v)), 'Peak Hour']}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Bar dataKey="peak_hour" fill="#F59E0B" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
