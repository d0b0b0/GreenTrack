import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { backend, usingCloud } from '../data/backend'
import { ACHIEVEMENTS } from '../lib/achievements'
import { CHALLENGES, defaultProgress } from '../lib/challenges'
import { monthlyTotal, totalCo2 } from '../lib/carbon'
import { useToast } from './ToastProvider'
import type { ActivityPatch } from '../data/types'
import type { Activity, Category, ChallengeProgress, Profile } from '../types'

interface AppCtx {
  ready: boolean
  authed: boolean
  userId: string | null
  profile: Profile | null
  activities: Activity[]
  challengeProgress: ChallengeProgress[]
  achievements: string[]
  usingCloud: boolean

  signUp: (name: string, email: string, password: string) => Promise<string | null>
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>

  addActivity: (input: { category: Category; co2: number; note: string; date: string }) => Promise<void>
  updateActivity: (id: string, patch: ActivityPatch) => Promise<void>
  deleteActivity: (id: string) => Promise<void>
  updateProfile: (patch: Partial<Profile>) => Promise<void>
  setBaseline: (annual: number) => Promise<void>
  joinChallenge: (id: string) => Promise<void>
}

const Ctx = createContext<AppCtx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { push } = useToast()
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [challengeProgress, setChallengeProgress] = useState<ChallengeProgress[]>([])
  const [achievements, setAchievements] = useState<string[]>([])
  const profileRef = useRef<Profile | null>(null)
  profileRef.current = profile

  const loadAll = useCallback(async (id: string) => {
    const [p, acts, chal, ach] = await Promise.all([
      backend.getProfile(id),
      backend.listActivities(id),
      backend.listChallengeProgress(id),
      backend.listAchievements(id),
    ])
    setProfile(p)
    setActivities(acts)
    setChallengeProgress(chal)
    setAchievements(ach)
  }, [])

  // initial session + auth subscription
  useEffect(() => {
    let active = true
    backend.getSession().then(async (s) => {
      if (!active) return
      if (s) {
        setUserId(s.id)
        await loadAll(s.id)
      }
      setReady(true)
    })
    const unsub = backend.onAuthChange(async (u) => {
      if (!active) return
      if (u) {
        setUserId(u.id)
        await loadAll(u.id)
      } else {
        setUserId(null)
        setProfile(null)
        setActivities([])
        setChallengeProgress([])
        setAchievements([])
      }
    })
    return () => {
      active = false
      unsub()
    }
  }, [loadAll])

  /** Re-evaluate aggregates, challenges & achievements after data changes. */
  const recompute = useCallback(
    async (acts: Activity[], chalState: ChallengeProgress[], achState: string[]) => {
      const base = profileRef.current
      if (!base) return
      let pointsDelta = 0
      const newChal = [...chalState]
      const newAch = [...achState]

      // challenges (only award joined & not-yet-completed ones)
      for (const def of CHALLENGES) {
        const idx = newChal.findIndex((c) => c.challengeId === def.id)
        if (idx < 0) continue
        const cp = newChal[idx]
        if (!cp.joined || cp.completed) {
          newChal[idx] = { ...cp, progress: def.measure(acts) }
          continue
        }
        const progress = def.measure(acts)
        if (progress >= def.target) {
          const done: ChallengeProgress = {
            ...cp,
            progress: def.target,
            completed: true,
            completedAt: new Date().toISOString(),
          }
          newChal[idx] = done
          pointsDelta += def.reward
          await backend.saveChallengeProgress(base.id, done)
          push(`Челендж пройдено: ${def.title} (+${def.reward})`, { emoji: def.emoji, kind: 'achievement' })
        } else {
          newChal[idx] = { ...cp, progress }
        }
      }

      // achievements — loop a few passes since unlocks can grant points
      const completedChallenges = newChal.filter((c) => c.completed).length
      for (let pass = 0; pass < 3; pass++) {
        let changed = false
        const liveProfile: Profile = { ...base, ecoPoints: base.ecoPoints + pointsDelta }
        for (const def of ACHIEVEMENTS) {
          if (newAch.includes(def.id)) continue
          if (def.check({ log: acts, profile: liveProfile, completedChallenges })) {
            newAch.push(def.id)
            pointsDelta += def.reward
            changed = true
            await backend.addAchievement(base.id, def.id)
            push(`Досягнення: ${def.title}${def.reward ? ` (+${def.reward})` : ''}`, {
              emoji: def.icon,
              kind: 'achievement',
            })
          }
        }
        if (!changed) break
      }

      const updated: Profile = {
        ...base,
        ecoPoints: base.ecoPoints + pointsDelta,
        totalCo2: Math.round(totalCo2(acts) * 10) / 10,
        monthCo2: Math.round(monthlyTotal(acts) * 10) / 10,
      }
      setProfile(updated)
      setChallengeProgress(newChal)
      setAchievements(newAch)
      await backend.saveProfile(updated)
    },
    [push],
  )

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const res = await backend.signUp(name, email, password)
    if (res.error) return res.error
    if (res.user) {
      setUserId(res.user.id)
      await loadAll(res.user.id)
      push('Вітаємо у GreenTrack! 🌿', { emoji: '🎉' })
    }
    return null
  }, [loadAll, push])

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await backend.signIn(email, password)
    if (res.error) return res.error
    if (res.user) {
      setUserId(res.user.id)
      await loadAll(res.user.id)
      push('З поверненням! 👋', { emoji: '🌱' })
    }
    return null
  }, [loadAll, push])

  const signOut = useCallback(async () => {
    await backend.signOut()
    setUserId(null)
    setProfile(null)
    setActivities([])
    setChallengeProgress([])
    setAchievements([])
  }, [])

  const addActivity = useCallback(
    async (input: { category: Category; co2: number; note: string; date: string }) => {
      if (!userId) return
      const created = await backend.addActivity({ userId, ...input })
      const next = [created, ...activities]
      setActivities(next)
      // base points for logging
      const base = profileRef.current
      if (base) {
        const bumped = { ...base, ecoPoints: base.ecoPoints + 10 }
        setProfile(bumped)
        profileRef.current = bumped
      }
      push('Активність додано (+10)', { emoji: '✅' })
      await recompute(next, challengeProgress, achievements)
    },
    [userId, activities, challengeProgress, achievements, recompute, push],
  )

  const updateActivity = useCallback(
    async (id: string, patch: ActivityPatch) => {
      if (!userId) return
      const updated = await backend.updateActivity(userId, id, patch)
      const next = activities
        .map((a) => (a.id === id ? updated : a))
        .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
      setActivities(next)
      await recompute(next, challengeProgress, achievements)
    },
    [userId, activities, challengeProgress, achievements, recompute],
  )

  const deleteActivity = useCallback(
    async (id: string) => {
      if (!userId) return
      await backend.deleteActivity(userId, id)
      const next = activities.filter((a) => a.id !== id)
      setActivities(next)
      await recompute(next, challengeProgress, achievements)
    },
    [userId, activities, challengeProgress, achievements, recompute],
  )

  const updateProfile = useCallback(async (patch: Partial<Profile>) => {
    const base = profileRef.current
    if (!base) return
    const updated = { ...base, ...patch }
    setProfile(updated)
    profileRef.current = updated
    await backend.saveProfile(updated)
  }, [])

  const setBaseline = useCallback(
    async (annual: number) => {
      const base = profileRef.current
      if (!base) return
      const firstTime = base.baseline == null
      const updated = {
        ...base,
        baseline: annual,
        ecoPoints: base.ecoPoints + (firstTime ? 25 : 0),
      }
      setProfile(updated)
      profileRef.current = updated
      await backend.saveProfile(updated)
      if (firstTime) push('Базовий розрахунок збережено (+25)', { emoji: '🧮' })
      await recompute(activities, challengeProgress, achievements)
    },
    [activities, challengeProgress, achievements, recompute, push],
  )

  const joinChallenge = useCallback(
    async (id: string) => {
      if (!userId) return
      const existing = challengeProgress.find((c) => c.challengeId === id)
      if (existing?.joined) return
      const cp: ChallengeProgress = {
        ...(existing ?? defaultProgress(id)),
        joined: true,
        joinedAt: new Date().toISOString(),
      }
      await backend.saveChallengeProgress(userId, cp)
      const next = [...challengeProgress.filter((c) => c.challengeId !== id), cp]
      setChallengeProgress(next)
      push('Челендж прийнято! 💪', { emoji: '🎯' })
      await recompute(activities, next, achievements)
    },
    [userId, challengeProgress, activities, achievements, recompute, push],
  )

  const value: AppCtx = {
    ready,
    authed: !!userId,
    userId,
    profile,
    activities,
    challengeProgress,
    achievements,
    usingCloud,
    signUp,
    signIn,
    signOut,
    addActivity,
    updateActivity,
    deleteActivity,
    updateProfile,
    setBaseline,
    joinChallenge,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useApp must be used within AppProvider')
  return c
}
