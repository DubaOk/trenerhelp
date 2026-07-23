// Attendance + payment-method bookkeeping — no amounts, no prices.
// The trainer only records HOW a session was paid (cash / reception), never how much.

export function computeAttendance(clientId, sessions) {
  const attended = sessions.filter((s) => s.clientId === clientId && s.status === 'attended')
  const missingMethod = attended.filter((s) => !s.method).length
  return {
    attendedCount: attended.length,
    missingMethod,
  }
}

export function computeStatusColor(stats) {
  if (!stats || stats.attendedCount === 0) return 'none'
  if (stats.missingMethod > 0) return 'warn'
  return 'ok'
}

export function getAttendanceLabel(stats) {
  if (!stats || stats.attendedCount === 0) return 'Тренировок пока нет'
  if (stats.missingMethod > 0) return `Не указан способ оплаты (${stats.missingMethod})`
  return `${stats.attendedCount} тренировок`
}
