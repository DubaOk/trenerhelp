import { db } from './db'
import { today } from '../utils/date'

export async function exportBackup() {
  const [clients, subscriptionTypes, payments, sessions, workoutTemplates, splits, settings] = await Promise.all([
    db.clients.toArray(),
    db.subscriptionTypes.toArray(),
    db.payments.toArray(),
    db.sessions.toArray(),
    db.workoutTemplates.toArray(),
    db.splits.toArray(),
    db.settings.toArray(),
  ])
  const data = { schemaVersion: 4, exportedAt: new Date().toISOString(), clients, subscriptionTypes, payments, sessions, workoutTemplates, splits, settings }
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
  await db.transaction('rw', db.clients, db.subscriptionTypes, db.payments, db.sessions, db.workoutTemplates, db.splits, db.settings, async () => {
    await Promise.all([
      db.clients.clear(),
      db.subscriptionTypes.clear(),
      db.payments.clear(),
      db.sessions.clear(),
      db.workoutTemplates.clear(),
      db.splits.clear(),
      db.settings.clear(),
    ])
    await db.clients.bulkAdd(data.clients)
    await db.subscriptionTypes.bulkAdd(data.subscriptionTypes ?? [])
    await db.payments.bulkAdd(data.payments ?? [])
    await db.sessions.bulkAdd(data.sessions ?? [])
    await db.workoutTemplates.bulkAdd(data.workoutTemplates ?? [])
    await db.splits.bulkAdd(data.splits ?? [])
    await db.settings.bulkAdd(data.settings ?? [])
  })
  return { clients: data.clients.length, sessions: data.sessions.length }
}
