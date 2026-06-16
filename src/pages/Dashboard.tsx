import { useApp } from '../context/AppProvider'
import { EnvBanner } from '../components/EnvBanner'
import { Tabs } from '../components/Tabs'
import { OverviewPanel } from '../components/panels/OverviewPanel'
import { AnalyticsPanel } from '../components/panels/AnalyticsPanel'
import { levelFor } from '../lib/levels'

export default function Dashboard() {
  const { profile } = useApp()
  if (!profile) return null
  const lvl = levelFor(profile.ecoPoints)

  return (
    <div className="route-fade">
      <div style={{ marginBottom: '1.4rem' }}>
        <h1 className="greeting">
          Вітаємо, <em>{profile.name.split(' ')[0]}</em>! {lvl.emoji}
        </h1>
        <p className="page-sub">Ваша еко-панель: логуйте дії, відстежуйте прогрес і виконуйте челенджі.</p>
      </div>

      <EnvBanner />

      <Tabs
        tabs={[
          { id: 'overview', label: '📊 Огляд', render: () => <OverviewPanel /> },
          { id: 'analytics', label: '📈 Аналітика', render: () => <AnalyticsPanel /> },
        ]}
      />
    </div>
  )
}
