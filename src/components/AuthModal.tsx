import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import { useLang } from '../context/LangProvider'
import { validEmail } from '../lib/format'
import { Logo } from './Logo'

type Tab = 'login' | 'register'

export function AuthModal({ initialTab, onClose }: { initialTab: Tab; onClose: () => void }) {
  const { signIn, signUp } = useApp()
  const { t } = useLang()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>(initialTab)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function switchTab(t: Tab) {
    setTab(t)
    setError(null)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (tab === 'register') {
      if (!name.trim()) return setError(t('Введіть ваше ім’я.', 'Enter your name.'))
      if (!validEmail(email)) return setError(t('Введіть коректну електронну пошту.', 'Enter a valid email.'))
      if (pw.length < 6) return setError(t('Пароль має містити щонайменше 6 символів.', 'Password must be at least 6 characters.'))
      if (pw !== pw2) return setError(t('Паролі не збігаються.', 'Passwords do not match.'))
      setBusy(true)
      const err = await signUp(name.trim(), email, pw)
      setBusy(false)
      if (err) return setError(err)
      onClose()
      navigate('/app')
    } else {
      if (!validEmail(email)) return setError(t('Введіть коректну електронну пошту.', 'Enter a valid email.'))
      if (!pw) return setError(t('Введіть пароль.', 'Enter your password.'))
      setBusy(true)
      const err = await signIn(email, pw)
      setBusy(false)
      if (err) return setError(err)
      onClose()
      navigate('/app')
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label={t('Закрити', 'Close')}>
          ×
        </button>
        <div className="modal-head">
          <Logo />
          <div className="modal-tabs">
            <button className={`modal-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>
              {t('Вхід', 'Sign in')}
            </button>
            <button
              className={`modal-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => switchTab('register')}
            >
              {t('Реєстрація', 'Sign up')}
            </button>
          </div>
        </div>
        <form className="modal-body" onSubmit={submit}>
          {error && <div className="alert error">⚠️ {error}</div>}

          {tab === 'register' && (
            <div className="field">
              <label htmlFor="rn">{t('Ім’я', 'Name')}</label>
              <input
                id="rn"
                className="input"
                autoComplete="name"
                placeholder={t('Ваше ім’я', 'Your name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="em">{t('Електронна пошта', 'Email')}</label>
            <input
              id="em"
              type="email"
              className="input"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="pw">{t('Пароль', 'Password')}</label>
            <input
              id="pw"
              type="password"
              className="input"
              autoComplete={tab === 'register' ? 'new-password' : 'current-password'}
              placeholder="••••••••"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
            {tab === 'register' && <div className="field-hint">{t('Мінімум 6 символів', 'At least 6 characters')}</div>}
          </div>
          {tab === 'register' && (
            <div className="field">
              <label htmlFor="pw2">{t('Підтвердіть пароль', 'Confirm password')}</label>
              <input
                id="pw2"
                type="password"
                className="input"
                autoComplete="new-password"
                placeholder="••••••••"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary block" disabled={busy}>
            {busy ? <span className="spinner" /> : tab === 'register' ? t('Створити акаунт 🌿', 'Create account 🌿') : t('Увійти в акаунт', 'Sign in')}
          </button>

          <div className="modal-foot">
            {tab === 'register' ? (
              <>
                {t('Вже маєте акаунт?', 'Already have an account?')}{' '}
                <button type="button" className="btn-link" onClick={() => switchTab('login')}>
                  {t('Увійти', 'Sign in')}
                </button>
              </>
            ) : (
              <>
                {t('Ще немає акаунта?', "Don't have an account?")}{' '}
                <button type="button" className="btn-link" onClick={() => switchTab('register')}>
                  {t('Зареєструватися', 'Sign up')}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
