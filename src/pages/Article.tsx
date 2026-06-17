import { Link, useParams } from 'react-router-dom'
import { useLang } from '../context/LangProvider'
import { ARTICLES, articleById } from '../lib/tips'

export default function Article() {
  const { id } = useParams()
  const { t, tr } = useLang()
  const article = id ? articleById(id) : undefined

  if (!article) {
    return (
      <div className="card">
        <div className="empty">
          <span className="emoji">🔍</span>
          {t('Статтю не знайдено.', 'Article not found.')} <Link className="btn-link" to="/app/library">{t('До бібліотеки', 'To library')}</Link>
        </div>
      </div>
    )
  }

  const related = ARTICLES.filter((a) => a.id !== article.id).slice(0, 3)

  return (
    <article className="route-fade" style={{ maxWidth: 760, margin: '0 auto' }}>
      <Link className="btn-link" to="/app/library">← {t('Бібліотека', 'Library')}</Link>
      <div
        className="article-cover"
        style={{ background: article.cover, height: 180, borderRadius: 'var(--r-lg)', margin: '1rem 0 1.4rem', fontSize: '4rem' }}
      >
        {article.emoji}
      </div>
      <span className="pill outline">{tr(article.category)}</span>
      <h1 className="greeting" style={{ margin: '0.7rem 0 0.4rem' }}>{article.title}</h1>
      <p className="muted" style={{ marginBottom: '1.6rem' }}>📖 {article.readMins} {t('хв читання', 'min read')}</p>

      {article.body.map((p, i) => (
        <p key={i} style={{ marginBottom: '1.1rem', lineHeight: 1.8, fontSize: '1.02rem' }}>{p}</p>
      ))}

      <div className="card" style={{ marginTop: '2rem', background: 'var(--green-pale)', border: 'none' }}>
        <strong style={{ color: 'var(--green)' }}>💚 {t('Дія дня:', 'Action of the day:')}</strong> {t('залогуйте бодай одну активність із цієї теми у вашій', 'log at least one activity on this topic in your')} <Link className="btn-link" to="/app/activities">{t('панелі активностей', 'activities page')}</Link> {t('— і отримайте бали.', '— and earn points.')}
      </div>

      <h3 style={{ margin: '2.2rem 0 1rem' }}>{t('Читайте також', 'Read also')}</h3>
      <div className="lib-grid">
        {related.map((a) => (
          <Link className="card hover article-card" to={`/app/library/${a.id}`} key={a.id}>
            <div className="article-cover" style={{ background: a.cover, height: 90, fontSize: '2rem' }}>{a.emoji}</div>
            <div className="article-body">
              <h3 style={{ fontSize: '0.98rem' }}>{a.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </article>
  )
}
