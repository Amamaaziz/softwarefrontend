import clsx from 'clsx';

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-border bg-canvas shadow-card dark:border-border-dark dark:bg-surface-dark dark:shadow-card-dark',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return (
    <div className={clsx('flex items-center justify-between border-b border-border px-5 py-4 dark:border-border-dark', className)}>
      {children}
    </div>
  );
}

export function CardBody({ className, children }) {
  return <div className={clsx('p-5', className)}>{children}</div>;
}
