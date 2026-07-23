import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import BottomSheet from '../layout/BottomSheet'
import ConfirmDialog from '../layout/ConfirmDialog'
import { DateField, TimeField } from '../ui/fields'
import Picker from '../ui/Picker'
import Button from '../ui/Button'
import { XIcon, CashIcon, CardIcon } from '../ui/icons'
import WorkoutField from './WorkoutField'
import { db } from '../../data/db'
import { genId } from '../../utils/id'
import { today, addDays, formatDateShort } from '../../utils/date'

export default function SessionForm({ open, onClose, session, defaultClientId, defaultDate }) {
  const isEdit = Boolean(session)
  const clients = useLiveQuery(() => db.clients.toArray(), [])
  const [clientId, setClientId] = useState(session?.clientId ?? defaultClientId ?? '')
  const [extraClientIds, setExtraClientIds] = useState([])
  const [date, setDate] = useState(session?.date ?? defaultDate ?? today())
  const [time, setTime] = useState(session?.time ?? '10:00')
  const [workout, setWorkout] = useState(session?.workout ?? '')
  const [splitMeta, setSplitMeta] = useState(session?.split ?? null)
  const [method, setMethod] = useState(session?.method ?? null)
  const [repeatWeeks, setRepeatWeeks] = useState('0')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const clientLocked = Boolean(defaultClientId) && !isEdit

  const conflict = useLiveQuery(async () => {
    if (!date || !time) return null
    const sameSlot = await db.sessions.where('date').equals(date).toArray()
    const other = sameSlot.find(
      (s) =>
        s.time === time &&
        s.id !== session?.id &&
        // participants of the same group session are not a conflict
        !(session?.pairId && s.pairId === session.pairId)
    )
    if (!other) return null
    const client = await db.clients.get(other.clientId)
    return client?.name ?? 'другой клиент'
  }, [date, time, session?.id, session?.pairId])

  function addParticipant() {
    setExtraClientIds((prev) => [...prev, ''])
  }

  function setParticipant(index, id) {
    setExtraClientIds((prev) => prev.map((v, i) => (i === index ? id : v)))
  }

  function removeParticipant(index) {
    setExtraClientIds((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!clientId) return

    if (isEdit) {
      await db.sessions.update(session.id, { clientId, date, time, workout, split: splitMeta, method })
    } else {
      const participants = [clientId, ...extraClientIds.filter((id) => id && id !== clientId)]
      const uniqueParticipants = [...new Set(participants)]
      const weeks = Number(repeatWeeks)
      const records = []
      for (let i = 0; i <= weeks; i++) {
        const pairId = uniqueParticipants.length > 1 ? genId() : null
        for (const participantId of uniqueParticipants) {
          records.push({
            id: genId(),
            clientId: participantId,
            date: addDays(date, i * 7),
            time,
            workout: i === 0 ? workout : '',
            split: i === 0 && participantId === clientId ? splitMeta : null,
            pairId,
            method,
            status: 'planned',
          })
        }
      }
      await db.sessions.bulkAdd(records)
    }
    onClose()
  }

  async function handleDelete() {
    await db.sessions.delete(session.id)
    setConfirmOpen(false)
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={isEdit ? 'Тренировка' : 'Новая тренировка'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Picker
          label="Клиент"
          value={clientId}
          onChange={setClientId}
          disabled={clientLocked}
          placeholder="Выберите клиента"
          options={(clients ?? []).map((c) => ({ value: c.id, label: c.name, sublabel: c.phone || undefined }))}
        />

        {!isEdit &&
          extraClientIds.map((extraId, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <Picker
                  label={`Участник ${i + 2}`}
                  value={extraId}
                  onChange={(id) => setParticipant(i, id)}
                  placeholder="Выберите клиента"
                  options={(clients ?? [])
                    .filter((c) => c.id !== clientId && !extraClientIds.some((id, j) => id === c.id && j !== i))
                    .map((c) => ({ value: c.id, label: c.name, sublabel: c.phone || undefined }))}
                />
              </div>
              <button
                type="button"
                onClick={() => removeParticipant(i)}
                aria-label={`Убрать участника ${i + 2}`}
                className="press flex h-12 w-11 shrink-0 items-center justify-center rounded-xl text-text-secondary active:bg-ash"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          ))}

        {!isEdit && clientId && extraClientIds.length < 3 && (
          <Button type="button" variant="ghost" className="h-10 justify-start px-1 text-sm text-brand" onClick={addParticipant}>
            + Сплит: добавить участника
          </Button>
        )}

        {isEdit && session?.pairId && (
          <p className="rounded-xl bg-brand-soft px-3 py-2.5 text-sm text-text-primary">
            Сплит-тренировка: участники отмечаются каждый отдельно
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <DateField label="Дата" value={date} onChange={(e) => setDate(e.target.value)} required />
          <TimeField label="Время" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>

        {conflict && (
          <p className="rounded-xl bg-status-warn-bg px-3 py-2.5 text-sm text-text-primary">
            ⚠️ На {formatDateShort(date)} в {time} уже записан(а) <b>{conflict}</b>
          </p>
        )}

        {!isEdit && (
          <Picker
            label="Повторять еженедельно"
            value={repeatWeeks}
            onChange={setRepeatWeeks}
            options={[
              { value: '0', label: 'Не повторять' },
              { value: '3', label: 'Ещё 3 недели', sublabel: 'всего 4 тренировки' },
              { value: '7', label: 'Ещё 7 недель', sublabel: 'всего 8 тренировок' },
              { value: '11', label: 'Ещё 11 недель', sublabel: 'всего 12 тренировок' },
            ]}
          />
        )}

        <WorkoutField
          value={workout}
          onChange={setWorkout}
          clientId={clientId}
          sessionId={session?.id}
          onSplitPick={setSplitMeta}
        />

        <div>
          <p className="mb-1.5 text-sm font-medium text-text-secondary">Способ оплаты</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMethod((m) => (m === 'cash' ? null : 'cash'))}
              className={`press flex h-14 items-center justify-center gap-2 rounded-xl border-2 text-base font-semibold ${
                method === 'cash'
                  ? 'border-method-cash bg-method-cash-bg text-method-cash'
                  : 'border-mist bg-white text-text-secondary'
              }`}
            >
              <CashIcon className="h-5 w-5" />
              Наличные
            </button>
            <button
              type="button"
              onClick={() => setMethod((m) => (m === 'reception' ? null : 'reception'))}
              className={`press flex h-14 items-center justify-center gap-2 rounded-xl border-2 text-base font-semibold ${
                method === 'reception'
                  ? 'border-method-reception bg-method-reception-bg text-method-reception'
                  : 'border-mist bg-white text-text-secondary'
              }`}
            >
              <CardIcon className="h-5 w-5" />
              Ресепшн
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Сохранить
        </Button>
        {isEdit && (
          <Button type="button" variant="danger" className="w-full" onClick={() => setConfirmOpen(true)}>
            Удалить тренировку
          </Button>
        )}
      </form>
      <ConfirmDialog
        open={confirmOpen}
        title="Удалить тренировку?"
        description="Это действие нельзя отменить."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </BottomSheet>
  )
}
