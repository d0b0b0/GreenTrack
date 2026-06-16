import { useState } from 'react'
import { useApp } from '../context/AppProvider'
import { CHALLENGES } from '../lib/challenges'
import { ACHIEVEMENTS } from '../lib/achievements'

type Tab = 'challenges' | 'achievements'

const DIFF_CLASS: Record<string, string> = {
  'Легко': 'pill',
  'Середньо': 'pill amber',
  'Складно': 'pill rose',
}

export default function Challenges() {
  const { activities, challengeProgress, achievements, joinChallenge } = useApp()
  const [tab, setTab] = useState<Tab>('challenges')

  const progressFor = (id: string) => challengeProgress.find((c) => c.challengeId === id)
  const joinedCount = challengeProgress.filter((c) => c.joined && !c.completed).length
  const completedCount = challengeProgress.filter((c) => c.completed).length
  const unlockedCount = achievements.length

  return (
    <>
      <div style={{ marginBottom: '1.2rem' }}>
        <h1 className="greeting">Челенджі та досягнення</h1>
        <p className="page-sub">
          Активних: {joinedCount} · Пройдено: {completedCount} · Бейджів: {unlockedCount}/{ACHIEVEMENTS.length}
        </p>
      </div>

      <div className="segmented" style={{ marginBottom: '1.4rem' }}>
        <button className={tab === 'challenges' ? 'active' : ''} onClick={() => setTab('challenges')}>
          🎯 Челенджі
        </button>
        <button className={tab === 'achievements' ? 'active' : ''} onClick={() => setTab('achievements')}>
          🏅 Досягнення
        </button>
      </div>

      {tab === 'challenges' ? (
        <div className="challenge-grid">
          {CHALLENGES.map((c) => {
            const cp = progressFor(c.id)
            const progress = cp?.progress ?? c.measure(activities)
            const pct = Math.min(100, Math.round((progress / c.target) * 100))
            const done = cp?.completed
            return (
              <div className="card hover challenge-card" key={c.id}>
                <div className="row between">
                  <span className="challenge-emoji">{c.emoji}</span>
                  <span className={DIFF_CLASS[c.difficulty]}>{c.difficulty}</span>
                </div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <div className="challenge-meta">
                  <span className="pill outline">🏆 +{c.reward}</span>
                  <span className="muted" style={{ fontSize: '0.8rem' }}>
                    {Math.round(progress)} / {c.target} {c.unit}
                  </span>
                </div>
                <div className="progress thin" style={{ marginBottom: '0.9rem' }}>
                  <span style={{ width: `${pct}%`, background: done ? '#52B788' : undefined }} />
                </div>
                <div className="challenge-foot">
                  {done ? (
                    <button className="btn btn-soft block" disabled>
                      ✅ Пройдено
                    </button>
                  ) : cp?.joined ? (
                    <button className="btn btn-ghost block" disabled>
                      ⏳ В процесі ({pct}%)
                    </button>
                  ) : (
                    <button className="btn btn-primary block" onClick={() => joinChallenge(c.id)}>
                      Прийняти виклик
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="ach-grid">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = achievements.includes(a.id)
            return (
              <div className={`card ach-card ${unlocked ? 'unlocked' : ''}`} key={a.id}>
                <span className="ach-icon">{a.icon}</span>
                <h4>{a.title}</h4>
                <p>{a.desc}</p>
                {a.reward > 0 && (
                  <span className="pill" style={{ marginTop: '0.6rem' }}>
                    {unlocked ? '✓ ' : ''}+{a.reward}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
