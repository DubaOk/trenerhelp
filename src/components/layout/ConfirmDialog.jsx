import { createPortal } from 'react-dom'
import Button from '../ui/Button'

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Удалить', onConfirm, onCancel }) {
  if (!open) return null

  return createPortal(
    <div className="anim-backdrop backdrop-lock fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6" onClick={onCancel}>
      <div className="anim-dialog w-full max-w-sm rounded-3xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-lg font-semibold text-text-primary">{title}</p>
        {description && <p className="mt-1.5 text-sm text-text-secondary">{description}</p>}
        <div className="mt-5 flex gap-3">
          <Button variant="ghost" className="flex-1 bg-ash" onClick={onCancel}>
            Отмена
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
