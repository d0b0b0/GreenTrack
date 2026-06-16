import { createContext, useContext, useState, type ReactNode } from 'react'
import { AuthModal } from '../components/AuthModal'

type Tab = 'login' | 'register'
interface AuthModalCtx {
  open: (tab?: Tab) => void
  close: () => void
}

const Ctx = createContext<AuthModalCtx | null>(null)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<Tab | null>(null)

  const value: AuthModalCtx = {
    open: (t = 'login') => setTab(t),
    close: () => setTab(null),
  }

  return (
    <Ctx.Provider value={value}>
      {children}
      {tab && <AuthModal initialTab={tab} onClose={() => setTab(null)} />}
    </Ctx.Provider>
  )
}

export function useAuthModal(): AuthModalCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuthModal must be used within AuthModalProvider')
  return c
}
