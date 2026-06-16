export type Category = 'Транспорт' | 'Енергія' | 'Їжа' | 'Покупки' | 'Інше'

export interface Profile {
  id: string
  name: string
  email: string
  avatarColor: string
  baseline: number | null // т CO₂ / рік (from calculator)
  monthlyGoal: number // кг CO₂ / міс
  ecoPoints: number
  createdAt: string // ISO date
  settings: UserSettings
  // denormalized aggregates (maintained client-side, mirrored to DB)
  totalCo2: number
  monthCo2: number
}

export interface UserSettings {
  weeklyDigest: boolean
  publicProfile: boolean
  reminders: boolean
}

export interface Activity {
  id: string
  userId: string
  category: Category
  co2: number // кг
  note: string
  date: string // YYYY-MM-DD
  createdAt: string
}

export interface ChallengeProgress {
  challengeId: string
  joined: boolean
  completed: boolean
  progress: number // 0..target
  joinedAt: string | null
  completedAt: string | null
}

export interface LeaderboardEntry {
  id: string
  name: string
  avatarColor: string
  ecoPoints: number
  monthCo2: number
  level: number
  isMe?: boolean
}

export interface ToastMsg {
  id: number
  text: string
  emoji?: string
  kind?: 'default' | 'achievement'
  header?: string
  title?: string
}
