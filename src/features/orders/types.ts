export type OrderStatus = 'Fulfilled' | 'Processing' | 'Pending'

export interface Order {
  readonly id: string
  readonly customer: string
  readonly destination: string
  readonly itemsCount: number
  readonly totalAmount: number
  readonly status: OrderStatus
  readonly date: string
}

export interface OrderSummaryStat {
  readonly label: string
  readonly value: string
  readonly subtext: string
  readonly variant: 'default' | 'amber' | 'emerald'
}

