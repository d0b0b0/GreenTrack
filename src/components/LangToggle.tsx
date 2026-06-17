import { useLang } from '../context/LangProvider'

/** Two-state language switch: UA / EN. */
export function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button className={lang === 'uk' ? 'active' : ''} onClick={() => setLang('uk')} aria-pressed={lang === 'uk'}>
        UA
      </button>
      <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')} aria-pressed={lang === 'en'}>
        EN
      </button>
    </div>
  )
}
