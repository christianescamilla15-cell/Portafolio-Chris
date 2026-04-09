/**
 * Analytics Dashboard Middleware
 *
 * Middleware chain: CORS → Admin Auth (X-Admin-Key: ANALYTICS_SECRET)
 * Method: GET /api/analytics-dashboard?period=7d
 *
 * Protected admin endpoint that aggregates middleware telemetry:
 * visitor type distribution, provider usage, top queries, avg response time,
 * requests per day, language distribution. Configurable time period.
 *
 * See MIDDLEWARE.md for full architecture documentation.
 */
import { cors } from './_lib/cors.js'
import supabase from './_lib/supabase.js'
export default async function handler(req, res) {
  if (cors(req, res)) return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  // Auth check
  const secret = process.env.ANALYTICS_SECRET
  if (secret && req.headers['x-admin-key'] !== secret) {
    return res.status(401).json({ error: 'Unauthorized. Send X-Admin-Key header.' })
  }

  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' })

  // Parse period (default 7 days)
  const periodStr = req.query?.period || '7d'
  const days = parseInt(periodStr) || 7
  const since = new Date(Date.now() - days * 86400000).toISOString()

  try {
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('event_type, visitor_type, query, provider, response_time_ms, lang, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(5000)

    if (error) return res.status(500).json({ error: error.message })

    // Aggregate visitor types
    const visitorTypes = {}
    const providerUsage = {}
    const eventTypes = {}
    const queries = {}
    const langDist = {}
    let totalResponseTime = 0
    let responseTimeCount = 0

    for (const e of events) {
      if (e.visitor_type) visitorTypes[e.visitor_type] = (visitorTypes[e.visitor_type] || 0) + 1
      if (e.provider) providerUsage[e.provider] = (providerUsage[e.provider] || 0) + 1
      if (e.event_type) eventTypes[e.event_type] = (eventTypes[e.event_type] || 0) + 1
      if (e.lang) langDist[e.lang] = (langDist[e.lang] || 0) + 1
      if (e.query) {
        const q = e.query.toLowerCase().slice(0, 80)
        queries[q] = (queries[q] || 0) + 1
      }
      if (e.response_time_ms) {
        totalResponseTime += e.response_time_ms
        responseTimeCount++
      }
    }

    // Top queries
    const topQueries = Object.entries(queries)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([query, count]) => ({ query, count }))

    // Requests per day
    const perDay = {}
    for (const e of events) {
      const day = e.created_at.slice(0, 10)
      perDay[day] = (perDay[day] || 0) + 1
    }
    const requestsPerDay = Object.entries(perDay)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }))

    return res.status(200).json({
      period: `${days}d`,
      totalEvents: events.length,
      visitorTypes,
      providerUsage,
      eventTypes,
      langDistribution: langDist,
      avgResponseTimeMs: responseTimeCount ? Math.round(totalResponseTime / responseTimeCount) : null,
      topQueries,
      requestsPerDay,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
