import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin, UploadCloud, CheckCircle2 } from 'lucide-react'
import Seo from '../components/ui/Seo.jsx'
import Badge from '../components/ui/Badge.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { Input } from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getJobBySlug, submitJobApplication } from '../lib/api.js'

const applicationSchema = z.object({
  applicantName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  resume: z
    .any()
    .refine((files) => files?.length === 1, 'Attach your resume (PDF or DOCX)'),
})

export default function JobDetail() {
  const { slug } = useParams()
  const job = useAsync(() => getJobBySlug(slug), [slug])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(applicationSchema) })

  const onSubmit = async (values) => {
    setSubmitting(true)
    try {
      await submitJobApplication({
        job: slug,
        applicantName: values.applicantName,
        email: values.email,
        phone: values.phone,
        resumeName: values.resume?.[0]?.name,
      })
      setSubmitted(true)
      reset()
    } finally {
      setSubmitting(false)
    }
  }

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
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{j.title}</h1>
              <Badge tone={j.status === 'open' ? 'open' : 'closed'}>{j.status}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <span>{j.department}</span>
              <span className="flex items-center gap-1"><MapPin size={13} /> {j.location}</span>
              <span className="font-mono text-xs uppercase">{j.type.replace('-', ' ')} · {j.experienceLevel}</span>
            </div>

            <p className="mt-8 text-base leading-relaxed">{j.description}</p>

            <div className="mt-10">
              <h3 className="font-display text-lg font-semibold">What you'll do</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {j.responsibilities.map((r) => (
                  <li key={r} className="flex gap-2 text-sm leading-relaxed">
                    <span className="text-accent-hoverLight dark:text-accent-dark">—</span> {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="font-display text-lg font-semibold">What we're looking for</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {j.requirements.map((r) => (
                  <li key={r} className="flex gap-2 text-sm leading-relaxed">
                    <span className="text-accent-hoverLight dark:text-accent-dark">—</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="card-surface sticky top-24 p-6">
              {j.status !== 'open' ? (
                <EmptyState title="This role is closed" description="It's no longer accepting applications. See our other open roles." />
              ) : submitted ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <CheckCircle2 size={32} className="text-accent-hoverLight dark:text-accent-dark" />
                  <h3 className="font-display text-lg font-semibold">Application received</h3>
                  <p className="text-sm">We'll review it and reach out within a week if it's a fit.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                  <h3 className="font-display text-lg font-semibold">Apply for this role</h3>
                  <Input
                    id="applicantName"
                    label="Full name"
                    placeholder="Jordan Malik"
                    error={errors.applicantName?.message}
                    {...register('applicantName')}
                  />
                  <Input
                    id="email"
                    type="email"
                    label="Email"
                    placeholder="you@email.com"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                  <Input
                    id="phone"
                    label="Phone"
                    placeholder="+92 3xx xxxxxxx"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="resume" className="text-sm font-medium">Resume</label>
                    <label
                      htmlFor="resume"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 px-4 py-6 text-sm hover:border-accent dark:hover:border-accent-dark"
                    >
                      <UploadCloud size={16} /> PDF or DOCX, up to 5MB
                    </label>
                    <input id="resume" type="file" accept=".pdf,.doc,.docx" className="hidden" {...register('resume')} />
                    {errors.resume && <p className="text-xs text-rose-500">{errors.resume.message}</p>}
                  </div>
                  <Button type="submit" disabled={submitting} className="mt-2 justify-center">
                    {submitting ? 'Submitting…' : 'Submit application'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
