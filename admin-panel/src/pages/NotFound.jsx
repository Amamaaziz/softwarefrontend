import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center dark:bg-surface-dark">
      <Compass size={40} className="text-cta" />
      <h1 className="mt-4 text-2xl font-semibold text-heading dark:text-heading-dark">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-body dark:text-body-dark">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}
