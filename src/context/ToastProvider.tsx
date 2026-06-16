import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import type { ToastMsg } from '../types'

interface ToastCtx {
  toasts: ToastMsg[]
  push: (text: string, opts?: { emoji?: string; kind?: ToastMsg['kind'] }) => void
}

const Ctx = createContext<ToastCtx | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMsg[]>([])
  const idRef = useRef(0)

  const push = useCallback((text: string, opts?: { emoji?: string; kind?: ToastMsg['kind'] }) => {
    const id = ++idRef.current
    setToasts((t) => [...t, { id, text, emoji: opts?.emoji, kind: opts?.kind ?? 'default' }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])

  return (
    <Ctx.Provider value={{ toasts, push }}>
      {children}
      <div className="toast-wrap" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind === 'achievement' ? 'achievement' : ''}`}>
            {t.emoji && <span className="toast-emoji">{t.emoji}</span>}
            <span>{t.text}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export function useToast(): ToastCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useToast must be used within ToastProvider')
  return c
}
