import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// ─────────────────────────────────────────────────────────────────────────────
// Fake auth. There is no backend, so there is no token, no hashing, no session
// endpoint. There is exactly ONE admin account — no user management page, no
// invite flow, no roles. Sign in as:
//   admin@demo.com / demo1234
// ─────────────────────────────────────────────────────────────────────────────
export const DEMO_PASSWORD = 'demo1234';
export const DEMO_EMAIL = 'admin@demo.com';

const ADMIN = {
  _id: 'admin-1',
  name: 'Admin',
  email: DEMO_EMAIL,
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

    if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      throw new Error(`Incorrect email or password. Try ${DEMO_EMAIL} / ${DEMO_PASSWORD}.`);
    }

    window.sessionStorage.setItem('adminUser', JSON.stringify(ADMIN));
    setUser(ADMIN);
    return ADMIN;
  }, []);

  const logout = useCallback(async () => {
    window.sessionStorage.removeItem('adminUser');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}