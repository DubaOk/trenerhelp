import { useState } from 'react'
import Badge from '../ui/Badge'
import MethodTag from '../ui/MethodTag'
import { formatDateShort } from '../../utils/date'
import SessionForm from '../schedule/SessionForm'

const STATUS_LABEL = { planned: 'Запланировано', attended: 'Пришёл', missed: 'Не пришёл' }
const STATUS_COLOR = { planned: 'none', attended: 'ok', missed: 'danger' }

const PREVIEW_COUNT = 8

export default function SessionHistoryList({ sessions }) {
  const [editing, setEditing] = useState(null)
  const [showAll, setShowAll] = useState(false)

  if (sessions.length === 0) {
    return <p className="px-4 py-3 text-sm text-text-secondary">Тренировок пока нет</p>
  }

  const visible = showAll ? sessions : sessions.slice(0, PREVIEW_COUNT)

  return (
    <div className="flex flex-col gap-2 px-4">
      {visible.map((s) => (
        <button
          key={s.id}
          onClick={() => setEditing(s)}
          className="flex items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 text-left active:bg-fog"
        >
          <span className="min-w-0">
            <span className="block text-sm font-medium text-text-primary">
              {formatDateShort(s.date)} · {s.time}
            </span>
            {s.workout && <span className="block truncate text-xs text-text-secondary">{s.workout.split('\n')[0]}</span>}
          </span>
          {s.status === 'attended' && s.method ? (
            <MethodTag method={s.method} className="shrink-0" />
          ) : (
            <Badge status={STATUS_COLOR[s.status]} className="shrink-0">{STATUS_LABEL[s.status]}</Badge>
          )}
        </button>
      ))}
      {!showAll && sessions.length > PREVIEW_COUNT && (
        <button
          onClick={() => setShowAll(true)}
          className="h-11 rounded-xl text-sm font-semibold text-brand active:bg-brand-soft"
        >
          Показать все ({sessions.length})
        </button>
      )}
      {editing && <SessionForm open onClose={() => setEditing(null)} session={editing} />}
    </div>
  )
}
