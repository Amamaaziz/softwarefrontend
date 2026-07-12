import Seo from '../components/ui/Seo.jsx'
import Button from '../components/ui/Button.jsx'
import Reveal from '../components/ui/Reveal.jsx'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" />
      <Reveal as="section" className="container-page flex flex-col items-center gap-5 py-32 text-center">
        <p className="font-mono text-sm text-accent-hoverLight dark:text-accent-dark">404</p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">This page doesn't exist</h1>
        <p className="max-w-sm text-sm">The link may be broken, or the page may have moved.</p>
        <Button to="/">Back to home</Button>
      </Reveal>
    </>
  )
}