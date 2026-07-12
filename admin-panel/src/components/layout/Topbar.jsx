import { useState, useRef, useEffect } from 'react';
import { Menu, Sun, Moon, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-canvas/80 px-4 py-3 backdrop-blur dark:border-border-dark dark:bg-surface-dark/80 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-body hover:bg-surface dark:text-body-dark dark:hover:bg-canvas-dark/40 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-body hover:bg-surface dark:text-body-dark dark:hover:bg-canvas-dark/40"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface dark:hover:bg-canvas-dark/40"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cta/15 text-sm font-semibold text-cta-hover dark:text-cta-dark">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <span className="hidden text-sm font-medium text-heading dark:text-heading-dark sm:block">
              {user?.name}
            </span>
            <ChevronDown size={14} className="text-body/60 dark:text-body-dark/60" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-canvas py-1.5 shadow-popover animate-fade-in dark:border-border-dark dark:bg-surface-dark">
              <div className="px-3.5 py-2 text-xs text-body/70 dark:text-body-dark/70">
                Signed in as
                <p className="truncate text-sm font-medium text-heading dark:text-heading-dark">{user?.email}</p>
              </div>
              <div className="my-1 border-t border-border dark:border-border-dark" />
              <button className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-body hover:bg-surface dark:text-body-dark dark:hover:bg-canvas-dark/40">
                <UserIcon size={15} /> My Profile
              </button>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <LogOut size={15} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
