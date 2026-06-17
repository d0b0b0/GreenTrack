import { useApp } from '../context/AppProvider'
import { useLang } from '../context/LangProvider'
import { EnvBanner } from '../components/EnvBanner'
import { Tabs } from '../components/Tabs'
import { OverviewPanel } from '../components/panels/OverviewPanel'
import { AnalyticsPanel } from '../components/panels/AnalyticsPanel'
import { levelFor } from '../lib/levels'

export default function Dashboard() {
  const { profile } = useApp()
  const { t } = useLang()
  if (!profile) return null
  const lvl = levelFor(profile.ecoPoints)

  return (
    <div className="route-fade">
      <div style={{ marginBottom: '1.4rem' }}>
        <h1 className="greeting">
          {t('Вітаємо, ', 'Welcome, ')}<em>{profile.name.split(' ')[0]}</em>! {lvl.emoji}
        </h1>
        <p className="page-sub">{t('Ваша еко-панель: логуйте дії, відстежуйте прогрес і виконуйте челенджі.', 'Your eco-dashboard: log actions, track progress, and complete challenges.')}</p>
      </div>

      <EnvBanner />

      <Tabs
        tabs={[
          { id: 'overview', label: `📊 ${t('Огляд', 'Overview')}`, render: () => <OverviewPanel /> },
          { id: 'analytics', label: `📈 ${t('Аналітика', 'Analytics')}`, render: () => <AnalyticsPanel /> },
        ]}
      />
    </div>
  )
}
