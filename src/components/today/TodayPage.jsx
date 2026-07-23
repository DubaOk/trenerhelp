import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import PageHeader from '../layout/PageHeader'
import EmptyState from '../layout/EmptyState'
import Fab from '../layout/Fab'
import SettingsSheet from '../layout/SettingsSheet'
import { IconButton } from '../ui/Button'
import { HomeIcon, GearIcon } from '../ui/icons'
import BirthdayBanner from './BirthdayBanner'
import TodayStats from './TodayStats'
import TodaySessionRow from './TodaySessionRow'
import SessionForm from '../schedule/SessionForm'
import { useTodaySessions } from '../../hooks/useTodaySessions'
import { db } from '../../data/db'
import { today, formatDate, formatWeekday } from '../../utils/date'

export default function TodayPage() {
  const sessions = useTodaySessions()
  const clients = useLiveQuery(() => db.clients.toArray(), []) ?? []
  const clientsById = useMemo(() => Object.fromEntries(clients.map((c) => [c.id, c])), [clients])
  const [formState, setFormState] = useState(null) // null | 'new' | session object
  const [settingsOpen, setSettingsOpen] = useState(false)

  const dateLabel = `${formatWeekday(today())}, ${formatDate(today())}`

  return (
    <>
      <PageHeader
        title="Сегодня"
        action={
          <div className="flex items-center gap-1">
            <span className="text-sm capitalize text-text-secondary">{dateLabel}</span>
            <IconButton onClick={() => setSettingsOpen(true)} aria-label="Настройки">
              <GearIcon className="h-5 w-5" />
            </IconButton>
          </div>
        }
      />
      <div className="flex flex-col gap-3 pb-24">
        <TodayStats sessions={sessions} />
        <BirthdayBanner />

        {sessions && sessions.length === 0 ? (
          <EmptyState
            icon={<HomeIcon className="h-7 w-7" />}
            title="На сегодня тренировок нет"
            hint="Нажмите «+», чтобы добавить тренировку на сегодня"
          />
        ) : (
          <div className="flex flex-col gap-2 px-4">
            {sessions?.map((s, i) => (
              <TodaySessionRow key={s.id} session={s} client={clientsById[s.clientId]} onOpen={setFormState} index={i} />
            ))}
          </div>
        )}
      </div>

      <Fab onClick={() => setFormState('new')} />

      {formState === 'new' && <SessionForm open onClose={() => setFormState(null)} defaultDate={today()} />}
      {formState && formState !== 'new' && <SessionForm open onClose={() => setFormState(null)} session={formState} />}
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
