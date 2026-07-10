// fallback for attended sessions saved before price snapshots existed
export function fallbackSessionPrice(session, pricing) {
  return session.pairId ? pricing.pairPrice : pricing.singlePrice
}

export function computeMoney(clientId, payments, sessions, pricing) {
  const attended = sessions.filter((s) => s.clientId === clientId && s.status === 'attended')

  let cost = 0
  attended.forEach((s) => {
    cost += s.price ?? fallbackSessionPrice(s, pricing)
  })

  // paid = real money + promo bonuses granted at purchase time (e.g. «9+1»: 315 paid + 35 bonus)
  const paid = payments
    .filter((p) => p.clientId === clientId)
    .reduce((sum, p) => sum + p.amount + (p.bonus ?? 0), 0)

  return {
    balance: paid - cost,
    attendedCount: attended.length,
  }
}

export function computeStatusColor(money) {
  if (!money) return 'none'
  if (money.balance < 0) return 'danger'
  return 'ok'
}

export function computeDebt(money) {
  return Boolean(money) && money.balance < 0
}

export function getMoneyLabel(money) {
  if (!money) return ''
  if (money.balance < 0) return `Долг: ${-money.balance} Br`
  if (money.balance > 0) return `Предоплата: ${money.balance} Br`
  return 'Оплачено'
}
