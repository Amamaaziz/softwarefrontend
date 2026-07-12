export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:border-accent dark:hover:border-accent-dark"
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          aria-current={n === page ? 'page' : undefined}
          className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
            n === page
              ? 'bg-accent dark:bg-accent-dark text-slate-900'
              : 'border border-slate-300 dark:border-slate-600 hover:border-accent dark:hover:border-accent-dark'
          }`}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:border-accent dark:hover:border-accent-dark"
      >
        Next
      </button>
    </nav>
  )
}
