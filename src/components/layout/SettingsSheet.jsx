import { useRef, useState } from 'react'
import { useObservable } from 'dexie-react-hooks'
import BottomSheet from './BottomSheet'
import Button from '../ui/Button'
import { exportBackup, importBackup } from '../../data/backup'
import { db, cloudEnabled } from '../../data/db'

const SYNC_LABEL = {
  'not-started': 'не запущена',
  connecting: 'подключение…',
  connected: 'подключено',
  disconnected: 'нет связи (офлайн)',
  error: 'ошибка',
  offline: 'офлайн',
}

export default function SettingsSheet({ open, onClose }) {
  const fileRef = useRef(null)
  const [message, setMessage] = useState('')
  const user = useObservable(db.cloud.currentUser)
  const syncState = useObservable(db.cloud.syncState)

  async function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const { clients, sessions } = await importBackup(file)
      setMessage(`Восстановлено: ${clients} клиентов, ${sessions} тренировок`)
    } catch (err) {
      setMessage(`Ошибка: ${err.message}`)
    }
    e.target.value = ''
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Данные и резервная копия">
      <div className="flex flex-col gap-3">
        {cloudEnabled && user?.isLoggedIn && (
          <div className="rounded-xl bg-brand-soft p-3">
            <p className="text-sm font-semibold text-text-primary">{user.email}</p>
            <p className="mt-0.5 text-xs text-text-secondary">
              Данные автоматически сохраняются в облако · синхронизация: {SYNC_LABEL[syncState?.phase] ?? syncState?.phase ?? '—'}
            </p>
            <Button variant="ghost" className="mt-2 h-10 w-full text-sm" onClick={() => db.cloud.logout()}>
              Выйти из аккаунта
            </Button>
          </div>
        )}
        <p className="text-sm text-text-secondary">
          {cloudEnabled
            ? 'Резервная копия в файл — запасной вариант: данные и так синхронизируются с облаком.'
            : 'Все данные хранятся только в этом браузере. Регулярно сохраняйте резервную копию, чтобы не потерять базу при чистке браузера или смене телефона.'}
        </p>
        <Button onClick={exportBackup} className="w-full">
          Скачать резервную копию
        </Button>
        <Button variant="secondary" className="w-full" onClick={() => fileRef.current?.click()}>
          Восстановить из файла
        </Button>
        <input ref={fileRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
        {message && <p className="rounded-xl bg-brand-soft px-3 py-2.5 text-sm text-text-primary">{message}</p>}
        <p className="text-xs text-text-secondary">
          Восстановление полностью заменяет текущие данные содержимым файла.
        </p>
      </div>
    </BottomSheet>
  )
}
