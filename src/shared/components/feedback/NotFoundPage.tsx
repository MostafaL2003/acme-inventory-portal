import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <span className="text-4xl font-extrabold text-slate-800">404</span>
      <h2 className="text-lg font-semibold text-slate-700">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm">
        The requested URL was not found in the Acme Ops Portal workspace.
      </p>
      <Link
        to="/products"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        Back to Products
      </Link>
    </div>
  )
}

export default NotFoundPage

