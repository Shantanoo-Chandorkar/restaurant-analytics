import Link from 'next/link'
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline'

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
            <BuildingStorefrontIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Restaurant Analytics</h1>
            <p className="text-xs text-slate-500">Track performance across all locations</p>
          </div>
        </Link>
      </div>
    </header>
  )
}
