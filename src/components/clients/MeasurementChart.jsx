import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatDateShort } from '../../utils/date'

const METRICS = [
  { key: 'weight', label: 'Вес', unit: 'кг' },
  { key: 'waist', label: 'Талия', unit: 'см' },
  { key: 'hips', label: 'Бёдра', unit: 'см' },
  { key: 'chest', label: 'Грудь', unit: 'см' },
]

export default function MeasurementChart({ measurements }) {
  const available = METRICS.filter((m) => measurements.some((e) => typeof e[m.key] === 'number'))
  const [metricKey, setMetricKey] = useState(available[0]?.key ?? 'weight')
  const metric = METRICS.find((m) => m.key === metricKey) ?? METRICS[0]

  const data = [...measurements]
    .filter((e) => typeof e[metric.key] === 'number')
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .map((e) => ({ ...e, label: formatDateShort(e.date) }))

  if (available.length === 0) {
    return <p className="px-4 py-2 text-sm text-text-secondary">Добавьте первый замер, чтобы отслеживать прогресс</p>
  }

  const first = data[0]?.[metric.key]
  const last = data[data.length - 1]?.[metric.key]
  const delta = data.length >= 2 ? Math.round((last - first) * 10) / 10 : null

  return (
    <div>
      {available.length > 1 && (
        <div className="mb-2 flex flex-wrap gap-1.5 px-4">
          {available.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetricKey(m.key)}
              className={`h-9 rounded-full px-3.5 text-sm font-medium ${
                m.key === metric.key ? 'bg-brand text-white' : 'bg-white text-text-secondary'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {delta !== null && (
        <p className="mb-1 px-4 text-sm text-text-secondary">
          {metric.label}: {first} → {last} {metric.unit}{' '}
          <span className={delta <= 0 ? 'font-semibold text-status-ok' : 'font-semibold text-status-warn'}>
            ({delta > 0 ? '+' : ''}{delta} {metric.unit})
          </span>
        </p>
      )}

      {data.length < 2 ? (
        <p className="px-4 py-2 text-sm text-text-secondary">Добавьте ещё один замер, чтобы увидеть динамику</p>
      ) : (
        <div className="h-48 w-full px-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#828282' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#828282' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip formatter={(v) => [`${v} ${metric.unit}`, metric.label]} labelStyle={{ color: '#202020' }} />
              <Line type="monotone" dataKey={metric.key} stroke="#E2571A" strokeWidth={2.5} dot={{ r: 3, fill: '#E2571A' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
