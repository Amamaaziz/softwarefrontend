export default function Spinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center py-16 ${className}`} role="status" aria-live="polite">
      <span className="h-8 w-8 rounded-full border-2 border-slate-300 dark:border-slate-600 border-t-accent dark:border-t-accent-dark animate-spin" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
