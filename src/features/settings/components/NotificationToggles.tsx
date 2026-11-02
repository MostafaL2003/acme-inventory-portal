import type { AppSettings } from '../types'

export interface NotificationTogglesProps {
  readonly settings: AppSettings
  readonly onToggle: (key: keyof AppSettings) => void
}

const NOTIFICATION_ITEMS = [
  {
    key: 'lowStockAlerts',
    title: 'Automated Low Stock Alerts',
    desc: 'Instantly notify operations when inventory drops below threshold.',
  },
  {
    key: 'dailyValuationDigest',
    title: 'Daily Inventory Valuation Digest',
    desc: 'Receive morning summaries of aggregate inventory value and volume.',
  },
  {
    key: 'emailDispatchConfirmations',
    title: 'Email Dispatch Confirmations',
    desc: 'Send automated shipment alerts upon order fulfillment.',
  },
] as const

export function NotificationToggles({
  settings,
  onToggle,
}: NotificationTogglesProps) {
  return (
    <div className="space-y-4 divide-y divide-slate-100">
      {NOTIFICATION_ITEMS.map((item, idx) => {
        const checked = Boolean(settings[item.key])
        return (
          <div
            key={item.key}
            className={`flex items-center justify-between pt-4 ${
              idx === 0 ? 'pt-0' : ''
            }`}
          >
            <div className="pr-4">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={checked}
              aria-label={item.title}
              onClick={() => onToggle(item.key)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                checked ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 mt-0.5 ${
                  checked ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default NotificationToggles
