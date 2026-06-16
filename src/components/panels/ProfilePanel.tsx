import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppProvider'
import { ACHIEVEMENTS } from '../../lib/achievements'
import { totalCo2 } from '../../lib/carbon'
import { levelFor } from '../../lib/levels'
import { Counter } from '../Counter'
import { fmtDateLong, initials, round1 } from '../../lib/format'

export function ProfilePanel() {
  const { profile, activities, achievements, challengeProgress, updateProfile } = useApp()
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
                <button className="btn btn-primary sm" onClick={save}>Зберегти</button>
                <button className="btn btn-ghost sm" onClick={() => { setEditing(false); setName(profile.name) }}>Скасувати</button>
              </div>
            ) : (
              <div className="row gap wrap">
                <h2 style={{ fontSize: '1.5rem' }}>{profile.name}</h2>
                <button className="btn btn-ghost sm" onClick={() => setEditing(true)}>✏️ Змінити</button>
              </div>
            )}
            <p className="muted" style={{ marginTop: '0.3rem' }}>{profile.email}</p>
            <span className="pill" style={{ marginTop: '0.6rem' }}>{lvl.emoji} Рівень {lvl.level} · {lvl.title}</span>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1.3rem 0' }} />

        <div className="profile-rows">
          <div className="profile-row"><span className="k">Електронна пошта</span><span className="v">{profile.email}</span></div>
          <div className="profile-row"><span className="k">Дата реєстрації</span><span className="v">{fmtDateLong(profile.createdAt)}</span></div>
          <div className="profile-row"><span className="k">Базовий розрахунок</span><span className="v">{profile.baseline != null ? `${profile.baseline} т CO₂ / рік` : '—'}</span></div>
          <div className="profile-row"><span className="k">Місячна ціль</span><span className="v">{profile.monthlyGoal} кг CO₂</span></div>
          <div className="profile-row"><span className="k">Публічний профіль</span><span className="v">{profile.settings.publicProfile ? 'Так' : 'Ні'}</span></div>
        </div>
      </div>

      <div className="col-4 col" style={{ gap: '1.2rem' }}>
        <div className="card kpi">
          <span className="kpi-ico">⭐</span>
          <div className="stat-label">Еко-бали</div>
          <div className="stat-value"><Counter value={profile.ecoPoints} /></div>
        </div>
        <div className="card kpi">
          <span className="kpi-ico">📝</span>
          <div className="stat-label">Записів</div>
          <div className="stat-value"><Counter value={activities.length} /></div>
          <div className="stat-sub">{round1(totalCo2(activities))} кг сумарно</div>
        </div>
        <div className="card kpi">
          <span className="kpi-ico">🎯</span>
          <div className="stat-label">Челенджів пройдено</div>
          <div className="stat-value"><Counter value={completed} /></div>
        </div>
      </div>

      <div className="card col-12">
        <div className="card-title">🏅 Досягнення <span className="spacer" /> <span className="muted" style={{ fontSize: '0.85rem' }}>{unlocked.length}/{ACHIEVEMENTS.length}</span></div>
        {unlocked.length === 0 ? (
          <p className="muted" style={{ fontSize: '0.9rem' }}>Поки що жодного бейджа. Логуйте активності та виконуйте челенджі — і вони зʼявляться тут. <Link className="btn-link" to="/app/community">До челенджів →</Link></p>
        ) : (
          <>
            <div className="row wrap gap">
              {unlocked.map((a) => (
                <span className="pill" key={a.id} title={a.desc} style={{ fontSize: '0.84rem' }}>{a.icon} {a.title}</span>
              ))}
            </div>
            <Link className="btn-link" to="/app/community" style={{ display: 'inline-block', marginTop: '0.9rem' }}>Усі досягнення →</Link>
          </>
        )}
      </div>
    </div>
  )
}
