import { useMemo, useState } from 'react'
import PageHeader from '../layout/PageHeader'
import EmptyState from '../layout/EmptyState'
import Fab from '../layout/Fab'
import Button from '../ui/Button'
import ClientSearchBar from './ClientSearchBar'
import ClientListItem from './ClientListItem'
import ClientForm from './ClientForm'
import { useClientsWithStatus } from '../../hooks/useClientDerived'
import { UsersIcon } from '../ui/icons'

export default function ClientsListPage() {
  const clientsWithStatus = useClientsWithStatus()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formOpen, setFormOpen] = useState(false)

  const attentionCount = clientsWithStatus?.filter((c) => c.statusColor === 'warn' || c.statusColor === 'danger').length ?? 0

  const filtered = useMemo(() => {
    if (!clientsWithStatus) return []
    const q = query.trim().toLowerCase()
    let list = q
      ? clientsWithStatus.filter(
          (c) => c.client.name.toLowerCase().includes(q) || c.client.phone.toLowerCase().includes(q)
        )
      : clientsWithStatus
    if (statusFilter === 'attention') {
      list = list.filter((c) => c.statusColor === 'warn' || c.statusColor === 'danger')
    }
    return [...list].sort((a, b) => a.client.name.localeCompare(b.client.name, 'ru'))
  }, [clientsWithStatus, query, statusFilter])

  const isEmpty = clientsWithStatus && clientsWithStatus.length === 0

  return (
    <>
      <PageHeader title="Клиенты" />
      <div className="flex flex-col gap-3 pb-24">
        {!isEmpty && (
          <>
            <ClientSearchBar value={query} onChange={setQuery} />
            {attentionCount > 0 && (
              <div className="flex gap-1.5 px-4">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`h-9 rounded-full px-3.5 text-sm font-medium ${
                    statusFilter === 'all' ? 'bg-brand text-white' : 'bg-white text-text-secondary'
                  }`}
                >
                  Все
                </button>
                <button
                  onClick={() => setStatusFilter('attention')}
                  className={`h-9 rounded-full px-3.5 text-sm font-medium ${
                    statusFilter === 'attention' ? 'bg-status-warn text-white' : 'bg-white text-text-secondary'
                  }`}
                >
                  Внимание ({attentionCount})
                </button>
              </div>
            )}
            <div className="flex flex-col gap-2 px-4">
              {filtered.map(({ client, statusColor, label }, i) => (
                <ClientListItem key={client.id} client={client} statusColor={statusColor} label={label} index={i} />
              ))}
              {filtered.length === 0 && (
                <p className="px-2 py-6 text-center text-sm text-text-secondary">Ничего не найдено</p>
              )}
            </div>
          </>
        )}
        {isEmpty && (
          <EmptyState
            icon={<UsersIcon className="h-7 w-7" />}
            title="Пока нет клиентов"
            hint="Добавьте первого клиента, чтобы начать вести учёт тренировок и оплат"
            action={<Button onClick={() => setFormOpen(true)}>Добавить клиента</Button>}
          />
        )}
      </div>
      {!isEmpty && <Fab onClick={() => setFormOpen(true)} />}
      <ClientForm open={formOpen} onClose={() => setFormOpen(false)} />
    </>
  )
}
