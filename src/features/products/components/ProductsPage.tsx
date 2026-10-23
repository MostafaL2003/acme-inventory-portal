export function ProductsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Products Catalog</h2>
          <p className="text-sm text-slate-500">Manage, filter, and track stock levels across warehouse bins.</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 shadow-xs">
        <p className="text-sm">Products table and URL filters will be loaded here.</p>
      </div>
    </div>
  )
}

export default ProductsPage

