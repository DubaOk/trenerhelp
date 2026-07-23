import { useState } from 'react'
import PageHeader from '../layout/PageHeader'
import { CashIcon, CardIcon, TrendIcon, UsersIcon } from '../ui/icons'
import SessionsByMethodChart from './SessionsByMethodChart'
import { useDateRangeStats } from '../../hooks/useDateRangeStats'
import { today, addDays, startOfWeek, startOfMonth, endOfMonth } from '../../utils/date'
import { sessionsLabel } from '../../utils/format'

const PERIODS = [
  { key: 'week', label: 'Неделя' },
  { key: 'month', label: 'Месяц' },
  { key: 'custom', label: 'Период' },
]

export default function StatisticsPage() {
  const [period, setPeriod] = useState('month')
  const [customFrom, setCustomFrom] = useState(addDays(today(), -30))
  const [customTo, setCustomTo] = useState(today())

  const [from, to] =
    period === 'week'
      ? [startOfWeek(today()), addDays(startOfWeek(today()), 6)]
      : period === 'month'
        ? [startOfMonth(today()), endOfMonth(today())]
        : [customFrom, customTo]

  const stats = useDateRangeStats(from, to)

  return (
    <>
      <PageHeader title="Статистика" />
      <div className="flex flex-col gap-4 pb-8">
        <div className="mx-4 flex rounded-full bg-white p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`h-10 flex-1 rounded-full font-heading text-sm tracking-tight transition-colors ${
                period === p.key ? 'bg-brand text-white' : 'text-text-secondary'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {period === 'custom' && (
          <div className="grid grid-cols-2 gap-3 px-4">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="h-11 rounded-xl border border-mist bg-white px-3 text-sm outline-none"
            />
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="h-11 rounded-xl border border-mist bg-white px-3 text-sm outline-none"
            />
          </div>
        )}

        {stats && (
          <>
            <section className="px-4">
              <div className="rounded-[16px_0_0_0] bg-brand p-4 text-white">
                <p className="text-sm opacity-80">Проведено тренировок</p>
                <p className="mt-1 text-3xl font-bold">{stats.attendedCount}</p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-white p-4">
                  <div className="flex items-center gap-2 text-method-cash">
                    <CashIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Наличные</span>
                  </div>
                  <p className="mt-1 text-xl font-bold text-text-primary">{stats.cashCount}</p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <div className="flex items-center gap-2 text-method-reception">
                    <CardIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Ресепшн</span>
                  </div>
                  <p className="mt-1 text-xl font-bold text-text-primary">{stats.receptionCount}</p>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-2 px-4">
              <div className="rounded-2xl bg-white p-4">
                <div className="flex items-center gap-2 text-brand">
                  <TrendIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Пропущено</span>
                </div>
                <p className="mt-1 text-xl font-bold text-text-primary">{sessionsLabel(stats.missedCount)}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <div className="flex items-center gap-2 text-brand">
                  <UsersIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Новых клиентов</span>
                </div>
                <p className="mt-1 text-xl font-bold text-text-primary">{stats.newClientsCount}</p>
              </div>
            </section>

            <section>
              <h2 className="mb-2 px-5 text-base text-text-primary">Тренировки по неделям</h2>
              <div className="mx-4 rounded-2xl bg-white py-4">
                <SessionsByMethodChart buckets={stats.buckets} />
              </div>
            </section>
          </>
        )}
      </div>
    </>
  )
}
