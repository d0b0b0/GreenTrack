import { Link } from 'react-router-dom'

export function Logo({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="logo" aria-label="GreenTrack">
      <span className="logo-mark">🌿</span>
      GreenTrack
    </Link>
  )
}
