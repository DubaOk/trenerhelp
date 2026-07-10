// progress toward the gift session: every 10th attended is free
export default function SubscriptionProgress({ money }) {
  if (!money || money.attendedCount === 0) return null

  const pct = Math.round((money.sinceGift / 10) * 100)

  return (
    <div className="mt-3">
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/70">
        <div
          className="h-full rounded-full bg-status-ok transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-text-secondary">
        {money.nextIsGift
          ? '🎁 Следующая тренировка — в подарок!'
          : `Проведено ${money.sinceGift} из 9 · 10-я в подарок (осталось ${money.untilGift})`}
      </p>
    </div>
  )
}
