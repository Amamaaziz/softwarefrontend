import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import Seo from '../components/ui/Seo.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Pagination from '../components/ui/Pagination.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getBlogs } from '../lib/api.js'

const PAGE_SIZE = 3

export default function BlogList() {
  const blogs = useAsync(getBlogs, [])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (blogs.status !== 'success') return []
    const q = query.trim().toLowerCase()
    if (!q) return blogs.data
    return blogs.data.filter(
      (b) => b.title.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
    )
  }, [blogs.status, blogs.data, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
      <Seo title="Blog" description="Engineering, design, and product notes from the Nexbyte team." />

      {/* BANNER — centered "magazine" style: image fading up from the bottom,
          twin accent glows, centered title + tagline */}
      <section className="relative overflow-hidden bg-[#0a1c1b]">
        <img
          src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=70"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-x-0 bottom-0 h-2/3 w-full object-cover opacity-25 [mask-image:linear-gradient(to_top,black_20%,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 right-1/4 h-56 w-56 rounded-full bg-accent/5 blur-3xl"
        />
        <div className="relative container-page flex flex-col items-center py-24 text-center sm:py-32">
          <p className="font-mono text-xs uppercase tracking-wide text-accent">// notes &amp; ideas</p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Blog
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-300">
            Engineering, design, and product lessons from the projects we ship.
          </p>
          <p className="mt-8 text-sm text-slate-300">
            <Link to="/" className="transition-colors hover:text-accent">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-accent">Blog</span>
          </p>
        </div>
      </section>

      <section className="container-page py-20">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="blog" title="Notes from the team" description="What we're learning while building client software week to week." />
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Search articles…"
              className="w-56 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-canvas-dark py-2 pl-9 pr-3 text-sm outline-none focus:border-accent dark:focus:border-accent-dark"
            />
          </div>
        </Reveal>

        <div className="mt-12">
          {blogs.status === 'loading' && <Spinner />}
          {blogs.status === 'error' && <ErrorState onRetry={blogs.retry} />}
          {blogs.status === 'success' && filtered.length === 0 && (
            <EmptyState title="No articles found" description="Try a different search term." />
          )}
          {blogs.status === 'success' && filtered.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {paged.map((post, i) => (
                  <Reveal key={post.id} delay={(i % 3) * 100}>
                    <Link to={`/blog/${post.slug}`} className="group card-surface block overflow-hidden">
                    <div className="overflow-hidden">
                      <img src={post.coverImage} alt={post.title} loading="lazy" className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <p className="eyebrow mb-2">{post.category}</p>
                      <h3 className="font-display text-base font-semibold leading-snug">{post.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                      <p className="mt-4 text-xs">{post.authorName} · {new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </>
          )}
        </div>
      </section>
    </>
  )
}