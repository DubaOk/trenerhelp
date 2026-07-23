import { Link } from 'react-router-dom'

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export default function ClientListItem({ client, label, index = 0 }) {
  return (
    <Link
      to={`/clients/${client.id}`}
      className="anim-card press flex items-center gap-3 rounded-2xl bg-white px-4 py-3 active:bg-fog"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft text-base font-semibold text-brand">
        {initials(client.name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-text-primary">{client.name}</p>
        <p className="truncate text-sm text-text-secondary">{client.phone || label}</p>
      </div>
    </Link>
  )
}
