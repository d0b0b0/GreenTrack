import { useApp } from '../../context/AppProvider'
import { CHALLENGES } from '../../lib/challenges'

const DIFF_CLASS: Record<string, string> = {
  'Легко': 'pill',
  'Середньо': 'pill amber',
  'Складно': 'pill rose',
}

export function ChallengesPanel() {
  const { activities, challengeProgress, joinChallenge } = useApp()
  const progressFor = (id: string) => challengeProgress.find((c) => c.challengeId === id)

  return (
    <div className="challenge-grid stagger">
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
              <span className="muted" style={{ fontSize: '0.8rem' }}>{Math.round(progress)} / {c.target} {c.unit}</span>
            </div>
            <div className="progress thin" style={{ marginBottom: '0.9rem' }}>
              <span style={{ width: `${pct}%`, background: done ? '#52B788' : undefined }} />
            </div>
            <div className="challenge-foot">
              {done ? (
                <button className="btn btn-soft block" disabled>✅ Пройдено</button>
              ) : cp?.joined ? (
                <button className="btn btn-ghost block" disabled>⏳ В процесі ({pct}%)</button>
              ) : (
                <button className="btn btn-primary block" onClick={() => joinChallenge(c.id)}>Прийняти виклик</button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
