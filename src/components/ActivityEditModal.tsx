import { useEffect, useState } from 'react'
import { useApp } from '../context/AppProvider'
import { useLang } from '../context/LangProvider'
import { CATEGORIES, CATEGORY_META } from '../lib/carbon'
import { round1, todayISO } from '../lib/format'
import type { Activity, Category } from '../types'

export function ActivityEditModal({ activity, onClose }: { activity: Activity; onClose: () => void }) {
  const { updateActivity } = useApp()
  const { t, tr } = useLang()
  const [category, setCategory] = useState<Category>(activity.category)
  const [co2, setCo2] = useState(String(activity.co2))
  const [note, setNote] = useState(activity.note)
  const [date, setDate] = useState(activity.date)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const val = parseFloat(co2)
    if (isNaN(val)) return
    setBusy(true)
    await updateActivity(activity.id, { category, co2: round1(val), note: note.trim(), date: date || todayISO() })
    setBusy(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label={t('Закрити', 'Close')}>×</button>
        <div className="modal-head" style={{ paddingBottom: '0.3rem' }}>
          <h3 style={{ fontSize: '1.2rem' }}>✏️ {t('Редагувати запис', 'Edit entry')}</h3>
        </div>
        <form className="modal-body" onSubmit={save}>
          <div className="field">
            <label>{t('Категорія', 'Category')}</label>
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_META[c].icon} {tr(c)}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>{t('Викиди CO₂ (кг)', 'CO₂ emissions (kg)')}</label>
            <input className="input" type="number" step="0.1" value={co2} onChange={(e) => setCo2(e.target.value)} />
            <div className="field-hint">{t("Від'ємне значення = екодія (наприклад, сортування).", 'A negative value = eco-action (e.g. recycling).')}</div>
          </div>
          <div className="field">
            <label>{t('Нотатка', 'Note')}</label>
            <input className="input" type="text" placeholder={t("необов'язково", 'optional')} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <div className="field">
            <label>{t('Дата', 'Date')}</label>
            <input className="input" type="date" max={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="row gap" style={{ justifyContent: 'flex-end', marginTop: '0.4rem' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>{t('Скасувати', 'Cancel')}</button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? <span className="spinner" /> : t('Зберегти', 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
