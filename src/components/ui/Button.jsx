const VARIANTS = {
  primary: 'bg-brand text-white active:bg-black',
  secondary: 'bg-transparent border border-brand text-brand active:bg-ash',
  danger: 'bg-status-danger-bg text-status-danger active:bg-status-danger/20',
  ghost: 'bg-transparent text-text-secondary active:bg-ash',
}

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`press flex h-12 min-h-11 items-center justify-center gap-2 rounded-full px-5 font-heading text-base font-normal tracking-tight ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function IconButton({ className = '', children, ...props }) {
  return (
    <button
      className={`press flex h-11 w-11 items-center justify-center rounded-full text-text-secondary active:bg-ash ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
