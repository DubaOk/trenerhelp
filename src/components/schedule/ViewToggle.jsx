export default function ViewToggle({ value, onChange }) {
  return (
    <div className="mx-4 flex rounded-full bg-white p-1">
      {[
        { key: 'week', label: 'Неделя' },
        { key: 'month', label: 'Месяц' },
      ].map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`h-10 flex-1 rounded-full font-heading text-sm tracking-tight transition-colors ${
            value === opt.key ? 'bg-brand text-white' : 'text-text-secondary'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
