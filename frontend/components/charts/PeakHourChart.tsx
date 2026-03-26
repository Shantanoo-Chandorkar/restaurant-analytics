'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { DailyRow } from '@/lib/types'
import { formatHour, fmtDate } from '@/lib/format'

interface Props {
  data: DailyRow[]
  comparisonData?: DailyRow[]
}

export default function PeakHourChart({ data, comparisonData }: Props) {
  const merged = data.map((row, i) => ({
    ...row,
    peak_hour: row.peak_hour ?? 0,
    comp_peak_hour: comparisonData?.[i]?.peak_hour ?? undefined,
    comp_date: comparisonData?.[i]?.date,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={merged} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis
          label={{ value: 'Hour', angle: -90, position: 'insideLeft', offset: 20, style: { fontSize: 11 } }}
          domain={[0, 23]}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          formatter={(v, name) => [formatHour(Number(v)), name === 'Current Period' ? 'Current' : 'Comparison']}
          labelFormatter={(label, payload) => {
            const compDate = payload?.[0]?.payload?.comp_date
            if (compDate) return `${fmtDate(compDate)} vs ${fmtDate(label)}`
            return fmtDate(label)
          }}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        {comparisonData && <Legend />}
        <Line
          type="monotone"
          dataKey="peak_hour"
          name="Current Period"
          stroke="#B45309"
          strokeWidth={2}
          dot={{ r: 3, fill: '#B45309' }}
          activeDot={{ r: 5 }}
        />
        {comparisonData && (
          <Line
            type="monotone"
            dataKey="comp_peak_hour"
            name="Comparison Period"
            stroke="#EA580C"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, fill: '#EA580C' }}
            activeDot={{ r: 5 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
