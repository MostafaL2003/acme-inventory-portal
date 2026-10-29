import { useEffect } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

export interface FeedbackToastProps {
  type: 'success' | 'error'
  message: string
  onDismiss: () => void
  durationMs?: number
}

export function FeedbackToast({
  type,
  message,
  onDismiss,
  durationMs = 4000,
}: FeedbackToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, durationMs)
    return () => clearTimeout(timer)
  }, [onDismiss, durationMs])

  const isSuccess = type === 'success'

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all ${
        isSuccess
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-rose-50 border-rose-200 text-rose-900'
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
      )}

      <span className="text-sm font-medium">{message}</span>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className={`p-1 rounded-md transition-colors cursor-pointer ${
          isSuccess
            ? 'text-emerald-600 hover:bg-emerald-100'
            : 'text-rose-600 hover:bg-rose-100'
        }`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default FeedbackToast
