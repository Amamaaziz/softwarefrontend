import Seo from '../components/ui/Seo.jsx'
import { COMPANY } from '../data/mockData.js'

export default function Privacy() {
  return (
    <>
      <Seo title="Privacy Policy" description="How Nexbyte collects, uses, and protects your data." />
      <article className="container-page max-w-3xl py-20">
        <p className="eyebrow mb-4">legal</p>
        <h1 className="text-4xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-sm">Last updated: July 6, 2026</p>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-semibold text-heading-light dark:text-heading-dark">1. Information we collect</h2>
            <p className="mt-2">
              We collect the information you submit through our contact, quote, job application, and newsletter forms — such as your
              name, email, phone number, and any message or resume you provide. We also collect basic analytics data about how
              visitors use this site.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-heading-light dark:text-heading-dark">2. How we use it</h2>
            <p className="mt-2">
              We use submitted information to respond to inquiries, evaluate job applications, send newsletter updates you've
              opted into, and improve the site. We do not sell your personal information to third parties.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-heading-light dark:text-heading-dark">3. Data storage & security</h2>
            <p className="mt-2">
              Data is stored on encrypted, access-controlled infrastructure. Passwords for admin accounts are hashed and never
              stored in plain text. We use HTTPS across the entire site.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-heading-light dark:text-heading-dark">4. Your rights</h2>
            <p className="mt-2">
              You can request a copy of the data we hold about you, or ask us to delete it, at any time by emailing{' '}
              <a href={`mailto:${COMPANY.email}`} className="underline underline-offset-4">{COMPANY.email}</a>.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-heading-light dark:text-heading-dark">5. Changes to this policy</h2>
            <p className="mt-2">We may update this policy from time to time. Material changes will be posted on this page with a new "last updated" date.</p>
          </section>
        </div>
      </article>
    </>
  )
}
