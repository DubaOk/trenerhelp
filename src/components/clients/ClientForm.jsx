import { useState } from 'react'
import BottomSheet from '../layout/BottomSheet'
import { Input, TextArea, DateField } from '../ui/fields'
import Button from '../ui/Button'
import { db } from '../../data/db'
import { genId } from '../../utils/id'
import { today } from '../../utils/date'

export default function ClientForm({ open, onClose, client }) {
  const isEdit = Boolean(client)
  const [name, setName] = useState(client?.name ?? '')
  const [phone, setPhone] = useState(client?.phone || '+375 ')
  const [startDate, setStartDate] = useState(client?.startDate ?? today())
  const [birthday, setBirthday] = useState(client?.birthday ?? '')
  const [notes, setNotes] = useState(client?.notes ?? '')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return

    // an untouched "+375 " prefix means the phone was not entered
    const cleanPhone = phone.trim() === '+375' ? '' : phone.trim()

    if (isEdit) {
      await db.clients.update(client.id, { name: name.trim(), phone: cleanPhone, startDate, birthday, notes })
    } else {
      await db.clients.add({ id: genId(), name: name.trim(), phone: cleanPhone, startDate, birthday, notes, measurements: [] })
    }
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={isEdit ? 'Редактировать клиента' : 'Новый клиент'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Имя" value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя клиента" required autoFocus />
        <Input label="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+375 29 000-00-00" type="tel" />
        <div className="grid grid-cols-2 gap-3">
          <DateField label="Дата начала занятий" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <DateField label="День рождения" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
        </div>
        <TextArea label="Заметки (необязательно)" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Например, особенности здоровья" />
        <Button type="submit" className="mt-2 w-full">
          {isEdit ? 'Сохранить' : 'Добавить клиента'}
        </Button>
      </form>
    </BottomSheet>
  )
}
