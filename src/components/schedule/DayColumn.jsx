import Badge from '../ui/Badge'
import { formatWeekday, formatDateShort, isSameDay, today } from '../../utils/date'

const STATUS_LABEL = { planned: 'Запланировано', attended: 'Пришёл', missed: 'Не пришёл' }
const STATUS_COLOR = { planned: 'none', attended: 'ok', missed: 'danger' }

export default function DayColumn({ date, sessions, clientsById, onSessionClick }) {
  const isToday = isSameDay(date, today())
  const sorted = [...sessions].sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="px-4">
      <div className="mb-2 flex items-baseline gap-2">
        <span className={`text-sm font-semibold capitalize ${isToday ? 'text-brand' : 'text-text-primary'}`}>
          {formatWeekday(date)}
        </span>
        <span className="text-sm text-text-secondary">{formatDateShort(date)}</span>
      </div>
      {sorted.length === 0 ? (
        <p className="pb-3 text-sm text-text-secondary">Нет тренировок</p>
      ) : (
        <div className="mb-3 flex flex-col gap-2">
          {sorted.map((s) => (
            <button
              key={s.id}
              onClick={() => onSessionClick(s)}
              className="anim-card press flex items-center justify-between rounded-xl bg-white px-4 py-3 text-left active:bg-fog"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">
                  {clientsById[s.clientId]?.name ?? '—'}
                  {s.pairId && <span className="ml-1.5 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-graphite">сплит</span>}
                </p>
                <p className="truncate text-sm text-text-secondary">
                  {s.time}
                  {s.workout && ` · ${s.workout.split('\n')[0]}`}
                </p>
              </div>
              <Badge status={STATUS_COLOR[s.status]} className="shrink-0">{STATUS_LABEL[s.status]}</Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
