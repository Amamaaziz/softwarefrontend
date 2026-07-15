import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import Button from './ui/Button.jsx'

// Mock "Project Scope Estimator" — a multi-step wizard that builds a rough
// scope and drives a live Complexity Gauge.

const INDUSTRIES = ['Fintech', 'Healthcare', 'E-commerce', 'Education', 'Logistics', 'Other']

const PLATFORMS = [
  { key: 'web', label: 'Web App', base: 2, weeks: 6 },
  { key: 'mobile', label: 'Mobile App', base: 3, weeks: 8 },
  { key: 'saas', label: 'SaaS Product', base: 4, weeks: 10 },
  { key: 'web-mobile', label: 'Web + Mobile', base: 5, weeks: 12 },
]

const FEATURES = [
  { key: 'auth', label: 'JWT Auth & Roles', weight: 1 },
  { key: 'admin', label: 'Admin Dashboard', weight: 1 },
  { key: 'integrations', label: 'Third-party API Integrations', weight: 1 },
  { key: 'design-system', label: 'Custom Design System', weight: 2 },
  { key: 'payments', label: 'Payments & Billing', weight: 2 },
  { key: 'realtime', label: 'Realtime / WebSockets', weight: 3 },
  { key: 'multi-tenant', label: 'Multi-tenant Isolation', weight: 3 },
  { key: 'ai', label: 'AI-powered Features', weight: 3 },
]

const MAX_SCORE =
  Math.max(...PLATFORMS.map((p) => p.base)) + FEATURES.reduce((sum, f) => sum + f.weight, 0)

const STEPS = ['Industry', 'Platform', 'Features', 'Estimate']

export default function ScopeEstimator() {
  const [step, setStep] = useState(0)
  const [industry, setIndustry] = useState(null)
  const [platform, setPlatform] = useState(null)
  const [features, setFeatures] = useState([])

  const toggleFeature = (key) =>
    setFeatures((f) => (f.includes(key) ? f.filter((k) => k !== key) : [...f, key]))

  const { score, ratio, level } = useMemo(() => {
    const p = PLATFORMS.find((x) => x.key === platform)
    const s =
      (p?.base ?? 0) +
      FEATURES.filter((f) => features.includes(f.key)).reduce((sum, f) => sum + f.weight, 0)
    const r = Math.min(1, s / MAX_SCORE)
    const l = r < 0.25 ? 'Lean' : r < 0.5 ? 'Moderate' : r < 0.75 ? 'Ambitious' : 'Intense'
    return { score: s, ratio: r, level: l }
  }, [platform, features])

  const weeks = useMemo(() => {
    const p = PLATFORMS.find((x) => x.key === platform)
    const base = p?.weeks ?? 6
    const extra = FEATURES.filter((f) => features.includes(f.key)).reduce((s, f) => s + f.weight, 0)
    return { from: base + extra, to: base + extra + 4 }
  }, [platform, features])

  const canNext = (step === 0 && industry) || (step === 1 && platform) || step === 2

  return (
    <div className="rounded-[24px] border border-slate-700/60 bg-[#0a1c1b] p-6 text-slate-300 sm:p-10">
      {/* Step indicator */}
      <div className="flex items-center gap-2 font-mono text-xs">
        {STEPS.map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span className={i === step ? 'text-accent' : i < step ? 'text-slate-400' : 'text-slate-600'}>
              {String(i + 1).padStart(2, '0')} {s}
            </span>
            {i < STEPS.length - 1 && <span className="text-slate-700">—</span>}
          </span>
        ))}
      </div>

      {/* Complexity gauge — live on every step */}
      <div className="mt-6">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-slate-400">complexity</span>
          <span className="text-accent">{level} · {score}/{MAX_SCORE}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700/50">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${Math.max(4, ratio * 100)}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="mt-8 min-h-[13rem]">
        {step === 0 && (
          <>
            <h3 className="font-display text-xl font-semibold text-white">What industry are you in?</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustry(ind)}
                  className={`rounded-full px-4 py-2 font-mono text-xs transition-colors ${
                    industry === ind
                      ? 'bg-accent text-slate-900'
                      : 'border border-slate-600 hover:border-accent'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h3 className="font-display text-xl font-semibold text-white">What are we building?</h3>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPlatform(p.key)}
                  className={`rounded-xl border px-4 py-3.5 text-left text-sm transition-colors ${
                    platform === p.key
                      ? 'border-accent bg-accent/10 text-white'
                      : 'border-slate-600 hover:border-accent'
                  }`}
                >
                  <span className="font-semibold">{p.label}</span>
                  <span className="ml-2 font-mono text-xs text-slate-400">~{p.weeks} wks base</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="font-display text-xl font-semibold text-white">Which features do you need?</h3>
            <p className="mt-1 text-sm text-slate-400">Watch the gauge react.</p>
            <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {FEATURES.map((f) => {
                const on = features.includes(f.key)
                return (
                  <button
                    key={f.key}
                    onClick={() => toggleFeature(f.key)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      on ? 'border-accent bg-accent/10 text-white' : 'border-slate-600 hover:border-accent'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                          on ? 'border-accent bg-accent text-slate-900' : 'border-slate-500'
                        }`}
                      >
                        {on && <Check size={12} />}
                      </span>
                      {f.label}
                    </span>
                    <span className="font-mono text-xs text-slate-500">+{f.weight}</span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="font-display text-xl font-semibold text-white">Your rough scope</h3>
            <div className="mt-5 rounded-xl border border-slate-700/60 bg-black/20 p-5 font-mono text-xs leading-loose sm:text-sm">
              <p><span className="text-slate-500">industry:</span> <span className="text-accent">{industry}</span></p>
              <p><span className="text-slate-500">platform:</span> <span className="text-accent">{PLATFORMS.find((p) => p.key === platform)?.label}</span></p>
              <p>
                <span className="text-slate-500">features:</span>{' '}
                <span className="text-accent">
                  {features.length ? FEATURES.filter((f) => features.includes(f.key)).map((f) => f.label).join(', ') : 'core build only'}
                </span>
              </p>
              <p><span className="text-slate-500">complexity:</span> <span className="text-accent">{level}</span></p>
              <p><span className="text-slate-500">estimated timeline:</span> <span className="text-white">{weeks.from}–{weeks.to} weeks</span></p>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Ballpark only — a real quote follows a scoping call, not a widget.
            </p>
            <Button to="/contact" className="mt-5">
              Discuss this scope with us <ArrowUpRight size={16} />
            </Button>
          </>
        )}
      </div>

      {/* Nav */}
      {step < 3 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 font-mono text-xs text-slate-400 transition-colors hover:text-accent disabled:opacity-30"
          >
            <ArrowLeft size={14} /> back
          </button>
          <button
            onClick={() => canNext && setStep((s) => s + 1)}
            disabled={!canNext}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-slate-900 transition-opacity disabled:opacity-40"
          >
            {step === 2 ? 'See estimate' : 'Next'} <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}