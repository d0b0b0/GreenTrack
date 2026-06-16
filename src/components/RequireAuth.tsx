import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import { useAuthModal } from '../context/AuthModalProvider'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { ready, authed } = useApp()
  const { open } = useAuthModal()
  const location = useLocation()

  useEffect(() => {
    if (ready && !authed) open('login')
  }, [ready, authed, open])

  if (!ready) {
    return (
      <div className="loading-screen">
        <span className="spinner" />
        Завантаження…
      </div>
    )
  }
  if (!authed) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}
