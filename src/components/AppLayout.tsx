import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import { levelFor } from '../lib/levels'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'

interface NavItem {
  to: string
  icon: string
  label: string
  end?: boolean
}

const SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Огляд',
    items: [
      { to: '/app', icon: '📊', label: 'Панель', end: true },
      { to: '/app/activities', icon: '📝', label: 'Активності' },
      { to: '/app/calculator', icon: '🧮', label: 'Калькулятор' },
    ],
  },
  {
    label: 'Прогрес',
    items: [
      { to: '/app/community', icon: '🌍', label: 'Спільнота' },
      { to: '/app/library', icon: '📚', label: 'Бібліотека' },
    ],
  },
  {
    label: 'Акаунт',
    items: [{ to: '/app/profile', icon: '👤', label: 'Профіль' }],
  },
]

export function AppLayout() {
  const { profile } = useApp()
  const [open, setOpen] = useState(false)
  const lvl = profile ? levelFor(profile.ecoPoints) : null

  return (
    <div className="app-shell">
      <div className={`sidebar-backdrop ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <Logo to="/" />
        </div>
        <nav className="side-nav" onClick={() => setOpen(false)}>
          {SECTIONS.map((sec) => (
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
                    Рівень {lvl.level} · {lvl.title}
                  </div>
                  <div className="muted" style={{ fontSize: '0.76rem' }}>
                    {profile.ecoPoints} балів
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
          <button className="app-burger" onClick={() => setOpen(true)} aria-label="Меню">
            ☰
          </button>
          <div className="spacer" />
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
