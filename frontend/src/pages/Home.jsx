import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform } from 'framer-motion'
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  Code2,
  Smartphone,
  Palette,
  TrendingUp,
  Layers,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
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

// Icons + accent colors cycled per card, in order
const SERVICE_VISUALS = [
  { icon: Code2, ring: 'ring-blue-400/30', bg: 'bg-blue-500/10', text: 'text-blue-500 dark:text-blue-400', glow: 'rgba(59,130,246,0.35)' },
  { icon: Smartphone, ring: 'ring-violet-400/30', bg: 'bg-violet-500/10', text: 'text-violet-500 dark:text-violet-400', glow: 'rgba(139,92,246,0.35)' },
  { icon: Palette, ring: 'ring-pink-400/30', bg: 'bg-pink-500/10', text: 'text-pink-500 dark:text-pink-400', glow: 'rgba(236,72,153,0.35)' },
  { icon: TrendingUp, ring: 'ring-amber-400/30', bg: 'bg-amber-500/10', text: 'text-amber-500 dark:text-amber-400', glow: 'rgba(245,158,11,0.35)' },
  { icon: Layers, ring: 'ring-emerald-400/30', bg: 'bg-emerald-500/10', text: 'text-emerald-500 dark:text-emerald-400', glow: 'rgba(16,185,129,0.35)' },
  { icon: ShieldCheck, ring: 'ring-cyan-400/30', bg: 'bg-cyan-500/10', text: 'text-cyan-500 dark:text-cyan-400', glow: 'rgba(6,182,212,0.35)' },
]

/**
 * Premium service card:
 * - 3D tilt that follows the mouse (perspective + rotateX/rotateY)
 * - A soft spotlight glow that follows the cursor inside the card
 * - Glassmorphism surface
 */
function ServiceCard({ service, index, visual }) {
  const ref = useRef(null)
  const Icon = visual.icon

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smoothed rotation values for a natural tilt feel
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })

  const spotlightBackground = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, ${visual.glow}, transparent 75%)`

  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    mouseX.set(x)
    mouseY.set(y)

    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateAmount = 8 // max degrees of tilt

    rotateY.set(((x - centerX) / centerX) * rotateAmount)
    rotateX.set((-(y - centerY) / centerY) * rotateAmount)
  }

  function handleMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.96 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: 'easeOut' } },
      }}
      className="group relative"
      style={{ perspective: 1000 }}
    >
      {/* gradient glow ring behind the card, appears on hover */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-accent to-blue-400 opacity-0 blur transition-opacity duration-300 group-hover:opacity-40" />

      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full"
      >
        <Link to={`/services/${service.slug}`} className="relative block h-full">
          <Card className="relative flex h-full flex-col overflow-hidden border-transparent bg-white/70 backdrop-blur-md transition-shadow duration-300 group-hover:shadow-2xl dark:bg-slate-900/70">
            {/* cursor-following spotlight */}
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: spotlightBackground }}
            />

           

            <div
              style={{ transform: 'translateZ(40px)' }}
              className={`relative flex h-12 w-12 items-center justify-center rounded-xl ${visual.bg} ${visual.text} ring-1 ${visual.ring} transition-transform duration-300 group-hover:scale-110`}
            >
              <Icon size={22} strokeWidth={2} />
            </div>

            <h3 style={{ transform: 'translateZ(30px)' }} className="relative mt-5 font-display text-xl font-semibold">
              {service.title}
            </h3>
            <div className="relative mt-4 h-px w-full bg-gradient-to-r from-slate-200 via-slate-200 to-transparent dark:from-slate-600 dark:via-slate-600" />
            <p style={{ transform: 'translateZ(20px)' }} className="relative mt-4 text-sm leading-relaxed">
              {service.shortDescription}
            </p>

            <span
              style={{ transform: 'translateZ(30px)' }}
              className="relative mt-auto flex items-center gap-1 pt-6 text-sm font-semibold text-accent-hoverLight dark:text-accent-dark"
            >
              <span className="opacity-0 transition-all duration-300 group-hover:opacity-100">Learn more</span>
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </span>
          </Card>
        </Link>
      </motion.div>
    </motion.div>
  )
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

      {/* ============ SERVICES — premium 3D tilt + spotlight card grid ============ */}
      <section className="relative overflow-hidden bg-surface-light dark:bg-surface-dark py-24">
        {/* animated moving gradient blobs in the background */}
        <motion.div
          className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-accent/25 dark:bg-accent-dark/25 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-400/15 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="container-page relative">
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-5 py-2 font-mono text-xs uppercase tracking-wide">
              <motion.span
                animate={{ opacity: [1, 0.3, 1], rotate: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex"
              >
                <Sparkles size={13} className="text-accent-hoverLight dark:text-accent-dark" />
              </motion.span>
              Our Services
            </span>
            <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Advanced &amp; scalable software development services
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed">
              Being a trusted IT services provider means building a culture that nurtures growth,
              encourages creativity, and drives excellence in every digital solution we deliver.
            </p>
          </motion.div>

          <div className="mt-14">
            {services.status === 'loading' && <Spinner />}
            {services.status === 'error' && <ErrorState onRetry={services.retry} />}
            {services.status === 'success' && services.data.length === 0 && <EmptyState title="No services published yet" />}
            {services.status === 'success' && services.data.length > 0 && (
              <motion.div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.12 } },
                }}
              >
                {services.data.slice(0, 6).map((service, i) => (
                  <ServiceCard
                    key={service._id}
                    service={service}
                    index={i}
                    visual={SERVICE_VISUALS[i % SERVICE_VISUALS.length]}
                  />
                ))}
              </motion.div>
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
