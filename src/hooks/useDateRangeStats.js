import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { addDays, startOfWeek, formatDateShort } from '../utils/date'

export function useDateRangeStats(from, to) {
  return useLiveQuery(async () => {
    const [sessions, clients] = await Promise.all([db.sessions.toArray(), db.clients.toArray()])

    const inRange = (date) => date >= from && date <= to

    const attended = sessions.filter((s) => s.status === 'attended' && inRange(s.date))
    const cashCount = attended.filter((s) => s.method === 'cash').length
    const receptionCount = attended.filter((s) => s.method === 'reception').length
    const missedCount = sessions.filter((s) => s.status === 'missed' && inRange(s.date)).length

    const newClientsCount = clients.filter((c) => inRange(c.startDate)).length

    // weekly buckets for the chart
    const buckets = []
    let cursor = startOfWeek(from)
    while (cursor <= to) {
      const bucketEnd = addDays(cursor, 6)
      const bucketSessions = attended.filter((s) => s.date >= cursor && s.date <= bucketEnd)
      buckets.push({
        label: formatDateShort(cursor),
        cash: bucketSessions.filter((s) => s.method === 'cash').length,
        reception: bucketSessions.filter((s) => s.method === 'reception').length,
      })
      cursor = addDays(cursor, 7)
    }

    return {
      attendedCount: attended.length,
      cashCount,
      receptionCount,
      missedCount,
      newClientsCount,
      buckets,
    }
  }, [from, to])
}
