import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import Button from '../ui/Button'
import SplitForm from './SplitForm'
import { db } from '../../data/db'

export default function SplitSection({ clientId, sessionId, onPickDay }) {
  const [open, setOpen] = useState(false)
  const [editingSplit, setEditingSplit] = useState(null) // null | 'new' | split object
  const splits = useLiveQuery(() => db.splits.orderBy('name').toArray(), []) ?? []

  // last split day used by this client → suggest the next one
  const lastUsed = useLiveQuery(async () => {
    if (!clientId) return null
    const sessions = await db.sessions.where('clientId').equals(clientId).toArray()
    const withSplit = sessions
      .filter((s) => s.split && s.id !== sessionId)
      .sort((a, b) => (a.date === b.date ? b.time.localeCompare(a.time) : b.date.localeCompare(a.date)))
    return withSplit[0]?.split ?? null
  }, [clientId, sessionId])

  function suggestedIndex(split) {
    if (!lastUsed || lastUsed.splitId !== split.id) return null
    return (lastUsed.dayIndex + 1) % split.days.length
  }

  function pickDay(split, dayIndex) {
    const day = split.days[dayIndex]
    const header = day.name ? `${day.name}\n` : ''
    onPickDay(`${header}${day.text}`, { splitId: split.id, dayIndex })
    setOpen(false)
  }

  return (
    <>
      <Button type="button" variant="secondary" className="h-10 px-3 text-sm" onClick={() => setOpen((v) => !v)}>
        Программы{splits.length > 0 ? ` (${splits.length})` : ''}
      </Button>

      {open && (
        <div className="flex w-full flex-col gap-2 rounded-xl bg-bg-base p-2">
          {splits.length === 0 && (
            <p className="px-2 py-2 text-sm text-text-secondary">
              Программ пока нет. Создайте план по дням — и приложение само подскажет, какой день следующий
            </p>
          )}
          {splits.map((split) => {
            const nextIdx = suggestedIndex(split)
            return (
              <div key={split.id} className="rounded-lg bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-primary">{split.name}</p>
                  <button
                    type="button"
                    onClick={() => setEditingSplit(split)}
                    className="h-8 rounded-lg px-2 text-xs font-medium text-brand active:bg-brand-soft"
                  >
                    Изменить
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {split.days.map((day, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => pickDay(split, i)}
                      className={`h-10 rounded-full px-3 text-sm font-medium ${
                        i === nextIdx
                          ? 'bg-brand text-white'
                          : 'bg-bg-base text-text-primary active:bg-mist'
                      }`}
                    >
                      {i === nextIdx && '→ '}
                      {day.name || `День ${i + 1}`}
                    </button>
                  ))}
                </div>
                {nextIdx !== null && (
                  <p className="mt-1.5 text-xs text-text-secondary">
                    В прошлый раз был «{split.days[lastUsed.dayIndex]?.name || `День ${lastUsed.dayIndex + 1}`}» — следующий выделен
                  </p>
                )}
              </div>
            )
          })}
          <Button type="button" variant="ghost" className="h-10 text-sm text-brand" onClick={() => setEditingSplit('new')}>
            Создать программу
          </Button>
        </div>
      )}

      {editingSplit === 'new' && <SplitForm open onClose={() => setEditingSplit(null)} />}
      {editingSplit && editingSplit !== 'new' && (
        <SplitForm open onClose={() => setEditingSplit(null)} split={editingSplit} />
      )}
    </>
  )
}
