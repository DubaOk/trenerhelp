import DayColumn from './DayColumn'
import { getWeekDays } from '../../utils/date'

export default function WeekView({ anchorDate, sessions, clientsById, onSessionClick }) {
  const days = getWeekDays(anchorDate)

  return (
    <div className="flex flex-col gap-1">
      {days.map((date) => (
        <DayColumn
          key={date}
          date={date}
          sessions={sessions.filter((s) => s.date === date)}
          clientsById={clientsById}
          onSessionClick={onSessionClick}
        />
      ))}
    </div>
  )
}
