import { Link } from 'react-router-dom'
import { ChevronLeftIcon } from '../ui/icons'

export default function PageHeader({ title, backTo, action }) {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-2 bg-bg-base/95 px-4 pb-3 pt-[calc(14px+env(safe-area-inset-top))] backdrop-blur">
      {backTo && (
        <Link to={backTo} className="flex h-11 w-11 items-center justify-center rounded-full active:bg-mist/60">
          <ChevronLeftIcon className="h-6 w-6 text-text-primary" />
        </Link>
      )}
      <h1 className="flex-1 truncate text-2xl text-text-primary">{title}</h1>
      {action}
    </div>
  )
}
