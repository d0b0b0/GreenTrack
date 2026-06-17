import { useState } from 'react'
import { useApp } from '../context/AppProvider'
import { useConfirm } from '../context/ConfirmProvider'
import { useLang } from '../context/LangProvider'
import { CATEGORY_META } from '../lib/carbon'
import { fmtDate, round1 } from '../lib/format'
import { ActivityEditModal } from './ActivityEditModal'
import type { Activity } from '../types'

export function ActivityList({ items, emptyHint }: { items: Activity[]; emptyHint?: string }) {
  const { deleteActivity } = useApp()
  const { t, tr } = useLang()
  const confirm = useConfirm()
  const [editing, setEditing] = useState<Activity | null>(null)

  async function remove(e: Activity) {
    const ok = await confirm({
      title: t('Видалити запис?', 'Delete entry?'),
      message: `${CATEGORY_META[e.category].icon} ${tr(e.category)} · ${round1(e.co2)} ${t('кг', 'kg')} · ${fmtDate(e.date)}. ${t('Цю дію не можна скасувати.', 'This action cannot be undone.')}`,
      confirmText: t('Видалити', 'Delete'),
      cancelText: t('Скасувати', 'Cancel'),
      danger: true,
    })
    if (ok) await deleteActivity(e.id)
  }

  if (items.length === 0) {
    return (
      <div className="empty">
        <span className="emoji">🌱</span>
        {emptyHint ?? t('Поки що немає записів. Додайте свою першу активність вище.', 'No entries yet. Add your first activity above.')}
      </div>
    )
  }

  return (
    <>
      <div className="log-list">
        {items.map((e) => {
          const meta = CATEGORY_META[e.category]
          return (
            <div className="log-item" key={e.id}>
              <span className="log-dot" style={{ background: meta.color }} />
              <div>
                <div className="log-cat">{meta.icon} {tr(e.category)}</div>
                {e.note && <div className="log-note">{e.note}</div>}
              </div>
              <span className="log-co2" style={e.co2 < 0 ? { color: 'var(--green-light)' } : undefined}>
                {e.co2 < 0 ? '' : '+'}{round1(e.co2)} {t('кг', 'kg')}
              </span>
              <span className="log-date">{fmtDate(e.date)}</span>
              <div className="log-actions">
                <button className="log-edit" title={t('Редагувати', 'Edit')} onClick={() => setEditing(e)}>✏️</button>
                <button className="log-del" title={t('Видалити', 'Delete')} onClick={() => remove(e)}>×</button>
              </div>
            </div>
          )
        })}
      </div>
      {editing && <ActivityEditModal activity={editing} onClose={() => setEditing(null)} />}
    </>
  )
}
