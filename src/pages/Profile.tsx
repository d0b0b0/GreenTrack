import { useLang } from '../context/LangProvider'
import { Tabs } from '../components/Tabs'
import { ProfilePanel } from '../components/panels/ProfilePanel'
import { SettingsPanel } from '../components/panels/SettingsPanel'

export default function Profile() {
  const { t } = useLang()
  return (
    <div className="route-fade">
      <h1 className="greeting" style={{ marginBottom: '1.2rem' }}>{t('Профіль', 'Profile')}</h1>
      <Tabs
        tabs={[
          { id: 'profile', label: `👤 ${t('Профіль', 'Profile')}`, render: () => <ProfilePanel /> },
          { id: 'settings', label: `⚙️ ${t('Налаштування', 'Settings')}`, render: () => <SettingsPanel /> },
        ]}
      />
    </div>
  )
}
