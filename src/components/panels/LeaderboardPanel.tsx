import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppProvider'
import { backend } from '../../data/backend'
import { LEVELS, levelFor } from '../../lib/levels'
import { fmtKg, initials } from '../../lib/format'
import type { LeaderboardEntry } from '../../types'

export function LeaderboardPanel() {
  const { userId, profile } = useApp()
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
        {myRank > 0 ? <>Ваше місце: <strong>#{myRank}</strong> із {rows.length}</> : 'Долучайтесь до рейтингу!'}
      </p>

      <div className="podium stagger">
        {podiumOrder.map((p) => {
          const place = rows.findIndex((r) => r.id === p.id) + 1
          const lvl = levelFor(p.ecoPoints)
          return (
            <div className={`podium-card ${place === 1 ? 'p1' : ''}`} key={p.id}>
              <div className="podium-medal">{place === 1 ? '🥇' : place === 2 ? '🥈' : '🥉'}</div>
              <span className="avatar lg" style={{ background: p.avatarColor, margin: '0.4rem auto' }}>{initials(p.name)}</span>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{p.name}{p.isMe ? ' (ви)' : ''}</div>
              <div className="muted" style={{ fontSize: '0.78rem' }}>{lvl.emoji} {lvl.title}</div>
              <div className="lb-points" style={{ marginTop: '0.4rem' }}>{p.ecoPoints} балів</div>
            </div>
          )
        })}
      </div>

      <div className="card">
        <table className="lb-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Користувач</th>
              <th className="hide-sm">Рівень</th>
              <th className="hide-sm">CO₂/міс</th>
              <th style={{ textAlign: 'right' }}>Бали</th>
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
                      {r.name}{r.isMe ? ' (ви)' : ''}
                    </div>
                  </td>
                  <td className="hide-sm">{lvl.emoji} {lvl.title}</td>
                  <td className="hide-sm">{r.monthCo2 ? fmtKg(r.monthCo2) : '—'}</td>
                  <td className="lb-points" style={{ textAlign: 'right' }}>{r.ecoPoints}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: '1.2rem' }}>
        <div className="card-title">🌱 Як працюють рівні</div>
        <div className="row wrap gap">
          {LEVELS.map((l) => (
            <span className="pill outline" key={l.level} title={`від ${l.min} балів`}>{l.emoji} {l.title} · {l.min}+</span>
          ))}
        </div>
      </div>
    </>
  )
}
