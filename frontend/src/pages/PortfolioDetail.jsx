import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowUpRight, ArrowRight, Users, Server } from 'lucide-react'
import Seo from '../components/ui/Seo.jsx'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getPortfolioBySlug } from '../lib/api.js'
import RichText from '../components/ui/RichText.jsx'

export default function PortfolioDetail() {
  const { slug } = useParams()
  const project = useAsync(() => getPortfolioBySlug(slug), [slug])
  const [peek, setPeek] = useState(false)

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
        <Reveal>
          <p className="eyebrow mb-4">// case study — {p.client}</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{p.title}</h1>

          <div className="mt-3 flex flex-wrap gap-2">
            {p.technologies.map((t) => (
              <span key={t} className="rounded-full bg-slate-100 dark:bg-slate-700/60 px-2.5 py-1 text-xs font-mono">
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100}>
          {/* Blueprint toggle */}
          <div className="mt-10 flex items-center justify-end">
            <button
              onClick={() => setPeek((p) => !p)}
              aria-pressed={peek}
              className="flex items-center gap-3 font-mono text-xs uppercase tracking-wide transition-colors hover:text-accent-hoverLight dark:hover:text-accent-dark"
            >
              Peek behind the blueprint
              <span
                className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${
                  peek ? 'bg-accent dark:bg-accent-dark' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-300 ${
                    peek ? 'left-[1.125rem]' : 'left-0.5'
                  }`}
                />
              </span>
            </button>
          </div>

          {/* Cover image + blueprint overlay */}
          <div className="relative mt-3 overflow-hidden rounded-2xl">
            <img src={p.coverImage} alt={p.title} className="h-72 w-full object-cover sm:h-[420px]" loading="lazy" />

            <div
              aria-hidden={!peek}
              className={`absolute inset-0 flex flex-col justify-center bg-[#0a1c1b]/95 p-6 transition-opacity duration-500 sm:p-10 ${
                peek ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0,210,196,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,196,0.06) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            >
              <p className="font-mono text-xs uppercase tracking-wide text-accent">
                // system blueprint — {p.client}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-y-4">
                <span className="flex items-center gap-2 rounded-lg border border-slate-500/60 px-3.5 py-2 font-mono text-xs text-slate-300 sm:text-sm">
                  <Users size={14} /> Users
                </span>
                <ArrowRight size={16} className="mx-2 shrink-0 text-slate-500" />
                {p.technologies.map((t, i) => (
                  <span key={t} className="flex items-center">
                    <span className="rounded-lg border border-accent/40 bg-accent/10 px-3.5 py-2 font-mono text-xs text-accent sm:text-sm">
                      {t}
                    </span>
                    {i < p.technologies.length - 1 && (
                      <ArrowRight size={16} className="mx-2 shrink-0 text-slate-500" />
                    )}
                  </span>
                ))}
                <ArrowRight size={16} className="mx-2 shrink-0 text-slate-500" />
                <span className="flex items-center gap-2 rounded-lg border border-slate-500/60 px-3.5 py-2 font-mono text-xs text-slate-300 sm:text-sm">
                  <Server size={14} /> Production
                </span>
              </div>

              <p className="mt-8 max-w-md font-mono text-xs leading-relaxed text-slate-400">
                Simplified data flow derived from this project's stack. Every Nexbyte hand-off ships
                with full architecture docs — no black boxes.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {[
            { heading: 'Challenge', body: p.challenge },
            { heading: 'Solution', body: p.solution },
            { heading: 'Result', body: p.result },
          ].map((block, i) => (
            <Reveal key={block.heading} delay={i * 120}>
              <h3 className="font-mono text-sm font-bold uppercase tracking-wide text-accent-hoverLight dark:text-accent-dark">{block.heading}</h3>
              <RichText html={block.body} className="mt-3 text-sm leading-relaxed" />
            </Reveal>
          ))}
        </div>

        <Reveal y={32}>
          <div className="mt-16 card-surface flex flex-col items-center gap-5 px-6 py-14 text-center sm:px-14">
            <h2 className="max-w-lg font-display text-2xl font-semibold sm:text-3xl">Want results like this for your product?</h2>
            <Button to="/contact">Start a project <ArrowUpRight size={16} /></Button>
          </div>
        </Reveal>
      </section>
    </>
  )
}