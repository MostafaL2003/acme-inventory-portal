export interface AppSettings {
  warehouseLocation: string
  currency: 'USD' | 'EUR' | 'GBP'
  restockBatchDefault: number
  criticalStockThreshold: number
  lowStockAlerts: boolean
  dailyValuationDigest: boolean
  emailDispatchConfirmations: boolean
}

export const DEFAULT_SETTINGS: AppSettings = {
  warehouseLocation: 'Chicago WH-03',
  currency: 'USD',
  restockBatchDefault: 50,
  criticalStockThreshold: 10,
  lowStockAlerts: true,
  dailyValuationDigest: false,
  emailDispatchConfirmations: true,
}

export const WAREHOUSE_OPTIONS: readonly string[] = [
  'Chicago WH-03',
  'Minneapolis WH-04',
  'Seattle Terminal-01',
  'Houston Logistics Hub',
  'Boston Harbor-02',
]

export const CURRENCY_OPTIONS: readonly { code: AppSettings['currency']; symbol: string; label: string }[] = [
  { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound' },
]

export const SETTINGS_STORAGE_KEY = 'acme_portal_operations_settings'
