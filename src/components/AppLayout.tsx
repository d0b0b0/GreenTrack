import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import { useLang } from '../context/LangProvider'
import { levelFor } from '../lib/levels'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { LangToggle } from './LangToggle'
import { UserMenu } from './UserMenu'

interface NavItem {
  to: string
  icon: string
  label: string
  end?: boolean
}

export function AppLayout() {
  const { profile } = useApp()
  const { t, tr } = useLang()
  const [open, setOpen] = useState(false)
  const lvl = profile ? levelFor(profile.ecoPoints) : null

  const sections: { label: string; items: NavItem[] }[] = [
    {
      label: t('Огляд', 'Overview'),
      items: [
        { to: '/app', icon: '📊', label: t('Панель', 'Dashboard'), end: true },
        { to: '/app/activities', icon: '📝', label: t('Активності', 'Activities') },
        { to: '/app/calculator', icon: '🧮', label: t('Калькулятор', 'Calculator') },
      ],
    },
    {
      label: t('Прогрес', 'Progress'),
      items: [
        { to: '/app/community', icon: '🌍', label: t('Спільнота', 'Community') },
        { to: '/app/library', icon: '📚', label: t('Бібліотека', 'Library') },
      ],
    },
    {
      label: t('Акаунт', 'Account'),
      items: [{ to: '/app/profile', icon: '👤', label: t('Профіль', 'Profile') }],
    },
  ]

  return (
    <div className="app-shell">
      <div className={`sidebar-backdrop ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <Logo to="/" />
        </div>
        <nav className="side-nav" onClick={() => setOpen(false)}>
          {sections.map((sec) => (
            <div key={sec.label}>
              <div className="side-section-label">{sec.label}</div>
              {sec.items.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.end}
                  className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}
                >
                  <span className="ico">{it.icon}</span>
                  {it.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        {profile && lvl && (
          <div className="sidebar-foot">
            <div className="card" style={{ padding: '0.9rem' }}>
              <div className="row gap" style={{ marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{lvl.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                    {t('Рівень', 'Level')} {lvl.level} · {tr(lvl.title)}
                  </div>
                  <div className="muted" style={{ fontSize: '0.76rem' }}>
                    {profile.ecoPoints} {t('балів', 'points')}
                  </div>
                </div>
              </div>
              <div className="progress thin">
                <span style={{ width: `${lvl.pct}%` }} />
              </div>
            </div>
          </div>
        )}
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <button className="app-burger" onClick={() => setOpen(true)} aria-label={t('Меню', 'Menu')}>
            ☰
          </button>
          <div className="spacer" />
          <LangToggle />
          <ThemeToggle />
          <UserMenu />
        </header>
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
