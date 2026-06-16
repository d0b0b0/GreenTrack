import type { Activity, ChallengeProgress, LeaderboardEntry, Profile, UserSettings } from '../types'
import { pickAvatarColor } from '../lib/format'
import { levelFor } from '../lib/levels'
import { supabase } from '../lib/supabase'
import type { Backend, SessionUser } from './types'

/* ───────────── Supabase backend ───────────── */

function sb() {
  if (!supabase) throw new Error('Supabase не налаштовано')
  return supabase
}

interface ProfileRow {
  id: string
  name: string
  avatar_color: string | null
  baseline: number | null
  monthly_goal: number | null
  eco_points: number | null
  total_co2: number | null
  month_co2: number | null
  settings: UserSettings | null
  created_at: string
}

function rowToProfile(row: ProfileRow, email: string): Profile {
  return {
    id: row.id,
    name: row.name,
    email,
    avatarColor: row.avatar_color || pickAvatarColor(row.id),
    baseline: row.baseline,
    monthlyGoal: row.monthly_goal ?? 300,
    ecoPoints: row.eco_points ?? 0,
    totalCo2: row.total_co2 ?? 0,
    monthCo2: row.month_co2 ?? 0,
    settings: row.settings ?? { weeklyDigest: true, publicProfile: true, reminders: false },
    createdAt: (row.created_at || new Date().toISOString()).slice(0, 10),
  }
}

interface ActivityRow {
  id: string
  user_id: string
  category: Activity['category']
  co2: number
  note: string | null
  date: string
  created_at: string
}
function rowToActivity(r: ActivityRow): Activity {
  return {
    id: r.id,
    userId: r.user_id,
    category: r.category,
    co2: Number(r.co2),
    note: r.note ?? '',
    date: r.date,
    createdAt: r.created_at,
  }
}

export class SupabaseBackend implements Backend {
  readonly kind = 'supabase' as const

  async getSession(): Promise<SessionUser | null> {
    const { data } = await sb().auth.getSession()
    const u = data.session?.user
    return u ? { id: u.id, email: u.email ?? '' } : null
  }

  onAuthChange(cb: (u: SessionUser | null) => void): () => void {
    const { data } = sb().auth.onAuthStateChange((_event, session) => {
      const u = session?.user
      cb(u ? { id: u.id, email: u.email ?? '' } : null)
    })
    return () => data.subscription.unsubscribe()
  }

  async signUp(name: string, email: string, password: string) {
    const { data, error } = await sb().auth.signUp({
      email,
      password,
      options: { data: { name, avatar_color: pickAvatarColor(email) } },
    })
    if (error) return { error: error.message }
    const u = data.user
    if (!u) return { error: 'Не вдалося створити акаунт.' }
    if (!data.session) {
      return { error: 'Перевірте пошту — потрібно підтвердити email перед входом.' }
    }
    return { user: { id: u.id, email: u.email ?? email } }
  }

  async signIn(email: string, password: string) {
    const { data, error } = await sb().auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    const u = data.user
    return { user: { id: u.id, email: u.email ?? email } }
  }

  async signOut() {
    await sb().auth.signOut()
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const { data: sess } = await sb().auth.getSession()
    const email = sess.session?.user?.email ?? ''
    const { data, error } = await sb().from('profiles').select('*').eq('id', userId).maybeSingle()
    if (error) throw error
    if (!data) {
      // safety net: create a profile if the trigger didn't
      const name = (sess.session?.user?.user_metadata?.name as string) || email.split('@')[0] || 'Користувач'
      const fresh = {
        id: userId,
        name,
        avatar_color: pickAvatarColor(email || userId),
        monthly_goal: 300,
        eco_points: 20,
        settings: { weeklyDigest: true, publicProfile: true, reminders: false },
        created_at: new Date().toISOString(),
      }
      await sb().from('profiles').upsert(fresh)
      return rowToProfile({ ...fresh, baseline: null, total_co2: 0, month_co2: 0 } as ProfileRow, email)
    }
    return rowToProfile(data as ProfileRow, email)
  }

  async saveProfile(profile: Profile) {
    const { error } = await sb()
      .from('profiles')
      .update({
        name: profile.name,
        avatar_color: profile.avatarColor,
        baseline: profile.baseline,
        monthly_goal: profile.monthlyGoal,
        eco_points: profile.ecoPoints,
        total_co2: profile.totalCo2,
        month_co2: profile.monthCo2,
        settings: profile.settings,
      })
      .eq('id', profile.id)
    if (error) throw error
  }

  async listActivities(userId: string): Promise<Activity[]> {
    const { data, error } = await sb()
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as ActivityRow[]).map(rowToActivity)
  }

  async addActivity(a: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity> {
    const { data, error } = await sb()
      .from('activities')
      .insert({ user_id: a.userId, category: a.category, co2: a.co2, note: a.note, date: a.date })
      .select()
      .single()
    if (error) throw error
    return rowToActivity(data as ActivityRow)
  }

  async deleteActivity(_userId: string, id: string) {
    const { error } = await sb().from('activities').delete().eq('id', id)
    if (error) throw error
  }

  async listChallengeProgress(userId: string): Promise<ChallengeProgress[]> {
    const { data, error } = await sb().from('user_challenges').select('*').eq('user_id', userId)
    if (error) throw error
    return (data as Array<Record<string, unknown>>).map((r) => ({
      challengeId: r.challenge_id as string,
      joined: r.joined as boolean,
      completed: r.completed as boolean,
      progress: Number(r.progress),
      joinedAt: (r.joined_at as string) ?? null,
      completedAt: (r.completed_at as string) ?? null,
    }))
  }

  async saveChallengeProgress(userId: string, p: ChallengeProgress) {
    const { error } = await sb()
      .from('user_challenges')
      .upsert(
        {
          user_id: userId,
          challenge_id: p.challengeId,
          joined: p.joined,
          completed: p.completed,
          progress: p.progress,
          joined_at: p.joinedAt,
          completed_at: p.completedAt,
        },
        { onConflict: 'user_id,challenge_id' },
      )
    if (error) throw error
  }

  async listAchievements(userId: string): Promise<string[]> {
    const { data, error } = await sb().from('user_achievements').select('achievement_id').eq('user_id', userId)
    if (error) throw error
    return (data as Array<{ achievement_id: string }>).map((r) => r.achievement_id)
  }

  async addAchievement(userId: string, id: string) {
    const { error } = await sb()
      .from('user_achievements')
      .upsert({ user_id: userId, achievement_id: id }, { onConflict: 'user_id,achievement_id' })
    if (error) throw error
  }

  async leaderboard(meId: string): Promise<LeaderboardEntry[]> {
    const { data, error } = await sb()
      .from('profiles')
      .select('id, name, avatar_color, eco_points, month_co2, settings')
      .order('eco_points', { ascending: false })
      .limit(100)
    if (error) throw error
    return (data as Array<ProfileRow>)
      .filter((r) => r.id === meId || (r.settings?.publicProfile ?? true))
      .map((r) => ({
        id: r.id,
        name: r.name,
        avatarColor: r.avatar_color || pickAvatarColor(r.id),
        ecoPoints: r.eco_points ?? 0,
        monthCo2: r.month_co2 ?? 0,
        level: levelFor(r.eco_points ?? 0).level,
        isMe: r.id === meId,
      }))
  }
}
