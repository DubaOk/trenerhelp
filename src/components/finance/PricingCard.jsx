import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import Button from '../ui/Button'
import { db } from '../../data/db'
import { getPricing, savePricing } from '../../data/pricing'

export default function PricingCard() {
  const pricing = useLiveQuery(async () => {
    await db.settings.get('pricing') // subscribe to changes
    return getPricing()
  }, [])
  const [editing, setEditing] = useState(false)
  const [single, setSingle] = useState('')
  const [pair, setPair] = useState('')
  const [saved, setSaved] = useState(false)

  function startEdit() {
    setSingle(String(pricing?.singlePrice ?? 35))
    setPair(String(pricing?.pairPrice ?? 30))
    setEditing(true)
    setSaved(false)
  }

  async function handleSave() {
    if (!single || !pair) return
    await savePricing({ singlePrice: Number(single), pairPrice: Number(pair) })
    setEditing(false)
    setSaved(true)
  }

  if (!pricing) return null

  return (
    <div className="rounded-2xl bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-text-primary">Цены тренировок</p>
        {!editing && (
          <button onClick={startEdit} className="press h-9 rounded-full px-3 text-sm font-medium text-brand active:bg-brand-soft">
            Изменить
          </button>
        )}
      </div>

      {!editing ? (
        <p className="mt-1 text-sm text-text-secondary">
          Персональная: <b className="text-text-primary">{pricing.singlePrice} Br</b> · Сплит (в паре):{' '}
          <b className="text-text-primary">{pricing.pairPrice} Br</b> с человека
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-text-secondary">Персональная, Br</span>
              <input
                value={single}
                onChange={(e) => setSingle(e.target.value)}
                type="number"
                inputMode="decimal"
                className="h-12 w-full rounded-xl border border-mist bg-white px-4 text-base outline-none focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-text-secondary">Сплит, Br</span>
              <input
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                type="number"
                inputMode="decimal"
                className="h-12 w-full rounded-xl border border-mist bg-white px-4 text-base outline-none focus:border-brand"
              />
            </label>
          </div>
          <p className="text-xs text-text-secondary">
            Новая цена действует только на будущие тренировки — уже проведённые остаются по старой цене.
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" className="h-10 flex-1 bg-ash text-sm" onClick={() => setEditing(false)}>
              Отмена
            </Button>
            <Button className="h-10 flex-1 text-sm" onClick={handleSave}>
              Сохранить
            </Button>
          </div>
        </div>
      )}

      {saved && !editing && <p className="mt-2 text-sm font-medium text-status-ok">Сохранено ✓</p>}
    </div>
  )
}
