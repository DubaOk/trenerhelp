import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function RootLayout() {
  const location = useLocation()

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-lg flex-col bg-bg-base">
      <div key={location.pathname} className="anim-page flex-1 overflow-y-auto pb-4">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
