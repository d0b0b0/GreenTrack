import { Link } from 'react-router-dom'
import { useLang } from '../context/LangProvider'

export default function NotFound() {
  const { t } = useLang()
  return (
    <div className="loading-screen" style={{ minHeight: '100vh' }}>
      <div style={{ fontSize: '4rem' }}>🌵</div>
      <h1 className="greeting">{t('404 — сторінку не знайдено', '404 — page not found')}</h1>
      <p className="page-sub">{t('Можливо, ви заблукали в пустелі. Повернімось до зелені.', 'Looks like you wandered into the desert. Let’s head back to the green.')}</p>
      <Link className="btn btn-primary" to="/" style={{ marginTop: '1rem' }}>
        ← {t('На головну', 'Home')}
      </Link>
    </div>
  )
}
