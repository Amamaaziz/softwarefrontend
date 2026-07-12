export default function ErrorState({ title = 'Something went wrong', description = 'That content failed to load. Try refreshing the page.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/5 py-16 px-6 text-center">
      <h3 className="text-lg font-semibold font-display text-rose-600 dark:text-rose-400">{title}</h3>
      <p className="max-w-sm text-sm">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 text-sm font-semibold text-accent-hoverLight dark:text-accent-dark underline underline-offset-4">
          Try again
        </button>
      )}
    </div>
  )
}
