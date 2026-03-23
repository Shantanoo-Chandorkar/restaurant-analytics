import DateRangePicker from './DateRangePicker'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl">
            🍽
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Restaurant Analytics</h1>
            <p className="text-xs text-gray-500">Track performance across all locations</p>
          </div>
        </div>
        <DateRangePicker />
      </div>
    </header>
  )
}
