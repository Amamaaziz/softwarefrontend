export function Input({ label, error, id, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-heading-light dark:text-heading-dark">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border bg-white dark:bg-canvas-dark px-4 py-2.5 text-sm text-heading-light dark:text-heading-dark placeholder:text-slate-400 outline-none transition-colors focus:border-accent dark:focus:border-accent-dark ${
          error ? 'border-rose-400' : 'border-slate-300 dark:border-slate-600'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
}

export function Textarea({ label, error, id, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-heading-light dark:text-heading-dark">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={5}
        className={`w-full rounded-lg border bg-white dark:bg-canvas-dark px-4 py-2.5 text-sm text-heading-light dark:text-heading-dark placeholder:text-slate-400 outline-none transition-colors focus:border-accent dark:focus:border-accent-dark resize-none ${
          error ? 'border-rose-400' : 'border-slate-300 dark:border-slate-600'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
}

export function Select({ label, error, id, className = '', children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-heading-light dark:text-heading-dark">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full rounded-lg border bg-white dark:bg-canvas-dark px-4 py-2.5 text-sm text-heading-light dark:text-heading-dark outline-none transition-colors focus:border-accent dark:focus:border-accent-dark ${
          error ? 'border-rose-400' : 'border-slate-300 dark:border-slate-600'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
}