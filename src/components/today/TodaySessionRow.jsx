import Badge from '../ui/Badge'
import { CheckIcon, XIcon } from '../ui/icons'
import { setSessionStatus } from '../../data/pricing'

const STATUS_LABEL = { planned: 'Запланировано', attended: 'Пришёл', missed: 'Не пришёл' }
const STATUS_COLOR = { planned: 'none', attended: 'ok', missed: 'danger' }

export default function TodaySessionRow({ session, client, onOpen, index = 0 }) {
  async function setStatus(e, status) {
    e.stopPropagation()
    // second tap on the same status resets back to planned
    const next = session.status === status ? 'planned' : status
    await setSessionStatus(session, next)
  }

  return (
    <button
      onClick={() => onOpen(session)}
      className="anim-card press flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left active:bg-fog"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div className="w-14 shrink-0">
        <p className="text-base font-bold text-text-primary">{session.time}</p>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-text-primary">
          {client?.name ?? '—'}
          {session.pairId && <span className="ml-1.5 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-graphite">сплит</span>}
        </p>
        {session.workout ? (
          <p className="truncate text-sm text-text-secondary">{session.workout.split('\n')[0]}</p>
        ) : (
          <Badge status={STATUS_COLOR[session.status]} className="mt-0.5">{STATUS_LABEL[session.status]}</Badge>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        <span
          role="button"
          aria-label="Пришёл"
          onClick={(e) => setStatus(e, 'attended')}
          className={`press flex h-11 w-11 items-center justify-center rounded-full ${
            session.status === 'attended' ? 'bg-status-ok text-white' : 'bg-status-ok-bg text-status-ok'
          }`}
        >
          <CheckIcon className="h-5 w-5" />
        </span>
        <span
          role="button"
          aria-label="Не пришёл"
          onClick={(e) => setStatus(e, 'missed')}
          className={`press flex h-11 w-11 items-center justify-center rounded-full ${
            session.status === 'missed' ? 'bg-status-danger text-white' : 'bg-status-danger-bg text-status-danger'
          }`}
        >
          <XIcon className="h-5 w-5" />
        </span>
      </div>
    </button>
  )
}
