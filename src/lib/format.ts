/** Formatting & date helpers (Ukrainian locale). */

export function todayISO(d = new Date()): string {
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  )
}

export function fmtDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

const MONTHS_UK = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня',
]
const MONTHS_UK_SHORT = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру']

export function fmtDateLong(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS_UK[m - 1]} ${y}`
}

export function monthShort(monthIdx: number): string {
  return MONTHS_UK_SHORT[((monthIdx % 12) + 12) % 12]
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10
}

export function fmtKg(n: number): string {
  return round1(n).toLocaleString('uk-UA') + ' кг'
}

export function fmtCo2(n: number): string {
  if (n >= 1000) return round1(n / 1000).toLocaleString('uk-UA') + ' т'
  return round1(n).toLocaleString('uk-UA') + ' кг'
}

export function fmtNum(n: number): string {
  return Math.round(n).toLocaleString('uk-UA')
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function validEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

const AVATAR_COLORS = [
  '#2D6A4F', '#52B788', '#40916C', '#74C69D', '#1B4332',
  '#E9C46A', '#F4A261', '#2A9D8F', '#457B9D', '#6D597A',
]
export function pickAvatarColor(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const day = 86400000
  if (diff < day) return 'сьогодні'
  if (diff < 2 * day) return 'вчора'
  const days = Math.floor(diff / day)
  if (days < 7) return `${days} дн. тому`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} тиж. тому`
  const months = Math.floor(days / 30)
  return `${months} міс. тому`
}
