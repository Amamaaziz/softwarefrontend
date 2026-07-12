export default function Badge({ children, tone = 'default', className = '' }) {
  const tones = {
    default: 'bg-slate-100 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300',
    accent: 'bg-accent/10 text-accent-hoverLight dark:bg-accent-dark/10 dark:text-accent-dark',
    open: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    closed: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-mono font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}
