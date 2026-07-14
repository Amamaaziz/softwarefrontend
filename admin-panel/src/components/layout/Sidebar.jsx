import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  Newspaper,
  MessageSquareQuote,
  Inbox,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const navSections = [
  {
    label: 'Overview',
    items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { to: '/services', label: 'Services', icon: Briefcase },
      { to: '/portfolio', label: 'Portfolio', icon: FolderKanban },
      { to: '/blog', label: 'Blog', icon: Newspaper },
      { to: '/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    ],
  },
  {
    label: 'Careers',
    items: [
      { to: '/careers/jobs', label: 'Job Postings', icon: Briefcase },
      { to: '/careers/applications', label: 'Applications', icon: Inbox },
    ],
  },
  {
    label: 'Leads',
    items: [{ to: '/leads', label: 'Contact Leads', icon: Inbox }],
  },
];

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-canvas transition-transform duration-200 dark:border-border-dark dark:bg-surface-dark lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cta font-display text-base font-bold text-slate-900">
              SH
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight text-heading dark:text-heading-dark">
                Software House
              </p>
              <p className="text-xs leading-tight text-body/70 dark:text-body-dark/70">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-body hover:bg-surface dark:text-body-dark dark:hover:bg-canvas-dark/40 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto scrollbar-thin px-3 pb-4">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-body/50 dark:text-body-dark/50">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-cta/10 text-cta-hover dark:bg-cta/15 dark:text-cta-dark'
                          : 'text-body hover:bg-surface dark:text-body-dark dark:hover:bg-canvas-dark/40'
                      )
                    }
                  >
                    <item.icon size={18} />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-4 dark:border-border-dark">
          <div className="flex items-center gap-2.5 rounded-lg bg-surface px-3 py-2.5 dark:bg-canvas-dark/40">
            <ShieldCheck size={16} className="text-cta" />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-heading dark:text-heading-dark">{user?.name}</p>
              <p className="truncate text-[11px] text-body/70 dark:text-body-dark/70">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}