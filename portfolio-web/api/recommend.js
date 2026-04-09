/**
 * Semantic Recommendation Middleware
 *
 * Middleware chain: CORS → Rate Limit (60/min) → Voyage AI Embeddings → pgvector → Analytics
 * Provider fallback: Semantic search (Voyage AI + pgvector cosine similarity) → Keyword matching
 *
 * Features:
 * - Voyage AI voyage-3-lite embeddings (512d, multilingual)
 * - pgvector cosine similarity via Supabase RPC (match_projects)
 * - Post-retrieval re-ranking with visitor-type bonuses (recruiter: tests/metrics, client: demos/business relevance)
 * - Bilingual reason generation per recommendation
 * - Keyword fallback with tech-pattern scoring
 *
 * See MIDDLEWARE.md for full architecture documentation.
 */
import { PORTFOLIO_KB, getKB } from './kb.js'
import { cors } from './_lib/cors.js'
import { checkRateLimit } from './_lib/rateLimit.js'
import { logEvent, hashIP } from './_lib/analytics.js'
import { getQueryEmbedding } from './_lib/embeddings.js'
import supabase from './_lib/supabase.js'

export default async function handler(req, res) {
  if (cors(req, res)) return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (await checkRateLimit(req, 'recommend', 60)) return res.status(429).json({ error: 'Rate limit exceeded' })

  const start = Date.now()
  const { query, visitorType = 'visitor', lang = 'en', topN = 3 } = req.body
  if (!query) return res.status(400).json({ error: 'query required' })

  // Try semantic search first, fall back to keyword matching
  let recommendations
  let provider = 'keyword'

  if (supabase) {
    try {
      recommendations = await semanticSearch(query, visitorType, lang, topN)
      provider = 'semantic'
    } catch {
      // Fall through to keyword search
    }
  }

  if (!recommendations) {
    recommendations = await keywordSearch(query, visitorType, lang, topN)
  }

  logEvent({ eventType: 'recommend', visitorType, query: query?.slice(0, 200), provider, responseTimeMs: Date.now() - start, lang, ipHash: hashIP(req) })
  return res.status(200).json({
    recommendations,
    visitorType,
    query: query.slice(0, 100),
    totalProjects: recommendations.length,
    searchType: provider,
  })
}

// ─── SEMANTIC SEARCH (pgvector) ────────────────────────────────────────────
async function semanticSearch(query, visitorType, lang, topN) {
  const embedding = await getQueryEmbedding(query)

  // Fetch more than needed so we can re-rank with visitor bonuses
  const fetchCount = Math.min(topN * 2, 10)

  const { data, error } = await supabase.rpc('match_projects', {
    query_embedding: JSON.stringify(embedding),
    match_count: fetchCount,
    match_lang: lang,
  })

  if (error || !data?.length) throw new Error(error?.message || 'No results')

  // Apply visitor-type bonuses as re-ranking
  const reranked = data.map(p => {
    let bonus = 0
    if (visitorType === 'recruiter') {
      if (p.tests) bonus += Math.min(p.tests / 10, 15)
      if (p.key_metric) bonus += 5
      if (p.github_stars) bonus += Math.min(p.github_stars, 10)
    } else if (visitorType === 'client') {
      if (p.demo) bonus += 5
      if (/chatbot|content|analytics|crm|portal/i.test(p.name)) bonus += 10
    }
    return { ...p, finalScore: (p.similarity * 100) + bonus }
  })

  reranked.sort((a, b) => b.finalScore - a.finalScore)

  return reranked.slice(0, topN).map(p => ({
    name: p.name,
    description: lang === 'es' ? p.description_es : p.description_en,
    stack: p.stack,
    demo: p.demo,
    github: p.github,
    tests: p.tests,
    keyMetric: p.key_metric,
    githubStars: p.github_stars,
    githubLastPush: p.github_last_push,
    relevanceScore: Math.round(p.finalScore),
    similarity: Math.round(p.similarity * 100),
    reason: generateReason(p, visitorType, lang),
  }))
}

// ─── KEYWORD SEARCH (fallback) ─────────────────────────────────────────────
async function keywordSearch(query, visitorType, lang, topN) {
  const kb = await getKB()
  const projects = kb.projects
  const lower = query.toLowerCase()

  const scored = projects.map(project => {
    let score = 0
    const desc = (project.description[lang] || project.description.en).toLowerCase()
    const stack = (project.stack || '').toLowerCase()
    const name = project.name.toLowerCase()

    const queryWords = lower.split(/\s+/).filter(w => w.length > 2)
    queryWords.forEach(word => {
      if (name.includes(word)) score += 10
      if (stack.includes(word)) score += 8
      if (desc.includes(word)) score += 3
    })

    const techPatterns = {
      python: ['langchain', 'ad analytics', 'ai document', 'ai playground', 'hrscout'],
      react: ['langchain', 'ad analytics', 'ai playground', 'contentstudio', 'financeai', 'hrscout', 'clienthub'],
      flutter: ['mindscrolling', 'wordforge', 'quoteflow'],
      langchain: ['langchain pipeline'],
      rag: ['langchain pipeline', 'ai document', 'ai playground'],
      chatbot: ['synapse', 'chatbot'],
      ai: ['langchain', 'synapse', 'ai playground', 'contentstudio', 'hrscout', 'financeai', 'ai document', 'ad analytics'],
      automation: ['synapse', 'contentstudio', 'ad analytics'],
      mobile: ['mindscrolling', 'wordforge', 'quoteflow'],
      finance: ['financeai', 'invoice manager'],
      marketing: ['contentstudio', 'ad analytics'],
      hr: ['hrscout'],
      crm: ['clienthub'],
    }

    for (const [tech, projectNames] of Object.entries(techPatterns)) {
      if (lower.includes(tech)) {
        if (projectNames.some(p => name.includes(p.toLowerCase()) || desc.includes(p.toLowerCase()))) {
          score += 15
        }
      }
    }

    if (visitorType === 'recruiter') {
      if (project.tests) score += Math.min(project.tests / 10, 15)
      if (project.keyMetric) score += 5
    } else if (visitorType === 'client') {
      if (project.demo) score += 5
      if (/chatbot|content|analytics|crm|portal/i.test(name)) score += 10
    }

    return { ...project, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, topN).map(p => ({
    name: p.name,
    description: p.description[lang] || p.description.en,
    stack: p.stack,
    demo: p.demo,
    github: p.github,
    tests: p.tests,
    keyMetric: p.keyMetric,
    relevanceScore: p.score,
    reason: generateReason(p, visitorType, lang),
  }))
}

// ─── REASON GENERATOR ──────────────────────────────────────────────────────
function generateReason(project, visitorType, lang) {
  if (visitorType === 'recruiter') {
    return lang === 'es'
      ? `Relevante para tu búsqueda. ${project.tests ? `${project.tests} tests automatizados.` : ''} ${project.key_metric || project.keyMetric || ''}`
      : `Relevant to your search. ${project.tests ? `${project.tests} automated tests.` : ''} ${project.key_metric || project.keyMetric || ''}`
  }
  if (visitorType === 'client') {
    return lang === 'es'
      ? 'Este proyecto demuestra capacidad directa para tu necesidad. Demo en vivo disponible.'
      : 'This project demonstrates direct capability for your needs. Live demo available.'
  }
  return lang === 'es'
    ? 'Proyecto destacado con demo en vivo.'
    : 'Featured project with live demo.'
}
