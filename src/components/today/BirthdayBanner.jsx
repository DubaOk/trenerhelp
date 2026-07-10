import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../data/db'
import { today, addDays } from '../../utils/date'
import { CakeIcon } from '../ui/icons'

function upcomingBirthday(birthday) {
  // birthday stored as YYYY-MM-DD; compare month-day within next 3 days
  if (!birthday) return null
  const mmdd = birthday.slice(5)
  for (let i = 0; i <= 3; i++) {
    const d = addDays(today(), i)
    if (d.slice(5) === mmdd) return i
  }
  return null
}

export default function BirthdayBanner() {
  const clients = useLiveQuery(() => db.clients.toArray(), []) ?? []
  const celebrating = clients
    .map((c) => ({ client: c, inDays: upcomingBirthday(c.birthday) }))
    .filter((x) => x.inDays !== null)
    .sort((a, b) => a.inDays - b.inDays)

  if (celebrating.length === 0) return null

  return (
    <div className="mx-4 rounded-[16px_0_0_0] bg-brand-soft p-4">
      <div className="flex flex-col gap-1.5">
        {celebrating.map(({ client, inDays }) => (
          <Link key={client.id} to={`/clients/${client.id}`} className="flex items-center gap-2 py-0.5">
            <CakeIcon className="h-5 w-5 shrink-0 text-brand" />
            <span className="text-sm font-medium text-text-primary">{client.name}</span>
            <span className="ml-auto text-sm text-text-secondary">
              {inDays === 0 ? 'день рождения сегодня! 🎉' : inDays === 1 ? 'завтра' : `через ${inDays} дн.`}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
