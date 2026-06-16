import { useState } from 'react'
import { useApp } from '../context/AppProvider'
import { ACHIEVEMENTS } from '../lib/achievements'
import { totalCo2 } from '../lib/carbon'
import { levelFor } from '../lib/levels'
import { fmtDateLong, initials, round1 } from '../lib/format'

export default function Profile() {
  const { profile, activities, achievements, challengeProgress, updateProfile } = useApp()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile?.name ?? '')

  if (!profile) return null
  const lvl = levelFor(profile.ecoPoints)
  const completed = challengeProgress.filter((c) => c.completed).length

  async function save() {
    if (name.trim()) await updateProfile({ name: name.trim() })
    setEditing(false)
  }

  return (
    <>
      <h1 className="greeting" style={{ marginBottom: '1.2rem' }}>Профіль</h1>

      <div className="dash-grid">
        <div className="card col-8">
          <div className="profile-head">
            <span className="avatar xl" style={{ background: profile.avatarColor }}>{initials(profile.name)}</span>
            <div style={{ flex: 1, minWidth: 200 }}>
              {editing ? (
                <div className="row gap">
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} style={{ maxWidth: 240 }} />
                  <button className="btn btn-primary sm" onClick={save}>Зберегти</button>
                  <button className="btn btn-ghost sm" onClick={() => { setEditing(false); setName(profile.name) }}>Скасувати</button>
                </div>
              ) : (
                <div className="row gap">
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
            <div className="stat-value">{profile.ecoPoints}</div>
          </div>
          <div className="card kpi">
            <span className="kpi-ico">📝</span>
            <div className="stat-label">Записів</div>
            <div className="stat-value">{activities.length}</div>
            <div className="stat-sub">{round1(totalCo2(activities))} кг сумарно</div>
          </div>
          <div className="card kpi">
            <span className="kpi-ico">🎯</span>
            <div className="stat-label">Челенджів пройдено</div>
            <div className="stat-value">{completed}</div>
          </div>
        </div>

        <div className="card col-12">
          <div className="card-title">🏅 Досягнення <span className="spacer" /> <span className="muted" style={{ fontSize: '0.85rem' }}>{achievements.length}/{ACHIEVEMENTS.length}</span></div>
          <div className="ach-grid">
            {ACHIEVEMENTS.map((a) => {
              const unlocked = achievements.includes(a.id)
              return (
                <div className={`card ach-card ${unlocked ? 'unlocked' : ''}`} key={a.id}>
                  <span className="ach-icon">{a.icon}</span>
                  <h4>{a.title}</h4>
                  <p>{a.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
