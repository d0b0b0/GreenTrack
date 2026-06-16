import type { Activity, ChallengeProgress, LeaderboardEntry, Profile } from '../types'

export interface SessionUser {
  id: string
  email: string
}

export interface AuthError {
  error?: string
}

/** Unified persistence interface implemented by both backends. */
export interface Backend {
  readonly kind: 'supabase' | 'local'

  /* session / auth */
  getSession(): Promise<SessionUser | null>
  onAuthChange(cb: (user: SessionUser | null) => void): () => void
  signUp(name: string, email: string, password: string): Promise<AuthError & { user?: SessionUser }>
  signIn(email: string, password: string): Promise<AuthError & { user?: SessionUser }>
  signOut(): Promise<void>

  /* profile */
  getProfile(userId: string): Promise<Profile | null>
  saveProfile(profile: Profile): Promise<void>

  /* activities */
  listActivities(userId: string): Promise<Activity[]>
  addActivity(a: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity>
  deleteActivity(userId: string, id: string): Promise<void>

  /* challenges */
  listChallengeProgress(userId: string): Promise<ChallengeProgress[]>
  saveChallengeProgress(userId: string, p: ChallengeProgress): Promise<void>

  /* achievements */
  listAchievements(userId: string): Promise<string[]>
  addAchievement(userId: string, id: string): Promise<void>

  /* community */
  leaderboard(meId: string): Promise<LeaderboardEntry[]>
}
