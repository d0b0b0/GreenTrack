import { useState } from 'react'
import { useApp } from '../../context/AppProvider'
import { useTheme } from '../../context/ThemeProvider'
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
  const [goal, setGoal] = useState(profile?.monthlyGoal ?? 300)

  if (!profile) return null

  const setFlag = (key: keyof UserSettings, val: boolean) =>
    updateProfile({ settings: { ...profile.settings, [key]: val } })

  return (
    <div className="dash-grid stagger">
      <div className="card col-6">
        <div className="card-title">🎯 Цілі</div>
        <div className="field">
          <label>Місячна ціль CO₂ (кг)</label>
          <div className="row gap">
            <input className="input" type="number" min={50} max={2000} step={10} value={goal} onChange={(e) => setGoal(+e.target.value)} style={{ maxWidth: 160 }} />
            <button className="btn btn-primary sm" onClick={() => updateProfile({ monthlyGoal: Math.max(50, goal) })}>Зберегти</button>
          </div>
          <div className="field-hint">Менша ціль = амбітніше. Середній місячний слід — близько 560 кг.</div>
        </div>
      </div>

      <div className="card col-6">
        <div className="card-title">🎨 Вигляд</div>
        <div className="setting-row">
          <div>
            <div className="st-title">Темна тема</div>
            <div className="st-desc">Перемикач також доступний у шапці.</div>
          </div>
          <Switch checked={theme === 'dark'} onChange={toggle} />
        </div>
      </div>

      <div className="card col-12">
        <div className="card-title">🔔 Приватність і сповіщення</div>
        <div className="setting-row">
          <div>
            <div className="st-title">Публічний профіль</div>
            <div className="st-desc">Показувати ваше імʼя та бали в рейтингу спільноти.</div>
          </div>
          <Switch checked={profile.settings.publicProfile} onChange={(v) => setFlag('publicProfile', v)} />
        </div>
        <div className="setting-row">
          <div>
            <div className="st-title">Щотижневий дайджест</div>
            <div className="st-desc">Підсумок прогресу та поради (демонстраційне налаштування).</div>
          </div>
          <Switch checked={profile.settings.weeklyDigest} onChange={(v) => setFlag('weeklyDigest', v)} />
        </div>
        <div className="setting-row">
          <div>
            <div className="st-title">Нагадування логувати</div>
            <div className="st-desc">Щоденне нагадування додати активність (демонстраційне).</div>
          </div>
          <Switch checked={profile.settings.reminders} onChange={(v) => setFlag('reminders', v)} />
        </div>
      </div>

      <div className="card col-12">
        <div className="card-title">💾 Дані</div>
        <p className="muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
          {usingCloud
            ? 'Ваші дані зберігаються у хмарній базі Supabase й синхронізуються між пристроями.'
            : 'Demo-режим: дані зберігаються лише в цьому браузері (localStorage). Додайте ключі Supabase для хмарної БД.'}
        </p>
        <div className="row gap wrap">
          <button className="btn btn-danger sm" onClick={signOut}>🚪 Вийти з акаунта</button>
        </div>
      </div>
    </div>
  )
}
