import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { XIcon } from '../ui/icons'
import { IconButton } from '../ui/Button'

export default function BottomSheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="anim-backdrop backdrop-lock fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="anim-sheet sheet-scroll max-h-[88svh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white px-5 pb-8 pt-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-mist" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg text-text-primary">{title}</h2>
          <IconButton onClick={onClose} aria-label="Закрыть">
            <XIcon className="h-5 w-5" />
          </IconButton>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}
