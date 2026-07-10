export function toISODateString(date) {
  const d = date instanceof Date ? date : new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function today() {
  return toISODateString(new Date())
}

export function parseISODate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatDate(isoDate, options = { day: 'numeric', month: 'long' }) {
  return new Intl.DateTimeFormat('ru-RU', options).format(parseISODate(isoDate))
}

export function formatDateShort(isoDate) {
  return formatDate(isoDate, { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export function formatWeekday(isoDate) {
  return new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(parseISODate(isoDate))
}

export function isSameDay(isoDateA, isoDateB) {
  return isoDateA === isoDateB
}

export function addDays(isoDate, n) {
  const d = parseISODate(isoDate)
  d.setDate(d.getDate() + n)
  return toISODateString(d)
}

export function daysBetween(isoDateA, isoDateB) {
  const a = parseISODate(isoDateA)
  const b = parseISODate(isoDateB)
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

export function startOfWeek(isoDate) {
  const d = parseISODate(isoDate)
  const day = (d.getDay() + 6) % 7 // Monday = 0
  d.setDate(d.getDate() - day)
  return toISODateString(d)
}

export function startOfMonth(isoDate) {
  const d = parseISODate(isoDate)
  return toISODateString(new Date(d.getFullYear(), d.getMonth(), 1))
}

export function endOfMonth(isoDate) {
  const d = parseISODate(isoDate)
  return toISODateString(new Date(d.getFullYear(), d.getMonth() + 1, 0))
}

export function getWeekDays(isoDate) {
  const start = startOfWeek(isoDate)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function getMonthGrid(isoDate) {
  const firstOfMonth = startOfMonth(isoDate)
  const gridStart = startOfWeek(firstOfMonth)
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
}
