/**
 * Visitor Classification Middleware
 *
 * Middleware chain: CORS → Rate Limit (60/min) → HuggingFace Zero-Shot → Analytics
 * Provider fallback: HuggingFace (mDeBERTa-v3-base-mnli-xnli) → Local keyword regex
 *
 * Classifies visitors into: recruiter, developer, client, student, visitor
 * Returns confidence scores (0-100) and full profile with all category probabilities.
 * Bilingual classification labels (EN/ES) for accurate multilingual intent detection.
 *
 * See MIDDLEWARE.md for full architecture documentation.
 */
import { cors } from './_lib/cors.js'
import { checkRateLimit } from './_lib/rateLimit.js'
import { logEvent, hashIP } from './_lib/analytics.js'

export default async function handler(req, res) {
  if (cors(req, res)) return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (await checkRateLimit(req, 'classify', 60)) return res.status(429).json({ error: 'Rate limit exceeded' })

  const start = Date.now()

  const { message, lang = 'en' } = req.body
  if (!message) return res.status(400).json({ error: 'message required' })

  const HF_TOKEN = process.env.HF_TOKEN || ''

  // Labels for zero-shot classification
  const labels = lang === 'es'
    ? ['reclutador buscando talento', 'cliente buscando servicios de consultoría', 'desarrollador explorando proyectos', 'estudiante aprendiendo', 'visitante curioso']
    : ['recruiter looking for talent', 'client looking for consulting services', 'developer exploring projects', 'student learning', 'curious visitor']

  try {
    const response = await fetch(
      'https://router.huggingface.co/models/MoritzLaurer/mDeBERTa-v3-base-mnli-xnli',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(HF_TOKEN ? { 'Authorization': `Bearer ${HF_TOKEN}` } : {})
        },
        body: JSON.stringify({
          inputs: message,
          parameters: { candidate_labels: labels }
        })
      }
    )

    if (response.ok) {
      const data = await response.json()
      // Map labels back to simple types
      const typeMap = {}
      if (lang === 'es') {
        typeMap['reclutador buscando talento'] = 'recruiter'
        typeMap['cliente buscando servicios de consultoría'] = 'client'
        typeMap['desarrollador explorando proyectos'] = 'developer'
        typeMap['estudiante aprendiendo'] = 'student'
        typeMap['visitante curioso'] = 'visitor'
      } else {
        typeMap['recruiter looking for talent'] = 'recruiter'
        typeMap['client looking for consulting services'] = 'client'
        typeMap['developer exploring projects'] = 'developer'
        typeMap['student learning'] = 'student'
        typeMap['curious visitor'] = 'visitor'
      }

      const topLabel = data.labels?.[0] || ''
      const topScore = data.scores?.[0] || 0
      const visitorType = typeMap[topLabel] || 'visitor'

      // Build profile with all scores
      const profile = {}
      if (data.labels && data.scores) {
        data.labels.forEach((label, i) => {
          profile[typeMap[label] || label] = Math.round(data.scores[i] * 100)
        })
      }

      logEvent({ eventType: 'classify', visitorType, provider: 'huggingface', responseTimeMs: Date.now() - start, lang, ipHash: hashIP(req) })
      return res.status(200).json({
        type: visitorType,
        confidence: Math.round(topScore * 100),
        profile,
        source: 'huggingface',
        model: 'mDeBERTa-v3-base-mnli-xnli'
      })
    }
  } catch (e) {
    // Fall through to local
  }

  // Local fallback — keyword-based classification
  const lower = message.toLowerCase()
  let type = 'visitor'
  if (/recruit|hiring|talent|hr|looking for|busco talento|vacante|candidato|contratar/i.test(lower)) type = 'recruiter'
  else if (/servicio|service|consult|project|presupuesto|budget|need.*built|necesito.*construir|automat|chatbot/i.test(lower)) type = 'client'
  else if (/developer|code|github|open source|contribu|stack|framework/i.test(lower)) type = 'developer'
  else if (/learn|student|estudi|aprend|tutorial|course|ejemplo/i.test(lower)) type = 'student'

  logEvent({ eventType: 'classify', visitorType: type, provider: 'local', responseTimeMs: Date.now() - start, lang, ipHash: hashIP(req) })
  return res.status(200).json({ type, confidence: 70, profile: { [type]: 70 }, source: 'local' })
}
