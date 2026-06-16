import type { Activity, Category } from '../types'
import { todayISO } from './format'

export const CATEGORIES: Category[] = ['Транспорт', 'Енергія', 'Їжа', 'Покупки', 'Інше']

export const CATEGORY_META: Record<Category, { color: string; icon: string }> = {
  'Транспорт': { color: '#2D6A4F', icon: '🚗' },
  'Енергія': { color: '#52B788', icon: '💡' },
  'Їжа': { color: '#E9C46A', icon: '🥗' },
  'Покупки': { color: '#F4A261', icon: '🛍️' },
  'Інше': { color: '#74C69D', icon: '♻️' },
}

/**
 * Quick-add presets: typical activities with estimated CO₂ (kg) so users
 * can log without knowing exact numbers.
 */
export interface QuickAction {
  label: string
  category: Category
  co2: number
  icon: string
}
export const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Поїздка авто 10 км', category: 'Транспорт', co2: 2.1, icon: '🚗' },
  { label: 'Громадський транспорт', category: 'Транспорт', co2: 0.6, icon: '🚌' },
  { label: 'Велосипед / пішки', category: 'Транспорт', co2: 0, icon: '🚲' },
  { label: 'Авіапереліт (1 год)', category: 'Транспорт', co2: 90, icon: '✈️' },
  { label: 'День опалення', category: 'Енергія', co2: 6, icon: '🔥' },
  { label: 'Прання + сушка', category: 'Енергія', co2: 2.3, icon: '🧺' },
  { label: 'М’ясна страва', category: 'Їжа', co2: 5, icon: '🍖' },
  { label: 'Веганська страва', category: 'Їжа', co2: 0.7, icon: '🥦' },
  { label: 'Чашка кави', category: 'Їжа', co2: 0.4, icon: '☕' },
  { label: 'Нова футболка', category: 'Покупки', co2: 7, icon: '👕' },
  { label: 'Доставка посилки', category: 'Покупки', co2: 1.2, icon: '📦' },
  { label: 'Сортування сміття', category: 'Інше', co2: -0.5, icon: '♻️' },
]

/* ---------- annual calculator ---------- */
export interface CalcInput {
  transport: number
  food: number
  energy: number
  people: number
  area: number
  flights: number
}

export interface CalcResult {
  annual: number // т CO₂ / рік
  breakdown: { transport: number; food: number; energy: number; flights: number }
}

export const UA_AVG_ANNUAL = 6.8 // т CO₂ / рік (середнє по Україні, орієнтовно)

export function calcAnnual(i: CalcInput): CalcResult {
  const people = Math.max(1, i.people || 1)
  const area = i.area || 60
  const flights = Math.max(0, i.flights || 0)

  const areaFactor = (area / 60) * 0.8
  const transportT = (i.transport * 12) / people / 100
  const foodT = (i.food * 12) / 100
  const energyT = (i.energy * areaFactor * 12) / people / 100
  const flightsT = flights * 0.5

  const annual = Math.round((transportT + foodT + energyT + flightsT) * 10) / 10
  return {
    annual,
    breakdown: {
      transport: Math.round(transportT * 10) / 10,
      food: Math.round(foodT * 10) / 10,
      energy: Math.round(energyT * 10) / 10,
      flights: Math.round(flightsT * 10) / 10,
    },
  }
}

/* ---------- analytics over the activity log ---------- */
function ym(d: Date): string {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
}

export function monthlyTotal(log: Activity[], ref = new Date()): number {
  const key = ym(ref)
  return log.filter((e) => e.date.startsWith(key)).reduce((s, e) => s + e.co2, 0)
}

export function totalCo2(log: Activity[]): number {
  return log.reduce((s, e) => s + e.co2, 0)
}

export function computeStreak(log: Activity[]): number {
  const days = new Set(log.map((e) => e.date))
  let streak = 0
  const d = new Date()
  if (!days.has(todayISO())) d.setDate(d.getDate() - 1)
  while (days.has(todayISO(d))) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

export interface WeekData {
  labels: string[]
  totals: number[]
  todayIdx: number
}
export function weekData(log: Activity[]): WeekData {
  const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']
  const now = new Date()
  const dow = (now.getDay() + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - dow)
  const totals = [0, 0, 0, 0, 0, 0, 0]
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const iso = todayISO(d)
    totals[i] = log.filter((e) => e.date === iso).reduce((s, e) => s + e.co2, 0)
  }
  return { labels, totals, todayIdx: dow }
}

/** Last N months of totals for trend charts. */
export function monthlyTrend(log: Activity[], n = 6): { label: string; total: number; key: string }[] {
  const out: { label: string; total: number; key: string }[] = []
  const now = new Date()
  const shortMonths = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру']
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = ym(d)
    const total = log.filter((e) => e.date.startsWith(key)).reduce((s, e) => s + e.co2, 0)
    out.push({ label: shortMonths[d.getMonth()], total: Math.round(total * 10) / 10, key })
  }
  return out
}

export function sourceTotals(log: Activity[]): Record<Category, number> {
  const t: Record<Category, number> = {
    'Транспорт': 0, 'Енергія': 0, 'Їжа': 0, 'Покупки': 0, 'Інше': 0,
  }
  log.forEach((e) => {
    if (t[e.category] != null) t[e.category] += e.co2
  })
  return t
}

/** Eco-rating 0..100 — lower monthly CO₂ relative to a 600 kg ceiling = higher. */
export function ecoRating(monthly: number): number {
  return Math.max(0, Math.min(100, Math.round(100 * (1 - monthly / 600))))
}
