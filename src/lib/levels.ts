/** Eco-points → level progression. */

export const LEVELS = [
  { level: 1, min: 0, title: 'Паросток', emoji: '🌱' },
  { level: 2, min: 100, title: 'Саджанець', emoji: '🌿' },
  { level: 3, min: 300, title: 'Кущ', emoji: '🪴' },
  { level: 4, min: 700, title: 'Деревце', emoji: '🌳' },
  { level: 5, min: 1300, title: 'Дуб', emoji: '🌲' },
  { level: 6, min: 2200, title: 'Гай', emoji: '🏞️' },
  { level: 7, min: 3500, title: 'Ліс', emoji: '🌍' },
]

export function levelFor(points: number) {
  let current = LEVELS[0]
  for (const l of LEVELS) if (points >= l.min) current = l
  const next = LEVELS.find((l) => l.min > current.min) ?? null
  const span = next ? next.min - current.min : 1
  const into = points - current.min
  const pct = next ? Math.min(100, Math.round((into / span) * 100)) : 100
  return {
    ...current,
    next,
    pct,
    toNext: next ? next.min - points : 0,
  }
}

/** Points awarded for various actions. */
export const POINTS = {
  logActivity: 10,
  completeChallenge: (reward: number) => reward,
  unlockAchievement: (reward: number) => reward,
  useCalculator: 25,
}
