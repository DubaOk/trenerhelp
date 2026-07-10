import { useState } from 'react'
import BottomSheet from '../layout/BottomSheet'
import { Input, DateField } from '../ui/fields'
import Button from '../ui/Button'
import { db } from '../../data/db'
import { genId } from '../../utils/id'
import { today } from '../../utils/date'

export default function MeasurementForm({ open, onClose, client }) {
  const [date, setDate] = useState(today())
  const [weight, setWeight] = useState('')
  const [waist, setWaist] = useState('')
  const [hips, setHips] = useState('')
  const [chest, setChest] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const entry = { id: genId(), date }
    if (weight) entry.weight = Number(weight)
    if (waist) entry.waist = Number(waist)
    if (hips) entry.hips = Number(hips)
    if (chest) entry.chest = Number(chest)

    const measurements = [...(client.measurements ?? []), entry]
    await db.clients.update(client.id, { measurements })
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Новый замер">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <DateField label="Дата" value={date} onChange={(e) => setDate(e.target.value)} required />
        <Input label="Вес, кг" value={weight} onChange={(e) => setWeight(e.target.value)} type="number" inputMode="decimal" step="0.1" />
        <div className="grid grid-cols-3 gap-3">
          <Input label="Талия, см" value={waist} onChange={(e) => setWaist(e.target.value)} type="number" inputMode="decimal" />
          <Input label="Бёдра, см" value={hips} onChange={(e) => setHips(e.target.value)} type="number" inputMode="decimal" />
          <Input label="Грудь, см" value={chest} onChange={(e) => setChest(e.target.value)} type="number" inputMode="decimal" />
        </div>
        <Button type="submit" className="w-full">
          Сохранить замер
        </Button>
      </form>
    </BottomSheet>
  )
}
