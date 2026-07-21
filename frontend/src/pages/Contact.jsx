import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react'
import Seo from '../components/ui/Seo.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import { Input, Textarea, Select } from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { COMPANY } from '../data/mockData.js'
import { submitContactForm, getServices } from '../lib/api.js'

// Category dropdown values are a fixed backend enum (LeadCategory), not
// individual services — but we want the *labels* to reflect whatever the
// admin has actually named these services. No hardcoded fallback: if a
// service isn't found (renamed/removed, or the fetch failed), that option
// simply doesn't render.
const SERVICE_CATEGORY_OPTIONS = [
  { value: 'web-development', slug: 'web-development' },
  { value: 'mobile-app-development', slug: 'app-development' },
  { value: 'ui-ux-design', slug: 'ui-ux-design' },
  { value: 'custom-software', slug: 'custom-software' },
]

const contactSchema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  category: z.string().min(1, 'Select a category'),
  message: z.string().min(10, 'Tell us a little more about your project (10+ characters)'),
})

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [services, setServices] = useState([])
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(contactSchema) })

  useEffect(() => {
    let cancelled = false
    getServices()
      .then((data) => {
        if (!cancelled) setServices(data)
      })
      .catch(() => {
        // Silently fall back to hardcoded labels below — this dropdown
        // shouldn't block the whole contact form if the services call fails.
      })
    return () => {
      cancelled = true
    }
  }, [])

  const resolvedServiceOptions = SERVICE_CATEGORY_OPTIONS.map((opt) => ({
    ...opt,
    label: services.find((s) => s.slug === opt.slug)?.title,
  })).filter((opt) => opt.label)

  const onSubmit = async (values) => {
    setSubmitting(true)
    try {
      await submitContactForm(values)
      setSubmitted(true)
      reset()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Seo title="Contact Us" description="Get in touch with the DevInt team about your project." />

      {/* BANNER — "conversation" style: image masked on the LEFT (mirror of Services),
          right-aligned text block with quick email/phone links in mono */}
      <section className="relative overflow-hidden bg-[#0a1c1b]">
        <img
          src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=70"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-y-0 left-0 h-full w-1/2 object-cover opacity-30 [mask-image:linear-gradient(to_right,black_30%,transparent)]"
        />
        {/* accent glow behind the text block */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
        />
        <div className="relative container-page flex justify-start py-24 sm:justify-end sm:py-28">
          <div className="max-w-xl text-left sm:text-right">
            <p className="font-mono text-xs uppercase tracking-wide text-accent"></p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-300">
              Tell us what you&rsquo;re building — we reply within one business day.
            </p>
            <p className="mt-6 font-mono text-xs text-slate-300 sm:text-sm">
              <a href={`mailto:${COMPANY.email}`} className="transition-colors hover:text-accent">{COMPANY.email}</a>
              <span className="mx-2 text-accent">·</span>
              <a href={`tel:${COMPANY.phone.replace(/\s+/g, '')}`} className="transition-colors hover:text-accent">{COMPANY.phone}</a>
            </p>
            <p className="mt-6 text-sm text-slate-300">
              <Link to="/" className="transition-colors hover:text-accent">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-accent">Contact</span>
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <Reveal>
          <SectionHeading title="Feel free to contact us and join us" description="Fill in the form and we'll reply within one business day, usually sooner." />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            {submitted ? (
              <div className="card-surface flex flex-col items-center gap-3 px-8 py-16 text-center">
                <CheckCircle2 size={32} className="text-accent-hoverLight dark:text-accent-dark" />
                <h3 className="font-display text-xl font-semibold">Message sent</h3>
                <p className="max-w-sm text-sm">Thanks for reaching out — someone from our team will follow up by email shortly.</p>
                <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-2">
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Input id="name" label="Full name" placeholder="Jordan Malik" error={errors.name?.message} {...register('name')} />
                  <Input id="email" type="email" label="Email" placeholder="you@email.com" error={errors.email?.message} {...register('email')} />
                </div>
                <Input id="phone" label="Phone" placeholder="+92 3xx xxxxxxx" error={errors.phone?.message} {...register('phone')} />
                <Select id="category" label="Category" error={errors.category?.message} defaultValue="" {...register('category')}>
                  <option value="" disabled>Select a category…</option>
                  <optgroup label="Services">
                    {resolvedServiceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                    <option value="other-service">Other service</option>
                  </optgroup>
                  <optgroup label="Portfolio">
                    <option value="portfolio-inquiry">Ask about a portfolio project</option>
                    <option value="similar-project">I want something similar to your work</option>
                  </optgroup>
                </Select>
                <Textarea id="message" label="Details" placeholder="What are you building, and what's the timeline?" error={errors.message?.message} {...register('message')} />
                <Button type="submit" disabled={submitting} className="self-start">
                  {submitting ? 'Sending…' : 'Send message'}
                </Button>
              </form>
            )}
          </Reveal>

          <Reveal delay={150} className="lg:col-span-2">
            <div className="card-surface p-6">
              <h3 className="font-display text-lg font-semibold">Reach us directly</h3>
              <ul className="mt-5 flex flex-col gap-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail size={16} className="mt-0.5 shrink-0 text-accent-hoverLight dark:text-accent-dark" />
                  <a href={`mailto:${COMPANY.email}`} className="hover:underline">{COMPANY.email}</a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={16} className="mt-0.5 shrink-0 text-accent-hoverLight dark:text-accent-dark" />
                  <a href={`tel:${COMPANY.phone.replace(/\s+/g, '')}`} className="hover:underline">{COMPANY.phone}</a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-accent-hoverLight dark:text-accent-dark" />
                  <span>{COMPANY.address}</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
              <iframe
                title="Office location map"
                src="https://www.google.com/maps?q=Multan,Punjab,Pakistan&output=embed"
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}