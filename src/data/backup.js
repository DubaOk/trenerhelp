import { db } from './db'
import { today } from '../utils/date'

export async function exportBackup() {
  const [clients, sessions, workoutTemplates, splits] = await Promise.all([
    db.clients.toArray(),
    db.sessions.toArray(),
    db.workoutTemplates.toArray(),
    db.splits.toArray(),
  ])
  const data = { schemaVersion: 5, exportedAt: new Date().toISOString(), clients, sessions, workoutTemplates, splits }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `trenerhelp-backup-${today()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importBackup(file) {
  const text = await file.text()
  const data = JSON.parse(text)
  if (!Array.isArray(data.clients) || !Array.isArray(data.sessions)) {
    throw new Error('Файл не похож на резервную копию TrenerHelp')
  }
  // amounts/prices are intentionally never restored, even from older backup files
  const sessions = data.sessions.map(({ price, ...s }) => s)

  await db.transaction('rw', db.clients, db.sessions, db.workoutTemplates, db.splits, async () => {
    await Promise.all([db.clients.clear(), db.sessions.clear(), db.workoutTemplates.clear(), db.splits.clear()])
    await db.clients.bulkAdd(data.clients)
    await db.sessions.bulkAdd(sessions)
    await db.workoutTemplates.bulkAdd(data.workoutTemplates ?? [])
    await db.splits.bulkAdd(data.splits ?? [])
  })
  return { clients: data.clients.length, sessions: sessions.length }
}
