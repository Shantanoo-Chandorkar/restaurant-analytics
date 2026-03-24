'use client'

import { useState, useEffect } from 'react'
import { useOrders } from '@/hooks/useOrders'
import { formatCurrency } from '@/lib/format'

interface Props {
  restaurantId: number
  startDate: string
  endDate: string
}

export default function OrdersTable({ restaurantId, startDate, endDate }: Props) {
  const [page, setPage] = useState(1)

  // Reset to page 1 when date range changes
  useEffect(() => { setPage(1) }, [startDate, endDate])

  const { data, loading, error } = useOrders(restaurantId, startDate, endDate, page)

  const from = data ? (data.current_page - 1) * data.per_page + 1 : 0
  const to = data ? Math.min(data.current_page * data.per_page, data.total) : 0

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-16">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Date & Time</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              Array.from({ length: 15 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-4 py-3"><div className="h-5 w-8 bg-slate-100 rounded animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-5 w-40 bg-slate-100 rounded animate-pulse" /></td>
                  <td className="px-4 py-3 text-right"><div className="h-5 w-20 bg-slate-100 rounded animate-pulse ml-auto" /></td>
                </tr>
              ))
            )}
            {error && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-red-500">Failed to load orders.</td>
              </tr>
            )}
            {!loading && data?.data.map((order, i) => (
              <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-400">{from + i}</td>
                <td className="px-4 py-3 text-slate-700">
                  {new Date(order.order_time).toLocaleString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-slate-900">
                  {formatCurrency(order.order_amount)}
                </td>
              </tr>
            ))}
            {!loading && data?.data.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-400">No orders for the selected date range.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.last_page > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-sm text-slate-600">
          <span>Showing {from}–{to} of {data.total} orders</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={data.current_page === 1}
              className="px-3 py-1.5 rounded-md border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-slate-500">Page {data.current_page} of {data.last_page}</span>
            <button
              onClick={() => setPage(p => Math.min(data.last_page, p + 1))}
              disabled={data.current_page === data.last_page}
              className="px-3 py-1.5 rounded-md border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
