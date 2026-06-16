import type { Activity, Profile } from '../types'
import { computeStreak, sourceTotals, totalCo2 } from './carbon'

export interface AchievementDef {
  id: string
  icon: string
  title: string
  desc: string
  reward: number
  check: (ctx: { log: Activity[]; profile: Profile; completedChallenges: number }) => boolean
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'welcome',
    icon: '🎉',
    title: 'Ласкаво просимо',
    desc: 'Створено акаунт у GreenTrack',
    reward: 20,
    check: () => true,
  },
  {
    id: 'first-log',
    icon: '✍️',
    title: 'Дебют',
    desc: 'Перша залогована активність',
    reward: 20,
    check: ({ log }) => log.length >= 1,
  },
  {
    id: 'logger-10',
    icon: '📊',
    title: 'Аналітик',
    desc: '10 записів активностей',
    reward: 40,
    check: ({ log }) => log.length >= 10,
  },
  {
    id: 'logger-50',
    icon: '🗂️',
    title: 'Архіваріус',
    desc: '50 записів активностей',
    reward: 80,
    check: ({ log }) => log.length >= 50,
  },
  {
    id: 'streak-3',
    icon: '🔥',
    title: 'У потоці',
    desc: 'Серія 3 дні поспіль',
    reward: 30,
    check: ({ log }) => computeStreak(log) >= 3,
  },
  {
    id: 'streak-14',
    icon: '⚡',
    title: 'Залізна звичка',
    desc: 'Серія 14 днів поспіль',
    reward: 120,
    check: ({ log }) => computeStreak(log) >= 14,
  },
  {
    id: 'calculator',
    icon: '🧮',
    title: 'Самопізнання',
    desc: 'Розраховано річний слід у калькуляторі',
    reward: 25,
    check: ({ profile }) => profile.baseline != null,
  },
  {
    id: 'plant-lover',
    icon: '🥦',
    title: 'Рослиноїд',
    desc: '10 записів у категорії «Їжа»',
    reward: 50,
    check: ({ log }) => log.filter((e) => e.category === 'Їжа').length >= 10,
  },
  {
    id: 'cyclist',
    icon: '🚲',
    title: 'Еко-водій',
    desc: '10 зелених поїздок (≤ 1 кг CO₂)',
    reward: 50,
    check: ({ log }) => log.filter((e) => e.category === 'Транспорт' && e.co2 <= 1).length >= 10,
  },
  {
    id: 'challenger',
    icon: '🏅',
    title: 'Чемпіон челенджів',
    desc: 'Завершено 3 челенджі',
    reward: 100,
    check: ({ completedChallenges }) => completedChallenges >= 3,
  },
  {
    id: 'level-3',
    icon: '🌳',
    title: 'Виріс до дерева',
    desc: 'Досягнуто 3 рівня (300+ балів)',
    reward: 0,
    check: ({ profile }) => profile.ecoPoints >= 300,
  },
  {
    id: 'all-rounder',
    icon: '🌈',
    title: 'Універсал',
    desc: 'Активності в усіх категоріях',
    reward: 60,
    check: ({ log }) => Object.values(sourceTotals(log)).every((v) => v !== 0),
  },
  {
    id: 'tonne',
    icon: '📈',
    title: 'Тонна під контролем',
    desc: 'Відстежено понад 1000 кг CO₂',
    reward: 70,
    check: ({ log }) => totalCo2(log) >= 1000,
  },
]

export function achievementById(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id)
}
