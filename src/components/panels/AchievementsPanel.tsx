import { useApp } from '../../context/AppProvider'
import { ACHIEVEMENTS } from '../../lib/achievements'

export function AchievementsPanel() {
  const { achievements } = useApp()
  return (
    <div className="ach-grid stagger">
      {ACHIEVEMENTS.map((a) => {
        const unlocked = achievements.includes(a.id)
        return (
          <div className={`card ach-card ${unlocked ? 'unlocked' : ''}`} key={a.id}>
            <span className="ach-icon">{a.icon}</span>
            <h4>{a.title}</h4>
            <p>{a.desc}</p>
            {a.reward > 0 && (
              <span className="pill" style={{ marginTop: '0.6rem' }}>{unlocked ? '✓ ' : ''}+{a.reward}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
