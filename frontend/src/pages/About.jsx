import { Link } from 'react-router-dom'
import { Target, Eye, Heart, CheckCircle2, ArrowUpRight } from 'lucide-react'
import Seo from '../components/ui/Seo.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import TiltCard from '../components/ui/TiltCard.jsx'
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
  name: 'Hassan Ishtiaq Bukhari',
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
      <Seo title="About Us" description="The story, mission, and team behind DevInt." />

      {/* BANNER — "story" style: vertical accent rule beside the title,
          "est. {foundedYear}" mono stamp, team image fading in from the top-right */}
      <section className="relative overflow-hidden bg-[#0a1c1b]">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=70"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-30 [mask-image:linear-gradient(215deg,black_20%,transparent_70%)]"
        />
        {/* accent glow bottom-left */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
        />
        <div className="relative container-page py-24 sm:py-28">
          <div className="border-l-2 border-accent pl-6 sm:pl-8">
            <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              About Us
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
              DevInt — Developing Innovation, Delivering Excellence.
            </p>
          </div>
          <p className="mt-8 text-sm text-slate-300">
            <Link to="/" className="transition-colors hover:text-accent">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-accent">About</span>
          </p>
        </div>
      </section>

      {/* HERO — story left, image + CEO message card right */}
      <section className="container-page py-20">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="about us"
              title="Where vision meets technology"
              description={<p>At <b>DevInt</b>, we're more than just a software house — we're a catalyst for digital evolution. Our mission is to craft powerful, intelligent solutions that fuel growth, drive innovation, and help businesses thrive.</p>}
            />
            <p className="mt-5 max-w-2xl text-base leading-relaxed">
              We transform ideas into innovative digital solutions that help businesses grow and succeed.
              As a full-service software house, we specialize in Web Development, Mobile App Development, E Commerce solutions,
               Etsy store services, UI/UX design, and Custom Software tailored to your unique goals.
              We combine creativity, technical expertise, and a client-first approach to deliver high-quality, 
              scalable, and user-friendly solutions. Whether you're launching a startup, expanding your online presence,
               or modernizing your business, <b>DevInt</b> is committed to building technology that drives real results.
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
          </Reveal>

          {/* Image with floating CEO message card */}
          <Reveal delay={150} className="relative pb-24">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=70"
              alt="The DevInt team at work"
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
          </Reveal>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-surface-light dark:bg-surface-dark py-20">
        <div className="container-page grid grid-cols-1 gap-6 sm:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 100} className="h-full">
              <Card className="h-full">
                <v.icon size={22} className="text-accent-hoverLight dark:text-accent-dark" />
                <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{v.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TEAM — intro left, featured CEO card right, members below */}
      <section className="container-page py-20">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="expert team"
              title="Get to know our team"
              description="Our success is your success — together we help build software that makes work and life better."
            />
            <Button to="/careers" variant="outline" className="mt-8">
              Join the team <ArrowUpRight size={16} />
            </Button>
          </Reveal>

          {/* Featured CEO card */}
          <Reveal delay={150} className="mx-auto w-full max-w-sm">
            <TiltCard className="rounded-2xl">
              <img src={CEO.photo} alt={CEO.name} className="h-96 w-full rounded-2xl object-cover" loading="lazy" />
              <div className="absolute bottom-6 left-0 rounded-r-2xl bg-accent dark:bg-accent-dark px-6 py-4 shadow-lg">
                <p className="font-display text-xl font-semibold text-slate-900">{CEO.name}</p>
                <p className="text-sm text-slate-900">{CEO.role}</p>
              </div>
            </TiltCard>
          </Reveal>
        </div>

        {/* Rest of the team */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TEAM.map((member, i) => (
            <Reveal key={member.name} delay={i * 100}>
              <TiltCard max={8} className="rounded-2xl">
              <div className="group card-surface overflow-hidden p-0">
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
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}