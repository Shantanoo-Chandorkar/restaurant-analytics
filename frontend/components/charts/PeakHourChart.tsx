'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { DailyRow } from '@/lib/types'
import { formatHour } from '@/lib/format'

interface Props {
  data: DailyRow[]
  comparisonData?: DailyRow[]
}

export default function PeakHourChart({ data, comparisonData }: Props) {
  const merged = data.map((row, i) => ({
    ...row,
    peak_hour: row.peak_hour ?? 0,
    comp_peak_hour: comparisonData?.[i]?.peak_hour ?? undefined,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={merged} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis
          label={{ value: 'Hour', angle: -90, position: 'insideLeft', offset: 20, style: { fontSize: 11 } }}
          domain={[0, 23]}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          formatter={(v, name) => [formatHour(Number(v)), name === 'peak_hour' ? 'Current' : 'Comparison']}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        {comparisonData && <Legend />}
        <Bar dataKey="peak_hour" name="Current Period" fill="#B45309" radius={[4, 4, 0, 0]} />
        {comparisonData && (
          <Bar dataKey="comp_peak_hour" name="Comparison Period" fill="#FDE68A" radius={[4, 4, 0, 0]} />
        )}
      </BarChart>
    </ResponsiveContainer>
  )
}
