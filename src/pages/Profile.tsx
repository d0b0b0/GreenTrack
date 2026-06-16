import { Tabs } from '../components/Tabs'
import { ProfilePanel } from '../components/panels/ProfilePanel'
import { SettingsPanel } from '../components/panels/SettingsPanel'

export default function Profile() {
  return (
    <div className="route-fade">
      <h1 className="greeting" style={{ marginBottom: '1.2rem' }}>Профіль</h1>
      <Tabs
        tabs={[
          { id: 'profile', label: '👤 Профіль', render: () => <ProfilePanel /> },
          { id: 'settings', label: '⚙️ Налаштування', render: () => <SettingsPanel /> },
        ]}
      />
    </div>
  )
}
