/**
 * Supabase Client — Shared Database Middleware
 * Conditional initialization: returns null if env vars are missing.
 * All consumers check for null to enable graceful degradation.
 * Powers: rate limiting, analytics, KB loading, semantic search, GitHub sync.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

export default supabase
