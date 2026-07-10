const STYLES = {
  ok: 'bg-status-ok-bg text-status-ok',
  warn: 'bg-status-warn-bg text-status-warn',
  danger: 'bg-status-danger-bg text-status-danger',
  none: 'bg-ash text-text-secondary',
}

export default function Badge({ status = 'none', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium ${STYLES[status]} ${className}`}
    >
      {children}
    </span>
  )
}

export function StatusDot({ status = 'none', className = '' }) {
  const dot = {
    ok: 'bg-status-ok',
    warn: 'bg-status-warn',
    danger: 'bg-status-danger',
    none: 'bg-gray-300',
  }[status]
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${dot} ${className}`} />
}
