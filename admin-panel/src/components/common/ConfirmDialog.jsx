import { AlertTriangle, X } from 'lucide-react';
import Button from './Button.jsx';

export default function ConfirmDialog({
  open,
  title = 'Delete this item?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  isLoading,
  onConfirm,
  onCancel,
  tone = 'danger',cd
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-canvas p-6 shadow-popover dark:bg-surface-dark"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div
            className={
              tone === 'danger'
                ? 'flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
                : 'flex h-10 w-10 items-center justify-center rounded-full bg-cta/10 text-cta-hover dark:bg-cta/15 dark:text-cta-dark'
            }
          >
            <AlertTriangle size={20} />
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-1 text-body hover:bg-border/40 dark:text-body-dark dark:hover:bg-border-dark/40"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <h3 id="confirm-dialog-title" className="mt-4 text-base font-semibold text-heading dark:text-heading-dark">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-body dark:text-body-dark">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
