import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './ui/table'
import { formatCurrency, formatHour } from '@/lib/format'
import type { DailyRow } from '@/lib/types'

export default function DailyBreakdownTable({ data }: { data: DailyRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Revenue</TableHead>
          <TableHead>AOV</TableHead>
          <TableHead>Peak Hour</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.date}>
            <TableCell className="font-medium text-gray-700">{row.date}</TableCell>
            <TableCell className="text-blue-600 font-semibold">{row.orders}</TableCell>
            <TableCell className="text-green-600 font-semibold">
              {formatCurrency(row.revenue)}
            </TableCell>
            <TableCell className="text-purple-600 font-semibold">
              {formatCurrency(row.aov)}
            </TableCell>
            <TableCell className="text-amber-500 font-semibold">
              {formatHour(row.peak_hour)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
