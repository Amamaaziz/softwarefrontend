import { Link } from 'react-router-dom'
import { ArrowUpRight, ImageOff } from 'lucide-react'
import Seo from '../components/ui/Seo.jsx'
import Card from '../components/ui/Card.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Button from '../components/ui/Button.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import TechStackSandbox from '../components/TechStackSandbox.jsx'
import ScopeEstimator from '../components/ScopeEstimator.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getServices } from '../lib/api.js'
import { decodeCommonEntities } from '../lib/textToHtml.js'

export default function ServicesList() {
  const services = useAsync(getServices, [])

  return (
    <>
      <Seo title="Services" description="Web, mobile, design, SEO, SaaS, QA, and DevOps services from DevInt." />

      {/* BANNER — left-aligned "terminal" style: mono eyebrow, title + tagline, code image masked on the right */}
      <section className="relative overflow-hidden bg-[#0a1c1b]">
        <img
          src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=70"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-y-0 right-0 h-full w-1/2 object-cover opacity-30 [mask-image:linear-gradient(to_left,black_30%,transparent)]"
        />
        {/* subtle accent glow behind the text */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
        />
        <div className="relative container-page py-24 sm:py-28">
          <p className="font-mono text-xs uppercase tracking-wide text-accent"></p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Services
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
            Web, mobile, design, and everything in between — one team, end to end.
          </p>
          <p className="mt-8 text-sm text-slate-300">
            <Link to="/" className="transition-colors hover:text-accent">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-accent">Services</span>
          </p>
        </div>
      </section>

      <section className="container-page py-20">
        <Reveal>
          <SectionHeading
            
            title="Everything you need to ship, under one roof"
            description="Pick a single service or lean on the full team end to end — the same engineers stay on your project either way."
          />
        </Reveal>

        <div className="mt-12">
          {services.status === 'loading' && <Spinner />}
          {services.status === 'error' && <ErrorState onRetry={services.retry} />}
          {services.status === 'success' && services.data.length === 0 && (
            <EmptyState title="No services published yet" description="Check back soon — our services page is being updated." />
          )}
          {services.status === 'success' && services.data.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {services.data.map((service, i) => {
                const thumbnail = service.images?.[0]
                return (
                  <Reveal key={service._id} delay={(i % 2) * 100} className="h-full">
                    <Card className="group flex h-full flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60 dark:hover:border-accent-dark/60 hover:shadow-lg hover:shadow-accent/10 dark:hover:shadow-accent-dark/10">
                      <div>
                        <div className="mb-4 aspect-video w-full overflow-hidden rounded-xl bg-surface-light dark:bg-surface-dark">
                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              alt={decodeCommonEntities(service.title)}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-body/30 dark:text-body-dark/30">
                              <ImageOff size={22} />
                            </div>
                          )}
                        </div>
                        <span className="font-mono text-xs text-accent-hoverLight dark:text-accent-dark transition-transform duration-300 inline-block group-hover:scale-125 group-hover:translate-x-0.5">{String(i + 1).padStart(2, '0')}</span>
                        <h3 className="mt-3 font-display text-xl font-semibold transition-colors duration-300 group-hover:text-accent-hoverLight dark:group-hover:text-accent-dark">
                          {decodeCommonEntities(service.title)}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed">{service.shortDescription}</p>
                        <ul className="mt-4 flex flex-col gap-1.5">
                          {service.subServices.slice(0, 3).map((sub) => (
                            <li key={sub.title} className="text-xs">— {decodeCommonEntities(sub.title)}</li>
                          ))}
                        </ul>
                      </div>
                      <Button to={`/services/${service.slug}`} variant="outline" className="mt-6 self-start group-hover:border-accent dark:group-hover:border-accent-dark">
                        View details <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Button>
                    </Card>
                  </Reveal>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* TECH-STACK SANDBOX */}
      <section className="bg-surface-light dark:bg-surface-dark py-20">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              
              title="See a stack assemble itself"
              description="Pick a service and watch the kind of architecture we'd reach for compile in real time."
            />
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <TechStackSandbox />
          </Reveal>
        </div>
      </section>

      {/* SCOPE ESTIMATOR */}
      <section className="container-page py-20">
        <Reveal>
          <SectionHeading
            
            title="Sketch your project in 60 seconds"
            description="Answer three quick questions for a ballpark timeline — the more ambitious the scope, the more the border crackles."
          />
        </Reveal>
        <Reveal delay={100} y={32} className="mt-10">
          <ScopeEstimator />
        </Reveal>
      </section>
    </>
  )
}