import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppProvider'
import { useLang } from '../../context/LangProvider'
import { backend } from '../../data/backend'
import { LEVELS, levelFor } from '../../lib/levels'
import { fmtKg, initials } from '../../lib/format'
import type { LeaderboardEntry } from '../../types'

export function LeaderboardPanel() {
  const { userId, profile } = useApp()
  const { t, tr } = useLang()
  const [rows, setRows] = useState<LeaderboardEntry[] | null>(null)

  useEffect(() => {
    let active = true
    if (userId) backend.leaderboard(userId).then((r) => active && setRows(r))
    return () => {
      active = false
    }
  }, [userId, profile?.ecoPoints])

  if (!rows) {
    return <div className="card" style={{ height: 280 }}><div className="skeleton full" style={{ height: '100%' }} /></div>
  }

  const myRank = rows.findIndex((r) => r.isMe) + 1
  const top3 = rows.slice(0, 3)
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean)

  return (
    <>
      <p className="page-sub" style={{ marginBottom: '1.2rem' }}>
        {myRank > 0 ? <>{t('Ваше місце', 'Your rank')}: <strong>#{myRank}</strong> {t('із', 'of')} {rows.length}</> : t('Долучайтесь до рейтингу!', 'Join the leaderboard!')}
      </p>

      <div className="podium stagger">
        {podiumOrder.map((p) => {
          const place = rows.findIndex((r) => r.id === p.id) + 1
          const lvl = levelFor(p.ecoPoints)
          return (
            <div className={`podium-card ${place === 1 ? 'p1' : ''}`} key={p.id}>
              <div className="podium-medal">{place === 1 ? '🥇' : place === 2 ? '🥈' : '🥉'}</div>
              <span className="avatar lg" style={{ background: p.avatarColor, margin: '0.4rem auto' }}>{initials(p.name)}</span>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{p.name}{p.isMe ? t(' (ви)', ' (you)') : ''}</div>
              <div className="muted" style={{ fontSize: '0.78rem' }}>{lvl.emoji} {tr(lvl.title)}</div>
              <div className="lb-points" style={{ marginTop: '0.4rem' }}>{p.ecoPoints} {t('балів', 'points')}</div>
            </div>
          )
        })}
      </div>

      <div className="card">
        <table className="lb-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t('Користувач', 'User')}</th>
              <th className="hide-sm">{t('Рівень', 'Level')}</th>
              <th className="hide-sm">{t('CO₂/міс', 'CO₂/mo')}</th>
              <th style={{ textAlign: 'right' }}>{t('Бали', 'Points')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const lvl = levelFor(r.ecoPoints)
              return (
                <tr key={r.id} className={`lb-row ${r.isMe ? 'me' : ''}`}>
                  <td className={`lb-rank ${i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : ''}`}>{i + 1}</td>
                  <td>
                    <div className="lb-user">
                      <span className="avatar sm" style={{ background: r.avatarColor }}>{initials(r.name)}</span>
                      {r.name}{r.isMe ? t(' (ви)', ' (you)') : ''}
                    </div>
                  </td>
                  <td className="hide-sm">{lvl.emoji} {tr(lvl.title)}</td>
                  <td className="hide-sm">{r.monthCo2 ? fmtKg(r.monthCo2) : '—'}</td>
                  <td className="lb-points" style={{ textAlign: 'right' }}>{r.ecoPoints}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="muted-3" style={{ fontSize: '0.78rem', marginTop: '0.9rem' }}>
          {t(
            `Показано ${rows.length} ${rows.length === 1 ? 'учасника' : 'учасників'} із публічним профілем (топ-100 за балами).`,
            `Showing ${rows.length} ${rows.length === 1 ? 'user' : 'users'} with a public profile (top 100 by points).`,
          )}{' '}
          {t('Вимкнути показ можна у', 'You can disable this in')} <strong>{t('Профіль → Налаштування → Публічний профіль', 'Profile → Settings → Public profile')}</strong>.
        </p>
      </div>

      <div className="card" style={{ marginTop: '1.2rem' }}>
        <div className="card-title">🌱 {t('Як працюють рівні', 'How levels work')}</div>
        <div className="row wrap gap">
          {LEVELS.map((l) => (
            <span className="pill outline" key={l.level} title={`${t('від', 'from')} ${l.min} ${t('балів', 'points')}`}>{l.emoji} {tr(l.title)} · {l.min}+</span>
          ))}
        </div>
      </div>
    </>
  )
}
