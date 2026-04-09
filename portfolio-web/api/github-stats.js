/**
 * GitHub Stats Middleware
 *
 * Middleware chain: CORS (wildcard) → HTTP Cache (s-maxage=3600, 1 hour)
 * Public endpoint returning Christian's GitHub activity with hardcoded fallback.
 *
 * See MIDDLEWARE.md for full architecture documentation.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate') // cache 1 hour

  try {
    // Fetch user stats
    const userRes = await fetch('https://api.github.com/users/christianescamilla15-cell')
    const user = await userRes.json()

    // Fetch recent repos
    const reposRes = await fetch('https://api.github.com/users/christianescamilla15-cell/repos?sort=pushed&per_page=6')
    const repos = await reposRes.json()

    // Fetch recent events (commits, pushes)
    const eventsRes = await fetch('https://api.github.com/users/christianescamilla15-cell/events?per_page=15')
    const events = await eventsRes.json()

    return res.json({
      public_repos: user.public_repos || 22,
      followers: user.followers || 0,
      recent_repos: (repos || []).slice(0, 6).map(r => ({
        name: r.name,
        description: r.description?.slice(0, 80),
        stars: r.stargazers_count,
        language: r.language,
        pushed_at: r.pushed_at,
        url: r.html_url,
      })),
      recent_events: (events || []).filter(e => e.type === 'PushEvent').slice(0, 8).map(e => ({
        repo: e.repo?.name?.split('/')[1],
        date: e.created_at,
        commits: e.payload?.commits?.length || 1,
        message: e.payload?.commits?.[0]?.message?.slice(0, 60),
      })),
    })
  } catch (e) {
    // Fallback demo data
    return res.json({
      public_repos: 22,
      followers: 5,
      recent_repos: [
        { name: 'nexusforge-ai', description: 'Enterprise Agent Orchestration Platform', stars: 0, language: 'Python', pushed_at: new Date().toISOString() },
        { name: 'Portafolio-Chris', description: 'AI & Automation Portfolio', stars: 0, language: 'JavaScript', pushed_at: new Date().toISOString() },
        { name: 'MindScrolling', description: 'Anti doom-scrolling app', stars: 0, language: 'Dart', pushed_at: new Date().toISOString() },
      ],
      recent_events: [
        { repo: 'nexusforge-ai', date: new Date().toISOString(), commits: 3, message: 'feat: Session 4 — Infrastructure + Observability' },
        { repo: 'Portafolio-Chris', date: new Date().toISOString(), commits: 1, message: 'feat: Apple-level scroll-driven experience' },
      ],
    })
  }
}
