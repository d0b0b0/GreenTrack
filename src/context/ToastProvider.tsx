import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import type { ToastMsg } from '../types'

interface PushOpts {
  emoji?: string
  kind?: ToastMsg['kind']
  header?: string
  title?: string
}

interface ToastCtx {
  toasts: ToastMsg[]
  push: (text: string, opts?: PushOpts) => void
}

const Ctx = createContext<ToastCtx | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMsg[]>([])
  const idRef = useRef(0)

  const push = useCallback((text: string, opts?: PushOpts) => {
    const id = ++idRef.current
    const kind = opts?.kind ?? 'default'
    setToasts((t) => [...t, { id, text, emoji: opts?.emoji, kind, header: opts?.header, title: opts?.title }])
    const ttl = kind === 'achievement' ? 5500 : 4000
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl)
  }, [])

  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))

  return (
    <Ctx.Provider value={{ toasts, push }}>
      {children}
      <div className="toast-wrap" aria-live="polite">
        {toasts.map((t) =>
          t.kind === 'achievement' ? (
            <button key={t.id} className="toast-ach" onClick={() => dismiss(t.id)} title="Сховати">
              <span className="toast-ach-badge">{t.emoji ?? '🏅'}</span>
              <span className="toast-ach-body">
                {t.header && <span className="toast-ach-header">{t.header}</span>}
                {t.title && <span className="toast-ach-title">{t.title}</span>}
                <span className="toast-ach-points">{t.text}</span>
              </span>
              <span className="toast-ach-shine" />
            </button>
          ) : (
            <div key={t.id} className="toast">
              {t.emoji && <span className="toast-emoji">{t.emoji}</span>}
              <span>{t.text}</span>
            </div>
          ),
        )}
      </div>
    </Ctx.Provider>
  )
}

export function useToast(): ToastCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useToast must be used within ToastProvider')
  return c
}
