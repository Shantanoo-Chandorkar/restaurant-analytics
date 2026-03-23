import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: Props) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: Props) {
  return <div className={`px-6 pt-6 pb-2 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }: Props) {
  return (
    <h3 className={`text-base font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  )
}

export function CardContent({ children, className = '' }: Props) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>
}
