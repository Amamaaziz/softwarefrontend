import { forwardRef } from 'react';
import clsx from 'clsx';
import Spinner from './Spinner.jsx';

const variants = {
  primary:
    'bg-cta text-slate-900 hover:bg-cta-hover dark:bg-cta-dark dark:hover:bg-cta-hover-dark font-semibold shadow-sm',
  secondary:
    'bg-surface dark:bg-surface-dark text-heading dark:text-heading-dark border border-border dark:border-border-dark hover:bg-border/40 dark:hover:bg-border-dark/40',
  ghost: 'text-body dark:text-body-dark hover:bg-border/40 dark:hover:bg-border-dark/40',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  outlineDanger:
    'border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950',
};

const sizes = {
  sm: 'text-xs px-2.5 py-1.5 rounded-lg gap-1.5',
  md: 'text-sm px-4 py-2.5 rounded-lg gap-2',
  lg: 'text-base px-5 py-3 rounded-xl gap-2',
  icon: 'p-2 rounded-lg',
};

const Button = forwardRef(
  (
    { variant = 'primary', size = 'md', isLoading, disabled, className, children, type = 'button', ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={clsx(
          'inline-flex items-center justify-center font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Spinner size="sm" className={variant === 'primary' ? 'text-slate-900' : undefined} />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
