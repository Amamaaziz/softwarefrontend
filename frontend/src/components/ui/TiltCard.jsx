import { useRef, useState, useEffect } from 'react'

// 3D cursor tilt + glare spotlight wrapper.
// Wrap any card:  <TiltCard><Card>…</Card></TiltCard>
//
// - `max`    — maximum tilt in degrees (default 10)
// - `glare`  — show the cursor-following light spot (default true)
// Respects prefers-reduced-motion (renders static) and does nothing on
// touch-only devices, where there's no cursor to track.
export default function TiltCard({ children, max = 10, glare = true, className = '' }) {
  const ref = useRef(null)
  const [transform, setTransform] = useState('')
  const [spot, setSpot] = useState({ x: 50, y: 50, opacity: 0 })
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const onMouseMove = (e) => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width // 0 → 1
    const py = (e.clientY - rect.top) / rect.height
    const rotateY = (px - 0.5) * 2 * max
    const rotateX = -(py - 0.5) * 2 * max
    setTransform(`perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`)
    setSpot({ x: px * 100, y: py * 100, opacity: 1 })
  }

  const onMouseLeave = () => {
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)')
    setSpot((s) => ({ ...s, opacity: 0 }))
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative will-change-transform ${className}`}
      style={{
        transform: reduced ? 'none' : transform,
        transition: 'transform 0.18s ease-out',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
      {glare && !reduced && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            borderRadius: 'inherit',
            opacity: spot.opacity,
            transition: 'opacity 0.3s ease-out',
            background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(0, 210, 196, 0.14), transparent 55%)`,
          }}
        />
      )}
    </div>
  )
}