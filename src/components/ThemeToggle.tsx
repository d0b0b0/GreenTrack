import { useTheme } from '../context/ThemeProvider'
import { useLang } from '../context/LangProvider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const { t } = useLang()
  const label = theme === 'dark' ? t('Світла тема', 'Light theme') : t('Темна тема', 'Dark theme')
  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
