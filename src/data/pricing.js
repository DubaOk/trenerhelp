import { db } from './db'

export const DEFAULT_PRICING = { singlePrice: 35, pairPrice: 30 }

export async function getPricing() {
  const stored = await db.settings.get('pricing')
  if (stored) return stored
  // legacy fallback: derive from single-session subscription types
  const types = await db.subscriptionTypes.toArray()
  const singles = types.filter((t) => !t.isUnlimited && t.sessionsCount === 1)
  if (singles.length > 0) {
    const prices = singles.map((t) => t.price)
    return { singlePrice: Math.max(...prices), pairPrice: Math.min(...prices) }
  }
  return DEFAULT_PRICING
}

export async function savePricing({ singlePrice, pairPrice }) {
  await db.settings.put({ id: 'pricing', singlePrice, pairPrice })
}

// price snapshot: fixed on the session at the moment it is marked attended,
// so later price changes never rewrite history
export async function setSessionStatus(session, status, extraFields = {}) {
  let price = null
  if (status === 'attended') {
    const pricing = await getPricing()
    price = session.pairId ? pricing.pairPrice : pricing.singlePrice
  }
  await db.sessions.update(session.id, { status, price, ...extraFields })
}
