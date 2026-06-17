import { useApp } from '../../context/AppProvider'
import { useLang } from '../../context/LangProvider'
import { Counter } from '../Counter'
import { SourceDonut, TrendArea, WeeklyBars } from '../Charts'
import {
  CATEGORIES,
  CATEGORY_META,
  monthlyTotal,
  monthlyTrend,
  sourceTotals,
  totalCo2,
  weekData,
} from '../../lib/carbon'
import { fmtKg, round1 } from '../../lib/format'

export function AnalyticsPanel() {
  const { profile, activities } = useApp()
  const { t, tr } = useLang()
  if (!profile) return null

  if (activities.length === 0) {
    return (
      <div className="card">
        <div className="empty">
          <span className="emoji">📈</span>
          {t('Додайте кілька активностей, щоб побачити графіки та інсайти.', 'Add a few activities to see charts and insights.')}
        </div>
      </div>
    )
  }

  const trend = monthlyTrend(activities, 6)
  const week = weekData(activities)
  const sources = sourceTotals(activities)
  const total = totalCo2(activities)
  const monthly = monthlyTotal(activities)
  const prevMonth = trend.length >= 2 ? trend[trend.length - 2].total : 0
  const deltaPct = prevMonth > 0 ? Math.round(((monthly - prevMonth) / prevMonth) * 100) : 0
  const avgPerDay = total / new Set(activities.map((a) => a.date)).size

  return (
    <div className="dash-grid stagger">
      <div className="card col-3 kpi">
        <span className="kpi-ico">🌍</span>
        <div className="stat-label">{t('Сумарно', 'Total')}</div>
        <div className="stat-value"><Counter value={round1(total)} decimals={total % 1 ? 1 : 0} /> <span style={{ fontSize: '0.9rem' }}>{t('кг', 'kg')}</span></div>
      </div>
      <div className="card col-3 kpi">
        <span className="kpi-ico">📅</span>
        <div className="stat-label">{t('Цей місяць', 'This month')}</div>
        <div className="stat-value"><Counter value={round1(monthly)} decimals={monthly % 1 ? 1 : 0} /> <span style={{ fontSize: '0.9rem' }}>{t('кг', 'kg')}</span></div>
        {prevMonth > 0 && (
          <div className={`stat-sub ${deltaPct <= 0 ? 'up' : 'down'}`}>
            {deltaPct <= 0 ? '↓' : '↑'} {Math.abs(deltaPct)}% {t('до минулого', 'vs last')}
          </div>
        )}
      </div>
      <div className="card col-3 kpi">
        <span className="kpi-ico">📆</span>
        <div className="stat-label">{t('Середнє / день', 'Average / day')}</div>
        <div className="stat-value"><Counter value={round1(avgPerDay)} decimals={1} /> <span style={{ fontSize: '0.9rem' }}>{t('кг', 'kg')}</span></div>
      </div>
      <div className="card col-3 kpi">
        <span className="kpi-ico">🧮</span>
        <div className="stat-label">{t('Базовий (рік)', 'Baseline (year)')}</div>
        <div className="stat-value">{profile.baseline != null ? `${profile.baseline}` : '—'} <span style={{ fontSize: '0.9rem' }}>{t('т', 't')}</span></div>
      </div>

      <div className="card col-8">
        <div className="card-title">{t('Динаміка за 6 місяців', '6-month trend')}</div>
        <TrendArea data={trend} />
      </div>
      <div className="card col-4">
        <div className="card-title">{t('Джерела викидів', 'Emission sources')}</div>
        <SourceDonut totals={sources} />
      </div>

      <div className="card col-8">
        <div className="card-title">{t('Цей тиждень по днях', 'This week by day')}</div>
        <WeeklyBars labels={week.labels} totals={week.totals} todayIdx={week.todayIdx} />
      </div>

      <div className="card col-4">
        <div className="card-title">{t('Розподіл за категоріями', 'Category breakdown')}</div>
        <div className="profile-rows">
          {CATEGORIES.map((c) => {
            const v = sources[c]
            const pct = total !== 0 ? Math.round((v / total) * 100) : 0
            return (
              <div className="profile-row" key={c}>
                <span className="k">{CATEGORY_META[c].icon} {tr(c)}</span>
                <span className="v">{fmtKg(v)} <span className="muted-3" style={{ fontWeight: 400 }}>· {pct}%</span></span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
