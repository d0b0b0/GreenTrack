import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import { useAuthModal } from '../context/AuthModalProvider'
import { useLang } from '../context/LangProvider'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { LangToggle } from './LangToggle'
import { UserMenu } from './UserMenu'

export function Navbar() {
  const { authed } = useApp()
  const { open } = useAuthModal()
  const { t } = useLang()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: '/#features', label: t('Можливості', 'Features') },
    { href: '/#calculator', label: t('Калькулятор', 'Calculator') },
    { href: '/#howto', label: t('Як це працює', 'How it works') },
    { href: '/#team', label: t('Команда', 'Team') },
  ]

  return (
    <header className="nav">
      <Logo />
      <ul className="nav-links">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
      <div className="nav-actions">
        <LangToggle />
        <ThemeToggle />
        {authed ? (
          <>
            <button className="btn btn-soft sm" onClick={() => navigate('/app')}>
              {t('Моя панель', 'My dashboard')}
            </button>
            <UserMenu />
          </>
        ) : (
          <>
            <button className="btn btn-ghost sm" onClick={() => open('login')}>
              {t('Увійти', 'Sign in')}
            </button>
            <button className="btn btn-primary sm" onClick={() => open('register')}>
              {t('Почати безкоштовно', 'Start free')}
            </button>
          </>
        )}
        <button className="nav-burger" onClick={() => setMenuOpen((o) => !o)} aria-label={t('Меню', 'Menu')}>
          ☰
        </button>
      </div>
      {menuOpen && (
        <div className="user-dropdown" style={{ position: 'fixed', right: '1rem', top: '64px', width: 200 }}>
          {links.map((l) => (
            <a key={l.href} className="dd-item" href={l.href} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
          {authed ? (
            <Link className="dd-item" to="/app" onClick={() => setMenuOpen(false)}>
              📊 {t('Моя панель', 'My dashboard')}
            </Link>
          ) : (
            <button className="dd-item" onClick={() => { setMenuOpen(false); open('register') }}>
              🌿 {t('Почати безкоштовно', 'Start free')}
            </button>
          )}
        </div>
      )}
    </header>
  )
}
