import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import { initials } from '../lib/format'

export function UserMenu() {
  const { profile, signOut } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  if (!profile) return null

  return (
    <div className="user-menu" ref={ref}>
      <button className="user-trigger" onClick={() => setOpen((o) => !o)}>
        <span className="avatar sm" style={{ background: profile.avatarColor }}>
          {initials(profile.name)}
        </span>
        {profile.name.split(' ')[0]}
      </button>
      {open && (
        <div className="user-dropdown">
          <div className="dd-head">
            <div className="dd-name">{profile.name}</div>
            <div className="dd-mail">{profile.email}</div>
          </div>
          <button className="dd-item" onClick={() => { setOpen(false); navigate('/app') }}>
            📊 Панель
          </button>
          <button className="dd-item" onClick={() => { setOpen(false); navigate('/app/profile') }}>
            👤 Профіль
          </button>
          <button className="dd-item" onClick={() => { setOpen(false); navigate('/app/profile') }}>
            ⚙️ Налаштування
          </button>
          <button className="dd-item danger" onClick={() => { setOpen(false); signOut() }}>
            🚪 Вийти
          </button>
        </div>
      )}
    </div>
  )
}
