import { useState } from 'react'
import BottomSheet from '../layout/BottomSheet'
import ConfirmDialog from '../layout/ConfirmDialog'
import { Input } from '../ui/fields'
import Button from '../ui/Button'
import { XIcon } from '../ui/icons'
import { db } from '../../data/db'
import { genId } from '../../utils/id'

const EMPTY_DAY = () => ({ name: '', text: '' })

export default function SplitForm({ open, onClose, split }) {
  const isEdit = Boolean(split)
  const [name, setName] = useState(split?.name ?? '')
  const [days, setDays] = useState(split?.days?.length ? split.days.map((d) => ({ ...d })) : [EMPTY_DAY(), EMPTY_DAY()])
  const [confirmOpen, setConfirmOpen] = useState(false)

  function updateDay(i, patch) {
    setDays((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)))
  }

  function removeDay(i) {
    setDays((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const cleanDays = days
      .map((d) => ({ name: d.name.trim(), text: d.text.trim() }))
      .filter((d) => d.name || d.text)
    if (!name.trim() || cleanDays.length === 0) return

    if (isEdit) {
      await db.splits.update(split.id, { name: name.trim(), days: cleanDays })
    } else {
      await db.splits.add({ id: genId(), name: name.trim(), days: cleanDays })
    }
    onClose()
  }

  async function handleDelete() {
    await db.splits.delete(split.id)
    setConfirmOpen(false)
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={isEdit ? 'Программа' : 'Новая программа'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Название программы" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например, Классическая 3 дня" required autoFocus={!isEdit} />

        {days.map((day, i) => (
          <div key={i} className="rounded-xl bg-bg-base p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="shrink-0 text-sm font-semibold text-brand">День {i + 1}</span>
              <input
                value={day.name}
                onChange={(e) => updateDay(i, { name: e.target.value })}
                placeholder="Например, Ноги + ягодицы"
                className="h-10 min-w-0 flex-1 rounded-lg border border-mist bg-white px-3 text-sm outline-none focus:border-brand"
              />
              {days.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDay(i)}
                  aria-label={`Удалить день ${i + 1}`}
                  className="flex h-10 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary active:bg-mist"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            <textarea
              value={day.text}
              onChange={(e) => updateDay(i, { text: e.target.value })}
              placeholder={'Присед 40кг 3х10\nВыпады 3х12'}
              rows={3}
              className="w-full resize-none rounded-lg border border-mist bg-white px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
        ))}

        <Button type="button" variant="secondary" onClick={() => setDays((prev) => [...prev, EMPTY_DAY()])}>
          Добавить день
        </Button>

        <Button type="submit" className="w-full">
          Сохранить программу
        </Button>
        {isEdit && (
          <Button type="button" variant="danger" className="w-full" onClick={() => setConfirmOpen(true)}>
            Удалить сплит
          </Button>
        )}
      </form>
      <ConfirmDialog
        open={confirmOpen}
        title={`Удалить программу «${split?.name}»?`}
        description="Уже записанные тренировки не изменятся."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </BottomSheet>
  )
}
