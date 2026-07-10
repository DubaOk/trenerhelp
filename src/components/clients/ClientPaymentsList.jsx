import MethodTag from '../ui/MethodTag'
import { formatDateShort } from '../../utils/date'
import Money from '../ui/Money'

export default function ClientPaymentsList({ payments, subscriptionTypes }) {
  if (payments.length === 0) {
    return <p className="px-4 py-3 text-sm text-text-secondary">Платежей пока нет</p>
  }

  return (
    <div className="flex flex-col gap-2 px-4">
      {payments.map((p) => {
        const type = subscriptionTypes.find((t) => t.id === p.subscriptionTypeId)
        return (
          <div key={p.id} className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">{type?.name ?? 'Абонемент'}</p>
              <p className="text-sm text-text-secondary">
                {formatDateShort(p.date)} · <Money amount={p.amount} />
              </p>
            </div>
            <MethodTag method={p.method} />
          </div>
        )
      })}
    </div>
  )
}
