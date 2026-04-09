/**
 * GitHub Sync Middleware (Cron Job)
 *
 * Middleware chain: CORS → Cron Auth (Bearer CRON_SECRET)
 * Schedule: daily at 06:00 UTC via Vercel Cron
 *
 * Syncs GitHub API stats (stars, last push) into Supabase for all portfolio projects.
 * Also performs rate_limits table cleanup (entries older than 1 hour).
 * Respects GitHub rate limits with 200ms inter-request delay.
 *
 * See MIDDLEWARE.md for full architecture documentation.
 */
import { cors } from './_lib/cors.js'
import supabase from './_lib/supabase.js'
export default async function handler(req, res) {
  if (cors(req, res)) return res.status(200).end()

  // Verify cron secret (Vercel Cron sends this automatically, or manual call)
  const auth = req.headers.authorization
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' })

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    ...(GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {}),
  }

  const { data: projects, error } = await supabase
    .from('portfolio_projects')
    .select('id, name, github')
    .not('github', 'is', null)

  if (error) return res.status(500).json({ error: error.message })

  const results = []

  for (const project of projects) {
    if (!project.github) continue
    const repoPath = project.github
      .replace('https://github.com/', '')
      .replace(/\/$/, '')

    try {
      const repoRes = await fetch(`https://api.github.com/repos/${repoPath}`, { headers })
      if (!repoRes.ok) {
        results.push({ name: project.name, status: 'error', code: repoRes.status })
        continue
      }

      const repo = await repoRes.json()

      const { error: updateError } = await supabase
        .from('portfolio_projects')
        .update({
          github_stars: repo.stargazers_count || 0,
          github_last_push: repo.pushed_at || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', project.id)

      results.push({
        name: project.name,
        status: updateError ? 'update_error' : 'ok',
        stars: repo.stargazers_count,
        lastPush: repo.pushed_at,
      })
    } catch (err) {
      results.push({ name: project.name, status: 'fetch_error', message: err.message })
    }

    // Small delay to respect GitHub rate limits
    await new Promise(r => setTimeout(r, 200))
  }

  // Clean up old rate limit entries while we're at it
  await supabase
    .from('rate_limits')
    .delete()
    .lt('created_at', new Date(Date.now() - 3600000).toISOString())
    .then(() => {})
    .catch(() => {})

  return res.status(200).json({
    synced: results.filter(r => r.status === 'ok').length,
    total: projects.length,
    results,
    timestamp: new Date().toISOString(),
  })
}
