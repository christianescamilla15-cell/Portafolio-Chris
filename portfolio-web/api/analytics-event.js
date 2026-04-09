/**
 * Analytics Event API — Feature 5
 *
 * Receives analytics events from the frontend and stores them in Supabase.
 * Fire-and-forget pattern: always returns 200 even if storage fails.
 * Supports both JSON POST and sendBeacon (which sends text/plain).
 */
import { cors } from './_lib/cors.js'
import supabase from './_lib/supabase.js'

export default async function handler(req, res) {
  if (cors(req, res)) return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Parse body — sendBeacon sends text/plain, fetch sends application/json
  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }

  const eventType = body?.type || 'unknown'

  // Store in Supabase analytics_events table (fire and forget)
  if (supabase) {
    try {
      await supabase.from('analytics_events').insert({
        event_type: eventType,
        query: JSON.stringify(body),
        created_at: new Date().toISOString(),
      })
    } catch {
      // Silently fail — analytics should not break the response
    }
  }

  return res.status(200).json({ ok: true })
}
