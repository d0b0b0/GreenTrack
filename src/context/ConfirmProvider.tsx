import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

interface ConfirmOptions {
  title?: string
  message: ReactNode
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>

const Ctx = createContext<ConfirmFn | null>(null)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null)
  const resolver = useRef<(v: boolean) => void>()

  const confirm = useCallback<ConfirmFn>((o) => {
    setOpts(o)
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
    })
  }, [])

  const close = (val: boolean) => {
    resolver.current?.(val)
    resolver.current = undefined
    setOpts(null)
  }

  return (
    <Ctx.Provider value={confirm}>
      {children}
      {opts && (
        <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && close(false)}>
          <div className="modal" role="alertdialog" aria-modal="true" style={{ maxWidth: 400 }}>
            <div className="modal-body" style={{ paddingTop: '1.8rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>{opts.title ?? 'Підтвердження'}</h3>
              <p className="muted" style={{ marginBottom: '1.4rem' }}>{opts.message}</p>
              <div className="row gap" style={{ justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost" onClick={() => close(false)}>
                  {opts.cancelText ?? 'Скасувати'}
                </button>
                <button
                  className={`btn ${opts.danger ? 'btn-danger' : 'btn-primary'}`}
                  onClick={() => close(true)}
                  autoFocus
                >
                  {opts.confirmText ?? 'Підтвердити'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  )
}

export function useConfirm(): ConfirmFn {
  const c = useContext(Ctx)
  if (!c) throw new Error('useConfirm must be used within ConfirmProvider')
  return c
}
