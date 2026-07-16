import { useParams, Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import Seo from '../components/ui/Seo.jsx'
import Badge from '../components/ui/Badge.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Button from '../components/ui/Button.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getJobBySlug } from '../lib/api.js'
import RichText from '../components/ui/RichText.jsx'

export default function JobDetail() {
  const { slug } = useParams()
  const job = useAsync(() => getJobBySlug(slug), [slug])

  if (job.status === 'loading') return <Spinner className="py-32" />
  if (job.status === 'error') return <div className="container-page py-20"><ErrorState onRetry={job.retry} /></div>
  if (job.status === 'success' && !job.data) {
    return (
      <div className="container-page py-20">
        <EmptyState title="Position not found" description="This role may have been filled or closed." />
      </div>
    )
  }

  const j = job.data

  return (
    <>
      <Seo title={j.title} description={j.description} />

      <section className="container-page py-20">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{j.title}</h1>
                <Badge tone={j.status === 'open' ? 'open' : 'closed'}>{j.status}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <span>{j.department}</span>
                <span className="flex items-center gap-1"><MapPin size={13} /> {j.location}</span>
                <span className="font-mono text-xs uppercase">{j.type.replace('-', ' ')} · {j.experienceLevel}</span>
              </div>

              <RichText html={j.description} className="mt-8 text-base leading-relaxed" />
            </Reveal>

            <Reveal className="mt-10">
              <h3 className="font-display text-lg font-semibold">What you'll do</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {j.responsibilities.map((r) => (
                  <li key={r} className="flex gap-2 text-sm leading-relaxed">
                    <span className="text-accent-hoverLight dark:text-accent-dark">—</span> {r}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-8">
              <h3 className="font-display text-lg font-semibold">What we're looking for</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {j.requirements.map((r) => (
                  <li key={r} className="flex gap-2 text-sm leading-relaxed">
                    <span className="text-accent-hoverLight dark:text-accent-dark">—</span> {r}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={150}>
            <div className="card-surface sticky top-24 p-6 text-center">
              {j.status !== 'open' ? (
                <EmptyState title="This role is closed" description="It's no longer accepting applications. See our other open roles." />
              ) : (
                <>
                  <h3 className="font-display text-lg font-semibold">Interested in this role?</h3>
                  <p className="mt-2 text-sm">Apply from our Careers page — it only takes a couple of minutes.</p>
                  <Button to={`/careers?jobId=${j._id}`} className="mt-5 w-full justify-center">
  Apply now
</Button>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}