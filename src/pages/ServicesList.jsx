import { ArrowUpRight } from 'lucide-react'
import Seo from '../components/ui/Seo.jsx'
import Card from '../components/ui/Card.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Button from '../components/ui/Button.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getServices } from '../lib/api.js'

export default function ServicesList() {
  const services = useAsync(getServices, [])

  return (
    <>
      <Seo title="Services" description="Web, mobile, design, SEO, SaaS, QA, and DevOps services from Nexbyte." />

      <section className="container-page py-20">
        <SectionHeading
          eyebrow="services"
          title="Everything you need to ship, under one roof"
          description="Pick a single service or lean on the full team end to end — the same engineers stay on your project either way."
        />

        <div className="mt-12">
          {services.status === 'loading' && <Spinner />}
          {services.status === 'error' && <ErrorState onRetry={services.retry} />}
          {services.status === 'success' && services.data.length === 0 && (
            <EmptyState title="No services published yet" description="Check back soon — our services page is being updated." />
          )}
          {services.status === 'success' && services.data.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {services.data.map((service, i) => (
                <Card key={service._id} className="flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs text-accent-hoverLight dark:text-accent-dark">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="mt-3 font-display text-xl font-semibold">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed">{service.shortDescription}</p>
                    <ul className="mt-4 flex flex-col gap-1.5">
                      {service.subServices.slice(0, 3).map((sub) => (
                        <li key={sub.title} className="text-xs">— {sub.title}</li>
                      ))}
                    </ul>
                  </div>
                  <Button to={`/services/${service.slug}`} variant="outline" className="mt-6 self-start">
                    View details <ArrowUpRight size={14} />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
