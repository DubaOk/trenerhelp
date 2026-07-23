import { NavLink } from 'react-router-dom'
import { HomeIcon, UsersIcon, CalendarIcon, ChartIcon } from '../ui/icons'

const TABS = [
  { to: '/today', label: 'Сегодня', Icon: HomeIcon },
  { to: '/clients', label: 'Клиенты', Icon: UsersIcon },
  { to: '/schedule', label: 'Расписание', Icon: CalendarIcon },
  { to: '/statistics', label: 'Статистика', Icon: ChartIcon },
]

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-1">
      <div className="flex rounded-full border border-mist bg-white px-1 py-1.5">
        {TABS.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} className="flex flex-1 flex-col items-center gap-0.5 py-1">
            {({ isActive }) => (
              <>
                <div className={`flex h-8 w-12 items-center justify-center rounded-full ${isActive ? 'bg-ivory text-graphite' : 'text-slate'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`font-heading text-[11px] tracking-tight ${isActive ? 'text-graphite' : 'text-slate'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
