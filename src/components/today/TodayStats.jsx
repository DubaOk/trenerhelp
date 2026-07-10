import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../data/db'
import { today, startOfMonth, endOfMonth } from '../../utils/date'
import Money from '../ui/Money'

export default function TodayStats({ sessions }) {
  const monthIncome = useLiveQuery(async () => {
    const from = startOfMonth(today())
    const to = endOfMonth(today())
    const payments = await db.payments.where('date').between(from, to, true, true).toArray()
    return payments.reduce((s, p) => s + p.amount, 0)
  }, [])

  const total = sessions?.length ?? 0
  const attended = sessions?.filter((s) => s.status === 'attended').length ?? 0

  return (
    <div className="grid grid-cols-3 gap-2 px-4">
      <div className="anim-card rounded-2xl bg-white p-3">
        <p className="text-xl font-bold text-text-primary">{total}</p>
        <p className="text-xs text-text-secondary">Сегодня</p>
      </div>
      <div className="anim-card rounded-2xl bg-white p-3" style={{ animationDelay: '60ms' }}>
        <p className="text-xl font-bold text-status-ok">{attended}</p>
        <p className="text-xs text-text-secondary">Пришло</p>
      </div>
      <div className="anim-card rounded-2xl bg-white p-3" style={{ animationDelay: '120ms' }}>
        <p className="truncate text-xl font-bold text-text-primary"><Money amount={monthIncome ?? 0} /></p>
        <p className="text-xs text-text-secondary">За месяц</p>
      </div>
    </div>
  )
}
