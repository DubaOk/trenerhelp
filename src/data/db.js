import Dexie from 'dexie'
import dexieCloud from 'dexie-cloud-addon'
import { databaseUrl } from './cloudConfig'

export const db = new Dexie('trenerhelp', { addons: [dexieCloud] })

db.version(1).stores({
  clients: 'id, name',
  subscriptionTypes: 'id',
  payments: 'id, clientId, date',
  sessions: 'id, clientId, date',
})

db.version(2).stores({
  workoutTemplates: 'id, name',
})

db.version(3).stores({
  splits: 'id, name',
})

db.version(4)
  .stores({
    settings: 'id',
  })
  .upgrade(async (tx) => {
    // freeze prices of already-attended sessions so future price changes don't rewrite history
    const types = await tx.table('subscriptionTypes').toArray()
    const singles = types.filter((t) => !t.isUnlimited && t.sessionsCount === 1)
    const prices = singles.map((t) => t.price)
    const singlePrice = prices.length ? Math.max(...prices) : 35
    const pairPrice = prices.length ? Math.min(...prices) : 30
    await tx
      .table('sessions')
      .toCollection()
      .modify((s) => {
        if (s.status === 'attended' && s.price == null) {
          s.price = s.pairId ? pairPrice : singlePrice
        }
      })
  })

export const cloudEnabled = Boolean(databaseUrl)

if (cloudEnabled) {
  db.cloud.configure({
    databaseUrl,
    requireAuth: true,
  })
}
