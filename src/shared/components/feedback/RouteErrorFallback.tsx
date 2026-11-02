import { type JSX } from 'react'
import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from 'react-router-dom'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { AlertOctagon, RotateCcw, Home } from 'lucide-react'

export interface RouteErrorFallbackProps {
  readonly onReset?: () => void
}

export function RouteErrorFallback({
  onReset,
}: RouteErrorFallbackProps): JSX.Element {
  const error = useRouteError()
  const navigate = useNavigate()
  const { reset: resetQueryBoundary } = useQueryErrorResetBoundary()

  let title = 'Something went wrong'
  let message = 'An unexpected application error occurred while loading this view.'
  let statusCode: number | null = null

  if (isRouteErrorResponse(error)) {
    statusCode = error.status
    title = error.statusText || 'Navigation Error'
    if (typeof error.data === 'string') {
      message = error.data
    } else if (
      typeof error.data === 'object' &&
      error.data !== null &&
      'message' in error.data &&
      typeof (error.data as { message: unknown }).message === 'string'
    ) {
      message = (error.data as { message: string }).message
    } else {
      message = 'The requested route could not be loaded.'
    }
  } else if (error instanceof Error) {
    message = error.message
  }

  const handleRetry = (): void => {
    resetQueryBoundary()
    onReset?.()
    window.location.reload()
  }

  const handleGoHome = (): void => {
    resetQueryBoundary()
    navigate('/products')
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-5 text-rose-600 shadow-xs">
        <AlertOctagon className="w-8 h-8" aria-hidden="true" />
      </div>

      {statusCode && (
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full mb-3">
          HTTP {statusCode}
        </span>
      )}

      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
        {title}
      </h2>

      <p className="text-sm text-slate-500 max-w-md mt-2 leading-relaxed">
        {message}
      </p>

      <div className="flex items-center gap-3 mt-6">
        <button
          type="button"
          onClick={handleRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Try Again</span>
        </button>

        <button
          type="button"
          onClick={handleGoHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4 text-slate-400" aria-hidden="true" />
          <span>Go to Products</span>
        </button>
      </div>
    </div>
  )
}

export default RouteErrorFallback
