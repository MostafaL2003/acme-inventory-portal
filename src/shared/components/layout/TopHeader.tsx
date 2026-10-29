import { useLocation } from 'react-router-dom'
import { Search, Bell } from 'lucide-react'
import { useAppDispatch } from '@/shared/hooks'
import { openCommandPalette } from '@/shared/store'

export function TopHeader() {
  const location = useLocation()
  const dispatch = useAppDispatch()

  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard'
    if (pathname.startsWith('/products')) return 'Inventory Products'
    if (pathname.startsWith('/orders')) return 'Orders'
    if (pathname.startsWith('/settings')) return 'Settings'
    return 'Acme Portal'
  }

  const title = getPageTitle(location.pathname)

  return (
    <header className="flex items-center justify-between h-16 bg-white border-b border-slate-200 px-6 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Portal
        </span>
        <span className="text-slate-300">/</span>
        <h1 className="text-sm font-semibold text-slate-800">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => dispatch(openCommandPalette())}
          className="flex items-center gap-3 px-3.5 py-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer w-64 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search or command...</span>
          </div>
          <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded shadow-xs">
            ⌘K
          </kbd>
        </button>

        <div className="h-4 w-px bg-slate-200" />

        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
        </button>
      </div>
    </header>
  )
}

export default TopHeader

