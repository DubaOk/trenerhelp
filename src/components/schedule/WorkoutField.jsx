import { TextArea } from '../ui/fields'
import SplitSection from './SplitSection'

export default function WorkoutField({ value, onChange, clientId, sessionId, onSplitPick }) {
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
