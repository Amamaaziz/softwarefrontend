import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// Roles, matching PRD Section 8.2
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  CONTENT_EDITOR: 'content_editor',
  HR_MANAGER: 'hr_manager',
};

// Hardcoded credentials — this is a frontend-only project with no backend.
// Swap this block out once a real API exists.
const DEMO_EMAIL = 'admin@demo.com';
const DEMO_PASSWORD = 'demo1234';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = window.sessionStorage.getItem('adminUser');
    return cached ? JSON.parse(cached) : null;
  });
  const [isLoading] = useState(false); // no session restore call needed — nothing to await
  const navigate = useNavigate();

  const login = useCallback(async (credentials) => {
    // Simulate a brief delay so the button's loading state is visible.
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (credentials.email === DEMO_EMAIL && credentials.password === DEMO_PASSWORD) {
      const demoUser = {
        _id: 'demo-user-1',
        name: ' Admin',
        email: DEMO_EMAIL,
        role: ROLES.SUPER_ADMIN,
        isActive: true,
      };
      window.sessionStorage.setItem('adminUser', JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }

    throw new Error(`Incorrect email or password. Use ${DEMO_EMAIL} / ${DEMO_PASSWORD}.`);
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
