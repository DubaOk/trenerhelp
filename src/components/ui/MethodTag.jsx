import { CashIcon, CardIcon } from './icons'

const CONFIG = {
  cash: { label: 'Наличные', bg: 'bg-method-cash-bg', text: 'text-method-cash', Icon: CashIcon },
  reception: { label: 'Ресепшн', bg: 'bg-method-reception-bg', text: 'text-method-reception', Icon: CardIcon },
}

export default function MethodTag({ method, className = '' }) {
  const cfg = CONFIG[method]
  if (!cfg) return null
  const { Icon } = cfg
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium ${cfg.bg} ${cfg.text} ${className}`}>
      <Icon className="h-4 w-4" />
      {cfg.label}
    </span>
  )
}
