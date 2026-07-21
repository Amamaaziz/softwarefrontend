import { useParams } from 'react-router-dom'
import Seo from '../components/ui/Seo.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Button from '../components/ui/Button.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { useAsync } from '../lib/useAsync.js'
import { getBlogBySlug } from '../lib/api.js'
import RichText from '../components/ui/RichText.jsx'

export default function BlogDetail() {
  const { slug } = useParams()
  const post = useAsync(() => getBlogBySlug(slug), [slug])

  if (post.status === 'loading') return <Spinner className="py-32" />
  if (post.status === 'error') return <div className="container-page py-20"><ErrorState onRetry={post.retry} /></div>
  if (post.status === 'success' && !post.data) {
    return (
      <div className="container-page py-20">
        <EmptyState title="Article not found" description="This post may have been unpublished or moved." />
      </div>
    )
  }

  const b = post.data

  return (
    <>
      <Seo title={b.title} description={b.excerpt} />

      <article className="container-page max-w-3xl py-20">
        <Reveal>
          
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{b.title}</h1>
          <p className="mt-4 text-sm">
            {b.authorName} · {new Date(b.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </Reveal>
        <Reveal delay={100}>
          <img src={b.coverImage} alt={b.title} className="mt-10 h-64 w-full rounded-2xl object-cover sm:h-96" loading="lazy" />
        </Reveal>
        <Reveal delay={150}>
          <RichText html={b.content} className="mt-10 text-base leading-relaxed" />
        </Reveal>

        <Reveal>
          <div className="mt-14 border-t border-slate-200/70 dark:border-slate-700/60 pt-8">
            <Button to="/blog" variant="outline">Back to all articles</Button>
          </div>
        </Reveal>
      </article>
    </>
  )
}