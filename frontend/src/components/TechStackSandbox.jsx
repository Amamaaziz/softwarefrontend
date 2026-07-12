import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useAsync } from '../lib/useAsync.js'

// Interactive "Tech-Stack Sandbox" — pick a service, watch its mock
// architecture pipeline compile inside a stylized terminal.
// Reuses the project's useAsync hook so the compile step has the same
// loading/success rhythm as every data-driven page.

const STACKS = {
  web: {
    label: 'Web Development',
    command: 'nexbyte compile --stack web',
    nodes: ['React Frontend', 'Node.js API', 'PostgreSQL', 'Redis Cache', 'Edge CDN'],
  },
  mobile: {
    label: 'Mobile Apps',
    command: 'nexbyte compile --stack mobile',
    nodes: ['React Native App', 'GraphQL Gateway', 'Push Service', 'SQLite Offline Store'],
  },
  saas: {
    label: 'SaaS Development',
    command: 'nexbyte compile --stack saas',
    nodes: ['React Frontend', 'Node.js API', 'Stripe Billing', 'Multi-tenant DB', 'AWS S3'],
  },
  design: {
    label: 'UI/UX Design',
    command: 'nexbyte compile --stack design',
    nodes: ['User Research', 'Figma Wireframes', 'Design Tokens', 'Prototype', 'Handoff Specs'],
  },
  devops: {
    label: 'Cloud & DevOps',
    command: 'nexbyte compile --stack devops',
    nodes: ['GitHub Actions CI', 'Docker Build', 'Terraform Infra', 'K8s Cluster', 'Grafana Monitoring'],
  },
  qa: {
    label: 'QA & Testing',
    command: 'nexbyte compile --stack qa',
    nodes: ['Unit Suite', 'Playwright E2E', 'Load Tests', 'Release Gate'],
  },
}

const compileStack = (key) =>
  new Promise((resolve) => setTimeout(() => resolve(STACKS[key].nodes), 650))

function NodeChain({ nodes }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="flex flex-wrap items-center gap-y-4">
      {nodes.map((node, i) => (
        <span key={node} className="flex items-center">
          <span
            className={`rounded-lg border border-accent/40 bg-accent/10 px-3.5 py-2 font-mono text-xs text-accent transition-all duration-500 sm:text-sm ${
              on ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
            style={{ transitionDelay: `${i * 140}ms` }}
          >
            {node}
          </span>
          {i < nodes.length - 1 && (
            <ArrowRight
              size={16}
              className={`mx-2 shrink-0 text-slate-500 transition-opacity duration-500 ${
                on ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: `${i * 140 + 80}ms` }}
            />
          )}
        </span>
      ))}
      <span
        className={`ml-3 font-mono text-xs text-emerald-400 transition-opacity duration-500 ${
          on ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: `${nodes.length * 140 + 200}ms` }}
      >
        ✓ build succeeded
      </span>
    </div>
  )
}

export default function TechStackSandbox() {
  const [active, setActive] = useState('saas')
  const stack = useAsync(() => compileStack(active), [active])

  return (
    <div>
      {/* Service selector pills */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(STACKS).map(([key, s]) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors ${
              active === key
                ? 'bg-accent dark:bg-accent-dark text-slate-900'
                : 'border border-slate-300 dark:border-slate-600 hover:border-accent dark:hover:border-accent-dark'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Terminal */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0a1c1b] shadow-card">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-slate-700/60 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-3 font-mono text-xs text-slate-400">stack-sandbox — nexbyte</span>
        </div>

        <div className="min-h-[10rem] p-5 sm:p-6">
          <p className="font-mono text-xs text-slate-400 sm:text-sm">
            <span className="text-accent">$</span> {STACKS[active].command}
          </p>

          <div className="mt-5">
            {stack.status === 'loading' && (
              <p className="font-mono text-xs text-slate-400 sm:text-sm">
                compiling architecture
                <span className="inline-block animate-pulse">▍</span>
              </p>
            )}
            {stack.status === 'success' && <NodeChain key={active} nodes={stack.data} />}
          </div>
        </div>
      </div>

      <p className="mt-3 font-mono text-xs text-slate-400 dark:text-slate-500">
        // illustrative bundles — every real project gets a stack scoped to its needs
      </p>
    </div>
  )
}