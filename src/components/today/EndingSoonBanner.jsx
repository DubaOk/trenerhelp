import { Link } from 'react-router-dom'
import { useClientsWithStatus } from '../../hooks/useClientDerived'
import { StatusDot } from '../ui/Badge'

export default function EndingSoonBanner() {
  const clientsWithStatus = useClientsWithStatus()
  const attention = (clientsWithStatus ?? []).filter((c) => c.statusColor === 'warn' || c.statusColor === 'danger')

  if (attention.length === 0) return null

  return (
    <div className="mx-4 rounded-[16px_0_0_0] bg-status-warn-bg p-4">
      <p className="mb-2 text-sm font-semibold text-text-primary">Не оплачено</p>
      <div className="flex flex-col gap-1.5">
        {attention.map(({ client, statusColor, label }) => (
          <Link key={client.id} to={`/clients/${client.id}`} className="flex items-center gap-2 py-0.5">
            <StatusDot status={statusColor} />
            <span className="text-sm font-medium text-text-primary">{client.name}</span>
            <span className="ml-auto text-sm text-text-secondary">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
