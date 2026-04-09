/**
 * Rate Limit Middleware
 * Sliding-window algorithm backed by Supabase rate_limits table.
 * Per-endpoint, per-IP (SHA-256 hashed) limits. Fail-open design:
 * if Supabase is unavailable, all requests pass through.
 */
import supabase from './supabase.js'
import { hashIP } from './analytics.js'
export async function checkRateLimit(req, endpoint, maxPerMinute = 30) {
  if (!supabase) return false // fail-open if no DB

  const ipHash = hashIP(req)
  const windowStart = new Date(Date.now() - 60 * 1000).toISOString()

  try {
    // Count requests in the last 60 seconds
    const { count } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .eq('endpoint', endpoint)
      .gte('created_at', windowStart)

    if (count >= maxPerMinute) return true

    // Log this request (fire-and-forget)
    supabase
      .from('rate_limits')
      .insert({ ip_hash: ipHash, endpoint })
      .then(() => {})
      .catch(() => {})

    return false
  } catch {
    return false // fail-open on error
  }
}
