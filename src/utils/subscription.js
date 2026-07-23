import { sessionsLabel } from './format'

// Attendance bookkeeping only. Payment method (cash/reception) is optional info
// recorded per session — never a required field, never a warning.

export function computeAttendance(clientId, sessions) {
  const attended = sessions.filter((s) => s.clientId === clientId && s.status === 'attended')
  return { attendedCount: attended.length }
}

export function getAttendanceLabel(stats) {
  if (!stats || stats.attendedCount === 0) return 'Тренировок пока нет'
  return sessionsLabel(stats.attendedCount)
}
