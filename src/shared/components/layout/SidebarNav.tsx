import { NavLink } from 'react-router-dom'
import {
  Boxes,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  ChevronDown,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', path: '/products', icon: Package },
  { label: 'Orders', path: '/orders', icon: ShoppingCart },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export function SidebarNav() {
  return (
    <aside className="flex flex-col w-64 bg-slate-900 text-slate-400 shrink-0 h-full border-r border-slate-800 select-none">
      <div className="flex items-center gap-3 h-16 px-6 border-b border-slate-800">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white shadow-sm">
          <Boxes className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white text-base tracking-tight leading-none">
            Acme Ops
          </span>
          <span className="text-[11px] text-slate-400 font-medium tracking-wider uppercase mt-1">
            Enterprise Hub
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 font-medium'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="p-3 border-t border-slate-800 mt-auto">
        <button
          type="button"
          className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-slate-800/70 transition-colors text-left group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
              alt="The Hub avatar"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-700 shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-200 truncate group-hover:text-white">
                the Hub
              </span>
              <span className="text-xs text-slate-400 truncate">
                Admin Workspace
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-200 shrink-0 ml-2" />
        </button>
      </div>
    </aside>
  )
}

export default SidebarNav
