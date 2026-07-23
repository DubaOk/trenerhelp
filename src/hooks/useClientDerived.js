import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { computeAttendance, getAttendanceLabel } from '../utils/subscription'

export function useClientDerived(clientId) {
  return useLiveQuery(async () => {
    if (!clientId) return null
    const [client, sessions] = await Promise.all([
      db.clients.get(clientId),
      db.sessions.where('clientId').equals(clientId).toArray(),
    ])
    if (!client) return null
    const stats = computeAttendance(clientId, sessions)
    return {
      client,
      sessions: sessions.sort((a, b) => (a.date < b.date ? 1 : -1)),
      stats,
      label: getAttendanceLabel(stats),
    }
  }, [clientId])
}

export function useClientsWithStatus() {
  return useLiveQuery(async () => {
    const [clients, sessions] = await Promise.all([db.clients.toArray(), db.sessions.toArray()])
    return clients.map((client) => {
      const stats = computeAttendance(client.id, sessions)
      return { client, stats, label: getAttendanceLabel(stats) }
    })
  }, [])
}
