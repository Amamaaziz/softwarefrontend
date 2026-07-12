import Seo from '../components/ui/Seo.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { COMPANY } from '../data/mockData.js'

export default function Terms() {
  return (
    <>
      <Seo title="Terms & Conditions" description="Terms governing use of the Nexbyte website and services." />
      <article className="container-page max-w-3xl py-20">
        <Reveal>
          <p className="eyebrow mb-4">legal</p>
          <h1 className="text-4xl font-semibold tracking-tight">Terms & Conditions</h1>
          <p className="mt-3 text-sm">Last updated: July 6, 2026</p>
        </Reveal>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed">
          <Reveal as="section" y={16}>
            <h2 className="font-display text-lg font-semibold text-heading-light dark:text-heading-dark">1. Acceptance of terms</h2>
            <p className="mt-2">
              By using this website or engaging {COMPANY.name} for services, you agree to these terms. If you do not agree,
              please do not use the site or submit information through it.
            </p>
          </Reveal>
          <Reveal as="section" y={16}>
            <h2 className="font-display text-lg font-semibold text-heading-light dark:text-heading-dark">2. Use of content</h2>
            <p className="mt-2">
              All text, images, and case study content on this site belong to {COMPANY.name} or are used with permission.
              You may not reproduce or redistribute this content without written consent.
            </p>
          </Reveal>
          <Reveal as="section" y={16}>
            <h2 className="font-display text-lg font-semibold text-heading-light dark:text-heading-dark">3. Project engagements</h2>
            <p className="mt-2">
              Any statement of work, quote, or proposal shared after a contact form submission is not binding until both parties
              sign a separate services agreement outlining scope, timeline, and payment terms.
            </p>
          </Reveal>
          <Reveal as="section" y={16}>
            <h2 className="font-display text-lg font-semibold text-heading-light dark:text-heading-dark">4. Job applications</h2>
            <p className="mt-2">
              Submitting a job application does not guarantee an interview or offer. Applicant data is retained only for
              recruitment purposes and handled per our Privacy Policy.
            </p>
          </Reveal>
          <Reveal as="section" y={16}>
            <h2 className="font-display text-lg font-semibold text-heading-light dark:text-heading-dark">5. Limitation of liability</h2>
            <p className="mt-2">
              This website is provided "as is." {COMPANY.name} is not liable for any indirect or incidental damages arising
              from its use.
            </p>
          </Reveal>
        </div>
      </article>
    </>
  )
}