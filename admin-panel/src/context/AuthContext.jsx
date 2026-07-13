import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { readDb } from '../data/mockDb.js';

const AuthContext = createContext(null);

// Roles, matching PRD Section 8.2
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  CONTENT_EDITOR: 'content_editor',
  HR_MANAGER: 'hr_manager',
};

// ─────────────────────────────────────────────────────────────────────────────
// Fake auth. There is no backend, so there is no token, no hashing, no session
// endpoint — passwords are never stored anywhere (see usersApi.beforeWrite).
//
// Sign in as:
//   admin@demo.com          → super_admin  (the catch-all demo account)
//   or ANY user on the Users page, e.g.
//   ayesha@nexbyte.dev      → super_admin
//   bilal@nexbyte.dev       → content_editor   (no Users/Settings/Logs access)
//   sara@nexbyte.dev        → hr_manager       (careers + leads only)
//
// Password for all of them: demo1234
// Signing in as different roles is how you demo the role-based route guards.
// ─────────────────────────────────────────────────────────────────────────────
export const DEMO_PASSWORD = 'demo1234';
export const DEMO_EMAIL = 'admin@demo.com';

const FALLBACK_ADMIN = {
  _id: 'demo-user-1',
  name: 'Demo Admin',
  email: DEMO_EMAIL,
  role: ROLES.SUPER_ADMIN,
  isActive: true,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = window.sessionStorage.getItem('adminUser');
    return cached ? JSON.parse(cached) : null;
  });
  const [isLoading] = useState(false); // nothing to await — no session endpoint
  const navigate = useNavigate();

  const login = useCallback(async (credentials) => {
    // Brief pause so the button's loading state is visible.
    await new Promise((resolve) => setTimeout(resolve, 400));

    const email = String(credentials.email || '').trim().toLowerCase();
    const password = String(credentials.password || '');

    if (password !== DEMO_PASSWORD) {
      throw new Error(`Incorrect email or password. Try ${DEMO_EMAIL} / ${DEMO_PASSWORD}.`);
    }

    const match =
      email === DEMO_EMAIL
        ? FALLBACK_ADMIN
        : (readDb().users || []).find((u) => u.email.toLowerCase() === email);

    if (!match) {
      throw new Error(`No account for that email. Try ${DEMO_EMAIL} / ${DEMO_PASSWORD}.`);
    }
    if (!match.isActive) {
      throw new Error('That account is deactivated. Reactivate it on the Users page.');
    }

    const signedIn = {
      _id: match._id,
      name: match.name,
      email: match.email,
      role: match.role,
      isActive: true,
    };
    window.sessionStorage.setItem('adminUser', JSON.stringify(signedIn));
    setUser(signedIn);
    return signedIn;
  }, []);

  const logout = useCallback(async () => {
    window.sessionStorage.removeItem('adminUser');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const hasRole = useCallback(
    (roles) => {
      if (!user) return false;
      if (!roles || roles.length === 0) return true;
      return roles.includes(user.role);
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
