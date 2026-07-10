import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { addDays, startOfWeek, formatDateShort } from '../utils/date'

export function useDateRangeStats(from, to) {
  return useLiveQuery(async () => {
    const [payments, sessions, clients] = await Promise.all([
      db.payments.toArray(),
      db.sessions.toArray(),
      db.clients.toArray(),
    ])

    const inRange = (date) => date >= from && date <= to

    const periodPayments = payments.filter((p) => inRange(p.date))
    const cashTotal = periodPayments.filter((p) => p.method === 'cash').reduce((s, p) => s + p.amount, 0)
    const receptionTotal = periodPayments.filter((p) => p.method === 'reception').reduce((s, p) => s + p.amount, 0)

    const attendedCount = sessions.filter((s) => s.status === 'attended' && inRange(s.date)).length
    const newClientsCount = clients.filter((c) => inRange(c.startDate)).length

    // weekly buckets for the bar chart
    const buckets = []
    let cursor = startOfWeek(from)
    while (cursor <= to) {
      const bucketEnd = addDays(cursor, 6)
      const bucketPayments = periodPayments.filter((p) => p.date >= cursor && p.date <= bucketEnd)
      buckets.push({
        label: formatDateShort(cursor),
        cash: bucketPayments.filter((p) => p.method === 'cash').reduce((s, p) => s + p.amount, 0),
        reception: bucketPayments.filter((p) => p.method === 'reception').reduce((s, p) => s + p.amount, 0),
      })
      cursor = addDays(cursor, 7)
    }

    return {
      cashTotal,
      receptionTotal,
      total: cashTotal + receptionTotal,
      attendedCount,
      newClientsCount,
      buckets,
    }
  }, [from, to])
}
