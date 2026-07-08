import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronLeft, ChevronRight, Star, CheckCircle2 } from 'lucide-react'
import Seo from '../components/ui/Seo.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getServices, getFeaturedPortfolio, getTestimonials } from '../lib/api.js'
import { COMPANY } from '../data/mockData.js'

const HIGHLIGHTS = [
  'Cutting-edge technology products',
  'Strategic partnerships for enhanced capabilities',
  'Commitment to quality and reliability',
  'Proven track record of success',
]

const CEO = {
  name: 'Sara Ahmed',
  role: 'CEO',
  photo: 'https://i.pravatar.cc/300?img=47',
  message:
    'As CEO, Sara is a strategist and creative technologist who believes that real innovation begins when you stop showcasing technology and start solving human problems.',
}

export default function Home() {
  const services = useAsync(getServices, [])
  const featured = useAsync(getFeaturedPortfolio, [])
  const testimonials = useAsync(getTestimonials, [])
  const [slide, setSlide] = useState(0)

  return (
    <>
      <Seo title="Software Development Studio" description={COMPANY.tagline} />

      {/* ============ HERO — centered, video background ============ */}
      <section className="relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.png"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-950/75" />

        <div className="container-page relative flex flex-col items-center py-28 text-center sm:py-40 animate-fadeUp">
          <span className="rounded-full border border-slate-500/60 bg-slate-900/60 px-5 py-2 font-mono text-xs uppercase tracking-wide text-slate-200">
            IT Evolution
          </span>
          <h1 className="mt-8 max-w-3xl text-4xl font-semibold leading-[1.15] tracking-tight text-white sm:text-6xl">
            A trusted software development partner to grow your business
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Step into the future of innovation. Our tech solutions are designed to elevate and
            transform your digital journey.
          </p>
          <Button to="/contact" className="group mt-10 text-base">
            Get Started
            <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>
      </section>

      {/* ============ ABOUT PREVIEW — story left, image + CEO card right ============ */}
      <section className="container-page py-24">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="about us"
              title="Where innovation thrives with the best IT services"
            />
            <p className="mt-6 text-base leading-relaxed">
              At <strong className="text-heading-light dark:text-heading-dark">{COMPANY.name}</strong>, we are more than
              a technology company — we are a trusted{' '}
              <strong className="text-heading-light dark:text-heading-dark">website development</strong> and{' '}
              <strong className="text-heading-light dark:text-heading-dark">IT services provider</strong> committed to
              driving digital transformation. Our mission is to deliver intelligent, scalable, and future-ready
              solutions that empower businesses to grow, innovate, and succeed.
            </p>
            <p className="mt-4 text-base leading-relaxed">
              With a team of skilled innovators, we offer comprehensive{' '}
              <strong className="text-heading-light dark:text-heading-dark">software development</strong>,{' '}
              <strong className="text-heading-light dark:text-heading-dark">web &amp; mobile development</strong>, and{' '}
              <strong className="text-heading-light dark:text-heading-dark">smart business tools</strong> — every
              solution built on a deep understanding of your goals and challenges.
            </p>

            <ul className="mt-8 flex flex-col gap-3.5">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm sm:text-base">
                  <CheckCircle2 size={20} className="shrink-0 text-accent-hoverLight dark:text-accent-dark" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-4">
              <Button to="/contact">Get Started <ArrowUpRight size={16} /></Button>
              <Button to="/services" variant="outline">Our Services</Button>
            </div>
          </div>

          {/* Image with floating CEO message card */}
          <div className="relative pb-28">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=70"
              alt="The team at work"
              className="h-80 w-full rounded-2xl object-cover sm:h-[420px]"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-6 sm:left-[-1.5rem] sm:right-14 rounded-2xl bg-accent dark:bg-accent-dark p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <img src={CEO.photo} alt={CEO.name} className="h-16 w-16 shrink-0 rounded-full object-cover" loading="lazy" />
                <p className="text-sm leading-relaxed text-slate-900">{CEO.message}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SERVICES — centered heading, card grid ============ */}
      <section className="bg-surface-light dark:bg-surface-dark py-24">
        <div className="container-page">
          <div className="flex flex-col items-center text-center">
            <span className="rounded-full border border-slate-300 dark:border-slate-600 px-5 py-2 font-mono text-xs uppercase tracking-wide">
              Our Services
            </span>
            <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Advanced &amp; scalable software development services
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed">
              Being a trusted IT services provider means building a culture that nurtures growth,
              encourages creativity, and drives excellence in every digital solution we deliver.
            </p>
          </div>

          <div className="mt-14">
            {services.status === 'loading' && <Spinner />}
            {services.status === 'error' && <ErrorState onRetry={services.retry} />}
            {services.status === 'success' && services.data.length === 0 && <EmptyState title="No services published yet" />}
            {services.status === 'success' && services.data.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.data.slice(0, 6).map((service) => (
                  <Link key={service._id} to={`/services/${service.slug}`} className="group">
                    <Card className="flex h-full flex-col transition-all hover:-translate-y-1 hover:shadow-lg hover:border-accent dark:hover:border-accent-dark">
                      <h3 className="font-display text-xl font-semibold">{service.title}</h3>
                      <div className="mt-4 h-px w-full bg-slate-200 dark:bg-slate-600" />
                      <p className="mt-4 text-sm leading-relaxed">{service.shortDescription}</p>
                      <span className="mt-auto pt-6 flex items-center gap-1 text-sm font-semibold text-accent-hoverLight dark:text-accent-dark opacity-0 transition-opacity group-hover:opacity-100">
                        Learn more <ArrowUpRight size={14} />
                      </span>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PORTFOLIO SLIDER (unchanged) ============ */}
      <section className="py-24">
        <div className="container-page">
          <SectionHeading eyebrow="proof of work" title="Recent launches" />

          <div className="mt-10">
            {featured.status === 'loading' && <Spinner />}
            {featured.status === 'error' && <ErrorState onRetry={featured.retry} />}
            {featured.status === 'success' && featured.data.length === 0 && <EmptyState title="No case studies featured yet" />}
            {featured.status === 'success' && featured.data.length > 0 && (
              <div className="relative">
                <div className="overflow-hidden rounded-2xl">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${slide * 100}%)` }}
                  >
                    {featured.data.map((project) => (
                      <a key={project._id} href={`/portfolio/${project.slug}`} className="w-full shrink-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 bg-surface-light dark:bg-surface-dark">
                          <img src={project.coverImage} alt={project.title} className="h-64 w-full object-cover md:h-full" loading="lazy" />
                          <div className="flex flex-col justify-center p-8 sm:p-10">
                            <p className="eyebrow mb-2">{project.client}</p>
                            <h3 className="font-display text-2xl font-semibold">{project.title}</h3>
                            <p className="mt-3 text-sm leading-relaxed line-clamp-3">{project.result}</p>
                            <div className="mt-5 flex flex-wrap gap-2">
                              {project.technologies.map((t) => (
                                <span key={t} className="rounded-full bg-slate-100 dark:bg-slate-700/60 px-2.5 py-1 text-xs font-mono">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {featured.data.length > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setSlide((s) => (s === 0 ? featured.data.length - 1 : s - 1))}
                      aria-label="Previous project"
                      className="rounded-full border border-slate-300 dark:border-slate-600 p-2 hover:border-accent dark:hover:border-accent-dark"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <div className="flex gap-1.5">
                      {featured.data.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSlide(i)}
                          aria-label={`Go to slide ${i + 1}`}
                          className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-6 bg-accent dark:bg-accent-dark' : 'w-1.5 bg-slate-300 dark:bg-slate-600'}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setSlide((s) => (s === featured.data.length - 1 ? 0 : s + 1))}
                      aria-label="Next project"
                      className="rounded-full border border-slate-300 dark:border-slate-600 p-2 hover:border-accent dark:hover:border-accent-dark"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS (unchanged) ============ */}
      <section className="bg-surface-light dark:bg-surface-dark py-24">
        <div className="container-page">
          <SectionHeading eyebrow="client word" title="What clients say after launch" align="center" className="mx-auto" />

          <div className="mt-10">
            {testimonials.status === 'loading' && <Spinner />}
            {testimonials.status === 'error' && <ErrorState onRetry={testimonials.retry} />}
            {testimonials.status === 'success' && testimonials.data.length === 0 && <EmptyState title="No testimonials published yet" />}
            {testimonials.status === 'success' && testimonials.data.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {testimonials.data.slice(0, 4).map((t) => (
                  <Card key={t._id}>
                    <div className="flex gap-0.5 text-accent-hoverLight dark:text-accent-dark">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} fill={i < t.rating ? 'currentColor' : 'none'} />
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
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ JOIN OUR TEAM — career banner ============ */}
      <section className="container-page py-24">
        <div className="card-surface flex flex-col gap-8 p-10 sm:p-14 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="rounded-full border border-slate-300 dark:border-slate-600 px-4 py-1.5 font-mono text-xs uppercase tracking-wide">
              Career
            </span>
            <h2 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">Join Our Team</h2>
            <p className="mt-4 text-sm sm:text-base">
              Build your future with us — where talent meets opportunity.
            </p>
          </div>
          <Button to="/careers" variant="outline" className="self-start md:self-center whitespace-nowrap text-base">
            Apply Now <ArrowUpRight size={16} />
          </Button>
        </div>
      </section>
    </>
  )
}