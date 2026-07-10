import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { today } from '../utils/date'

export function useTodaySessions() {
  return useLiveQuery(async () => {
    const sessions = await db.sessions.where('date').equals(today()).toArray()
    return sessions.sort((a, b) => a.time.localeCompare(b.time))
  }, [])
}
