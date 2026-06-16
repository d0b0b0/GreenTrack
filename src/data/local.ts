import type { Activity, ChallengeProgress, LeaderboardEntry, Profile } from '../types'
import { pickAvatarColor, todayISO } from '../lib/format'
import { levelFor } from '../lib/levels'
import type { ActivityPatch, Backend, SessionUser } from './types'

/* ───────────── localStorage demo backend ───────────── */

const K = {
  users: 'gt_users',
  session: 'gt_session',
  profile: (id: string) => `gt_profile_${id}`,
  acts: (id: string) => `gt_acts_${id}`,
  chal: (id: string) => `gt_chal_${id}`,
  ach: (id: string) => `gt_ach_${id}`,
  seeded: 'gt_demo_seeded',
}

interface StoredUser {
  id: string
  name: string
  email: string
  salt: string
  hash: string
  createdAt: string
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function write(key: string, val: unknown) {
  localStorage.setItem(key, JSON.stringify(val))
}

function uid(): string {
  return 'u_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

function randomSalt(): string {
  const a = new Uint8Array(16)
  crypto.getRandomValues(a)
  return [...a].map((b) => b.toString(16).padStart(2, '0')).join('')
}
async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(salt + ':' + password)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function defaultProfile(id: string, name: string, email: string): Profile {
  return {
    id,
    name,
    email,
    avatarColor: pickAvatarColor(email),
    baseline: null,
    monthlyGoal: 300,
    ecoPoints: 20, // welcome achievement
    createdAt: todayISO(),
    settings: { weeklyDigest: true, publicProfile: true, reminders: false },
    totalCo2: 0,
    monthCo2: 0,
  }
}

/* seed a few fake users so the leaderboard isn't empty in demo mode */
const DEMO_PEOPLE: { name: string; points: number; month: number }[] = [
  { name: 'Олена Кравченко', points: 1840, month: 212 },
  { name: 'Андрій Бондар', points: 1620, month: 245 },
  { name: 'Марія Ткаченко', points: 1410, month: 198 },
  { name: 'Ігор Левченко', points: 1180, month: 301 },
  { name: 'Софія Коваль', points: 960, month: 176 },
  { name: 'Дмитро Шевчук', points: 740, month: 268 },
  { name: 'Юлія Поліщук', points: 560, month: 333 },
  { name: 'Тарас Мельник', points: 430, month: 289 },
  { name: 'Назар Вознюк', points: 380, month: 254 },
  { name: 'Катерина Гнатюк', points: 220, month: 312 },
]

function ensureSeed() {
  if (localStorage.getItem(K.seeded)) return
  const demos = DEMO_PEOPLE.map((p) => ({
    id: uid(),
    name: p.name,
    avatarColor: pickAvatarColor(p.name),
    ecoPoints: p.points,
    monthCo2: p.month,
    level: levelFor(p.points).level,
  }))
  write(K.seeded, demos)
}

export class LocalBackend implements Backend {
  readonly kind = 'local' as const
  private listeners = new Set<(u: SessionUser | null) => void>()

  constructor() {
    ensureSeed()
  }

  private emit() {
    const id = localStorage.getItem(K.session)
    const user = id ? this.userById(id) : null
    const su = user ? { id: user.id, email: user.email } : null
    this.listeners.forEach((cb) => cb(su))
  }

  private users(): Record<string, StoredUser> {
    return read<Record<string, StoredUser>>(K.users, {})
  }
  private userById(id: string): StoredUser | null {
    return Object.values(this.users()).find((u) => u.id === id) ?? null
  }

  async getSession(): Promise<SessionUser | null> {
    const id = localStorage.getItem(K.session)
    if (!id) return null
    const u = this.userById(id)
    return u ? { id: u.id, email: u.email } : null
  }

  onAuthChange(cb: (u: SessionUser | null) => void): () => void {
    this.listeners.add(cb)
    return () => this.listeners.delete(cb)
  }

  async signUp(name: string, email: string, password: string) {
    email = email.trim().toLowerCase()
    const users = this.users()
    if (users[email]) return { error: 'Акаунт із такою поштою вже існує.' }
    const salt = randomSalt()
    const hash = await hashPassword(password, salt)
    const id = uid()
    users[email] = { id, name, email, salt, hash, createdAt: todayISO() }
    write(K.users, users)
    write(K.profile(id), defaultProfile(id, name, email))
    write(K.ach(id), ['welcome'])
    localStorage.setItem(K.session, id)
    this.emit()
    return { user: { id, email } }
  }

  async signIn(email: string, password: string) {
    email = email.trim().toLowerCase()
    const user = this.users()[email]
    if (!user) return { error: 'Акаунт не знайдено. Зареєструйтесь.' }
    const hash = await hashPassword(password, user.salt)
    if (hash !== user.hash) return { error: 'Невірний пароль.' }
    localStorage.setItem(K.session, user.id)
    this.emit()
    return { user: { id: user.id, email: user.email } }
  }

  async signOut() {
    localStorage.removeItem(K.session)
    this.emit()
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const p = read<Profile | null>(K.profile(userId), null)
    if (p) return p
    const u = this.userById(userId)
    if (!u) return null
    const np = defaultProfile(u.id, u.name, u.email)
    write(K.profile(userId), np)
    return np
  }

  async saveProfile(profile: Profile) {
    write(K.profile(profile.id), profile)
  }

  async listActivities(userId: string): Promise<Activity[]> {
    return read<Activity[]>(K.acts(userId), []).sort(
      (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
    )
  }

  async addActivity(a: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity> {
    const list = read<Activity[]>(K.acts(a.userId), [])
    const full: Activity = { ...a, id: uid(), createdAt: new Date().toISOString() }
    list.push(full)
    write(K.acts(a.userId), list)
    return full
  }

  async updateActivity(userId: string, id: string, patch: ActivityPatch): Promise<Activity> {
    const list = read<Activity[]>(K.acts(userId), [])
    const idx = list.findIndex((e) => e.id === id)
    if (idx < 0) throw new Error('Запис не знайдено')
    const updated = { ...list[idx], ...patch }
    list[idx] = updated
    write(K.acts(userId), list)
    return updated
  }

  async deleteActivity(userId: string, id: string) {
    const list = read<Activity[]>(K.acts(userId), []).filter((e) => e.id !== id)
    write(K.acts(userId), list)
  }

  async listChallengeProgress(userId: string): Promise<ChallengeProgress[]> {
    return read<ChallengeProgress[]>(K.chal(userId), [])
  }

  async saveChallengeProgress(userId: string, p: ChallengeProgress) {
    const list = read<ChallengeProgress[]>(K.chal(userId), [])
    const idx = list.findIndex((x) => x.challengeId === p.challengeId)
    if (idx >= 0) list[idx] = p
    else list.push(p)
    write(K.chal(userId), list)
  }

  async listAchievements(userId: string): Promise<string[]> {
    return read<string[]>(K.ach(userId), [])
  }

  async addAchievement(userId: string, id: string) {
    const list = read<string[]>(K.ach(userId), [])
    if (!list.includes(id)) {
      list.push(id)
      write(K.ach(userId), list)
    }
  }

  async leaderboard(meId: string): Promise<LeaderboardEntry[]> {
    ensureSeed()
    const demos = read<Array<LeaderboardEntry & { level: number }>>(K.seeded, [])
    // real local users (their public profiles)
    const reals: LeaderboardEntry[] = []
    for (const u of Object.values(this.users())) {
      const p = read<Profile | null>(K.profile(u.id), null)
      if (!p) continue
      if (p.settings && p.settings.publicProfile === false && u.id !== meId) continue
      reals.push({
        id: p.id,
        name: p.name,
        avatarColor: p.avatarColor,
        ecoPoints: p.ecoPoints,
        monthCo2: p.monthCo2,
        level: levelFor(p.ecoPoints).level,
        isMe: u.id === meId,
      })
    }
    const all = [...demos.map((d) => ({ ...d, isMe: false })), ...reals]
    all.sort((a, b) => b.ecoPoints - a.ecoPoints)
    return all
  }
}
