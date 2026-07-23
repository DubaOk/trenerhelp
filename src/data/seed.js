import { db } from './db'
import { genId } from '../utils/id'
import { addDays, today } from '../utils/date'

// Defaults every new user gets: an example workout program. No fake clients, no money.
export async function seedDefaults() {
  await db.transaction('rw', db.splits, async () => {
    if ((await db.splits.count()) > 0) return

    await db.splits.add({
      id: genId(),
      name: 'Классическая программа (3 дня)',
      days: [
        { name: 'Ноги + ягодицы', text: 'Присед 40кг 3х10\nВыпады 3х12\nРумынская тяга 30кг 3х12\nЯгодичный мост 40кг 3х15' },
        { name: 'Грудь + трицепс', text: 'Жим лёжа 25кг 3х12\nЖим гантелей на наклонной 2х8кг 3х12\nРазгибания на блоке 15кг 3х15' },
        { name: 'Спина + бицепс', text: 'Тяга верхнего блока 30кг 3х12\nТяга горизонтального блока 25кг 3х12\nСгибания с гантелями 2х6кг 3х12' },
      ],
    })
  })
}

export async function seedDemo() {
  await seedDefaults()
  await db.transaction('rw', db.clients, db.sessions, async () => {
    const count = await db.clients.count()
    if (count > 0) return

    const anna = {
      id: genId(),
      name: 'Анна Иванова',
      phone: '+375 29 111-22-33',
      startDate: addDays(today(), -60),
      notes: 'Фокус на осанку, аккуратно с коленом',
      measurements: [
        { id: genId(), date: addDays(today(), -55), weight: 68, waist: 74, hips: 98 },
        { id: genId(), date: addDays(today(), -30), weight: 66.5, waist: 72, hips: 96 },
        { id: genId(), date: addDays(today(), -5), weight: 65.8, waist: 71, hips: 95 },
      ],
    }

    const boris = {
      id: genId(),
      name: 'Борис Петров',
      phone: '+375 33 222-33-44',
      startDate: addDays(today(), -90),
      notes: '',
      measurements: [],
    }

    const ekaterina = {
      id: genId(),
      name: 'Екатерина Сидорова',
      phone: '+375 44 333-44-55',
      startDate: addDays(today(), -10),
      notes: 'Новая клиентка, без ограничений по здоровью',
      measurements: [{ id: genId(), date: addDays(today(), -8), weight: 72 }],
    }

    await db.clients.bulkAdd([anna, boris, ekaterina])

    const sessions = []

    // Anna: 5 attended (mix of cash/reception), one missed, one planned today, one planned tomorrow
    const annaWorkout = 'Присед 40кг 3х10\nЖим лёжа 25кг 3х12\nТяга верхнего блока 30кг 3х12'
    const annaPastDates = [-18, -15, -11, -8, -4, -2]
    annaPastDates.forEach((offset, i) => {
      sessions.push({
        id: genId(),
        clientId: anna.id,
        date: addDays(today(), offset),
        time: '10:00',
        status: i === 1 ? 'missed' : 'attended',
        method: i === 1 ? null : i % 2 === 0 ? 'cash' : 'reception',
        workout: i === 1 ? '' : annaWorkout,
      })
    })
    sessions.push({ id: genId(), clientId: anna.id, date: today(), time: '09:00', status: 'planned' })
    sessions.push({ id: genId(), clientId: anna.id, date: addDays(today(), 1), time: '09:00', status: 'planned' })

    // Boris: attended sessions, one still missing a payment method (demonstrates the reminder banner)
    const borisPastDates = [-14, -10, -6, -2]
    borisPastDates.forEach((offset, i) => {
      sessions.push({
        id: genId(),
        clientId: boris.id,
        date: addDays(today(), offset),
        time: '18:00',
        status: 'attended',
        method: i === borisPastDates.length - 1 ? null : 'reception',
      })
    })

    // Ekaterina: one attended (cash), today's session, a couple more this week
    sessions.push({ id: genId(), clientId: ekaterina.id, date: addDays(today(), -3), time: '11:00', status: 'attended', method: 'cash' })
    sessions.push({ id: genId(), clientId: ekaterina.id, date: today(), time: '17:00', status: 'planned' })
    sessions.push({ id: genId(), clientId: ekaterina.id, date: addDays(today(), 2), time: '11:00', status: 'planned' })
    sessions.push({ id: genId(), clientId: ekaterina.id, date: addDays(today(), 4), time: '11:00', status: 'planned' })

    await db.sessions.bulkAdd(sessions)
  })
}
