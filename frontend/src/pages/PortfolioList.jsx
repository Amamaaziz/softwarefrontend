import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/ui/Seo.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getPortfolio } from '../lib/api.js'


export default function PortfolioList() {
  const portfolio = useAsync(getPortfolio, [])
  const [filter, setFilter] = useState('All')

  const technologies = useMemo(() => {
    if (portfolio.status !== 'success') return []
    return ['All', ...new Set(portfolio.data.flatMap((p) => p.technologies))]
  }, [portfolio.status, portfolio.data])

  const filtered = useMemo(() => {
    if (portfolio.status !== 'success') return []
    if (filter === 'All') return portfolio.data
    return portfolio.data.filter((p) => p.technologies.includes(filter))
  }, [portfolio.status, portfolio.data, filter])

  return (
    <>
      <Seo title="Portfolio" description="Case studies from products DevInt has designed and built." />

      {/* BANNER — full-bleed "case study cover": image across the whole banner,
          dark gradient overlay, title anchored bottom-left */}
      <section className="relative overflow-hidden bg-[#0a1c1b]">
        <img
          src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1600&q=70"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0a1c1b] via-[#0a1c1b]/60 to-[#0a1c1b]/20"
        />
        <div className="relative container-page flex min-h-[22rem] flex-col justify-end pb-14 pt-24 sm:min-h-[26rem]">
          <p className="font-mono text-xs uppercase tracking-wide text-accent"></p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Portfolio
          </h1>
          <p className="mt-4 text-sm text-slate-300">
            <Link to="/" className="transition-colors hover:text-accent">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-accent">Portfolio</span>
          </p>
        </div>
      </section>

      <section className="container-page py-20">
        <Reveal>
          <SectionHeading  title="Case studies, not just screenshots" description="Every project below shipped to real users. We show the problem and the result, not just the pretty screens." />
        </Reveal>

        {portfolio.status === 'success' && technologies.length > 1 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <button
                key={tech}
                onClick={() => setFilter(tech)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-mono transition-colors ${
                  filter === tech
                    ? 'bg-accent dark:bg-accent-dark text-slate-900'
                    : 'border border-slate-300 dark:border-slate-600 hover:border-accent dark:hover:border-accent-dark'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10">
          {portfolio.status === 'loading' && <Spinner />}
          {portfolio.status === 'error' && <ErrorState onRetry={portfolio.retry} />}
          {portfolio.status === 'success' && filtered.length === 0 && (
            <EmptyState title="No projects match that filter" description="Try a different technology, or view all projects." />
          )}
          {portfolio.status === 'success' && filtered.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {filtered.map((project, i) => (
                <Reveal key={project._id} delay={(i % 2) * 100}>
                  <Link to={`/portfolio/${project.slug}`} className="group card-surface block overflow-hidden">
                  <div className="overflow-hidden">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      loading="lazy"
                      className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    
                     <h3 className="font-display text-sm font-semibold text-accent dark:text-accent-dark">
                       {project.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.technologies.map((t) => (
                        <span key={t} className="rounded-full bg-slate-100 dark:bg-slate-700/60 px-2.5 py-1 text-xs font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}