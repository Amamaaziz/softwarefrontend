import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import Seo from '../components/ui/Seo.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Pagination from '../components/ui/Pagination.jsx'
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

      <section className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
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
        </div>

        <div className="mt-12">
          {blogs.status === 'loading' && <Spinner />}
          {blogs.status === 'error' && <ErrorState onRetry={blogs.retry} />}
          {blogs.status === 'success' && filtered.length === 0 && (
            <EmptyState title="No articles found" description="Try a different search term." />
          )}
          {blogs.status === 'success' && filtered.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {paged.map((post) => (
                  <Link key={post._id} to={`/blog/${post.slug}`} className="group card-surface overflow-hidden">
                    <div className="overflow-hidden">
                      <img src={post.coverImage} alt={post.title} loading="lazy" className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <p className="eyebrow mb-2">{post.category}</p>
                      <h3 className="font-display text-base font-semibold leading-snug">{post.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                      <p className="mt-4 text-xs">{post.author} · {new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </Link>
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
