import { useState } from 'react'
import { getMonthGrid, startOfMonth, isSameDay, today, parseISODate } from '../../utils/date'
import DayColumn from './DayColumn'

export default function MonthView({ anchorDate, sessions, clientsById, onSessionClick }) {
  const [selectedDate, setSelectedDate] = useState(today())
  const days = getMonthGrid(anchorDate)
  const monthIndex = parseISODate(startOfMonth(anchorDate)).getMonth()
  const countByDate = sessions.reduce((acc, s) => {
    acc[s.date] = (acc[s.date] ?? 0) + 1
    return acc
  }, {})

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 px-4">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
          <div key={d} className="pb-1 text-center text-xs font-medium text-text-secondary">
            {d}
          </div>
        ))}
        {days.map((date) => {
          const inMonth = parseISODate(date).getMonth() === monthIndex
          const isToday = isSameDay(date, today())
          const isSelected = isSameDay(date, selectedDate)
          const count = countByDate[date] ?? 0
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex aspect-square flex-col items-center justify-center rounded-xl text-sm ${
                isSelected ? 'bg-brand text-white' : isToday ? 'bg-brand-soft text-brand' : inMonth ? 'text-text-primary' : 'text-gray-300'
              }`}
            >
              <span className="font-medium">{parseISODate(date).getDate()}</span>
              {count > 0 && <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-brand'}`} />}
            </button>
          )
        })}
      </div>

      <div className="mt-4">
        <DayColumn
          date={selectedDate}
          sessions={sessions.filter((s) => s.date === selectedDate)}
          clientsById={clientsById}
          onSessionClick={onSessionClick}
        />
      </div>
    </div>
  )
}
