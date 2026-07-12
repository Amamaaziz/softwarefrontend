import clsx from 'clsx';

export default function ToggleSwitch({ checked, onChange, label, disabled }) {
  return (
    <label
      className={clsx(
        'inline-flex select-none items-center gap-3',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300 ease-in-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-canvas dark:focus-visible:ring-offset-surface-dark',
          checked ? 'bg-cta shadow-inner' : 'bg-slate-300 dark:bg-slate-600'
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-md ring-1 ring-black/5 transition-transform duration-300 ease-in-out',
            checked ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </button>
      {label && <span className="whitespace-nowrap text-sm font-medium text-heading dark:text-heading-dark">{label}</span>}
    </label>
  );
}