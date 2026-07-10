export default function EmptyState({ icon, title, hint, action }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      {icon && <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand">{icon}</div>}
      <p className="text-lg font-semibold text-text-primary">{title}</p>
      {hint && <p className="max-w-xs text-sm text-text-secondary">{hint}</p>}
      {action}
    </div>
  )
}
