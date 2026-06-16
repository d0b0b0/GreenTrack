import { useApp } from '../context/AppProvider'
import { CATEGORY_META } from '../lib/carbon'
import { fmtDate, round1 } from '../lib/format'
import type { Activity } from '../types'

export function ActivityList({ items, emptyHint }: { items: Activity[]; emptyHint?: string }) {
  const { deleteActivity } = useApp()

  if (items.length === 0) {
    return (
      <div className="empty">
        <span className="emoji">🌱</span>
        {emptyHint ?? 'Поки що немає записів. Додайте свою першу активність вище.'}
      </div>
    )
  }

  return (
    <div className="log-list">
      {items.map((e) => {
        const meta = CATEGORY_META[e.category]
        return (
          <div className="log-item" key={e.id}>
            <span className="log-dot" style={{ background: meta.color }} />
            <div>
              <div className="log-cat">
                {meta.icon} {e.category}
              </div>
              {e.note && <div className="log-note">{e.note}</div>}
            </div>
            <span className={`log-co2 ${e.co2 < 0 ? 'muted' : ''}`} style={e.co2 < 0 ? { color: 'var(--green-light)' } : undefined}>
              {e.co2 < 0 ? '' : '+'}
              {round1(e.co2)} кг
            </span>
            <span className="log-date">{fmtDate(e.date)}</span>
            <button className="log-del" title="Видалити" onClick={() => deleteActivity(e.id)}>
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
