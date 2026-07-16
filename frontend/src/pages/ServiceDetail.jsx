import { useParams } from 'react-router-dom'
import { ArrowUpRight, Check, ImageOff } from 'lucide-react'
import Seo from '../components/ui/Seo.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getServiceBySlug } from '../lib/api.js'
import { textToHtml } from '../lib/textToHtml.js'
import RichText from '../components/ui/RichText.jsx'

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = useAsync(() => getServiceBySlug(slug), [slug])

  if (service.status === 'loading') return <Spinner className="py-32" />
  if (service.status === 'error') return <div className="container-page py-20"><ErrorState onRetry={service.retry} /></div>
  if (service.status === 'success' && !service.data) {
    return (
      <div className="container-page py-20">
        <EmptyState title="Service not found" description="This service may have been renamed or unpublished." />
      </div>
    )
  }

  const s = service.data
  const [heroImage, ...galleryImages] = s.images || []

  return (
    <>
      <Seo title={s.title} description={s.shortDescription} />

      <section className="container-page py-20">
        <Reveal>
          <p className="eyebrow mb-4">// service</p>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">{s.title}</h1>
            <Button to="/contact" className="whitespace-nowrap">
              Discuss this service <ArrowUpRight size={16} />
            </Button>
          </div>
          <RichText html={textToHtml(s.description)} className="mt-6 max-w-2xl text-base leading-relaxed" />
        </Reveal>

        {heroImage ? (
          <Reveal delay={100}>
            <div className="mt-10 aspect-[21/9] w-full overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark">
              <img
                src={heroImage}
                alt={s.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        ) : null}

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {s.subServices.map((sub, i) => (
            <Reveal key={sub.title} delay={(i % 3) * 100} className="h-full">
              <Card className="h-full">
                <Check size={18} className="text-accent-hoverLight dark:text-accent-dark" />
                <h3 className="mt-3 font-display font-semibold">{sub.title}</h3>
                <RichText html={textToHtml(sub.description)} className="mt-2 text-sm leading-relaxed" />
              </Card>
            </Reveal>
          ))}
        </div>

        {galleryImages.length > 0 && (
          <Reveal delay={100}>
            <div className="mt-14">
              <h2 className="font-display text-xl font-semibold">Gallery</h2>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {galleryImages.map((img, i) => (
                  <div key={img + i} className="aspect-square overflow-hidden rounded-xl bg-surface-light dark:bg-surface-dark">
                    <img
                      src={img}
                      alt={`${s.title} ${i + 2}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal y={32}>
          <div className="mt-16 card-surface flex flex-col items-center gap-5 px-6 py-14 text-center sm:px-14">
            <h2 className="max-w-lg font-display text-2xl font-semibold sm:text-3xl">
              Curious what this looks like for your product?
            </h2>
            <Button to="/contact">Get a free quote <ArrowUpRight size={16} /></Button>
          </div>
        </Reveal>
      </section>
    </>
  )
}