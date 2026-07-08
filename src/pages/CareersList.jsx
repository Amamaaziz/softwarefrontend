import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin, ArrowUpRight, UploadCloud, CheckCircle2, ArrowLeft } from 'lucide-react'
import Seo from '../components/ui/Seo.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import { Input, Textarea, Select } from '../components/ui/Input.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getJobs, submitJobApplication } from '../lib/api.js'
import { COMPANY } from '../data/mockData.js'

const applySchema = z.object({
  firstName: z.string().min(2, 'Enter your first name'),
  secondName: z.string().min(2, 'Enter your second name'),
  gender: z.string().min(1, 'Select your gender'),
  dob: z.string().min(1, 'Enter your date of birth'),
  address: z.string().min(5, 'Enter your address'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  education: z.string().min(2, 'Enter your education'),
  applyFor: z.string().min(2, 'Enter the role you are applying for'),
  experience: z.string().min(1, 'Enter your experience'),
  remoteJob: z.string().min(1, 'Select an option'),
  about: z.string().min(10, 'Tell us a little about yourself (10+ characters)'),
  resume: z.any().refine((files) => files?.length === 1, 'Attach your resume (PDF or DOCX)'),
})

export default function CareersList() {
  const jobs = useAsync(getJobs, [])
  const openJobs = jobs.status === 'success' ? jobs.data.filter((j) => j.status === 'open') : []

  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const rightPanelRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(applySchema) })

  const openForm = () => {
    setSubmitted(false)
    setShowForm(true)
    // Smoothly bring the form into view (nice on mobile where it's below the cards)
    setTimeout(() => rightPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const onSubmit = async (values) => {
    setSubmitting(true)
    try {
      await submitJobApplication({
        applicantName: `${values.firstName} ${values.secondName}`,
        gender: values.gender,
        dob: values.dob,
        address: values.address,
        email: values.email,
        phone: values.phone,
        education: values.education,
        applyFor: values.applyFor,
        experience: values.experience,
        remoteJob: values.remoteJob,
        about: values.about,
        resumeName: values.resume?.[0]?.name,
      })
      setSubmitted(true)
      reset()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Seo title="Careers" description="Open roles at Nexbyte." />

      {/* HERO — cards left, message / apply form right */}
      <section className="container-page py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* LEFT: contact card + apply card */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="card-surface animate-fadeUp p-8 text-center">
              <h2 className="font-display text-2xl font-semibold">Careers at {COMPANY.name}</h2>
              <p className="mt-4 text-sm leading-relaxed">
                Looking to build a meaningful tech career? We&rsquo;re always on the lookout for
                passionate, curious minds to join our growing team.
              </p>
              <Button to="/contact" className="mt-6">
                Contact Us <ArrowUpRight size={16} />
              </Button>
            </div>

            <div className="card-surface animate-fadeUp p-8 text-center" style={{ animationDelay: '0.15s' }}>
              <h2 className="font-display text-2xl font-semibold">Join Us Today!</h2>
              <Button variant="outline" onClick={openForm} className="mt-6">
                Apply Now
              </Button>
            </div>
          </div>

          {/* RIGHT: message by default, application form after Apply Now */}
          <div ref={rightPanelRef} className="lg:col-span-3 scroll-mt-24">
            {!showForm ? (
              <div key="message" className="animate-fadeUp">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=70"
                  alt="Team working together"
                  className="h-64 w-full rounded-2xl object-cover sm:h-80"
                  loading="lazy"
                />
                <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Shape the Future With Us
                </h1>
                <p className="mt-4 text-base leading-relaxed">
                  We don&rsquo;t just build software — we build careers. At {COMPANY.name}, you&rsquo;ll work on
                  impactful projects, collaborate with top talent, and grow your skills in a culture of
                  innovation and support. Whether you&rsquo;re a developer, designer, marketer, or strategist,
                  there&rsquo;s a place here for you.
                </p>
              </div>
            ) : (
              <div key="form" className="card-surface animate-fadeUp p-6 sm:p-8">
                {submitted ? (
                  <div className="flex flex-col items-center gap-3 py-12 text-center">
                    <CheckCircle2 size={36} className="text-accent-hoverLight dark:text-accent-dark" />
                    <h3 className="font-display text-xl font-semibold">Application received</h3>
                    <p className="max-w-sm text-sm">We&rsquo;ll review it and reach out within a week if it&rsquo;s a fit.</p>
                    <Button variant="outline" onClick={() => setShowForm(false)} className="mt-3">
                      Back
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-semibold">Application Form</h3>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex items-center gap-1 text-sm font-medium hover:text-accent-hoverLight dark:hover:text-accent-dark"
                      >
                        <ArrowLeft size={14} /> Back
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Input id="firstName" label="First name" placeholder="Jordan" error={errors.firstName?.message} {...register('firstName')} />
                      <Input id="secondName" label="Second name" placeholder="Malik" error={errors.secondName?.message} {...register('secondName')} />
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-heading-light dark:text-heading-dark">Gender</span>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="radio" value="male" className="accent-accent" {...register('gender')} /> Male
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="radio" value="female" className="accent-accent" {...register('gender')} /> Female
                        </label>
                      </div>
                      {errors.gender && <p className="text-xs text-rose-500">{errors.gender.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Input id="dob" type="date" label="Date of birth" error={errors.dob?.message} {...register('dob')} />
                      <Input id="phone" label="Phone number" placeholder="+92 3xx xxxxxxx" error={errors.phone?.message} {...register('phone')} />
                    </div>

                    <Input id="address" label="Address" placeholder="Street, city" error={errors.address?.message} {...register('address')} />
                    <Input id="email" type="email" label="Email" placeholder="you@email.com" error={errors.email?.message} {...register('email')} />
                    <Input id="education" label="Education" placeholder="e.g. BS Computer Science" error={errors.education?.message} {...register('education')} />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Input id="applyFor" label="Apply for" placeholder="e.g. Frontend Developer" error={errors.applyFor?.message} {...register('applyFor')} />
                      <Input id="experience" label="Experience" placeholder="e.g. 2 years" error={errors.experience?.message} {...register('experience')} />
                    </div>

                    <Select id="remoteJob" label="Apply for remote job?" error={errors.remoteJob?.message} defaultValue="" {...register('remoteJob')}>
                      <option value="" disabled>Select an option…</option>
                      <option value="yes">Yes — remote</option>
                      <option value="no">No — on-site</option>
                      <option value="hybrid">Hybrid</option>
                    </Select>

                    <Textarea id="about" label="Tell about yourself" placeholder="A few lines about you and your work…" error={errors.about?.message} {...register('about')} />

                    {/* Resume upload */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="resume" className="text-sm font-medium text-heading-light dark:text-heading-dark">Resume</label>
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
                      {submitting ? 'Submitting…' : 'Submit'}
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* OPEN ROLES (unchanged) */}
      <section className="container-page pb-20">
        <SectionHeading
          eyebrow="open roles"
          title="Current openings"
          description="Apply to a specific role below, or use the general application form above."
        />

        <div className="mt-12">
          {jobs.status === 'loading' && <Spinner />}
          {jobs.status === 'error' && <ErrorState onRetry={jobs.retry} />}
          {jobs.status === 'success' && openJobs.length === 0 && (
            <EmptyState title="No open roles right now" description="Check back soon, or send your resume to hello@nexbyte.dev and we'll reach out when something opens." />
          )}
          {jobs.status === 'success' && openJobs.length > 0 && (
            <div className="flex flex-col divide-y divide-slate-200/70 dark:divide-slate-700/60 border-t border-b border-slate-200/70 dark:border-slate-700/60">
              {openJobs.map((job) => (
                <Link
                  key={job._id}
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
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}