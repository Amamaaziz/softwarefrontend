import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Forbidden from '../pages/Forbidden.jsx';

/**
 * Wraps a group of nested routes and only renders them if the current
 * user's role is included in `allow`. Otherwise shows a 403 page.
 * This is a UI-level convenience only — the backend must enforce the
 * same rule independently (see PRD Section 9).
 */
export default function RoleRoute({ allow }) {
  const { hasRole } = useAuth();

  if (!hasRole(allow)) {
    return <Forbidden />;
  }

  return <Outlet />;
}
