export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-heading dark:text-heading-dark">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-body dark:text-body-dark">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
