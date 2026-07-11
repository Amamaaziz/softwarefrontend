import { Star } from 'lucide-react'
import Seo from '../components/ui/Seo.jsx'
import Card from '../components/ui/Card.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getTestimonials } from '../lib/api.js'

export default function Testimonials() {
  const testimonials = useAsync(getTestimonials, [])

  return (
    <>
      <Seo title="Testimonials" description="What clients say about working with Nexbyte." />

      <section className="container-page py-20">
        <Reveal>
          <SectionHeading eyebrow="reviews" title="Client testimonials" align="center" className="mx-auto" />
        </Reveal>

        <div className="mt-12">
          {testimonials.status === 'loading' && <Spinner />}
          {testimonials.status === 'error' && <ErrorState onRetry={testimonials.retry} />}
          {testimonials.status === 'success' && testimonials.data.length === 0 && (
            <EmptyState title="No testimonials published yet" />
          )}
          {testimonials.status === 'success' && testimonials.data.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.data.map((t, i) => (
                <Reveal key={t._id} delay={(i % 3) * 100} className="h-full">
                  <Card className="h-full">
                    <div className="flex gap-0.5 text-accent-hoverLight dark:text-accent-dark">
                      {Array.from({ length: 5 }).map((_, star) => (
                        <Star key={star} size={14} fill={star < t.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed">&ldquo;{t.message}&rdquo;</p>
                    <div className="mt-5 flex items-center gap-3">
                      <img src={t.photo} alt={t.clientName} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                      <div>
                        <p className="text-sm font-semibold text-heading-light dark:text-heading-dark">{t.clientName}</p>
                        <p className="text-xs">{t.company}</p>
                      </div>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}