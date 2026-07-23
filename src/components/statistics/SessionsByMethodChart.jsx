import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const CASH = '#E2571A'
const RECEPTION = '#7D5C00'

export default function SessionsByMethodChart({ buckets }) {
  const hasData = buckets.some((b) => b.cash > 0 || b.reception > 0)
  if (!hasData) {
    return <p className="px-4 py-4 text-sm text-text-secondary">Нет отмеченных тренировок за выбранный период</p>
  }

  return (
    <div>
      <div className="mb-2 flex gap-4 px-4">
        <span className="flex items-center gap-1.5 text-sm text-text-secondary">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: CASH }} />
          Наличные
        </span>
        <span className="flex items-center gap-1.5 text-sm text-text-secondary">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: RECEPTION }} />
          Ресепшн
        </span>
      </div>
      <div className="h-52 w-full px-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={buckets} margin={{ top: 8, right: 12, bottom: 0, left: -8 }} barCategoryGap="25%">
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#828282' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#828282' }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
            <Tooltip
              formatter={(value, name) => [`${value}`, name === 'cash' ? 'Наличные' : 'Ресепшн']}
              labelStyle={{ color: '#202020' }}
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            />
            <Bar dataKey="cash" stackId="sessions" fill={CASH} />
            <Bar dataKey="reception" stackId="sessions" fill={RECEPTION} radius={[4, 4, 0, 0]} stroke="#fff" strokeWidth={2} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
