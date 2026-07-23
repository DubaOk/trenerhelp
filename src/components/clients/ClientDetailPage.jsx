import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../layout/PageHeader'
import ConfirmDialog from '../layout/ConfirmDialog'
import Badge from '../ui/Badge'
import Button, { IconButton } from '../ui/Button'
import { TrashIcon, PhoneIcon } from '../ui/icons'
import { useClientDerived } from '../../hooks/useClientDerived'
import { db } from '../../data/db'
import { formatDateShort } from '../../utils/date'
import ClientForm from './ClientForm'
import SessionHistoryList from './SessionHistoryList'
import MeasurementForm from './MeasurementForm'
import MeasurementChart from './MeasurementChart'
import SessionForm from '../schedule/SessionForm'
import ContactRow from './ContactRow'

export default function ClientDetailPage() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const data = useClientDerived(clientId)

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [sessionFormOpen, setSessionFormOpen] = useState(false)
  const [measurementFormOpen, setMeasurementFormOpen] = useState(false)
  const [notes, setNotes] = useState(null)
  const [notebook, setNotebook] = useState(null)

  if (!data) return null

  const { client, sessions, label } = data
  const currentNotes = notes ?? client.notes ?? ''
  const currentNotebook = notebook ?? client.notebook ?? ''

  async function handleDelete() {
    await db.transaction('rw', db.clients, db.sessions, async () => {
      await db.sessions.where('clientId').equals(client.id).delete()
      await db.clients.delete(client.id)
    })
    navigate('/clients', { replace: true })
  }

  async function handleNotesBlur() {
    if (notes !== null && notes !== client.notes) {
      await db.clients.update(client.id, { notes })
    }
  }

  async function handleNotebookBlur() {
    if (notebook !== null && notebook !== client.notebook) {
      await db.clients.update(client.id, { notebook })
    }
  }

  return (
    <>
      <PageHeader
        title={client.name}
        backTo="/clients"
        action={
          <IconButton onClick={() => setDeleteOpen(true)} aria-label="Удалить клиента">
            <TrashIcon className="h-5 w-5" />
          </IconButton>
        }
      />

      <div className="flex flex-col gap-5 px-4 pb-24">
        <div className="rounded-[16px_0_0_0] bg-ivory p-4">
          <div className="flex items-center justify-between">
            <div>
              {client.phone && (
                <p className="flex items-center gap-1.5 text-sm text-text-secondary">
                  <PhoneIcon className="h-4 w-4" /> {client.phone}
                </p>
              )}
              <p className="mt-0.5 text-sm text-text-secondary">С {formatDateShort(client.startDate)}</p>
            </div>
            <Badge status="none">{label}</Badge>
          </div>

          {client.phone && <ContactRow phone={client.phone} />}

          <Button variant="secondary" className="mt-3 w-full" onClick={() => setEditOpen(true)}>
            Редактировать данные
          </Button>
        </div>

        <section>
          <h2 className="mb-2 px-1 text-base text-text-primary">Информация о здоровье</h2>
          <textarea
            value={currentNotes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Травмы, ограничения, особенности здоровья"
            rows={3}
            className="w-full resize-none rounded-2xl bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-brand-soft"
          />
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-base text-text-primary">Тренировки</h2>
            <Button variant="ghost" className="h-9 px-3 text-sm text-brand" onClick={() => setSessionFormOpen(true)}>
              Добавить
            </Button>
          </div>
          <SessionHistoryList sessions={sessions} />
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-base text-text-primary">Прогресс</h2>
            <Button variant="ghost" className="h-9 px-3 text-sm text-brand" onClick={() => setMeasurementFormOpen(true)}>
              Добавить замер
            </Button>
          </div>
          <MeasurementChart measurements={client.measurements ?? []} />
        </section>

        <section>
          <h2 className="mb-2 px-1 text-base text-text-primary">Заметки</h2>
          <div className="rounded-[16px_0_0_0] bg-ivory p-1">
            <textarea
              value={currentNotebook}
              onChange={(e) => setNotebook(e.target.value)}
              onBlur={handleNotebookBlur}
              placeholder={'Рабочий блокнот по клиенту:\nупражнения, рабочие веса, что даётся тяжело,\nчто добавить в следующий раз…'}
              rows={8}
              className="w-full resize-none rounded-[14px_0_0_0] bg-ivory p-4 text-sm leading-6 text-text-primary outline-none placeholder:text-text-secondary/70"
            />
          </div>
          <p className="mt-1 px-1 text-xs text-text-secondary">Сохраняется автоматически</p>
        </section>
      </div>

      <ClientForm open={editOpen} onClose={() => setEditOpen(false)} client={client} />
      {sessionFormOpen && (
        <SessionForm open onClose={() => setSessionFormOpen(false)} defaultClientId={client.id} />
      )}
      {measurementFormOpen && (
        <MeasurementForm open onClose={() => setMeasurementFormOpen(false)} client={client} />
      )}
      <ConfirmDialog
        open={deleteOpen}
        title={`Удалить клиента ${client.name}?`}
        description="Все тренировки и замеры этого клиента будут удалены безвозвратно."
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  )
}
