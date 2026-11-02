import { useState, type JSX, type FormEvent } from 'react'
import { Sliders, Bell, Check, Loader2, RotateCcw } from 'lucide-react'
import { FeedbackToast } from '@/shared/components'
import { NotificationToggles } from '../components/NotificationToggles'
import {
  type AppSettings,
  DEFAULT_SETTINGS,
  WAREHOUSE_OPTIONS,
  CURRENCY_OPTIONS,
  SETTINGS_STORAGE_KEY,
} from '../types'

function loadSavedSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function SettingsPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications'>('general')
  const [settings, setSettings] = useState<AppSettings>(loadSavedSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleSave = (e: FormEvent): void => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
      setIsSaving(false)
      setShowToast(true)
    }, 400)
  }

  const handleReset = (): void => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS))
    setShowToast(true)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Operations Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage warehouse thresholds, notification preferences, and system defaults.
        </p>
      </div>

      <div className="flex border-b border-slate-200 gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'general'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>General Configuration</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'notifications'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notification Preferences</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          {activeTab === 'general' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="wh-location" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Warehouse Location
                </label>
                <select
                  id="wh-location"
                  value={settings.warehouseLocation}
                  onChange={(e) => setSettings({ ...settings, warehouseLocation: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  {WAREHOUSE_OPTIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="curr-display" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Currency Display
                </label>
                <select
                  id="curr-display"
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value as AppSettings['currency'] })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="batch-restock" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Restock Batch Default (Units)
                </label>
                <input
                  id="batch-restock"
                  type="number"
                  min="1"
                  max="1000"
                  value={settings.restockBatchDefault}
                  onChange={(e) => setSettings({ ...settings, restockBatchDefault: Number(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="crit-threshold" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Critical Stock Threshold
                </label>
                <input
                  id="crit-threshold"
                  type="number"
                  min="0"
                  max="500"
                  value={settings.criticalStockThreshold}
                  onChange={(e) => setSettings({ ...settings, criticalStockThreshold: Number(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          ) : (
            <NotificationToggles
              settings={settings}
              onToggle={(key) => setSettings({ ...settings, [key]: !settings[key] })}
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
        </div>
      </form>

      {showToast && (
        <FeedbackToast
          type="success"
          message="Settings updated successfully"
          onDismiss={() => setShowToast(false)}
        />
      )}
    </div>
  )
}

export default SettingsPage
