import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/ui/Seo.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
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
      <Seo title="Portfolio" description="Case studies from products Nexbyte has designed and built." />

      <section className="container-page py-20">
        <SectionHeading eyebrow="portfolio" title="Case studies, not just screenshots" description="Every project below shipped to real users. We show the problem and the result, not just the pretty screens." />

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
              {filtered.map((project) => (
                <Link key={project._id} to={`/portfolio/${project.slug}`} className="group card-surface overflow-hidden">
                  <div className="overflow-hidden">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      loading="lazy"
                      className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="eyebrow mb-2">{project.client}</p>
                    <h3 className="font-display text-lg font-semibold">{project.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.technologies.map((t) => (
                        <span key={t} className="rounded-full bg-slate-100 dark:bg-slate-700/60 px-2.5 py-1 text-xs font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
