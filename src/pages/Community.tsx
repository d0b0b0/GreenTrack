import { useApp } from '../context/AppProvider'
import { useLang } from '../context/LangProvider'
import { Tabs } from '../components/Tabs'
import { ChallengesPanel } from '../components/panels/ChallengesPanel'
import { AchievementsPanel } from '../components/panels/AchievementsPanel'
import { LeaderboardPanel } from '../components/panels/LeaderboardPanel'
import { ACHIEVEMENTS } from '../lib/achievements'

export default function Community() {
  const { challengeProgress, achievements } = useApp()
  const { t } = useLang()
  const active = challengeProgress.filter((c) => c.joined && !c.completed).length
  const completed = challengeProgress.filter((c) => c.completed).length

  return (
    <div className="route-fade">
      <div style={{ marginBottom: '1.2rem' }}>
        <h1 className="greeting">{t('Спільнота', 'Community')} 🌍</h1>
        <p className="page-sub">
          {t('Активних челенджів', 'Active challenges')}: {active} · {t('Пройдено', 'Completed')}: {completed} · {t('Бейджів', 'Badges')}: {achievements.length}/{ACHIEVEMENTS.length}
        </p>
      </div>

      <Tabs
        tabs={[
          { id: 'challenges', label: `🎯 ${t('Челенджі', 'Challenges')}`, render: () => <ChallengesPanel /> },
          { id: 'achievements', label: `🏅 ${t('Досягнення', 'Achievements')}`, render: () => <AchievementsPanel /> },
          { id: 'leaderboard', label: `🏆 ${t('Рейтинг', 'Leaderboard')}`, render: () => <LeaderboardPanel /> },
        ]}
      />
    </div>
  )
}
