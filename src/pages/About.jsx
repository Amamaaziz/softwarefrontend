import { Target, Eye, Heart, CheckCircle2, ArrowUpRight } from 'lucide-react'
import Seo from '../components/ui/Seo.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import { COMPANY } from '../data/mockData.js'

const VALUES = [
  { icon: Target, title: 'Ship what matters', body: 'We scope ruthlessly around the features that move the metric you actually care about.' },
  { icon: Eye, title: 'No black boxes', body: 'Clear documentation and clean code, so your next hire isn\u2019t stuck reverse-engineering our decisions.' },
  { icon: Heart, title: 'Own the outcome', body: 'We treat every client project like it has to survive contact with real users, because it does.' },
]

const HIGHLIGHTS = [
  'Cutting-edge technology products',
  'Strategic partnerships for enhanced capabilities',
  'Commitment to quality and reliability',
  'Proven track record of success',
]

const CEO = {
  name: 'Sara Ahmed',
  role: 'CEO & Founder',
  photo: 'https://i.pravatar.cc/300?img=47',
  message:
    'Real innovation begins when you stop showcasing technology and start solving human problems. That\u2019s the standard we hold every project to.',
}

const TEAM = [
  { name: 'Bilal Raza', role: 'Head of Design', photo: 'https://i.pravatar.cc/200?img=13' },
  { name: 'Hamza Iqbal', role: 'Mobile Lead', photo: 'https://i.pravatar.cc/200?img=14' },
  { name: 'Ayesha Malik', role: 'QA Lead', photo: 'https://i.pravatar.cc/200?img=48' },
]

export default function About() {
  return (
    <>
      <Seo title="About Us" description="The story, mission, and team behind Nexbyte." />

      {/* HERO — story left, image + CEO message card right */}
      <section className="container-page py-20">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-2">
          <div className="animate-fadeUp">
            <SectionHeading
              eyebrow="about us"
              title="Where vision meets technology"
              description={`At ${COMPANY.name}, we're more than just a software house — we're a catalyst for digital evolution. Our mission is to craft powerful, intelligent solutions that fuel growth, drive innovation, and help businesses thrive.`}
            />
            <p className="mt-5 max-w-2xl text-base leading-relaxed">
              {COMPANY.name} began as three engineers taking on freelance projects between day jobs in {COMPANY.foundedYear}.
              Years later we&rsquo;re a full studio, but the rule hasn&rsquo;t changed: the people who scope your project are
              the people who build it.
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
              <Button to="/contact" className="group">
                Contact Us <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
              <Button to="/services" variant="outline">Our Services</Button>
            </div>
          </div>

          {/* Image with floating CEO message card */}
          <div className="relative animate-fadeUp pb-24" style={{ animationDelay: '0.15s' }}>
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=70"
              alt="The Nexbyte team at work"
              className="h-80 w-full rounded-2xl object-cover sm:h-[420px]"
              loading="lazy"
            />
            <div className="absolute -bottom-0 left-0 right-6 sm:left-[-2rem] sm:right-16 rounded-2xl bg-accent dark:bg-accent-dark p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <img src={CEO.photo} alt={CEO.name} className="h-16 w-16 shrink-0 rounded-full object-cover" loading="lazy" />
                <div>
                  <p className="text-sm leading-relaxed text-slate-900">
                    &ldquo;{CEO.message}&rdquo;
                  </p>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{CEO.name} — {CEO.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES (unchanged) */}
      <section className="bg-surface-light dark:bg-surface-dark py-20">
        <div className="container-page grid grid-cols-1 gap-6 sm:grid-cols-3">
          {VALUES.map((v) => (
            <Card key={v.title}>
              <v.icon size={22} className="text-accent-hoverLight dark:text-accent-dark" />
              <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed">{v.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* TEAM — intro left, featured CEO card right, members below */}
      <section className="container-page py-20">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="expert team"
              title="Get to know our team"
              description="Our success is your success — together we help build software that makes work and life better."
            />
            <Button to="/careers" variant="outline" className="mt-8">
              Join the team <ArrowUpRight size={16} />
            </Button>
          </div>

          {/* Featured CEO card */}
          <div className="relative mx-auto w-full max-w-sm">
            <img src={CEO.photo} alt={CEO.name} className="h-96 w-full rounded-2xl object-cover" loading="lazy" />
            <div className="absolute bottom-6 left-0 rounded-r-2xl bg-accent dark:bg-accent-dark px-6 py-4 shadow-lg">
              <p className="font-display text-xl font-semibold text-slate-900">{CEO.name}</p>
              <p className="text-sm text-slate-900">{CEO.role}</p>
            </div>
          </div>
        </div>

        {/* Rest of the team */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TEAM.map((member) => (
            <div key={member.name} className="group card-surface overflow-hidden p-0">
              <div className="overflow-hidden">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <p className="font-display text-lg font-semibold">{member.name}</p>
                <p className="text-sm">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}