const FREE_EVERY = 10 // every 10th attended session is a gift

// fallback for attended sessions saved before price snapshots existed
export function fallbackSessionPrice(session, pricing) {
  return session.pairId ? pricing.pairPrice : pricing.singlePrice
}

export function computeMoney(clientId, payments, sessions, pricing) {
  const attended = sessions
    .filter((s) => s.clientId === clientId && s.status === 'attended')
    .sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)))

  let cost = 0
  attended.forEach((s, i) => {
    const isGift = (i + 1) % FREE_EVERY === 0
    if (!isGift) cost += s.price ?? fallbackSessionPrice(s, pricing)
  })

  const paid = payments.filter((p) => p.clientId === clientId).reduce((sum, p) => sum + p.amount, 0)
  const attendedCount = attended.length
  const sinceGift = attendedCount % FREE_EVERY

  return {
    balance: paid - cost,
    attendedCount,
    sinceGift, // attended sessions since the last gift (0..9)
    untilGift: FREE_EVERY - sinceGift, // how many left until the free one
    nextIsGift: sinceGift === FREE_EVERY - 1,
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
