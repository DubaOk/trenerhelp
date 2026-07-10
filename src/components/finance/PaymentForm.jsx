import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import BottomSheet from '../layout/BottomSheet'
import { Input, DateField } from '../ui/fields'
import Picker from '../ui/Picker'
import Button from '../ui/Button'
import { CashIcon, CardIcon } from '../ui/icons'
import { db } from '../../data/db'
import { genId } from '../../utils/id'
import { today } from '../../utils/date'
import { computeMoney } from '../../utils/subscription'
import { getPricing } from '../../data/pricing'

export default function PaymentForm({ open, onClose, defaultClientId }) {
  const clients = useLiveQuery(() => db.clients.orderBy('name').toArray(), [])
  const types = useLiveQuery(() => db.subscriptionTypes.toArray(), [])
  const [clientId, setClientId] = useState(defaultClientId ?? '')
  const [typeId, setTypeId] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(today())
  const [method, setMethod] = useState('cash')

  const balance = useLiveQuery(async () => {
    if (!clientId) return null
    const [payments, sessions, pricing] = await Promise.all([
      db.payments.where('clientId').equals(clientId).toArray(),
      db.sessions.where('clientId').equals(clientId).toArray(),
      getPricing(),
    ])
    return computeMoney(clientId, payments, sessions, pricing).balance
  }, [clientId]) ?? null

  const numericAmount = Number(amount) || 0
  const balanceAfter = (balance ?? 0) + numericAmount

  function handleClientChange(id) {
    setClientId(id)
  }

  function handleTypeChange(id) {
    setTypeId(id)
    const type = types?.find((t) => t.id === id)
    if (!type) return
    // if the client owes money, suggest covering the debt; otherwise the type price
    setAmount(String(balance !== null && balance < 0 ? -balance : type.price))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!clientId || !typeId || amount === '') return
    await db.payments.add({
      id: genId(),
      clientId,
      subscriptionTypeId: typeId,
      amount: numericAmount,
      date,
      method,
    })
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Новый платёж">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Picker
          label="Клиент"
          value={clientId}
          onChange={handleClientChange}
          disabled={Boolean(defaultClientId)}
          placeholder="Выберите клиента"
          options={(clients ?? []).map((c) => ({ value: c.id, label: c.name, sublabel: c.phone || undefined }))}
        />

        {balance !== null && balance !== 0 && (
          <p
            className={`rounded-xl px-3 py-2.5 text-sm text-text-primary ${
              balance < 0 ? 'bg-status-danger-bg' : 'bg-status-ok-bg'
            }`}
          >
            {balance < 0 ? `Долг клиента: ${-balance} Br` : `💰 Предоплата клиента: ${balance} Br`}
          </p>
        )}

        <Picker
          label="Абонемент"
          value={typeId}
          onChange={handleTypeChange}
          placeholder="Выберите тип"
          options={(types ?? []).map((t) => ({
            value: t.id,
            label: t.name,
            sublabel: `${t.price} Br${t.isUnlimited ? ' · безлимит' : ''}`,
          }))}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Сумма, Br" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" inputMode="decimal" step="0.01" required />
          <DateField label="Дата оплаты" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        {typeId && amount !== '' && (
          <p className="rounded-xl bg-brand-soft px-3 py-2.5 text-sm text-text-primary">
            Баланс после оплаты:{' '}
            <b>{balanceAfter > 0 ? `+${balanceAfter}` : balanceAfter} Br</b>
            {balanceAfter > 0 && ' (предоплата — спишется за следующие тренировки)'}
          </p>
        )}

        <div>
          <p className="mb-1.5 text-sm font-medium text-text-secondary">Способ оплаты</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMethod('cash')}
              className={`flex h-14 items-center justify-center gap-2 rounded-xl border-2 text-base font-semibold ${
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
              onClick={() => setMethod('reception')}
              className={`flex h-14 items-center justify-center gap-2 rounded-xl border-2 text-base font-semibold ${
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
          Добавить платёж
        </Button>
      </form>
    </BottomSheet>
  )
}
