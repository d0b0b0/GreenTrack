import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangProvider'
import { ARTICLES } from '../lib/tips'

export default function Library() {
  const { t, tr } = useLang()
  const [cat, setCat] = useState('Всі')
  const cats = useMemo(() => ['Всі', ...Array.from(new Set(ARTICLES.map((a) => a.category)))], [])
  const list = cat === 'Всі' ? ARTICLES : ARTICLES.filter((a) => a.category === cat)

  return (
    <div className="route-fade">
      <div style={{ marginBottom: '1.2rem' }}>
        <h1 className="greeting">{t('Еко-бібліотека 📚', 'Eco-library 📚')}</h1>
        <p className="page-sub">{t('Перевірені поради та статті, щоб зменшувати слід усвідомлено.', 'Curated tips and articles to reduce your footprint consciously.')}</p>
      </div>

      <div className="row wrap gap" style={{ marginBottom: '1.4rem' }}>
        {cats.map((c) => (
          <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
            {c === 'Всі' ? t('Всі', 'All') : tr(c)}
          </button>
        ))}
      </div>

      <div className="lib-grid stagger">
        {list.map((a) => (
          <Link className="card hover article-card" to={`/app/library/${a.id}`} key={a.id}>
            <div className="article-cover" style={{ background: a.cover }}>{a.emoji}</div>
            <div className="article-body">
              <span className="pill outline" style={{ alignSelf: 'flex-start', marginBottom: '0.6rem' }}>{tr(a.category)}</span>
              <h3>{a.title}</h3>
              <p>{a.excerpt}</p>
              <div className="article-meta">
                <span>📖 {a.readMins} {t('хв читання', 'min read')}</span>
                <span className="spacer" />
                <span className="btn-link">{t('Читати →', 'Read →')}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
