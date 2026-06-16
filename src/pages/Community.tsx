import { useApp } from '../context/AppProvider'
import { Tabs } from '../components/Tabs'
import { ChallengesPanel } from '../components/panels/ChallengesPanel'
import { AchievementsPanel } from '../components/panels/AchievementsPanel'
import { LeaderboardPanel } from '../components/panels/LeaderboardPanel'
import { ACHIEVEMENTS } from '../lib/achievements'

export default function Community() {
  const { challengeProgress, achievements } = useApp()
  const active = challengeProgress.filter((c) => c.joined && !c.completed).length
  const completed = challengeProgress.filter((c) => c.completed).length

  return (
    <div className="route-fade">
      <div style={{ marginBottom: '1.2rem' }}>
        <h1 className="greeting">Спільнота 🌍</h1>
        <p className="page-sub">
          Активних челенджів: {active} · Пройдено: {completed} · Бейджів: {achievements.length}/{ACHIEVEMENTS.length}
        </p>
      </div>

      <Tabs
        tabs={[
          { id: 'challenges', label: '🎯 Челенджі', render: () => <ChallengesPanel /> },
          { id: 'achievements', label: '🏅 Досягнення', render: () => <AchievementsPanel /> },
          { id: 'leaderboard', label: '🏆 Рейтинг', render: () => <LeaderboardPanel /> },
        ]}
      />
    </div>
  )
}
