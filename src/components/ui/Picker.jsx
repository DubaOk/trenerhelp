import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Field } from './fields'
import { CheckIcon, SearchIcon, XIcon } from './icons'
import { IconButton } from './Button'

/**
 * iPhone-friendly dropdown: a field-looking button that opens a bottom sheet
 * with large tap targets, a check on the selected option and search for long lists.
 * options: [{ value, label, sublabel? }]
 */
export default function Picker({
  label,
  value,
  onChange,
  options,
  placeholder = 'Выбрать',
  disabled = false,
  searchable,
  sheetTitle,
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selected = options.find((o) => o.value === value)
  const showSearch = searchable ?? options.length > 8

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.sublabel?.toLowerCase?.().includes(q)
    )
  }, [options, query])

  function pick(option) {
    onChange(option.value)
    setQuery('')
    setOpen(false)
  }

  return (
    <>
      <Field label={label}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className={`press flex h-12 w-full items-center justify-between rounded-xl border border-mist bg-white px-4 text-base ${
            disabled ? 'opacity-60' : ''
          } ${selected ? 'text-text-primary' : 'text-text-secondary'}`}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="ml-2 h-4 w-4 shrink-0 text-text-secondary">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </Field>

      {open &&
        createPortal(
          <div className="anim-backdrop backdrop-lock fixed inset-0 z-[60] flex items-end justify-center bg-black/40" onClick={() => setOpen(false)}>
            <div
              className="anim-sheet flex max-h-[80svh] w-full max-w-lg flex-col rounded-t-3xl bg-white pb-[calc(16px+env(safe-area-inset-bottom))] pt-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-3 h-1.5 w-10 shrink-0 rounded-full bg-mist" />
              <div className="mb-2 flex shrink-0 items-center justify-between px-5">
                <h2 className="text-lg text-text-primary">{sheetTitle ?? label ?? placeholder}</h2>
                <IconButton onClick={() => setOpen(false)} aria-label="Закрыть">
                  <XIcon className="h-5 w-5" />
                </IconButton>
              </div>

              {showSearch && (
                <div className="relative mb-2 shrink-0 px-5">
                  <SearchIcon className="pointer-events-none absolute left-8 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Поиск"
                    className="h-11 w-full rounded-full border border-mist bg-fog pl-11 pr-4 text-base outline-none focus:border-brand"
                  />
                </div>
              )}

              <div className="sheet-scroll min-h-0 flex-1 overflow-y-auto px-3">
                {filtered.length === 0 && (
                  <p className="px-4 py-6 text-center text-sm text-text-secondary">Ничего не найдено</p>
                )}
                {filtered.map((option) => {
                  const isSelected = option.value === value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => pick(option)}
                      className={`press flex min-h-13 w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left ${
                        isSelected ? 'bg-ivory' : 'active:bg-fog'
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-base font-medium text-text-primary">{option.label}</span>
                        {option.sublabel && (
                          <span className="block truncate text-sm text-text-secondary">{option.sublabel}</span>
                        )}
                      </span>
                      {isSelected && <CheckIcon className="h-5 w-5 shrink-0 text-brand" />}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
