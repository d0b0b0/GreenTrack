import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppProvider'
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
  if (!profile) return null

  const monthly = monthlyTotal(activities)
  const rating = ecoRating(monthly)
  const streak = computeStreak(activities)
  const week = weekData(activities)
  const sources = sourceTotals(activities)
  const tips = personalTips(activities, profile.monthlyGoal)
  const lvl = levelFor(profile.ecoPoints)
  const goalPct = Math.min(100, Math.round((monthly / profile.monthlyGoal) * 100))
  const goalColor = monthly >= profile.monthlyGoal ? '#F4A261' : monthly >= profile.monthlyGoal * 0.7 ? '#E9C46A' : '#52B788'
  const recent = activities.slice(0, 6)

  return (
    <div className="dash-grid stagger">
      <div className="card kpi col-4">
        <span className="kpi-ico">🌍</span>
        <div className="stat-label">CO₂ цього місяця</div>
        <div className="stat-value"><Counter value={round1(monthly)} decimals={monthly % 1 ? 1 : 0} /> <span style={{ fontSize: '1rem' }}>кг</span></div>
        <div className="stat-sub">{activities.length ? `Ціль — ${profile.monthlyGoal} кг` : 'Почніть логувати активності'}</div>
      </div>
      <div className="card kpi col-4">
        <span className="kpi-ico">🌿</span>
        <div className="stat-label">Еко-рейтинг</div>
        <div className="stat-value">{activities.length ? <><Counter value={rating} />/100</> : '—'}</div>
        <div className="stat-sub up">
          {activities.length ? (rating >= 70 ? 'Чудовий результат' : rating >= 40 ? 'Є куди рости' : 'Час діяти') : 'Зʼявиться після записів'}
        </div>
      </div>
      <div className="card kpi col-4">
        <span className="kpi-ico">🔥</span>
        <div className="stat-label">Серія днів</div>
        <div className="stat-value"><Counter value={streak} />{streak > 0 ? ' 🔥' : ''}</div>
        <div className="stat-sub">{streak > 0 ? 'Так тримати!' : 'Залогуйте дію сьогодні'}</div>
      </div>

      <div className="card col-8">
        <div className="card-title">Викиди по днях тижня <span className="spacer" /> <span className="pill outline">кг CO₂</span></div>
        <WeeklyBars labels={week.labels} totals={week.totals} todayIdx={week.todayIdx} />
      </div>

      <div className="card col-4">
        <div className="card-title">Рівень і ціль</div>
        <div className="level-ring" style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '2.4rem' }}>{lvl.emoji}</span>
          <div>
            <div style={{ fontWeight: 800, fontFamily: 'var(--font-display)' }}>Рівень {lvl.level}</div>
            <div className="muted" style={{ fontSize: '0.84rem' }}>{lvl.title} · {profile.ecoPoints} балів</div>
          </div>
        </div>
        <div className="progress thin" style={{ marginBottom: '0.4rem' }}><span style={{ width: `${lvl.pct}%` }} /></div>
        <div className="muted" style={{ fontSize: '0.78rem' }}>{lvl.next ? `Ще ${lvl.toNext} балів до «${lvl.next.title}»` : 'Максимальний рівень!'}</div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />
        <div className="stat-label">Місячна ціль</div>
        <div className="progress" style={{ margin: '0.6rem 0 0.4rem' }}><span style={{ width: `${goalPct}%`, background: goalColor }} /></div>
        <div className="muted" style={{ fontSize: '0.8rem' }}>{round1(monthly)} з {profile.monthlyGoal} кг</div>
      </div>

      <div className="card col-8">
        <div className="card-title">Залогувати активність</div>
        <ActivityForm />
      </div>

      <div className="card col-4">
        <div className="card-title">Джерела викидів</div>
        <SourceDonut totals={sources} />
      </div>

      <div className="card col-8">
        <div className="card-title">💡 Персональні поради</div>
        <div className="tip-list">
          {tips.map((t, i) => (
            <div className="tip" key={i}><span className="tip-ico">{t.icon}</span>{t.text}</div>
          ))}
        </div>
      </div>

      <div className="card col-4">
        <div className="card-title">Останні записи <span className="spacer" /> <Link className="btn-link" to="/app/activities">усі →</Link></div>
        <ActivityList items={recent} />
      </div>
    </div>
  )
}
