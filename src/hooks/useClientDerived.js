import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { getPricing } from '../data/pricing'
import { computeMoney, computeStatusColor, computeDebt, getMoneyLabel } from '../utils/subscription'

export function useClientDerived(clientId) {
  return useLiveQuery(async () => {
    if (!clientId) return null
    const [client, payments, sessions, subscriptionTypes, pricing] = await Promise.all([
      db.clients.get(clientId),
      db.payments.where('clientId').equals(clientId).toArray(),
      db.sessions.where('clientId').equals(clientId).toArray(),
      db.subscriptionTypes.toArray(),
      getPricing(),
    ])
    if (!client) return null
    const money = computeMoney(clientId, payments, sessions, pricing)
    return {
      client,
      payments: payments.sort((a, b) => (a.date < b.date ? 1 : -1)),
      sessions: sessions.sort((a, b) => (a.date < b.date ? 1 : -1)),
      subscriptionTypes,
      money,
      balance: money.balance,
      statusColor: computeStatusColor(money),
      isDebt: computeDebt(money),
      label: getMoneyLabel(money),
    }
  }, [clientId])
}

export function useClientsWithStatus() {
  return useLiveQuery(async () => {
    const [clients, payments, sessions, pricing] = await Promise.all([
      db.clients.toArray(),
      db.payments.toArray(),
      db.sessions.toArray(),
      getPricing(),
    ])
    return clients.map((client) => {
      const money = computeMoney(client.id, payments, sessions, pricing)
      return {
        client,
        money,
        statusColor: computeStatusColor(money),
        isDebt: computeDebt(money),
        label: getMoneyLabel(money),
      }
    })
  }, [])
}
