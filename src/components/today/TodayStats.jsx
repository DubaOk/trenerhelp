export default function TodayStats({ sessions }) {
  const total = sessions?.length ?? 0
  const attended = sessions?.filter((s) => s.status === 'attended').length ?? 0
  const noMethod = sessions?.filter((s) => s.status === 'attended' && !s.method).length ?? 0

  return (
    <div className="grid grid-cols-3 gap-2 px-4">
      <div className="anim-card rounded-2xl bg-white p-3">
        <p className="text-xl font-bold text-text-primary">{total}</p>
        <p className="text-xs text-text-secondary">Сегодня</p>
      </div>
      <div className="anim-card rounded-2xl bg-white p-3" style={{ animationDelay: '60ms' }}>
        <p className="text-xl font-bold text-status-ok">{attended}</p>
        <p className="text-xs text-text-secondary">Пришло</p>
      </div>
      <div className="anim-card rounded-2xl bg-white p-3" style={{ animationDelay: '120ms' }}>
        <p className={`text-xl font-bold ${noMethod > 0 ? 'text-status-warn' : 'text-text-primary'}`}>{noMethod}</p>
        <p className="text-xs text-text-secondary">Без отметки</p>
      </div>
    </div>
  )
}
