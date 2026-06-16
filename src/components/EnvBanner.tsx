import { useApp } from '../context/AppProvider'

/** Shown only in demo mode to remind that data lives in this browser. */
export function EnvBanner() {
  const { usingCloud } = useApp()
  if (usingCloud) return null
  return (
    <div className="env-banner">
      <span>🧪</span>
      <span>
        <strong>Demo-режим.</strong> Дані зберігаються лише у цьому браузері. Щоб увімкнути спільну хмарну
        базу даних — додайте ключі Supabase (див. <code>SUPABASE_SETUP.md</code>).
      </span>
    </div>
  )
}
