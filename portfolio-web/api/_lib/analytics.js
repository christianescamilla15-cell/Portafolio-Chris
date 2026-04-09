/**
 * Analytics Middleware
 * Fire-and-forget event logging to Supabase analytics_events table.
 * Never blocks the response. Includes privacy-first IP hashing (SHA-256, truncated).
 */
import { createHash } from 'crypto'
import supabase from './supabase.js'

export function hashIP(req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || req.socket?.remoteAddress
    || 'unknown'
  return createHash('sha256').update(ip).digest('hex').slice(0, 16)
}

// Fire-and-forget analytics event — never blocks the response
export function logEvent({ eventType, visitorType, query, provider, responseTimeMs, lang, ipHash }) {
  if (!supabase) return
  supabase
    .from('analytics_events')
    .insert({
      event_type: eventType,
      visitor_type: visitorType || null,
      query: query?.slice(0, 200) || null,
      provider: provider || null,
      response_time_ms: responseTimeMs || null,
      lang: lang || null,
      ip_hash: ipHash || null,
    })
    .then(() => {})
    .catch(() => {})
}
