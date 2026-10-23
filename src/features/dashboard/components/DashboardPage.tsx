export function DashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h2>
        <p className="text-sm text-slate-500">Live operational metrics and inventory valuation.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Total SKUs</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">194</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Low Stock Items</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">12</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Valuation</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">$48,250</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

