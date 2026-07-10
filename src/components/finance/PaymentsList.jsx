import { useState } from 'react'
import MethodTag from '../ui/MethodTag'
import ConfirmDialog from '../layout/ConfirmDialog'
import { formatDateShort } from '../../utils/date'
import { formatMoney } from '../../utils/format'
import Money from '../ui/Money'
import { db } from '../../data/db'

export default function PaymentsList({ payments, clientsById, typesById }) {
  const [deleting, setDeleting] = useState(null)

  if (payments.length === 0) {
    return <p className="px-4 py-6 text-center text-sm text-text-secondary">Платежей не найдено</p>
  }

  async function handleDelete() {
    await db.payments.delete(deleting.id)
    setDeleting(null)
  }

  return (
    <div className="flex flex-col gap-2 px-4">
      {payments.map((p) => (
        <button
          key={p.id}
          onClick={() => setDeleting(p)}
          className="flex items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3 text-left active:bg-fog"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">{clientsById[p.clientId]?.name ?? '—'}</p>
            <p className="truncate text-sm text-text-secondary">
              {typesById[p.subscriptionTypeId]?.name ?? 'Абонемент'} · {formatDateShort(p.date)}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <span className="text-base font-bold text-text-primary"><Money amount={p.amount} /></span>
            <MethodTag method={p.method} />
          </div>
        </button>
      ))}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Удалить платёж?"
        description={
          deleting
            ? `${clientsById[deleting.clientId]?.name ?? ''} · ${formatMoney(deleting.amount)} · ${formatDateShort(deleting.date)}`
            : ''
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
