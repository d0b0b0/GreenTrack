import { isSupabaseEnabled } from '../lib/supabase'
import { LocalBackend } from './local'
import { SupabaseBackend } from './remote'
import type { Backend } from './types'

/** The single backend instance used across the app. */
export const backend: Backend = isSupabaseEnabled ? new SupabaseBackend() : new LocalBackend()

export const usingCloud = isSupabaseEnabled
