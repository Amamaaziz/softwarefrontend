import { useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Seo from '../components/ui/Seo.jsx'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getPortfolioBySlug } from '../lib/api.js'

export default function PortfolioDetail() {
  const { slug } = useParams()
  const project = useAsync(() => getPortfolioBySlug(slug), [slug])

  if (project.status === 'loading') return <Spinner className="py-32" />
  if (project.status === 'error') return <div className="container-page py-20"><ErrorState onRetry={project.retry} /></div>
  if (project.status === 'success' && !project.data) {
    return (
      <div className="container-page py-20">
        <EmptyState title="Project not found" description="This case study may have been unpublished." />
      </div>
    )
  }

  const p = project.data

  return (
    <>
      <Seo title={p.title} description={p.result} />

      <section className="container-page py-20">
        <p className="eyebrow mb-4">// case study — {p.client}</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{p.title}</h1>

        <div className="mt-3 flex flex-wrap gap-2">
          {p.technologies.map((t) => (
            <span key={t} className="rounded-full bg-slate-100 dark:bg-slate-700/60 px-2.5 py-1 text-xs font-mono">
              {t}
            </span>
          ))}
        </div>

        <img src={p.coverImage} alt={p.title} className="mt-10 h-72 w-full rounded-2xl object-cover sm:h-[420px]" loading="lazy" />

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wide text-accent-hoverLight dark:text-accent-dark">Challenge</h3>
            <p className="mt-3 text-sm leading-relaxed">{p.challenge}</p>
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wide text-accent-hoverLight dark:text-accent-dark">Solution</h3>
            <p className="mt-3 text-sm leading-relaxed">{p.solution}</p>
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wide text-accent-hoverLight dark:text-accent-dark">Result</h3>
            <p className="mt-3 text-sm leading-relaxed">{p.result}</p>
          </div>
        </div>

        <div className="mt-16 card-surface flex flex-col items-center gap-5 px-6 py-14 text-center sm:px-14">
          <h2 className="max-w-lg font-display text-2xl font-semibold sm:text-3xl">Want results like this for your product?</h2>
          <Button to="/contact">Start a project <ArrowUpRight size={16} /></Button>
        </div>
      </section>
    </>
  )
}
