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
import { formatCurrency, fmtDate } from '@/lib/format'

interface Props {
  data: DailyRow[]
  comparisonData?: DailyRow[]
}

export default function DailyRevenueChart({ data, comparisonData }: Props) {
  const merged = data.map((row, i) => ({
    ...row,
    comp_revenue: comparisonData?.[i]?.revenue ?? undefined,
    comp_date: comparisonData?.[i]?.date,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={merged} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(v, name) => [formatCurrency(Number(v)), name === 'Current Period' ? 'Current' : 'Comparison']}
          labelFormatter={(label, payload) => {
            const compDate = payload?.[0]?.payload?.comp_date
            if (compDate) return `${fmtDate(label)} vs ${fmtDate(compDate)}`
            return fmtDate(label)
          }}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        {comparisonData && <Legend />}
        <Line
          type="monotone"
          dataKey="revenue"
          name="Current Period"
          stroke="#059669"
          strokeWidth={2}
          dot={{ r: 3, fill: '#059669' }}
          activeDot={{ r: 5 }}
        />
        {comparisonData && (
          <Line
            type="monotone"
            dataKey="comp_revenue"
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
