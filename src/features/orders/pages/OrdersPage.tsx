import { useState, useMemo, type JSX } from 'react'
import {
  Search,
  X,
  PackageCheck,
  Clock,
  DollarSign,
  ShoppingCart,
} from 'lucide-react'
import { MOCK_ORDERS, ORDER_SUMMARY_STATS } from '../data/mockOrders'
import type { OrderStatus } from '../types'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

function getStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case 'Fulfilled':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
    case 'Processing':
      return 'bg-blue-50 text-blue-700 border-blue-200/80'
    case 'Pending':
      return 'bg-amber-50 text-amber-700 border-amber-200/80'
  }
}

export function OrdersPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return MOCK_ORDERS
    return MOCK_ORDERS.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.destination.toLowerCase().includes(query),
    )
  }, [searchQuery])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Orders & Invoicing
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track fulfillment, warehouse dispatches, and incoming purchase requisitions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ORDER_SUMMARY_STATS.map((stat, idx) => (
          <div
            key={stat.label}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                {stat.value}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.subtext}</p>
            </div>
            <div
              className={`p-3 rounded-xl border ${
                idx === 1
                  ? 'bg-amber-50 text-amber-600 border-amber-200/60'
                  : idx === 2
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200/60'
                    : 'bg-blue-50 text-blue-600 border-blue-200/60'
              }`}
            >
              {idx === 0 && <ShoppingCart className="w-5 h-5" aria-hidden="true" />}
              {idx === 1 && <Clock className="w-5 h-5" aria-hidden="true" />}
              {idx === 2 && <DollarSign className="w-5 h-5" aria-hidden="true" />}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative w-72 max-w-full">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID or Customer..."
              aria-label="Filter orders"
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear order search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <span className="text-xs font-medium text-slate-500">
            Showing {filteredOrders.length} of {MOCK_ORDERS.length} orders
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <PackageCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm font-semibold text-slate-700">No orders match your filter</p>
            <p className="text-xs text-slate-400 mt-1">Try searching by a different ID or customer name.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th scope="col" className="py-3 px-4">Order ID</th>
                  <th scope="col" className="py-3 px-4">Customer / Destination</th>
                  <th scope="col" className="py-3 px-4">Items Count</th>
                  <th scope="col" className="py-3 px-4">Total Amount</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-blue-600 whitespace-nowrap">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{order.customer}</p>
                      <p className="text-[11px] text-slate-400">{order.destination}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {currencyFormatter.format(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 whitespace-nowrap">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage

