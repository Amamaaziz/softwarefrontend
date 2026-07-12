import { Link } from 'react-router-dom'
import { Linkedin, Twitter, Github, Instagram } from 'lucide-react'
import { COMPANY, SERVICES } from '../data/mockData.js'

const COLUMNS = [
  {
    heading: 'Company',
    links: [
      { to: '/about', label: 'About us' },
      { to: '/portfolio', label: 'Portfolio' },
      { to: '/careers', label: 'Careers' },
      { to: '/blog', label: 'Blog' },
    ],
  },
  {
    heading: 'Services',
    links: SERVICES.slice(0, 4).map((s) => ({ to: `/services/${s.slug}`, label: s.title })),
  },
  {
    heading: 'Legal',
    links: [
      { to: '/privacy-policy', label: 'Privacy policy' },
      { to: '/terms-and-conditions', label: 'Terms & conditions' },
      { to: '/testimonials', label: 'Testimonials' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200/70 dark:border-slate-700/60 bg-surface-light dark:bg-surface-dark">
      <div className="container-page py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-heading-light dark:bg-accent-dark font-mono text-sm text-white dark:text-slate-900">
                &lt;/&gt;
              </span>
              {COMPANY.name}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{COMPANY.tagline}</p>
            <div className="mt-5 flex gap-3">
              <a href={COMPANY.social.linkedin} aria-label="LinkedIn" className="rounded-lg border border-slate-300 dark:border-slate-600 p-2 hover:border-accent dark:hover:border-accent-dark transition-colors">
                <Linkedin size={16} />
              </a>
              <a href={COMPANY.social.twitter} aria-label="Twitter / X" className="rounded-lg border border-slate-300 dark:border-slate-600 p-2 hover:border-accent dark:hover:border-accent-dark transition-colors">
                <Twitter size={16} />
              </a>
              <a href={COMPANY.social.github} aria-label="GitHub" className="rounded-lg border border-slate-300 dark:border-slate-600 p-2 hover:border-accent dark:hover:border-accent-dark transition-colors">
                <Github size={16} />
              </a>
              <a href={COMPANY.social.instagram} aria-label="Instagram" className="rounded-lg border border-slate-300 dark:border-slate-600 p-2 hover:border-accent dark:hover:border-accent-dark transition-colors">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="font-mono text-xs uppercase tracking-wide text-heading-light dark:text-heading-dark">{col.heading}</h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm hover:text-accent-hoverLight dark:hover:text-accent-dark transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200/70 dark:border-slate-700/60 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <p className="font-mono">{COMPANY.email} · {COMPANY.phone}</p>
        </div>
      </div>
    </footer>
  )
}
