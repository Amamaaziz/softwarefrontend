export default function Card({ as = 'div', className = '', children, ...props }) {
  const Comp = as
  return (
    <Comp className={`card-surface p-6 ${className}`} {...props}>
      {children}
    </Comp>
  )
}
