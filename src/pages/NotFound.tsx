import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="loading-screen" style={{ minHeight: '100vh' }}>
      <div style={{ fontSize: '4rem' }}>🌵</div>
      <h1 className="greeting">404 — сторінку не знайдено</h1>
      <p className="page-sub">Можливо, ви заблукали в пустелі. Повернімось до зелені.</p>
      <Link className="btn btn-primary" to="/" style={{ marginTop: '1rem' }}>
        ← На головну
      </Link>
    </div>
  )
}
