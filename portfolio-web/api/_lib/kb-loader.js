/**
 * Knowledge Base Loader Middleware
 * Cached data layer with Supabase-first loading and hardcoded fallback.
 * In-memory TTL cache (5 min) survives warm Vercel function instances.
 * Bilingual content (EN/ES) for all portfolio data.
 */
import supabase from './supabase.js'
let cache = null
let cacheTime = 0
const TTL = 5 * 60 * 1000 // 5 minutes

export async function loadKB() {
  // Return cached data if fresh
  if (cache && Date.now() - cacheTime < TTL) return cache

  if (!supabase) return null

  try {
    const [projectsRes, metaRes] = await Promise.all([
      supabase.from('portfolio_projects').select('*').order('id'),
      supabase.from('portfolio_meta').select('*'),
    ])

    if (projectsRes.error || metaRes.error) return null

    const meta = {}
    for (const row of metaRes.data) {
      meta[row.key] = { en: row.value_en, es: row.value_es }
    }

    const projects = projectsRes.data.map(p => ({
      name: p.name,
      description: { en: p.description_en, es: p.description_es },
      stack: p.stack,
      tests: p.tests,
      demo: p.demo,
      github: p.github,
      keyMetric: p.key_metric,
      githubStars: p.github_stars,
      githubLastPush: p.github_last_push,
    }))

    cache = {
      about: meta.about || { en: '', es: '' },
      skills: meta.skills || { en: '', es: '' },
      experience: meta.experience || { en: '', es: '' },
      contact: meta.contact || { en: '', es: '' },
      availability: meta.availability || { en: '', es: '' },
      metrics: meta.metrics || { en: '', es: '' },
      projects,
    }
    cacheTime = Date.now()
    return cache
  } catch {
    return null
  }
}
