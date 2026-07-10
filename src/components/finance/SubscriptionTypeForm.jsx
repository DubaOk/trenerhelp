import { useState } from 'react'
import BottomSheet from '../layout/BottomSheet'
import ConfirmDialog from '../layout/ConfirmDialog'
import { Input } from '../ui/fields'
import Button from '../ui/Button'
import { db } from '../../data/db'
import { genId } from '../../utils/id'

export default function SubscriptionTypeForm({ open, onClose, type }) {
  const isEdit = Boolean(type)
  const [name, setName] = useState(type?.name ?? '')
  const [price, setPrice] = useState(type?.price != null ? String(type.price) : '')
  const [isUnlimited, setIsUnlimited] = useState(type?.isUnlimited ?? false)
  const [sessionsCount, setSessionsCount] = useState(type?.sessionsCount != null ? String(type.sessionsCount) : '')
  const [confirmOpen, setConfirmOpen] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !price) return
    if (!isUnlimited && !sessionsCount) return

    const data = {
      name: name.trim(),
      price: Number(price),
      isUnlimited,
      sessionsCount: isUnlimited ? null : Number(sessionsCount),
    }

    if (isEdit) {
      await db.subscriptionTypes.update(type.id, data)
    } else {
      await db.subscriptionTypes.add({ id: genId(), ...data })
    }
    onClose()
  }

  async function handleDelete() {
    await db.subscriptionTypes.delete(type.id)
    setConfirmOpen(false)
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={isEdit ? 'Тип абонемента' : 'Новый тип абонемента'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Название" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например, 8 тренировок" required autoFocus={!isEdit} />
        <Input label="Цена, Br" value={price} onChange={(e) => setPrice(e.target.value)} type="number" inputMode="numeric" required />

        <label className="flex min-h-11 items-center gap-3">
          <input
            type="checkbox"
            checked={isUnlimited}
            onChange={(e) => setIsUnlimited(e.target.checked)}
            className="h-5 w-5 accent-brand"
          />
          <span className="text-base text-text-primary">Безлимит (на месяц)</span>
        </label>

        {!isUnlimited && (
          <Input
            label="Количество тренировок"
            value={sessionsCount}
            onChange={(e) => setSessionsCount(e.target.value)}
            type="number"
            inputMode="numeric"
            required
          />
        )}

        <Button type="submit" className="w-full">
          Сохранить
        </Button>
        {isEdit && (
          <Button type="button" variant="danger" className="w-full" onClick={() => setConfirmOpen(true)}>
            Удалить тип
          </Button>
        )}
      </form>
      <ConfirmDialog
        open={confirmOpen}
        title={`Удалить «${type?.name}»?`}
        description="Уже добавленные платежи с этим типом останутся."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </BottomSheet>
  )
}
