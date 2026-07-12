import { X } from 'lucide-react';
import clsx from 'clsx';

/**
 * Slide-in drawer used for fast, in-context review of Leads and Job
 * Applications, per PRD 8.2 ("modal/drawer... move through many records quickly").
 */
export default function Drawer({ open, onClose, title, subtitle, avatar, children, footer }) {
  return (
    <div
      className={clsx(
        'fixed inset-0 z-40 transition-opacity duration-200',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      )}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className={clsx(
          'absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-canvas shadow-2xl transition-transform duration-300 ease-out dark:bg-surface-dark',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border bg-surface/60 px-6 py-5 dark:border-border-dark dark:bg-canvas-dark/40">
          <div className="flex items-center gap-3 min-w-0">
            {avatar && (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cta/15 text-base font-semibold text-cta-hover dark:bg-cta/20 dark:text-cta-dark">
                {avatar}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-heading dark:text-heading-dark">{title}</h3>
              {subtitle && (
                <p className="truncate text-xs text-body/70 dark:text-body-dark/70">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-body transition-colors hover:bg-canvas hover:text-heading dark:text-body-dark dark:hover:bg-canvas-dark/60 dark:hover:text-heading-dark"
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">{children}</div>
        {footer && <div className="border-t border-border bg-surface/40 px-6 py-4 dark:border-border-dark dark:bg-canvas-dark/30">{footer}</div>}
      </div>
    </div>
  );
}