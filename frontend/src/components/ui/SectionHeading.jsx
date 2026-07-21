export default function SectionHeading({ eyebrow, title, description, align = 'left', className = '' }) {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''} ${className}`}>
      
      <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed">{description}</p>}
    </div>
  )
}
