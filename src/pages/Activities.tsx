import { useMemo, useState } from 'react'
import { useApp } from '../context/AppProvider'
import { useLang } from '../context/LangProvider'
import { ActivityForm } from '../components/ActivityForm'
import { ActivityList } from '../components/ActivityList'
import { CATEGORIES } from '../lib/carbon'
import { fmtKg, round1 } from '../lib/format'
import { monthlyTotal, totalCo2 } from '../lib/carbon'
import type { Category } from '../types'

type Filter = Category | 'Всі'

export default function Activities() {
  const { activities } = useApp()
  const { t, tr } = useLang()
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
    <div className="route-fade">
      <div className="row between wrap" style={{ marginBottom: '1.2rem', gap: '0.8rem' }}>
        <div>
          <h1 className="greeting">{t('Активності', 'Activities')}</h1>
          <p className="page-sub">{t('Усі ваші записи в одному місці.', 'All your entries in one place.')} {t('Усього', 'Total')} {activities.length} · {t('цей місяць', 'this month')} {fmtKg(monthlyTotal(activities))}.</p>
        </div>
        <button className="btn btn-ghost sm" onClick={exportCsv} disabled={!activities.length}>
          ⬇️ {t('Експорт CSV', 'Export CSV')}
        </button>
      </div>

      <div className="dash-grid stagger">
        <div className="card col-12">
          <div className="card-title">{t('Додати активність', 'Add an activity')}</div>
          <ActivityForm />
        </div>

        <div className="card col-4 kpi">
          <span className="kpi-ico">📋</span>
          <div className="stat-label">{t('Усього записів', 'Total entries')}</div>
          <div className="stat-value">{activities.length}</div>
        </div>
        <div className="card col-4 kpi">
          <span className="kpi-ico">🌍</span>
          <div className="stat-label">{t('Сумарно CO₂', 'Total CO₂')}</div>
          <div className="stat-value">{round1(totalCo2(activities))} <span style={{ fontSize: '1rem' }}>{t('кг', 'kg')}</span></div>
        </div>
        <div className="card col-4 kpi">
          <span className="kpi-ico">📅</span>
          <div className="stat-label">{t('Цього місяця', 'This month')}</div>
          <div className="stat-value">{round1(monthlyTotal(activities))} <span style={{ fontSize: '1rem' }}>{t('кг', 'kg')}</span></div>
        </div>

        <div className="card col-12">
          <div className="row between wrap" style={{ gap: '0.8rem', marginBottom: '1rem' }}>
            <div className="row wrap gap">
              {(['Всі', ...CATEGORIES] as Filter[]).map((c) => (
                <button key={c} className={`chip ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
                  {c === 'Всі' ? t('Всі', 'All') : tr(c)}
                </button>
              ))}
            </div>
            <input
              className="input"
              style={{ maxWidth: 220 }}
              placeholder={t('🔍 Пошук за нотаткою…', '🔍 Search by note…')}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <ActivityList items={filtered} emptyHint={activities.length ? t('Нічого не знайдено за фільтром.', 'Nothing found for this filter.') : undefined} />
        </div>
      </div>
    </div>
  )
}
