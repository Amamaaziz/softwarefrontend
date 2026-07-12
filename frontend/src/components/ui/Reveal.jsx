import { useEffect, useRef, useState } from 'react'

// Scroll-reveal wrapper. Children fade + slide up when they enter the viewport.
//
// Usage:
//   <Reveal>...</Reveal>
//   <Reveal delay={120}>...</Reveal>          // stagger (ms)
//   <Reveal y={40}>...</Reveal>               // larger slide distance (px)
//   <Reveal as="section" className="...">     // custom element / extra classes
//
// Accessibility: index.css disables the effect under prefers-reduced-motion,
// and if IntersectionObserver is unavailable the content shows immediately.
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  as = 'div',
  className = '',
  ...props
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const Comp = as
  return (
    <Comp
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, '--reveal-y': `${y}px` }}
      {...props}
    >
      {children}
    </Comp>
  )
}
