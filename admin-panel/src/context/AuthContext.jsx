import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '../lib/http.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = window.sessionStorage.getItem('adminUser');
    return cached ? JSON.parse(cached) : null;
  });
  const [isLoading] = useState(false);
  const navigate = useNavigate();

  const login = useCallback(async (credentials) => {
    const { data } = await http.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    // login controller returns { success, data: { user: { id, role } }, message }
    const loggedInUser = data.data.user;
    window.sessionStorage.setItem('adminUser', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(async () => {
    await http.post('/auth/logout').catch(() => {});
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