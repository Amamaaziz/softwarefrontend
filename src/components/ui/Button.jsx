import { Link } from 'react-router-dom'

const VARIANTS = {
  primary:
    'bg-accent dark:bg-accent-dark text-slate-900 hover:bg-accent-hoverLight dark:hover:bg-accent-hoverDark',
  outline:
    'border border-slate-300 dark:border-slate-600 text-heading-light dark:text-heading-dark hover:border-accent dark:hover:border-accent-dark',
  ghost:
    'text-heading-light dark:text-heading-dark hover:bg-surface-light dark:hover:bg-surface-dark',
}

export default function Button({
  as = 'button',
  to,
  href,
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }
  const Comp = as
  return (
    <Comp className={classes} {...props}>
      {children}
    </Comp>
  )
}
