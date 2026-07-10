const numberFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 2,
})

export function formatNumber(amount) {
  return numberFormatter.format(amount)
}

// plain-text money (dialogs, option sublabels); styled NBRB symbol lives in ui/Money.jsx
export function formatMoney(amount) {
  return `${numberFormatter.format(amount)} Br`
}

export function pluralize(n, one, few, many) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

export function sessionsLabel(n) {
  return `${n} ${pluralize(n, 'тренировка', 'тренировки', 'тренировок')}`
}
