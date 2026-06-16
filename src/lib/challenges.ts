import type { Activity, ChallengeProgress } from '../types'
import { computeStreak, monthlyTotal } from './carbon'

export interface ChallengeDef {
  id: string
  emoji: string
  title: string
  desc: string
  reward: number // eco-points
  difficulty: 'Легко' | 'Середньо' | 'Складно'
  target: number
  unit: string
  /** Compute current progress (0..target) from the user's activity log. */
  measure: (log: Activity[]) => number
}

const isThisWeek = (iso: string): boolean => {
  const now = new Date()
  const dow = (now.getDay() + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - dow)
  monday.setHours(0, 0, 0, 0)
  const d = new Date(iso)
  return d >= monday
}

export const CHALLENGES: ChallengeDef[] = [
  {
    id: 'streak-7',
    emoji: '🔥',
    title: 'Тиждень дисципліни',
    desc: 'Логуйте активності 7 днів поспіль, щоб виробити звичку.',
    reward: 100,
    difficulty: 'Середньо',
    target: 7,
    unit: 'днів',
    measure: (log) => Math.min(7, computeStreak(log)),
  },
  {
    id: 'log-20',
    emoji: '📝',
    title: 'Уважний спостерігач',
    desc: 'Додайте 20 записів активностей будь-якої категорії.',
    reward: 80,
    difficulty: 'Легко',
    target: 20,
    unit: 'записів',
    measure: (log) => Math.min(20, log.length),
  },
  {
    id: 'green-commute',
    emoji: '🚲',
    title: 'Зелений маршрут',
    desc: 'Цього тижня залогуйте 5 поїздок велосипедом, пішки або громадським транспортом (≤ 1 кг CO₂).',
    reward: 90,
    difficulty: 'Середньо',
    target: 5,
    unit: 'поїздок',
    measure: (log) =>
      Math.min(
        5,
        log.filter((e) => e.category === 'Транспорт' && e.co2 <= 1 && isThisWeek(e.date)).length,
      ),
  },
  {
    id: 'plant-week',
    emoji: '🥦',
    title: 'Рослинний виклик',
    desc: 'Залогуйте 7 рослинних страв (категорія «Їжа», ≤ 1.5 кг CO₂).',
    reward: 90,
    difficulty: 'Середньо',
    target: 7,
    unit: 'страв',
    measure: (log) =>
      Math.min(7, log.filter((e) => e.category === 'Їжа' && e.co2 <= 1.5).length),
  },
  {
    id: 'under-300',
    emoji: '🎯',
    title: 'Тримай нижче 300',
    desc: 'Утримайте місячні викиди нижче 300 кг CO₂. Прогрес = скільки ще можна витратити.',
    reward: 150,
    difficulty: 'Складно',
    target: 300,
    unit: 'кг',
    measure: (log) => Math.max(0, Math.min(300, 300 - monthlyTotal(log))),
  },
  {
    id: 'energy-saver',
    emoji: '💡',
    title: 'Енергоощадність',
    desc: 'Тримайте сумарні викиди категорії «Енергія» за тиждень нижче 30 кг.',
    reward: 70,
    difficulty: 'Легко',
    target: 30,
    unit: 'кг збережено',
    measure: (log) => {
      const used = log
        .filter((e) => e.category === 'Енергія' && isThisWeek(e.date))
        .reduce((s, e) => s + e.co2, 0)
      return Math.max(0, Math.min(30, 30 - used))
    },
  },
  {
    id: 'first-step',
    emoji: '🌱',
    title: 'Перший крок',
    desc: 'Додайте свою найпершу активність. Кожна подорож починається з кроку!',
    reward: 30,
    difficulty: 'Легко',
    target: 1,
    unit: 'запис',
    measure: (log) => Math.min(1, log.length),
  },
  {
    id: 'diverse',
    emoji: '🌈',
    title: 'Повна картина',
    desc: 'Залогуйте активності в усіх 5 категоріях, щоб бачити цілісну картину.',
    reward: 60,
    difficulty: 'Легко',
    target: 5,
    unit: 'категорій',
    measure: (log) => new Set(log.map((e) => e.category)).size,
  },
]

export function challengeById(id: string): ChallengeDef | undefined {
  return CHALLENGES.find((c) => c.id === id)
}

export function defaultProgress(id: string): ChallengeProgress {
  return { challengeId: id, joined: false, completed: false, progress: 0, joinedAt: null, completedAt: null }
}

/** Returns true if the challenge meets its target. */
export function isChallengeMet(def: ChallengeDef, log: Activity[]): boolean {
  return def.measure(log) >= def.target
}
