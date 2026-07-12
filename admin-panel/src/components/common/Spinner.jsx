import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

export default function Spinner({ size = 'md', className }) {
  return (
    <Loader2
      className={clsx('animate-spin text-cta', sizes[size], className)}
      aria-label="Loading"
    />
  );
}
