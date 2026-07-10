import { SearchIcon } from '../ui/icons'

export default function ClientSearchBar({ value, onChange }) {
  return (
    <div className="relative px-4">
      <SearchIcon className="pointer-events-none absolute left-7 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск клиента"
        className="h-12 w-full rounded-xl border border-mist bg-white pl-11 pr-4 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft"
      />
    </div>
  )
}
