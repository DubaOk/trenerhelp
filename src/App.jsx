import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import WelcomeScreen from './components/layout/WelcomeScreen'
import TodayPage from './components/today/TodayPage'
import ClientsListPage from './components/clients/ClientsListPage'
import ClientDetailPage from './components/clients/ClientDetailPage'
import SchedulePage from './components/schedule/SchedulePage'
import StatisticsPage from './components/statistics/StatisticsPage'
import { db } from './data/db'

export default function App() {
  const [screen, setScreen] = useState('loading') // loading | welcome | app

  useEffect(() => {
    async function init() {
      if (localStorage.getItem('trenerhelp_onboarded')) {
        setScreen('app')
        return
      }
      // existing users (installed before onboarding was added) skip the welcome screen
      const hasData = (await db.clients.count()) > 0
      if (hasData) {
        localStorage.setItem('trenerhelp_onboarded', '1')
        setScreen('app')
      } else {
        setScreen('welcome')
      }
    }
    init()
  }, [])

  if (screen === 'loading') {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-bg-base">
        <img src={`${import.meta.env.BASE_URL}icons/icon.svg`} alt="" className="h-18 w-18 rounded-3xl" style={{ width: 72, height: 72 }} />
        <p className="text-sm text-text-secondary">Загрузка…</p>
      </div>
    )
  }
  if (screen === 'welcome') return <WelcomeScreen onDone={() => setScreen('app')} />

  return (
    <HashRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Navigate to="/today" replace />} />
          <Route path="today" element={<TodayPage />} />
          <Route path="clients" element={<ClientsListPage />} />
          <Route path="clients/:clientId" element={<ClientDetailPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="statistics" element={<StatisticsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
