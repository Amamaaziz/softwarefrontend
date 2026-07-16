import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowUpRight,
  UploadCloud,
  CheckCircle2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Seo from '../components/ui/Seo.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
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
  jobId: z.string().min(1, 'Select the role you are applying for'),
  experience: z.string().min(1, 'Enter your experience'),
  remoteJob: z.string().min(1, 'Select an option'),
  about: z.string().min(10, 'Tell us a little about yourself (10+ characters)'),
  resume: z.any().refine((files) => files?.length === 1, 'Attach your resume (PDF or DOCX)'),
})

function AnnouncementBar({ jobs }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (jobs.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % jobs.length), 6000)
    return () => clearInterval(id)
  }, [jobs.length])

  if (jobs.length === 0) return null

  const job = jobs[index % jobs.length]
  const prev = () => setIndex((i) => (i - 1 + jobs.length) % jobs.length)
  const next = () => setIndex((i) => (i + 1) % jobs.length)

  return (
    <div className="bg-slate-950 text-white">
      <div className="relative flex items-center justify-center px-14 py-5 text-center sm:px-20">
        {jobs.length > 1 && (
          <button
            onClick={prev}
            aria-label="Previous vacancy"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-300 transition-colors hover:text-white sm:left-6"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        <div>
          <p className="font-display text-base font-bold sm:text-xl">
            Vacancy Opened For {job.title}. Apply Now
          </p>
          <Link
            to={`/careers/${job.slug}`}
            className="mt-3 inline-flex items-center rounded-full border border-white/70 px-6 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-slate-900"
          >
            Click Here
          </Link>
        </div>

        {jobs.length > 1 && (
          <button
            onClick={next}
            aria-label="Next vacancy"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-300 transition-colors hover:text-white sm:right-6"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>
    </div>
  )
}

function CareersBanner() {
  return (
    <section className="relative overflow-hidden bg-[#0a1c1b]">
      <img
        src="https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&w=1400&q=70"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-y-0 right-0 h-full w-full object-cover opacity-40 sm:w-2/3 sm:[mask-image:linear-gradient(to_left,black_40%,transparent)]"
      />
      <div className="relative container-page flex flex-col items-center justify-center py-24 text-center sm:py-32">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Careers
        </h1>
        <p className="mt-4 text-sm text-slate-300">
          <Link to="/" className="transition-colors hover:text-accent">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-accent">Careers</span>
        </p>
      </div>
    </section>
  )
}

export default function CareersList() {
  const jobs = useAsync(getJobs, [])
  const openJobs = jobs.status === 'success' ? jobs.data.filter((j) => j.status === 'open') : []
  const [searchParams] = useSearchParams()

  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const rightPanelRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ resolver: zodResolver(applySchema) })

  const openForm = () => {
    setSubmitted(false)
    setShowForm(true)
    setTimeout(() => rightPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  // Auto-open the form and pre-select the role when arriving via
  // JobDetail.jsx's "Apply now" button (/careers?jobId=...).
  useEffect(() => {
    if (jobs.status !== 'success') return
    const jobId = searchParams.get('jobId')
    if (!jobId) return
    const match = openJobs.find((j) => j._id === jobId)
    if (!match) return

    setValue('jobId', jobId)
    openForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs.status])

  const onSubmit = async (values) => {
    setSubmitting(true)
    try {
      const selectedJob = openJobs.find((j) => j._id === values.jobId)
      await submitJobApplication({
        jobId: values.jobId,
        applyFor: selectedJob?.title || '',
        applicantName: `${values.firstName} ${values.secondName}`,
        gender: values.gender,
        dob: values.dob,
        address: values.address,
        email: values.email,
        phone: values.phone,
        education: values.education,
        experience: values.experience,
        remoteJob: values.remoteJob,
        about: values.about,
        resumeName: values.resume?.[0]?.name,
      })
      setSubmitted(true)
      reset()
      setResumeFile(null)
    } catch (err) {
      console.error('Application submit failed:', err.response?.data || err.message)
      alert(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Seo title="Careers" description="Open roles at Nexbyte." />

      <AnnouncementBar jobs={openJobs} />
      <CareersBanner />

      <section className="container-page py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
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
              <Button
                variant="outline"
                onClick={openForm}
                className="mt-6"
                disabled={jobs.status === 'success' && openJobs.length === 0}
              >
                Apply Now
              </Button>
              {jobs.status === 'success' && openJobs.length === 0 && (
                <p className="mt-3 text-xs text-body/60 dark:text-body-dark/60">
                  No open positions right now — check back soon.
                </p>
              )}
            </div>
          </div>

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
                      <Select id="jobId" label="Apply for" error={errors.jobId?.message} defaultValue="" {...register('jobId')}>
                        <option value="" disabled>Select a role…</option>
                        {openJobs.map((j) => (
                          <option key={j._id} value={j._id}>{j.title}</option>
                        ))}
                      </Select>
                      <Input id="experience" label="Experience" placeholder="e.g. 2 years" error={errors.experience?.message} {...register('experience')} />
                    </div>

                    <Select id="remoteJob" label="Apply for remote job?" error={errors.remoteJob?.message} defaultValue="" {...register('remoteJob')}>
                      <option value="" disabled>Select an option…</option>
                      <option value="yes">Yes — remote</option>
                      <option value="no">No — on-site</option>
                      <option value="hybrid">Hybrid</option>
                    </Select>

                    <Textarea id="about" label="Tell about yourself" placeholder="A few lines about you and your work…" error={errors.about?.message} {...register('about')} />

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="resume" className="text-sm font-medium text-heading-light dark:text-heading-dark">Resume</label>
                      <label
                        htmlFor="resume"
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 px-4 py-6 text-sm hover:border-accent dark:hover:border-accent-dark"
                      >
                        <UploadCloud size={16} />
                        {resumeFile ? resumeFile.name : 'PDF or DOCX, up to 5MB'}
                      </label>
                      <input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        {...register('resume', {
                          onChange: (e) => setResumeFile(e.target.files?.[0] || null),
                        })}
                      />
                      {resumeFile && (
                        <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={13} /> {resumeFile.name} uploaded
                        </p>
                      )}
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

      <section className="container-page pb-20">
        <div className="card-surface flex flex-col items-center gap-5 px-6 py-14 text-center sm:px-14">
          <SectionHeading
            eyebrow="opportunities"
            title="Find the role that fits you"
            align="center"
            description={
              jobs.status === 'success' && openJobs.length > 0
                ? `We currently have ${openJobs.length} open ${openJobs.length === 1 ? 'position' : 'positions'} across the team. See every opening in one place and apply directly.`
                : 'Browse every current opening in one place and apply directly to the role that fits you best.'
            }
          />
          <Button to="/careers/opportunities" className="group">
            Explore Opportunities
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>
      </section>
    </>
  )
}