'use client'

import { useEffect, useRef } from 'react'

interface Filters {
  minAmount: number
  maxAmount: number
  minHour: number
  maxHour: number
}

interface Props {
  minAmount: number
  maxAmount: number
  minHour: number
  maxHour: number
  onChange: (filters: Filters) => void
  onClose: () => void
}

export default function OrderFilterPanel({ minAmount, maxAmount, minHour, maxHour, onChange, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  function handleReset() {
    onChange({ minAmount: 100, maxAmount: 10000, minHour: 0, maxHour: 23 })
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 z-20 w-72 bg-white rounded-xl border border-slate-200 shadow-lg p-4"
    >
      {/* Amount Range */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount Range</span>
          <span className="text-xs text-slate-700">₹{minAmount.toLocaleString('en-IN')} – ₹{maxAmount.toLocaleString('en-IN')}</span>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={minAmount}
            onChange={e => {
              const val = Math.min(Number(e.target.value), maxAmount - 100)
              onChange({ minAmount: val, maxAmount, minHour, maxHour })
            }}
            className="w-full accent-blue-600"
          />
          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={maxAmount}
            onChange={e => {
              const val = Math.max(Number(e.target.value), minAmount + 100)
              onChange({ minAmount, maxAmount: val, minHour, maxHour })
            }}
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      {/* Hour Range */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Hour Range</span>
          <span className="text-xs text-slate-700">{minHour}h – {maxHour}h</span>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={23}
            step={1}
            value={minHour}
            onChange={e => {
              const val = Math.min(Number(e.target.value), maxHour - 1)
              onChange({ minAmount, maxAmount, minHour: val, maxHour })
            }}
            className="w-full accent-blue-600"
          />
          <input
            type="range"
            min={0}
            max={23}
            step={1}
            value={maxHour}
            onChange={e => {
              const val = Math.max(Number(e.target.value), minHour + 1)
              onChange({ minAmount, maxAmount, minHour, maxHour: val })
            }}
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      {/* Reset */}
      <div className="text-right">
        <button
          onClick={handleReset}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
