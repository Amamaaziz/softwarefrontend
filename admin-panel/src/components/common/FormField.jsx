import { forwardRef } from 'react';
import clsx from 'clsx';

const baseFieldClasses =
  'w-full rounded-lg border border-border bg-canvas px-3.5 py-2.5 text-sm text-heading placeholder:text-body/60 focus:border-cta focus:ring-1 focus:ring-cta transition-colors dark:border-border-dark dark:bg-surface-dark dark:text-heading-dark dark:placeholder:text-body-dark/50';

export const Input = forwardRef(({ className, error, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(baseFieldClasses, error && 'border-red-400 focus:border-red-400 focus:ring-red-400', className)}
    {...props}
  />
));
Input.displayName = 'Input';

export const Textarea = forwardRef(({ className, error, rows = 4, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={clsx(baseFieldClasses, 'resize-y', error && 'border-red-400 focus:border-red-400 focus:ring-red-400', className)}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export const Select = forwardRef(({ className, error, children, ...props }, ref) => (
  <select
    ref={ref}
    className={clsx(baseFieldClasses, 'cursor-pointer', error && 'border-red-400 focus:border-red-400 focus:ring-red-400', className)}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';

export function FormField({ label, htmlFor, error, hint, required, children }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-heading dark:text-heading-dark">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-body/70 dark:text-body-dark/70">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
