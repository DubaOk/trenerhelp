import { db } from './db'
import { genId } from '../utils/id'
import { addDays, today } from '../utils/date'

// Defaults every new user gets: pricing, subscription types + an example split. No fake clients.
export async function seedDefaults() {
  await db.transaction('rw', db.subscriptionTypes, db.splits, db.settings, async () => {
    if ((await db.subscriptionTypes.count()) > 0) return

    await db.settings.put({ id: 'pricing', singlePrice: 35, pairPrice: 30 })

    await db.splits.add({
      id: genId(),
      name: 'Классическая программа (3 дня)',
      days: [
        { name: 'Ноги + ягодицы', text: 'Присед 40кг 3х10\nВыпады 3х12\nРумынская тяга 30кг 3х12\nЯгодичный мост 40кг 3х15' },
        { name: 'Грудь + трицепс', text: 'Жим лёжа 25кг 3х12\nЖим гантелей на наклонной 2х8кг 3х12\nРазгибания на блоке 15кг 3х15' },
        { name: 'Спина + бицепс', text: 'Тяга верхнего блока 30кг 3х12\nТяга горизонтального блока 25кг 3х12\nСгибания с гантелями 2х6кг 3х12' },
      ],
    })

    await db.subscriptionTypes.bulkAdd([
      { id: genId(), name: 'Разовое', sessionsCount: 1, isUnlimited: false, price: 35 },
      { id: genId(), name: 'Разовое (в паре)', sessionsCount: 1, isUnlimited: false, price: 30 },
      { id: genId(), name: '10 занятий (акция 9+1)', sessionsCount: 10, isUnlimited: false, price: 315 },
    ])
  })
}

export async function seedDemo() {
  await seedDefaults()
  await db.transaction('rw', db.clients, db.subscriptionTypes, db.payments, db.sessions, async () => {
    const count = await db.clients.count()
    if (count > 0) return

    const subscriptionTypes = await db.subscriptionTypes.toArray()
    const single = subscriptionTypes.find((t) => t.name === 'Разовое')
    const promo = subscriptionTypes.find((t) => t.name === '10 занятий (акция 9+1)')

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

    await db.payments.bulkAdd([
      { id: genId(), clientId: anna.id, subscriptionTypeId: promo.id, amount: promo.price, priceApplied: promo.price, date: addDays(today(), -20), method: 'cash' },
      { id: genId(), clientId: boris.id, subscriptionTypeId: single.id, amount: single.price, priceApplied: single.price, date: addDays(today(), -15), method: 'reception' },
      // Ekaterina paid 50 for a single (35) — 15 stays on her balance
      { id: genId(), clientId: ekaterina.id, subscriptionTypeId: single.id, amount: 50, priceApplied: single.price, date: addDays(today(), -5), method: 'cash' },
    ])

    const sessions = []

    // Anna: 5 of 8 sessions attended, one missed, one planned today, one planned tomorrow
    const annaWorkout = 'Присед 40кг 3х10\nЖим лёжа 25кг 3х12\nТяга верхнего блока 30кг 3х12'
    const annaPastDates = [-18, -15, -11, -8, -4, -2]
    annaPastDates.forEach((offset, i) => {
      sessions.push({
        id: genId(),
        clientId: anna.id,
        date: addDays(today(), offset),
        time: '10:00',
        status: i === 1 ? 'missed' : 'attended',
        price: i === 1 ? null : 35,
        workout: i === 1 ? '' : annaWorkout,
      })
    })
    sessions.push({ id: genId(), clientId: anna.id, date: today(), time: '09:00', status: 'planned' })
    sessions.push({ id: genId(), clientId: anna.id, date: addDays(today(), 1), time: '09:00', status: 'planned' })

    // Boris: all 4 sessions attended, no future sessions (debt example)
    const borisPastDates = [-14, -10, -6, -2]
    borisPastDates.forEach((offset) => {
      sessions.push({ id: genId(), clientId: boris.id, date: addDays(today(), offset), time: '18:00', status: 'attended', price: 35 })
    })

    // Ekaterina: one attended, today's session, a couple more this week
    sessions.push({ id: genId(), clientId: ekaterina.id, date: addDays(today(), -3), time: '11:00', status: 'attended', price: 35 })
    sessions.push({ id: genId(), clientId: ekaterina.id, date: today(), time: '17:00', status: 'planned' })
    sessions.push({ id: genId(), clientId: ekaterina.id, date: addDays(today(), 2), time: '11:00', status: 'planned' })
    sessions.push({ id: genId(), clientId: ekaterina.id, date: addDays(today(), 4), time: '11:00', status: 'planned' })

    await db.sessions.bulkAdd(sessions)
  })
}
