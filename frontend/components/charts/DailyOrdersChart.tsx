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

interface Props {
  data: DailyRow[]
  comparisonData?: DailyRow[]
}

export default function DailyOrdersChart({ data, comparisonData }: Props) {
  const merged = data.map((row, i) => ({
    ...row,
    comp_orders: comparisonData?.[i]?.orders ?? undefined,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={merged} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(v, name) => [Number(v), name === 'orders' ? 'Current' : 'Comparison']}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        {comparisonData && <Legend />}
        <Bar dataKey="orders" name="Current Period" fill="#2563EB" radius={[4, 4, 0, 0]} />
        {comparisonData && (
          <Bar dataKey="comp_orders" name="Comparison Period" fill="#BFDBFE" radius={[4, 4, 0, 0]} />
        )}
      </BarChart>
    </ResponsiveContainer>
  )
}
