import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import PageHeader from '../layout/PageHeader'
import Fab from '../layout/Fab'
import Button from '../ui/Button'
import { StatusDot } from '../ui/Badge'
import { CashIcon, CardIcon } from '../ui/icons'
import Picker from '../ui/Picker'
import PricingCard from './PricingCard'
import PaymentForm from './PaymentForm'
import PaymentsList from './PaymentsList'
import SubscriptionTypeForm from './SubscriptionTypeForm'
import { useClientsWithStatus } from '../../hooks/useClientDerived'
import { db } from '../../data/db'
import { sessionsLabel } from '../../utils/format'
import Money from '../ui/Money'

export default function FinancePage() {
  const payments = useLiveQuery(() => db.payments.toArray(), []) ?? []
  const clients = useLiveQuery(() => db.clients.toArray(), []) ?? []
  const types = useLiveQuery(() => db.subscriptionTypes.toArray(), []) ?? []
  const clientsWithStatus = useClientsWithStatus() ?? []

  const [paymentFormOpen, setPaymentFormOpen] = useState(false)
  const [typeForm, setTypeForm] = useState(null) // null | 'new' | type object
  const [typesOpen, setTypesOpen] = useState(false)
  const [clientFilter, setClientFilter] = useState('')
  const [methodFilter, setMethodFilter] = useState('')

  const clientsById = useMemo(() => Object.fromEntries(clients.map((c) => [c.id, c])), [clients])
  const typesById = useMemo(() => Object.fromEntries(types.map((t) => [t.id, t])), [types])

  const debtors = clientsWithStatus.filter((c) => c.isDebt)

  const filtered = useMemo(() => {
    return payments
      .filter((p) => (clientFilter ? p.clientId === clientFilter : true))
      .filter((p) => (methodFilter ? p.method === methodFilter : true))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [payments, clientFilter, methodFilter])

  return (
    <>
      <PageHeader title="Финансы" />
      <div className="flex flex-col gap-4 pb-24">
        {debtors.length > 0 && (
          <div className="mx-4 rounded-[16px_0_0_0] bg-status-danger-bg p-4">
            <p className="mb-2 text-sm font-semibold text-text-primary">Задолженность</p>
            <div className="flex flex-col gap-1.5">
              {debtors.map(({ client, label }) => (
                <Link key={client.id} to={`/clients/${client.id}`} className="flex items-center gap-2 py-0.5">
                  <StatusDot status="danger" />
                  <span className="text-sm font-medium text-text-primary">{client.name}</span>
                  <span className="ml-auto text-sm text-text-secondary">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <section className="px-4">
          <PricingCard />
        </section>

        <section className="px-4">
          <button
            onClick={() => setTypesOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3.5 active:bg-fog"
          >
            <span className="text-base font-semibold text-text-primary">Типы абонементов</span>
            <span className="text-sm text-text-secondary">{typesOpen ? 'Скрыть' : `${types.length} шт.`}</span>
          </button>
          {typesOpen && (
            <div className="mt-2 flex flex-col gap-2">
              {types.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTypeForm(t)}
                  className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-left active:bg-fog"
                >
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                    <p className="text-sm text-text-secondary">
                      {t.isUnlimited ? 'Безлимит на месяц' : sessionsLabel(t.sessionsCount)}
                    </p>
                  </div>
                  <span className="text-base font-bold text-text-primary"><Money amount={t.price} /></span>
                </button>
              ))}
              <Button variant="secondary" onClick={() => setTypeForm('new')}>
                Добавить тип абонемента
              </Button>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-2 px-5 text-base text-text-primary">Платежи</h2>
          <div className="mb-3 flex gap-2 px-4">
            <div className="min-w-0 flex-1">
              <Picker
                value={clientFilter}
                onChange={setClientFilter}
                placeholder="Все клиенты"
                sheetTitle="Фильтр по клиенту"
                options={[
                  { value: '', label: 'Все клиенты' },
                  ...clients.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                onClick={() => setMethodFilter(methodFilter === 'cash' ? '' : 'cash')}
                aria-label="Только наличные"
                className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
                  methodFilter === 'cash' ? 'border-method-cash bg-method-cash-bg text-method-cash' : 'border-mist bg-white text-text-secondary'
                }`}
              >
                <CashIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setMethodFilter(methodFilter === 'reception' ? '' : 'reception')}
                aria-label="Только ресепшн"
                className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
                  methodFilter === 'reception'
                    ? 'border-method-reception bg-method-reception-bg text-method-reception'
                    : 'border-mist bg-white text-text-secondary'
                }`}
              >
                <CardIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <PaymentsList payments={filtered} clientsById={clientsById} typesById={typesById} />
        </section>
      </div>

      <Fab onClick={() => setPaymentFormOpen(true)} />

      {paymentFormOpen && <PaymentForm open onClose={() => setPaymentFormOpen(false)} />}
      {typeForm === 'new' && <SubscriptionTypeForm open onClose={() => setTypeForm(null)} />}
      {typeForm && typeForm !== 'new' && <SubscriptionTypeForm open onClose={() => setTypeForm(null)} type={typeForm} />}
    </>
  )
}
