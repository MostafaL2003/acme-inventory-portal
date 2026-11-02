import { useState, useRef, useEffect, type JSX } from 'react'
import { Bell, CheckCheck, AlertTriangle, PackagePlus, RefreshCw } from 'lucide-react'

export interface InventoryNotification {
  readonly id: string
  readonly title: string
  readonly message: string
  readonly timestamp: string
  readonly type: 'warning' | 'info' | 'success'
  isRead: boolean
}

const INITIAL_NOTIFICATIONS: readonly InventoryNotification[] = [
  {
    id: 'notif-1',
    title: 'Low Stock Alert',
    message: 'SKU-7210 is below threshold (0 remaining).',
    timestamp: '10m ago',
    type: 'warning',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: 'Batch Restock',
    message: '50 units added to selected catalog items.',
    timestamp: '42m ago',
    type: 'info',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'Automated Sync',
    message: 'DummyJSON catalog refreshed successfully.',
    timestamp: '2h ago',
    type: 'success',
    isRead: false,
  },
]

export function NotificationMenu(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<InventoryNotification[]>([
    ...INITIAL_NOTIFICATIONS,
  ])
  const menuRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  useEffect(() => {
    if (!isOpen) return
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications'}
        className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-blue-600 rounded-full border border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Notifications</h2>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 flex items-start gap-3 transition-colors ${
                  item.isRead ? 'bg-white opacity-80' : 'bg-blue-50/30'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {item.type === 'warning' && (
                    <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/60">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  )}
                  {item.type === 'info' && (
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200/60">
                      <PackagePlus className="w-4 h-4" />
                    </div>
                  )}
                  {item.type === 'success' && (
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-900 truncate">{item.title}</p>
                    <span className="text-[11px] text-slate-400 shrink-0">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.message}</p>
                </div>

                {!item.isRead && (
                  <span className="w-2 h-2 mt-1.5 rounded-full bg-blue-600 shrink-0" />
                )}
              </div>
            ))}
          </div>

          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 font-medium">
              System alerts synced with warehouse queue
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationMenu
