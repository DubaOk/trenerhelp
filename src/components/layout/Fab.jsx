import { PlusIcon } from '../ui/icons'

export default function Fab({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      aria-label="Добавить"
      className={`anim-pop press fixed bottom-[calc(88px+env(safe-area-inset-bottom))] right-[max(0.75rem,calc(50vw-16rem+0.75rem))] z-30 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white active:bg-black ${className}`}
    >
      <PlusIcon className="h-6 w-6" />
    </button>
  )
}
