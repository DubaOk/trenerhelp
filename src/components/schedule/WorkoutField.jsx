import { TextArea } from '../ui/fields'
import Button from '../ui/Button'
import SplitSection from './SplitSection'
import { db } from '../../data/db'

export default function WorkoutField({ value, onChange, clientId, sessionId, onSplitPick }) {
  async function copyPrevious() {
    if (!clientId) return
    const previous = await db.sessions
      .where('clientId')
      .equals(clientId)
      .toArray()
    const withWorkout = previous
      .filter((s) => s.workout && s.id !== sessionId)
      .sort((a, b) => (a.date === b.date ? b.time.localeCompare(a.time) : b.date.localeCompare(a.date)))
    if (withWorkout.length > 0) onChange(withWorkout[0].workout)
  }

  return (
    <div className="flex flex-col gap-2">
      <TextArea
        label="Программа тренировки"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={'Например:\nПрисед 40кг 3х10\nЖим лёжа 25кг 3х12'}
        rows={4}
      />

      <div className="flex flex-wrap gap-2">
        {clientId && (
          <Button type="button" variant="secondary" className="h-10 px-3 text-sm" onClick={copyPrevious}>
            Как в прошлый раз
          </Button>
        )}
        <SplitSection
          clientId={clientId}
          sessionId={sessionId}
          onPickDay={(text, meta) => {
            onChange(text)
            onSplitPick?.(meta)
          }}
        />
      </div>
    </div>
  )
}
