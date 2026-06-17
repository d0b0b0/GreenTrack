import { useState } from 'react'
import { useApp } from '../../context/AppProvider'
import { useTheme } from '../../context/ThemeProvider'
import { useLang } from '../../context/LangProvider'
import type { UserSettings } from '../../types'

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="track" />
    </label>
  )
}

export function SettingsPanel() {
  const { profile, updateProfile, signOut, usingCloud } = useApp()
  const { theme, toggle } = useTheme()
  const { t } = useLang()
  const [goal, setGoal] = useState(profile?.monthlyGoal ?? 300)

  if (!profile) return null

  const setFlag = (key: keyof UserSettings, val: boolean) =>
    updateProfile({ settings: { ...profile.settings, [key]: val } })

  return (
    <div className="dash-grid stagger">
      <div className="card col-6">
        <div className="card-title">🎯 {t('Цілі', 'Goals')}</div>
        <div className="field">
          <label>{t('Місячна ціль CO₂ (кг)', 'Monthly CO₂ goal (kg)')}</label>
          <div className="row gap">
            <input className="input" type="number" min={50} max={2000} step={10} value={goal} onChange={(e) => setGoal(+e.target.value)} style={{ maxWidth: 160 }} />
            <button className="btn btn-primary sm" onClick={() => updateProfile({ monthlyGoal: Math.max(50, goal) })}>{t('Зберегти', 'Save')}</button>
          </div>
          <div className="field-hint">{t('Менша ціль = амбітніше. Середній місячний слід — близько 560 кг.', 'A smaller goal is more ambitious. The average monthly footprint is around 560 kg.')}</div>
        </div>
      </div>

      <div className="card col-6">
        <div className="card-title">🎨 {t('Вигляд', 'Appearance')}</div>
        <div className="setting-row">
          <div>
            <div className="st-title">{t('Темна тема', 'Dark theme')}</div>
            <div className="st-desc">{t('Перемикач також доступний у шапці.', 'A toggle is also available in the header.')}</div>
          </div>
          <Switch checked={theme === 'dark'} onChange={toggle} />
        </div>
      </div>

      <div className="card col-12">
        <div className="card-title">🔔 {t('Приватність і сповіщення', 'Privacy & notifications')}</div>
        <div className="setting-row">
          <div>
            <div className="st-title">{t('Публічний профіль', 'Public profile')}</div>
            <div className="st-desc">{t('Показувати ваше імʼя та бали в рейтингу спільноти.', 'Show your name and points on the community leaderboard.')}</div>
          </div>
          <Switch checked={profile.settings.publicProfile} onChange={(v) => setFlag('publicProfile', v)} />
        </div>
        <div className="setting-row">
          <div>
            <div className="st-title">{t('Щотижневий дайджест', 'Weekly digest')}</div>
            <div className="st-desc">{t('Підсумок прогресу та поради (демонстраційне налаштування).', 'A summary of progress and tips (demo setting).')}</div>
          </div>
          <Switch checked={profile.settings.weeklyDigest} onChange={(v) => setFlag('weeklyDigest', v)} />
        </div>
        <div className="setting-row">
          <div>
            <div className="st-title">{t('Нагадування логувати', 'Logging reminders')}</div>
            <div className="st-desc">{t('Щоденне нагадування додати активність (демонстраційне).', 'A daily reminder to add an activity (demo).')}</div>
          </div>
          <Switch checked={profile.settings.reminders} onChange={(v) => setFlag('reminders', v)} />
        </div>
      </div>

      <div className="card col-12">
        <div className="card-title">💾 {t('Дані', 'Data')}</div>
        <p className="muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
          {usingCloud
            ? t('Ваші дані зберігаються у хмарній базі Supabase й синхронізуються між пристроями.', 'Your data is stored in the Supabase cloud database and synced across devices.')
            : t('Demo-режим: дані зберігаються лише в цьому браузері (localStorage). Додайте ключі Supabase для хмарної БД.', 'Demo mode: data is stored only in this browser (localStorage). Add Supabase keys for the cloud database.')}
        </p>
        <div className="row gap wrap">
          <button className="btn btn-danger sm" onClick={signOut}>🚪 {t('Вийти з акаунта', 'Sign out')}</button>
        </div>
      </div>
    </div>
  )
}
