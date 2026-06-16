import { useState } from 'react'
import { useApp } from '../context/AppProvider'
import { CATEGORIES, QUICK_ACTIONS } from '../lib/carbon'
import { todayISO } from '../lib/format'
import type { Category } from '../types'

export function ActivityForm({ compact = false }: { compact?: boolean }) {
  const { addActivity } = useApp()
  const [category, setCategory] = useState<Category>('Транспорт')
  const [co2, setCo2] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(todayISO())
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const val = parseFloat(co2)
    if (isNaN(val)) return
    setBusy(true)
    await addActivity({ category, co2: Math.round(val * 10) / 10, note: note.trim(), date: date || todayISO() })
    setBusy(false)
    setCo2('')
    setNote('')
  }

  async function quick(label: string, cat: Category, value: number) {
    await addActivity({ category: cat, co2: value, note: label, date: todayISO() })
  }

  return (
    <div>
      {!compact && (
        <>
          <div className="muted" style={{ fontSize: '0.82rem', marginBottom: '0.6rem' }}>
            Швидке додавання
          </div>
          <div className="row wrap gap" style={{ marginBottom: '1.1rem' }}>
            {QUICK_ACTIONS.map((q) => (
              <button
                key={q.label}
                className="chip"
                onClick={() => quick(q.label, q.category, q.co2)}
                title={`${q.co2} кг CO₂`}
              >
                {q.icon} {q.label}
              </button>
            ))}
          </div>
        </>
      )}

      <form className="log-form" onSubmit={submit}>
        <div className="field">
          <label>Категорія</label>
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>CO₂ (кг)</label>
          <input className="input" type="number" step="0.1" placeholder="напр. 4.5" value={co2} onChange={(e) => setCo2(e.target.value)} />
        </div>
        <div className="field">
          <label>Нотатка</label>
          <input className="input" type="text" placeholder="необов'язково" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <div className="field">
          <label>Дата</label>
          <input className="input" type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? <span className="spinner" /> : 'Додати'}
        </button>
      </form>
    </div>
  )
}
