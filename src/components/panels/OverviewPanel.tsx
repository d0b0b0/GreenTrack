import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppProvider'
import { useLang } from '../../context/LangProvider'
import { ActivityForm } from '../ActivityForm'
import { ActivityList } from '../ActivityList'
import { Counter } from '../Counter'
import { SourceDonut, WeeklyBars } from '../Charts'
import { computeStreak, ecoRating, monthlyTotal, sourceTotals, weekData } from '../../lib/carbon'
import { personalTips } from '../../lib/tips'
import { levelFor } from '../../lib/levels'
import { round1 } from '../../lib/format'

export function OverviewPanel() {
  const { profile, activities } = useApp()
  const { t, tr, lang } = useLang()
  if (!profile) return null

  const monthly = monthlyTotal(activities)
  const rating = ecoRating(monthly)
  const streak = computeStreak(activities)
  const week = weekData(activities)
  const sources = sourceTotals(activities)
  const tips = personalTips(activities, profile.monthlyGoal, lang)
  const lvl = levelFor(profile.ecoPoints)
  const goalPct = Math.min(100, Math.round((monthly / profile.monthlyGoal) * 100))
  const goalColor = monthly >= profile.monthlyGoal ? '#F4A261' : monthly >= profile.monthlyGoal * 0.7 ? '#E9C46A' : '#52B788'
  const recent = activities.slice(0, 6)

  return (
    <div className="dash-grid stagger">
      <div className="card kpi col-4">
        <span className="kpi-ico">🌍</span>
        <div className="stat-label">{t('CO₂ цього місяця', 'CO₂ this month')}</div>
        <div className="stat-value"><Counter value={round1(monthly)} decimals={monthly % 1 ? 1 : 0} /> <span style={{ fontSize: '1rem' }}>{t('кг', 'kg')}</span></div>
        <div className="stat-sub">{activities.length ? `${t('Ціль', 'Goal')} — ${profile.monthlyGoal} ${t('кг', 'kg')}` : t('Почніть логувати активності', 'Start logging activities')}</div>
      </div>
      <div className="card kpi col-4">
        <span className="kpi-ico">🌿</span>
        <div className="stat-label">{t('Еко-рейтинг', 'Eco-rating')}</div>
        <div className="stat-value">{activities.length ? <><Counter value={rating} />/100</> : '—'}</div>
        <div className="stat-sub up">
          {activities.length ? (rating >= 70 ? t('Чудовий результат', 'Excellent result') : rating >= 40 ? t('Є куди рости', 'Room to grow') : t('Час діяти', 'Time to act')) : t('Зʼявиться після записів', 'Appears after entries')}
        </div>
      </div>
      <div className="card kpi col-4">
        <span className="kpi-ico">🔥</span>
        <div className="stat-label">{t('Серія днів', 'Day streak')}</div>
        <div className="stat-value"><Counter value={streak} />{streak > 0 ? ' 🔥' : ''}</div>
        <div className="stat-sub">{streak > 0 ? t('Так тримати!', 'Keep it up!') : t('Залогуйте дію сьогодні', 'Log an action today')}</div>
      </div>

      <div className="card col-8">
        <div className="card-title">{t('Викиди по днях тижня', 'Emissions by weekday')} <span className="spacer" /> <span className="pill outline">{t('кг CO₂', 'kg CO₂')}</span></div>
        <WeeklyBars labels={week.labels} totals={week.totals} todayIdx={week.todayIdx} />
      </div>

      <div className="card col-4">
        <div className="card-title">{t('Рівень і ціль', 'Level & goal')}</div>
        <div className="level-ring" style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '2.4rem' }}>{lvl.emoji}</span>
          <div>
            <div style={{ fontWeight: 800, fontFamily: 'var(--font-display)' }}>{t('Рівень', 'Level')} {lvl.level}</div>
            <div className="muted" style={{ fontSize: '0.84rem' }}>{tr(lvl.title)} · {profile.ecoPoints} {t('балів', 'points')}</div>
          </div>
        </div>
        <div className="progress thin" style={{ marginBottom: '0.4rem' }}><span style={{ width: `${lvl.pct}%` }} /></div>
        <div className="muted" style={{ fontSize: '0.78rem' }}>{lvl.next ? `${t('Ще', 'Another')} ${lvl.toNext} ${t('балів до', 'points to')} «${tr(lvl.next.title)}»` : t('Максимальний рівень!', 'Max level!')}</div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />
        <div className="stat-label">{t('Місячна ціль', 'Monthly goal')}</div>
        <div className="progress" style={{ margin: '0.6rem 0 0.4rem' }}><span style={{ width: `${goalPct}%`, background: goalColor }} /></div>
        <div className="muted" style={{ fontSize: '0.8rem' }}>{round1(monthly)} {t('з', 'of')} {profile.monthlyGoal} {t('кг', 'kg')}</div>
      </div>

      <div className="card col-8">
        <div className="card-title">{t('Залогувати активність', 'Log an activity')}</div>
        <ActivityForm />
      </div>

      <div className="card col-4">
        <div className="card-title">{t('Джерела викидів', 'Emission sources')}</div>
        <SourceDonut totals={sources} />
      </div>

      <div className="card col-8">
        <div className="card-title">💡 {t('Персональні поради', 'Personal tips')}</div>
        <div className="tip-list">
          {tips.map((tip, i) => (
            <div className="tip" key={i}><span className="tip-ico">{tip.icon}</span>{tip.text}</div>
          ))}
        </div>
      </div>

      <div className="card col-4">
        <div className="card-title">{t('Останні записи', 'Recent entries')} <span className="spacer" /> <Link className="btn-link" to="/app/activities">{t('усі →', 'all →')}</Link></div>
        <ActivityList items={recent} />
      </div>
    </div>
  )
}
