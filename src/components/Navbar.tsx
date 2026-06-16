import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import { useAuthModal } from '../context/AuthModalProvider'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'

const LINKS = [
  { href: '/#features', label: 'Можливості' },
  { href: '/calculator', label: 'Калькулятор' },
  { href: '/#howto', label: 'Як це працює' },
  { href: '/#team', label: 'Команда' },
]

export function Navbar() {
  const { authed } = useApp()
  const { open } = useAuthModal()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="nav">
      <Logo />
      <ul className="nav-links">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
      <div className="nav-actions">
        <ThemeToggle />
        {authed ? (
          <>
            <button className="btn btn-soft sm" onClick={() => navigate('/app')}>
              Моя панель
            </button>
            <UserMenu />
          </>
        ) : (
          <>
            <button className="btn btn-ghost sm" onClick={() => open('login')}>
              Увійти
            </button>
            <button className="btn btn-primary sm" onClick={() => open('register')}>
              Почати безкоштовно
            </button>
          </>
        )}
        <button className="nav-burger" onClick={() => setMenuOpen((o) => !o)} aria-label="Меню">
          ☰
        </button>
      </div>
      {menuOpen && (
        <div className="user-dropdown" style={{ position: 'fixed', right: '1rem', top: '64px', width: 200 }}>
          {LINKS.map((l) => (
            <a key={l.href} className="dd-item" href={l.href} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
          {authed ? (
            <Link className="dd-item" to="/app" onClick={() => setMenuOpen(false)}>
              📊 Моя панель
            </Link>
          ) : (
            <button className="dd-item" onClick={() => { setMenuOpen(false); open('register') }}>
              🌿 Почати безкоштовно
            </button>
          )}
        </div>
      )}
    </header>
  )
}
