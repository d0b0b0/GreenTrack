import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppProvider'
import { useLang } from '../../context/LangProvider'
import { ACHIEVEMENTS } from '../../lib/achievements'
import { totalCo2 } from '../../lib/carbon'
import { levelFor } from '../../lib/levels'
import { Counter } from '../Counter'
import { fmtDateLong, initials, round1 } from '../../lib/format'

export function ProfilePanel() {
  const { profile, activities, achievements, challengeProgress, updateProfile } = useApp()
  const { t, tr } = useLang()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile?.name ?? '')

  if (!profile) return null
  const lvl = levelFor(profile.ecoPoints)
  const completed = challengeProgress.filter((c) => c.completed).length
  const unlocked = ACHIEVEMENTS.filter((a) => achievements.includes(a.id))

  async function save() {
    if (name.trim()) await updateProfile({ name: name.trim() })
    setEditing(false)
  }

  return (
    <div className="dash-grid stagger">
      <div className="card col-8">
        <div className="profile-head">
          <span className="avatar xl" style={{ background: profile.avatarColor }}>{initials(profile.name)}</span>
          <div style={{ flex: 1, minWidth: 200 }}>
            {editing ? (
              <div className="row gap wrap">
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} style={{ maxWidth: 240 }} />
                <button className="btn btn-primary sm" onClick={save}>{t('Зберегти', 'Save')}</button>
                <button className="btn btn-ghost sm" onClick={() => { setEditing(false); setName(profile.name) }}>{t('Скасувати', 'Cancel')}</button>
              </div>
            ) : (
              <div className="row gap wrap">
                <h2 style={{ fontSize: '1.5rem' }}>{profile.name}</h2>
                <button className="btn btn-ghost sm" onClick={() => setEditing(true)}>✏️ {t('Змінити', 'Edit')}</button>
              </div>
            )}
            <p className="muted" style={{ marginTop: '0.3rem' }}>{profile.email}</p>
            <span className="pill" style={{ marginTop: '0.6rem' }}>{lvl.emoji} {t('Рівень', 'Level')} {lvl.level} · {tr(lvl.title)}</span>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1.3rem 0' }} />

        <div className="profile-rows">
          <div className="profile-row"><span className="k">{t('Електронна пошта', 'Email')}</span><span className="v">{profile.email}</span></div>
          <div className="profile-row"><span className="k">{t('Дата реєстрації', 'Joined')}</span><span className="v">{fmtDateLong(profile.createdAt)}</span></div>
          <div className="profile-row"><span className="k">{t('Базовий розрахунок', 'Baseline')}</span><span className="v">{profile.baseline != null ? `${profile.baseline} ${t('т CO₂ / рік', 't CO₂ / year')}` : '—'}</span></div>
          <div className="profile-row"><span className="k">{t('Місячна ціль', 'Monthly goal')}</span><span className="v">{profile.monthlyGoal} {t('кг CO₂', 'kg CO₂')}</span></div>
          <div className="profile-row"><span className="k">{t('Публічний профіль', 'Public profile')}</span><span className="v">{profile.settings.publicProfile ? t('Так', 'Yes') : t('Ні', 'No')}</span></div>
        </div>
      </div>

      <div className="col-4 col" style={{ gap: '1.2rem' }}>
        <div className="card kpi">
          <span className="kpi-ico">⭐</span>
          <div className="stat-label">{t('Еко-бали', 'Eco-points')}</div>
          <div className="stat-value"><Counter value={profile.ecoPoints} /></div>
        </div>
        <div className="card kpi">
          <span className="kpi-ico">📝</span>
          <div className="stat-label">{t('Записів', 'Entries')}</div>
          <div className="stat-value"><Counter value={activities.length} /></div>
          <div className="stat-sub">{round1(totalCo2(activities))} {t('кг сумарно', 'kg total')}</div>
        </div>
        <div className="card kpi">
          <span className="kpi-ico">🎯</span>
          <div className="stat-label">{t('Челенджів пройдено', 'Challenges done')}</div>
          <div className="stat-value"><Counter value={completed} /></div>
        </div>
      </div>

      <div className="card col-12">
        <div className="card-title">🏅 {t('Досягнення', 'Achievements')} <span className="spacer" /> <span className="muted" style={{ fontSize: '0.85rem' }}>{unlocked.length}/{ACHIEVEMENTS.length}</span></div>
        {unlocked.length === 0 ? (
          <p className="muted" style={{ fontSize: '0.9rem' }}>{t('Поки що жодного бейджа. Логуйте активності та виконуйте челенджі — і вони зʼявляться тут.', 'No badges yet. Log activities and complete challenges — they will appear here.')} <Link className="btn-link" to="/app/community">{t('До челенджів →', 'To challenges →')}</Link></p>
        ) : (
          <>
            <div className="row wrap gap">
              {unlocked.map((a) => (
                <span className="pill" key={a.id} title={tr(a.desc)} style={{ fontSize: '0.84rem' }}>{a.icon} {tr(a.title)}</span>
              ))}
            </div>
            <Link className="btn-link" to="/app/community" style={{ display: 'inline-block', marginTop: '0.9rem' }}>{t('Усі досягнення →', 'All achievements →')}</Link>
          </>
        )}
      </div>
    </div>
  )
}
