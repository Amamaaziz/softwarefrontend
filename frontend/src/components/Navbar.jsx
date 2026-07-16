import { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, Sun, Moon, ArrowUpRight, ChevronDown } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'
import { COMPANY } from '../data/mockData.js'
import { getServices } from '../lib/api.js'
import Button from './ui/Button.jsx'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services', dropdown: true },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/blog', label: 'Blog' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [services, setServices] = useState([])
  const dropdownRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    getServices()
      .then((data) => {
        if (!cancelled) setServices(data)
      })
      .catch(() => {
        if (!cancelled) setServices([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const closeAll = () => {
    setOpen(false)
    setServicesOpen(false)
    setMobileServicesOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-6">
      <div
        className={`mx-auto flex h-14 max-w-5xl items-center justify-between rounded-2xl border px-4 transition-all duration-300 sm:px-5 ${
          scrolled
            ? 'bg-canvas-light/90 dark:bg-canvas-dark/90 backdrop-blur border-slate-200/70 dark:border-slate-700/60 shadow-card'
            : 'bg-canvas-light/60 dark:bg-canvas-dark/60 backdrop-blur border-slate-200/40 dark:border-slate-700/40'
        }`}
      >
        <NavLink to="/" className="flex items-center gap-2 font-display text-lg font-semibold" onClick={closeAll}>
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-heading-light dark:bg-accent-dark font-mono text-sm text-white dark:text-slate-900">
            &lt;/&gt;
          </span>
          {COMPANY.name}
        </NavLink>

        <nav className="hidden lg:flex items-center gap-1">
          {LINKS.map((link) =>
            link.dropdown ? (
              <div
                key={link.to}
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-accent-hoverLight dark:text-accent-dark'
                        : 'hover:text-accent-hoverLight dark:hover:text-accent-dark'
                    }`
                  }
                  onClick={() => setServicesOpen(false)}
                >
                  {link.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                  />
                </NavLink>

                {servicesOpen && (
                  <div className="absolute left-0 top-full w-64 pt-2">
                    <div className="card-surface flex flex-col overflow-hidden p-2">
                      {services.map((service) => (
                        <Link
                          key={service.slug}
                          to={`/services/${service.slug}`}
                          onClick={() => setServicesOpen(false)}
                          className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-canvas-light dark:hover:bg-canvas-dark hover:text-accent-hoverLight dark:hover:text-accent-dark"
                        >
                          {service.title}
                        </Link>
                      ))}
                      <Link
                        to="/services"
                        onClick={() => setServicesOpen(false)}
                        className="mt-1 flex items-center gap-1 border-t border-slate-200/70 dark:border-slate-700/60 px-3 pt-2.5 pb-1 text-sm font-semibold text-accent-hoverLight dark:text-accent-dark"
                      >
                        All services <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-accent-hoverLight dark:text-accent-dark'
                      : 'hover:text-accent-hoverLight dark:hover:text-accent-dark'
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="rounded-lg p-2 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Button to="/contact" className="group !px-4 !py-2 rounded-xl">
            Contact <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <button onClick={toggleTheme} aria-label="Toggle color theme" className="rounded-lg p-2">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open} className="rounded-lg p-2">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="mx-auto mt-2 flex max-w-5xl flex-col gap-1 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-canvas-light/95 dark:bg-canvas-dark/95 backdrop-blur px-4 py-4 shadow-card lg:hidden">
          {LINKS.map((link) =>
            link.dropdown ? (
              <div key={link.to}>
                <button
                  onClick={() => setMobileServicesOpen((o) => !o)}
                  aria-expanded={mobileServicesOpen}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium"
                >
                  {link.label}
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {mobileServicesOpen && (
                  <div className="ml-3 flex flex-col gap-1 border-l border-slate-200/70 dark:border-slate-700/60 pl-3">
                    {services.map((service) => (
                      <Link
                        key={service.slug}
                        to={`/services/${service.slug}`}
                        onClick={closeAll}
                        className="rounded-lg px-3 py-2 text-sm"
                      >
                        {service.title}
                      </Link>
                    ))}
                    <Link
                      to="/services"
                      onClick={closeAll}
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-accent-hoverLight dark:text-accent-dark"
                    >
                      All services
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={closeAll}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'text-accent-hoverLight dark:text-accent-dark bg-surface-light dark:bg-surface-dark' : ''
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
          <Button to="/contact" className="mt-2 justify-center rounded-xl" onClick={closeAll}>
            Contact
          </Button>
        </nav>
      )}
    </header>
  )
}