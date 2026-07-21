import { Link } from 'react-router-dom'
import { MapPin, ArrowUpRight, ArrowLeft } from 'lucide-react'
import Seo from '../components/ui/Seo.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Badge from '../components/ui/Badge.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getJobs } from '../lib/api.js'

export default function Opportunities() {
  const jobs = useAsync(getJobs, [])
  const openJobs = jobs.status === 'success' ? jobs.data.filter((j) => j.status === 'open') : []

  return (
    <>
      <Seo title="Open Opportunities" description="All current open positions at DevInt." />

      {/* Dark banner with title + breadcrumb, matching the Careers page */}
      <section className="relative overflow-hidden bg-[#0a1c1b]">
        <img
          src="https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&w=1400&q=70"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-y-0 right-0 h-full w-full object-cover opacity-40 sm:w-2/3 sm:[mask-image:linear-gradient(to_left,black_40%,transparent)]"
        />
        <div className="relative container-page flex flex-col items-center justify-center py-24 text-center sm:py-32">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Opportunities
          </h1>
          <p className="mt-4 text-sm text-slate-300">
            <Link to="/" className="transition-colors hover:text-accent">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/careers" className="transition-colors hover:text-accent">Careers</Link>
            <span className="mx-2">/</span>
            <span className="text-accent">Opportunities</span>
          </p>
        </div>
      </section>

      <section className="container-page py-20">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            
            title="Current openings"
            description="Every role below is actively hiring. Click through to see the full description and apply."
          />
          <Link
            to="/careers"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-accent-hoverLight dark:hover:text-accent-dark"
          >
            <ArrowLeft size={15} /> Back to careers
          </Link>
        </Reveal>

        <div className="mt-12">
          {jobs.status === 'loading' && <Spinner />}
          {jobs.status === 'error' && <ErrorState onRetry={jobs.retry} />}
          {jobs.status === 'success' && openJobs.length === 0 && (
            <EmptyState
              title="No open roles right now"
              description="Check back soon, or send your resume to hello@devint.dev and we'll reach out when something opens."
            />
          )}
          {jobs.status === 'success' && openJobs.length > 0 && (
            <div className="flex flex-col divide-y divide-slate-200/70 dark:divide-slate-700/60 border-t border-b border-slate-200/70 dark:border-slate-700/60">
              {openJobs.map((job, i) => (
                <Reveal key={job._id} delay={i * 80} y={16}>
                  <Link
                    to={`/careers/${job.slug}`}
                    className="group flex flex-wrap items-center justify-between gap-4 py-6 transition-colors hover:bg-surface-light dark:hover:bg-surface-dark px-2 -mx-2 rounded-lg"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-display text-lg font-semibold">{job.title}</h3>
                        <Badge tone="open">{job.status}</Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                        <span>{job.department}</span>
                        <span className="flex items-center gap-1"><MapPin size={13} /> {job.location}</span>
                        <span className="font-mono text-xs uppercase">{job.type.replace('-', ' ')}</span>
                      </div>
                    </div>
                    <ArrowUpRight size={18} className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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