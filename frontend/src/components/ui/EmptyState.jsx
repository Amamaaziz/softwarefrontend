export default function EmptyState({ title = 'Nothing here yet', description, icon }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 py-16 px-6 text-center">
      {icon && <div className="text-3xl">{icon}</div>}
      <h3 className="text-lg font-semibold font-display">{title}</h3>
      {description && <p className="max-w-sm text-sm">{description}</p>}
    </div>
  )
}
