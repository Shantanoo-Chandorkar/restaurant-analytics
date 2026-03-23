import { ReactNode } from 'react'

export function Table({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className="overflow-auto rounded-xl border border-gray-200">
      <table className={`w-full text-sm ${className}`}>{children}</table>
    </div>
  )
}

export function TableHeader({ children }: { children: ReactNode }) {
  return <thead className="bg-gray-50 border-b border-gray-200">{children}</thead>
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-gray-100 bg-white">{children}</tbody>
}

export function TableRow({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <tr className={`hover:bg-gray-50 transition-colors ${className}`}>{children}</tr>
}

export function TableHead({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${className}`}
    >
      {children}
    </th>
  )
}

export function TableCell({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <td className={`px-4 py-3 whitespace-nowrap ${className}`}>{children}</td>
}
