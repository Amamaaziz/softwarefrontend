import { Inbox } from 'lucide-react';
import Button from './Button.jsx';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  message = 'Once items are added, they will show up here.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface dark:bg-canvas-dark">
        <Icon size={26} className="text-body/60 dark:text-body-dark/60" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-heading dark:text-heading-dark">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-body dark:text-body-dark">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-5" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
