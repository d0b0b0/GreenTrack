import { useApp } from '../context/AppProvider'
import { useLang } from '../context/LangProvider'

/** Shown only in demo mode to remind that data lives in this browser. */
export function EnvBanner() {
  const { usingCloud } = useApp()
  const { t } = useLang()
  if (usingCloud) return null
  return (
    <div className="env-banner">
      <span>🧪</span>
      <span>
        <strong>{t('Demo-режим.', 'Demo mode.')}</strong>{' '}
        {t(
          'Дані зберігаються лише у цьому браузері. Щоб увімкнути спільну хмарну базу даних — додайте ключі Supabase у файл',
          'Data is stored only in this browser. To enable the shared cloud database, add your Supabase keys to the',
        )}{' '}
        <code>.env</code>{t('.', ' file.')}
      </span>
    </div>
  )
}
