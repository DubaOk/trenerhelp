import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import PageHeader from '../layout/PageHeader'
import Fab from '../layout/Fab'
import { IconButton } from '../ui/Button'
import { ChevronLeftIcon, ChevronRightIcon } from '../ui/icons'
import ViewToggle from './ViewToggle'
import WeekView from './WeekView'
import MonthView from './MonthView'
import SessionForm from './SessionForm'
import { db } from '../../data/db'
import { addDays, today, formatDate, parseISODate } from '../../utils/date'

export default function SchedulePage() {
  const [mode, setMode] = useState('week')
  const [anchorDate, setAnchorDate] = useState(today())
  const [formState, setFormState] = useState(null) // null | 'new' | session object

  const sessions = useLiveQuery(() => db.sessions.toArray(), []) ?? []
  const clients = useLiveQuery(() => db.clients.toArray(), []) ?? []
  const clientsById = useMemo(() => Object.fromEntries(clients.map((c) => [c.id, c])), [clients])

  function goPrev() {
    setAnchorDate((d) => (mode === 'week' ? addDays(d, -7) : shiftMonth(d, -1)))
  }
  function goNext() {
    setAnchorDate((d) => (mode === 'week' ? addDays(d, 7) : shiftMonth(d, 1)))
  }

  const label = mode === 'week' ? formatDate(anchorDate, { month: 'long', year: 'numeric' }) : formatDate(anchorDate, { month: 'long', year: 'numeric' })

  return (
    <>
      <PageHeader title="Расписание" />
      <div className="flex flex-col gap-3 pb-24">
        <ViewToggle value={mode} onChange={setMode} />

        <div className="flex items-center justify-between px-4">
          <IconButton onClick={goPrev} aria-label="Назад">
            <ChevronLeftIcon className="h-5 w-5" />
          </IconButton>
          <span className="text-sm font-semibold capitalize text-text-primary">{label}</span>
          <IconButton onClick={goNext} aria-label="Вперёд">
            <ChevronRightIcon className="h-5 w-5" />
          </IconButton>
        </div>

        {mode === 'week' ? (
          <WeekView anchorDate={anchorDate} sessions={sessions} clientsById={clientsById} onSessionClick={setFormState} />
        ) : (
          <MonthView anchorDate={anchorDate} sessions={sessions} clientsById={clientsById} onSessionClick={setFormState} />
        )}
      </div>

      <Fab onClick={() => setFormState('new')} />

      {formState === 'new' && <SessionForm open onClose={() => setFormState(null)} defaultDate={anchorDate} />}
      {formState && formState !== 'new' && (
        <SessionForm open onClose={() => setFormState(null)} session={formState} />
      )}
    </>
  )
}

function shiftMonth(isoDate, delta) {
  const d = parseISODate(isoDate)
  const next = new Date(d.getFullYear(), d.getMonth() + delta, 1)
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-01`
}
