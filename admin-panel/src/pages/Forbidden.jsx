import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <ShieldAlert size={40} className="text-red-500" />
      <h1 className="mt-4 text-xl font-semibold text-heading dark:text-heading-dark">You don't have access to this</h1>
      <p className="mt-2 max-w-sm text-sm text-body dark:text-body-dark">
        Your role doesn't include permission for this section. Contact a Super Admin if you think this is a mistake.
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button variant="secondary">Back to dashboard</Button>
      </Link>
    </div>
  );
}
