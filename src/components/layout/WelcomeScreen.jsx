import { useState } from 'react'
import Button from '../ui/Button'
import { seedDefaults, seedDemo } from '../../data/seed'

export default function WelcomeScreen({ onDone }) {
  const [busy, setBusy] = useState(false)

  async function start(withDemo) {
    setBusy(true)
    try {
      if (withDemo) {
        await seedDemo()
      } else {
        await seedDefaults()
      }
      localStorage.setItem('trenerhelp_onboarded', '1')
      onDone()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-lg flex-col items-center justify-center gap-6 bg-bg-base px-6 text-center">
      <img src={`${import.meta.env.BASE_URL}icons/icon.svg`} alt="" className="h-20 w-20 rounded-3xl" />
      <div>
        <h1 className="text-2xl  text-text-primary">TrenerHelp</h1>
        <p className="mt-2 text-base text-text-secondary">
          Клиенты, расписание, абонементы и оплаты — всё для персонального тренера в одном месте
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Button className="w-full" disabled={busy} onClick={() => start(false)}>
          Начать работу
        </Button>
        <Button variant="secondary" className="w-full" disabled={busy} onClick={() => start(true)}>
          Посмотреть с примерами
        </Button>
      </div>

      <p className="text-xs text-text-secondary">
        «С примерами» добавит трёх вымышленных клиентов, чтобы освоиться. Их можно удалить в любой момент.
      </p>
    </div>
  )
}
