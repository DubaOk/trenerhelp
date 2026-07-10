export function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-text-secondary">{label}</span>}
      {children}
    </label>
  )
}

const inputClass =
  'h-12 w-full rounded-xl border border-mist bg-white px-4 text-base text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft'

export function Input({ label, className = '', ...props }) {
  return (
    <Field label={label}>
      <input className={`${inputClass} ${className}`} {...props} />
    </Field>
  )
}

export function TextArea({ label, className = '', rows = 3, ...props }) {
  return (
    <Field label={label}>
      <textarea rows={rows} className={`${inputClass} h-auto py-3 resize-none ${className}`} {...props} />
    </Field>
  )
}

export function Select({ label, children, className = '', ...props }) {
  return (
    <Field label={label}>
      <select className={`${inputClass} ${className}`} {...props}>
        {children}
      </select>
    </Field>
  )
}

export function DateField({ label, className = '', ...props }) {
  return (
    <Field label={label}>
      <input type="date" className={`${inputClass} ${className}`} {...props} />
    </Field>
  )
}

export function TimeField({ label, className = '', ...props }) {
  return (
    <Field label={label}>
      <input type="time" className={`${inputClass} ${className}`} {...props} />
    </Field>
  )
}
