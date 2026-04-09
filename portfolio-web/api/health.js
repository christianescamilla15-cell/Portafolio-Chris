/**
 * Health Check Middleware
 *
 * Middleware chain: CORS only (no rate limit — monitoring must always be accessible)
 *
 * Aggregates real-time status from all middleware components:
 * - Supabase connectivity (live query to portfolio_meta)
 * - LLM providers: Groq, Cloudflare Workers AI configuration status
 * - ML providers: HuggingFace classification availability
 * - Security: CORS origins, rate limiting, analytics operational status
 * - GitHub sync: cron schedule, token configuration
 *
 * See MIDDLEWARE.md for full architecture documentation.
 */
import { cors } from './_lib/cors.js'
import supabase from './_lib/supabase.js'

export default async function handler(req, res) {
  if (cors(req, res)) return res.status(200).end()

  // Cache for 1 minute (Feature 5: API response caching)
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')

  // Check Supabase connectivity
  let supabaseStatus = 'not configured'
  if (supabase) {
    try {
      const { error } = await supabase.from('portfolio_meta').select('key').limit(1)
      supabaseStatus = error ? 'error' : 'connected'
    } catch {
      supabaseStatus = 'error'
    }
  }

  // Feature 10: Basic analytics summary
  let analyticsStats = { visits_24h: 0, events_24h: 0 }
  if (supabase) {
    try {
      const since = new Date(Date.now() - 86400000).toISOString()
      const { count: totalEvents } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', since)
      const { count: visits } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'visit')
        .gte('created_at', since)
      analyticsStats = { visits_24h: visits || 0, events_24h: totalEvents || 0 }
    } catch {
      // Analytics query failed — non-critical
    }
  }

  const status = {
    phase: 7,
    classify: {
      huggingface: process.env.HF_TOKEN ? 'configured' : 'available (no token)',
      local: 'always available',
    },
    recommend: {
      semantic: supabaseStatus === 'connected' ? 'available' : 'unavailable',
      keyword: 'always available',
    },
    chat: {
      groq: process.env.GROQ_API_KEY ? 'configured' : 'not configured',
      cloudflare: process.env.CF_ACCOUNT_ID ? 'configured' : 'not configured',
      local: 'always available',
    },
    supabase: supabaseStatus,
    security: {
      cors: process.env.ALLOWED_ORIGINS || '*',
      rateLimit: supabaseStatus === 'connected' ? 'active' : 'inactive',
      analytics: supabaseStatus === 'connected' ? 'active' : 'inactive',
    },
    githubSync: {
      cron: 'daily at 06:00 UTC',
      githubToken: process.env.GITHUB_TOKEN ? 'configured' : 'not configured',
    },
    analytics: analyticsStats,
    timestamp: new Date().toISOString(),
  }

  return res.status(200).json(status)
}
