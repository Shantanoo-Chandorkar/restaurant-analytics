import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './ui/table'
import { formatCurrency } from '@/lib/format'
import type { TopDay } from '@/lib/types'

export default function TopDaysTable({ data }: { data: TopDay[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Revenue</TableHead>
          <TableHead>AOV</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={row.date}>
            <TableCell className="font-medium text-slate-400">#{index + 1}</TableCell>
            <TableCell className="font-medium text-gray-700">{row.date}</TableCell>
            <TableCell className="text-blue-600 font-semibold">{row.orders}</TableCell>
            <TableCell className="text-green-600 font-semibold">
              {formatCurrency(row.revenue)}
            </TableCell>
            <TableCell className="text-purple-600 font-semibold">
              {formatCurrency(row.aov)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
