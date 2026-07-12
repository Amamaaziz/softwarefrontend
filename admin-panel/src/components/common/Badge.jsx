import clsx from 'clsx';

const tones = {
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  danger: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
  neutral: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  cta: 'bg-cta/10 text-cta-hover dark:bg-cta/15 dark:text-cta-dark',
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
};

export default function Badge({ tone = 'neutral', children, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
