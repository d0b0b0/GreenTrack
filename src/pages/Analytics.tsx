import { useApp } from '../context/AppProvider'
import { SourceDonut, TrendArea, WeeklyBars } from '../components/Charts'
import {
  CATEGORY_META,
  monthlyTotal,
  monthlyTrend,
  sourceTotals,
  totalCo2,
  weekData,
} from '../lib/carbon'
import { CATEGORIES } from '../lib/carbon'
import { fmtKg, round1 } from '../lib/format'

export default function Analytics() {
  const { profile, activities } = useApp()
  if (!profile) return null

  const trend = monthlyTrend(activities, 6)
  const week = weekData(activities)
  const sources = sourceTotals(activities)
  const total = totalCo2(activities)
  const monthly = monthlyTotal(activities)
  const prevMonth = trend.length >= 2 ? trend[trend.length - 2].total : 0
  const deltaPct = prevMonth > 0 ? Math.round(((monthly - prevMonth) / prevMonth) * 100) : 0
  const avgPerDay = activities.length ? total / new Set(activities.map((a) => a.date)).size : 0

  if (activities.length === 0) {
    return (
      <>
        <h1 className="greeting">Аналітика</h1>
        <p className="page-sub">Глибокий розбір ваших викидів за днями, тижнями та місяцями.</p>
        <div className="card" style={{ marginTop: '1.2rem' }}>
          <div className="empty">
            <span className="emoji">📈</span>
            Додайте кілька активностей, щоб побачити графіки та інсайти.
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div style={{ marginBottom: '1.2rem' }}>
        <h1 className="greeting">Аналітика</h1>
        <p className="page-sub">Глибокий розбір ваших викидів за днями, тижнями та місяцями.</p>
      </div>

      <div className="dash-grid">
        <div className="card col-3 kpi">
          <span className="kpi-ico">🌍</span>
          <div className="stat-label">Сумарно</div>
          <div className="stat-value">{round1(total)} <span style={{ fontSize: '0.9rem' }}>кг</span></div>
        </div>
        <div className="card col-3 kpi">
          <span className="kpi-ico">📅</span>
          <div className="stat-label">Цей місяць</div>
          <div className="stat-value">{round1(monthly)} <span style={{ fontSize: '0.9rem' }}>кг</span></div>
          {prevMonth > 0 && (
            <div className={`stat-sub ${deltaPct <= 0 ? 'up' : 'down'}`}>
              {deltaPct <= 0 ? '↓' : '↑'} {Math.abs(deltaPct)}% до минулого
            </div>
          )}
        </div>
        <div className="card col-3 kpi">
          <span className="kpi-ico">📆</span>
          <div className="stat-label">Середнє / день</div>
          <div className="stat-value">{round1(avgPerDay)} <span style={{ fontSize: '0.9rem' }}>кг</span></div>
        </div>
        <div className="card col-3 kpi">
          <span className="kpi-ico">🧮</span>
          <div className="stat-label">Базовий (рік)</div>
          <div className="stat-value">{profile.baseline != null ? `${profile.baseline}` : '—'} <span style={{ fontSize: '0.9rem' }}>т</span></div>
        </div>

        <div className="card col-8">
          <div className="card-title">Динаміка за 6 місяців</div>
          <TrendArea data={trend} />
        </div>
        <div className="card col-4">
          <div className="card-title">Джерела викидів</div>
          <SourceDonut totals={sources} />
        </div>

        <div className="card col-8">
          <div className="card-title">Цей тиждень по днях</div>
          <WeeklyBars labels={week.labels} totals={week.totals} todayIdx={week.todayIdx} />
        </div>

        <div className="card col-4">
          <div className="card-title">Розподіл за категоріями</div>
          <div className="profile-rows">
            {CATEGORIES.map((c) => {
              const v = sources[c]
              const pct = total > 0 ? Math.round((v / total) * 100) : 0
              return (
                <div className="profile-row" key={c}>
                  <span className="k">
                    {CATEGORY_META[c].icon} {c}
                  </span>
                  <span className="v">
                    {fmtKg(v)} <span className="muted-3" style={{ fontWeight: 400 }}>· {pct}%</span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
