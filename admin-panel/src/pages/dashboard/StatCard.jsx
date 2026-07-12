import clsx from 'clsx';
import Card, { CardBody } from '../../components/common/Card.jsx';
import { useCountUp } from '../../hooks/useCountUp.js';

const ACCENTS = {
  teal: {
    icon: 'bg-cta text-white shadow-lg shadow-cta/30',
    glow: 'from-cta/25 via-cta/5',
    bg: 'bg-gradient-to-br from-cta/10 via-canvas to-canvas dark:from-cta/10 dark:via-surface-dark dark:to-surface-dark',
    border: 'border-cta/20 dark:border-cta/20',
  },
  violet: {
    icon: 'bg-violet-500 text-white shadow-lg shadow-violet-500/30',
    glow: 'from-violet-500/25 via-violet-500/5',
    bg: 'bg-gradient-to-br from-violet-100 via-canvas to-canvas dark:from-violet-500/10 dark:via-surface-dark dark:to-surface-dark',
    border: 'border-violet-200 dark:border-violet-500/20',
  },
  amber: {
    icon: 'bg-amber-500 text-white shadow-lg shadow-amber-500/30',
    glow: 'from-amber-500/25 via-amber-500/5',
    bg: 'bg-gradient-to-br from-amber-100 via-canvas to-canvas dark:from-amber-500/10 dark:via-surface-dark dark:to-surface-dark',
    border: 'border-amber-200 dark:border-amber-500/20',
  },
  blue: {
    icon: 'bg-blue-500 text-white shadow-lg shadow-blue-500/30',
    glow: 'from-blue-500/25 via-blue-500/5',
    bg: 'bg-gradient-to-br from-blue-100 via-canvas to-canvas dark:from-blue-500/10 dark:via-surface-dark dark:to-surface-dark',
    border: 'border-blue-200 dark:border-blue-500/20',
  },
};

export default function StatCard({ icon: Icon, label, value, trend, trendLabel, delay = 0, accent = 'teal' }) {
  const isPositive = trend >= 0;
  const animatedValue = useCountUp(value);
  const colors = ACCENTS[accent] || ACCENTS.teal;

  return (
    <Card
      className={clsx(
        'group relative animate-fade-up overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-popover',
        colors.bg,
        colors.border
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative gradient glow in the corner */}
      <div
        className={clsx(
          'pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br to-transparent blur-xl transition-transform duration-500 group-hover:scale-125',
          colors.glow
        )}
      />

      <CardBody className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-body/60 dark:text-body-dark/60">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tabular-nums text-heading dark:text-heading-dark">
            {animatedValue}
          </p>
          {typeof trend === 'number' && (
            <p
              className={clsx(
                'mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold',
                isPositive
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                  : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'
              )}
            >
              {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
              <span className="font-medium opacity-80">{trendLabel}</span>
            </p>
          )}
        </div>
        <div
          className={clsx(
            'flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6',
            colors.icon
          )}
        >
          <Icon size={22} />
        </div>
      </CardBody>
    </Card>
  );
}