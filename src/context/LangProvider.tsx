import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { translate, type Lang } from '../lib/i18n'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  /** Inline UI string: pick Ukrainian or English. */
  t: (uk: string, en: string) => string
  /** Translate data-driven content via the dictionary. */
  tr: (uk: string) => string
}

const Ctx = createContext<LangCtx | null>(null)
const KEY = 'gt_lang'

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem(KEY) as Lang) || 'uk')

  useEffect(() => {
    localStorage.setItem(KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const toggle = useCallback(() => setLangState((l) => (l === 'uk' ? 'en' : 'uk')), [])
  const t = useCallback((uk: string, en: string) => (lang === 'en' ? en : uk), [lang])
  const tr = useCallback((uk: string) => translate(uk, lang), [lang])

  return <Ctx.Provider value={{ lang, setLang, toggle, t, tr }}>{children}</Ctx.Provider>
}

export function useLang(): LangCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useLang must be used within LangProvider')
  return c
}
