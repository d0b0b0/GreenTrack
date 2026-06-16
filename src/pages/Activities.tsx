import { useMemo, useState } from 'react'
import { useApp } from '../context/AppProvider'
import { ActivityForm } from '../components/ActivityForm'
import { ActivityList } from '../components/ActivityList'
import { CATEGORIES } from '../lib/carbon'
import { fmtKg, round1 } from '../lib/format'
import { monthlyTotal, totalCo2 } from '../lib/carbon'
import type { Category } from '../types'

type Filter = Category | 'Всі'

export default function Activities() {
  const { activities } = useApp()
  const [filter, setFilter] = useState<Filter>('Всі')
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      if (filter !== 'Всі' && a.category !== filter) return false
      if (q && !(`${a.category} ${a.note}`.toLowerCase().includes(q.toLowerCase()))) return false
      return true
    })
  }, [activities, filter, q])

  const exportCsv = () => {
    const rows = [['date', 'category', 'co2_kg', 'note'], ...activities.map((a) => [a.date, a.category, String(a.co2), a.note])]
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'greentrack-activities.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="row between wrap" style={{ marginBottom: '1.2rem', gap: '0.8rem' }}>
        <div>
          <h1 className="greeting">Активності</h1>
          <p className="page-sub">Усі ваші записи в одному місці. Усього {activities.length} · цей місяць {fmtKg(monthlyTotal(activities))}.</p>
        </div>
        <button className="btn btn-ghost sm" onClick={exportCsv} disabled={!activities.length}>
          ⬇️ Експорт CSV
        </button>
      </div>

      <div className="dash-grid">
        <div className="card col-12">
          <div className="card-title">Додати активність</div>
          <ActivityForm />
        </div>

        <div className="card col-4 kpi">
          <span className="kpi-ico">📋</span>
          <div className="stat-label">Усього записів</div>
          <div className="stat-value">{activities.length}</div>
        </div>
        <div className="card col-4 kpi">
          <span className="kpi-ico">🌍</span>
          <div className="stat-label">Сумарно CO₂</div>
          <div className="stat-value">{round1(totalCo2(activities))} <span style={{ fontSize: '1rem' }}>кг</span></div>
        </div>
        <div className="card col-4 kpi">
          <span className="kpi-ico">📅</span>
          <div className="stat-label">Цього місяця</div>
          <div className="stat-value">{round1(monthlyTotal(activities))} <span style={{ fontSize: '1rem' }}>кг</span></div>
        </div>

        <div className="card col-12">
          <div className="row between wrap" style={{ gap: '0.8rem', marginBottom: '1rem' }}>
            <div className="row wrap gap">
              {(['Всі', ...CATEGORIES] as Filter[]).map((c) => (
                <button key={c} className={`chip ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
                  {c}
                </button>
              ))}
            </div>
            <input
              className="input"
              style={{ maxWidth: 220 }}
              placeholder="🔍 Пошук за нотаткою…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <ActivityList items={filtered} emptyHint={activities.length ? 'Нічого не знайдено за фільтром.' : undefined} />
        </div>
      </div>
    </>
  )
}
