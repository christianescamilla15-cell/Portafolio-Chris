/**
 * Chat Middleware Endpoint
 *
 * Middleware chain: CORS → Rate Limit (30/min) → Provider Router → Analytics
 * Provider fallback: Groq (Llama 3.3 70B) → Cloudflare Workers AI (Llama 3.1 8B) → Local KB
 *
 * Features:
 * - Multi-provider failover with cost optimization (cheapest provider first)
 * - Conversation history (last 10 messages)
 * - Visitor-type-aware system prompts (recruiter/client/developer/visitor)
 * - Recommended project context injection from semantic search
 * - UI action detection (navigate, filter, highlight) returned alongside LLM response
 * - Response normalization: all providers return { response, source, model, visitorType, actions }
 *
 * See MIDDLEWARE.md for full architecture documentation.
 */
import { PORTFOLIO_KB, getKB } from './kb.js'
import { cors } from './_lib/cors.js'
import { checkRateLimit } from './_lib/rateLimit.js'
import { logEvent, hashIP } from './_lib/analytics.js'

export default async function handler(req, res) {
  if (cors(req, res)) return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (await checkRateLimit(req, 'chat', 30)) return res.status(429).json({ error: 'Rate limit exceeded' })

  const start = Date.now()
  const ipHash = hashIP(req)

  const { message, lang = 'en', history = [], visitorType = 'visitor', conversationHistory = [], recommendedProjects = [] } = req.body
  if (!message) return res.status(400).json({ error: 'message required' })

  // Load KB from Supabase (falls back to hardcoded)
  const kb = await getKB()

  // Build context from KB
  const context = buildContext(kb, message, lang, recommendedProjects)

  // Build persona-adapted system prompt + comprehensive portfolio knowledge
  const systemPrompt = buildSystemPrompt(lang, visitorType, recommendedProjects)
  const fullSystemPrompt = systemPrompt + '\n\n' + PORTFOLIO_SYSTEM_CONTEXT + '\n\nDynamic KB Context:\n' + context

  // Build messages array with history
  const messages = [
    { role: 'system', content: fullSystemPrompt }
  ]

  // Add conversation history (from frontend "history" param or legacy "conversationHistory")
  const chatHistory = history.length > 0 ? history : conversationHistory
  chatHistory.slice(-10).forEach(msg => {
    messages.push({ role: msg.role, content: msg.content })
  })

  messages.push({ role: 'user', content: message })

  // Detect UI actions from the user's message
  const actions = detectActions(message, lang)

  // Try Groq first (Llama 3.3 70B — fast, free)
  const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
  if (GROQ_API_KEY) {
    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages,
          max_tokens: 400,
          temperature: 0.7,
        })
      })

      if (groqResponse.ok) {
        const data = await groqResponse.json()
        const text = data.choices?.[0]?.message?.content || ''
        if (text) {
          logEvent({ eventType: 'chat', visitorType, query: message?.slice(0, 200), provider: 'groq', responseTimeMs: Date.now() - start, lang, ipHash })
          return res.status(200).json({
            response: text,
            source: 'groq',
            model: 'llama-3.3-70b',
            visitorType,
            actions,
          })
        }
      }
    } catch (e) { /* fall through */ }
  }

  // Try Cloudflare Workers AI
  const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || ''
  const CF_API_TOKEN = process.env.CF_API_TOKEN || ''
  if (CF_ACCOUNT_ID && CF_API_TOKEN) {
    try {
      const cfResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${CF_API_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages, max_tokens: 400, temperature: 0.7 })
        }
      )
      if (cfResponse.ok) {
        const data = await cfResponse.json()
        const text = data.result?.response || ''
        if (text) {
          logEvent({ eventType: 'chat', visitorType, query: message?.slice(0, 200), provider: 'cloudflare', responseTimeMs: Date.now() - start, lang, ipHash })
          return res.status(200).json({ response: text, source: 'cloudflare', model: 'llama-3.1-8b', visitorType, actions })
        }
      }
    } catch (e) { /* fall through */ }
  }

  // Local fallback
  const localResponse = generateLocalResponse(kb, message, lang, visitorType, recommendedProjects)
  logEvent({ eventType: 'chat', visitorType, query: message?.slice(0, 200), provider: 'local', responseTimeMs: Date.now() - start, lang, ipHash })
  return res.status(200).json({ response: localResponse, source: 'local', visitorType, actions })
}

function buildSystemPrompt(lang, visitorType, recommendedProjects) {
  const projectNames = recommendedProjects.map(p => p.name || p).join(', ')

  const prompts = {
    recruiter: {
      en: `You are the AI assistant for Christian Hernandez Escamilla's portfolio. You are speaking with a RECRUITER. Focus on: technical depth, architecture decisions, test coverage, code quality, CI/CD practices, and team collaboration skills. Be specific about technologies, patterns (SOLID, Repository, Strategy), and metrics (1,500+ tests, 86% coverage). When mentioning projects, always include the live demo link. Keep responses concise (3-5 sentences). ${projectNames ? `The most relevant projects for this recruiter are: ${projectNames}.` : ''}`,
      es: `Eres el asistente IA del portafolio de Christian Hernandez Escamilla. Hablas con un RECLUTADOR. Enfócate en: profundidad técnica, decisiones de arquitectura, cobertura de tests, calidad de código, prácticas CI/CD, y habilidades de colaboración. Sé específico sobre tecnologías, patrones (SOLID, Repository, Strategy), y métricas (1,500+ tests, 86% cobertura). Al mencionar proyectos, incluye siempre el link a la demo. Respuestas concisas (3-5 oraciones). ${projectNames ? `Los proyectos más relevantes para este reclutador son: ${projectNames}.` : ''}`
    },
    client: {
      en: `You are the AI assistant for Christian Hernandez Escamilla's portfolio. You are speaking with a POTENTIAL CLIENT. Focus on: business value, ROI, time savings, cost reduction, scalability, and real-world impact. Use business language, not technical jargon. Mention that every project has a live demo they can try. When relevant, mention consulting availability. Keep responses warm and consultative (3-5 sentences). ${projectNames ? `The most relevant solutions for this client are: ${projectNames}.` : ''}`,
      es: `Eres el asistente IA del portafolio de Christian Hernandez Escamilla. Hablas con un CLIENTE POTENCIAL. Enfócate en: valor de negocio, ROI, ahorro de tiempo, reducción de costos, escalabilidad, e impacto real. Usa lenguaje de negocios, no jerga técnica. Menciona que cada proyecto tiene una demo en vivo. Cuando sea relevante, menciona disponibilidad para consultoría. Respuestas cálidas y consultivas (3-5 oraciones). ${projectNames ? `Las soluciones más relevantes para este cliente son: ${projectNames}.` : ''}`
    },
    developer: {
      en: `You are the AI assistant for Christian Hernandez Escamilla's portfolio. You are speaking with a FELLOW DEVELOPER. Be technical, share architecture details, mention GitHub repos, discuss trade-offs and design decisions. Be collegial. ${projectNames ? `Projects they might find interesting: ${projectNames}.` : ''}`,
      es: `Eres el asistente IA del portafolio de Christian Hernandez Escamilla. Hablas con un DESARROLLADOR. Sé técnico, comparte detalles de arquitectura, menciona repos de GitHub, discute trade-offs y decisiones de diseño. Sé colega. ${projectNames ? `Proyectos que podrían interesarle: ${projectNames}.` : ''}`
    },
    visitor: {
      en: `You are the AI assistant for Christian Hernandez Escamilla's portfolio. Answer questions about his projects, skills, experience, and availability. Be friendly, concise, and always include demo links when mentioning projects. If unsure about the visitor's intent, ask a clarifying question to better help them.`,
      es: `Eres el asistente IA del portafolio de Christian Hernandez Escamilla. Responde preguntas sobre sus proyectos, skills, experiencia y disponibilidad. Sé amigable, conciso, e incluye links de demos al mencionar proyectos. Si no estás seguro de la intención del visitante, haz una pregunta para entender mejor.`
    }
  }

  return (prompts[visitorType] || prompts.visitor)[lang] || prompts.visitor.en
}

function buildContext(kb, query, lang, recommendedProjects) {
  const parts = []
  parts.push(`About: ${kb.about[lang]}`)
  parts.push(`Skills: ${kb.skills[lang]}`)
  parts.push(`Experience: ${kb.experience[lang]}`)
  parts.push(`Contact: ${kb.contact[lang]}`)
  parts.push(`Availability: ${kb.availability[lang]}`)

  // Include recommended projects with full details
  if (recommendedProjects.length > 0) {
    parts.push('\nRecommended Projects:')
    recommendedProjects.forEach(p => {
      const project = kb.projects.find(proj => proj.name === (p.name || p))
      if (project) {
        parts.push(`- ${project.name}: ${project.description[lang] || project.description.en} Stack: ${project.stack}. Demo: ${project.demo} GitHub: ${project.github}`)
      }
    })
  } else {
    // Include all projects briefly
    kb.projects.forEach(p => {
      parts.push(`- ${p.name}: ${p.description[lang]?.slice(0, 100) || p.description.en.slice(0, 100)}... Demo: ${p.demo}`)
    })
  }

  return parts.join('\n\n')
}

function generateLocalResponse(kb, message, lang, visitorType, recommendedProjects) {
  // Same local fallback as before but adapted to visitor type
  const lower = message.toLowerCase()

  if (/hola|hello|hi|hey/i.test(lower)) {
    if (visitorType === 'recruiter') {
      return lang === 'es'
        ? '¡Hola! Veo que estás buscando talento. Christian tiene 20+ sistemas de IA en producción con 1,500+ tests. ¿Qué skills o tecnologías te interesan? Puedo recomendarte los proyectos más relevantes.'
        : "Hi! I see you're looking for talent. Christian has 20+ production AI systems with 1,500+ tests. What skills or technologies interest you? I can recommend the most relevant projects."
    }
    if (visitorType === 'client') {
      return lang === 'es'
        ? '¡Hola! Bienvenido. Puedo mostrarte soluciones que Christian ha construido para resolver necesidades como la tuya. ¿Qué tipo de proyecto necesitas? Chatbot, automatización, dashboard, o algo más?'
        : "Hi! Welcome. I can show you solutions Christian has built for needs like yours. What type of project do you need? Chatbot, automation, dashboard, or something else?"
    }
    return lang === 'es'
      ? '¡Hola! Soy el asistente del portafolio de Christian. Puedo ayudarte a explorar sus 20+ proyectos en producción, sus skills técnicos, o su experiencia. ¿Qué te gustaría conocer?'
      : "Hi! I'm Christian's portfolio assistant. I can help you explore his 20+ production projects, technical skills, or experience. What would you like to know?"
  }

  // Project listing
  if (/project|proyecto|demo|built|construi|show|muestra/i.test(lower)) {
    if (recommendedProjects.length > 0) {
      const list = recommendedProjects.map(p => `• ${p.name}${p.tests ? ` (${p.tests} tests)` : ''} — ${p.demo}`).join('\n')
      return lang === 'es'
        ? `Basado en tu perfil, estos proyectos son los más relevantes:\n\n${list}\n\n¿Quieres que te cuente más de alguno?`
        : `Based on your profile, these projects are the most relevant:\n\n${list}\n\nWant me to tell you more about any of them?`
    }
    const list = kb.projects.slice(0, 6).map(p => `• ${p.name}${p.tests ? ` (${p.tests} tests)` : ''} — ${p.demo}`).join('\n')
    return lang === 'es'
      ? `Christian tiene 20+ proyectos. Los principales:\n\n${list}\n\n¿Quieres saber más de alguno?`
      : `Christian has 20+ projects. The main ones:\n\n${list}\n\nWant to know more about any?`
  }

  if (/skill|habilidad|tech|stack/i.test(lower)) return kb.skills[lang]
  if (/experience|experiencia|work|trabajo/i.test(lower)) return kb.experience[lang]
  if (/contact|contacto|email|phone/i.test(lower)) return kb.contact[lang]
  if (/available|disponible|hire|contratar/i.test(lower)) return kb.availability[lang]

  return lang === 'es'
    ? 'Puedo ayudarte con información sobre proyectos, skills, experiencia, disponibilidad o contacto de Christian. ¿Qué te interesa?'
    : "I can help with information about Christian's projects, skills, experience, availability, or contact info. What interests you?"
}

// ─── UI ACTIONS DETECTION ──────────────────────────────────────────────────
// Parses user intent and returns structured actions for the frontend to execute
function detectActions(message, lang) {
  const lower = message.toLowerCase()
  const actions = []

  // ── Navigate to section ──
  if (/skill|habilidad|tech|stack|tecnolog/i.test(lower)) {
    actions.push({ type: 'navigate', target: '#skills' })
  }
  if (/contact|contacto|email|correo|phone|tel[eé]fono|hablar|llam/i.test(lower)) {
    actions.push({ type: 'navigate', target: '#contact' })
  }
  if (/about|sobre\s?(m[ií]|él|christian)|who|qui[eé]n/i.test(lower)) {
    actions.push({ type: 'navigate', target: '#about' })
  }

  // ── Filter by category ──
  if (/chatbot|agente|agent|nlp|llm|ia\b|ai\b|inteligencia/i.test(lower) && /show|muestra|ver|filtr|proyecto|project/i.test(lower)) {
    actions.push({ type: 'filter', category: 'ai' })
    actions.push({ type: 'navigate', target: '#projects' })
  }
  if (/mobile|m[oó]vil|flutter|kotlin|android|app\b/i.test(lower) && /show|muestra|ver|filtr|proyecto|project/i.test(lower)) {
    actions.push({ type: 'filter', category: 'mobile' })
    actions.push({ type: 'navigate', target: '#projects' })
  }
  if (/full.?stack|backend|frontend|web|laravel|vue/i.test(lower) && /show|muestra|ver|filtr|proyecto|project/i.test(lower)) {
    actions.push({ type: 'filter', category: 'fullstack' })
    actions.push({ type: 'navigate', target: '#projects' })
  }

  // ── Show all projects ──
  if (/todos.*proyecto|all.*project|ver todos|show all|muestra.*todos/i.test(lower)) {
    actions.push({ type: 'filter', category: 'all' })
    actions.push({ type: 'showAll' })
    actions.push({ type: 'navigate', target: '#projects' })
  }

  // ── Highlight specific project ──
  const projectMap = {
    'chatbot': 'Chatbot Multiagente',
    'multiagente': 'Chatbot Multiagente',
    'synapse': 'Chatbot Multiagente',
    'content': 'ContentStudio AI',
    'contentstudio': 'ContentStudio AI',
    'finance': 'FinanceAI Dashboard',
    'financiai': 'FinanceAI Dashboard',
    'dashboard financiero': 'FinanceAI Dashboard',
    'hrscout': 'HRScout',
    'hr scout': 'HRScout',
    'cv': 'HRScout',
    'clienthub': 'ClientHub',
    'client hub': 'ClientHub',
    'portal': 'ClientHub',
    'multi-agent': 'Multi-Agent Build System',
    'orquestador': 'Multi-Agent Build System',
    'mindscrolling': 'MindScrolling',
    'mind scrolling': 'MindScrolling',
    'wordforge': 'WordForge',
    'word forge': 'WordForge',
    'quoteflow': 'QuoteFlow',
    'invoice': 'Invoice Manager',
    'factura': 'Invoice Manager',
    'langchain': 'LangChain Pipeline',
    'pipeline': 'LangChain Pipeline',
    'ad analytics': 'Ad Analytics Pipeline',
    'marketing': 'Ad Analytics Pipeline',
    'document': 'AI Document Pipeline',
    'crewai': 'AI Document Pipeline',
    'agenticdev': 'AgenticDev Framework',
    'lobos': 'Lobos de la Montaña',
    'wolves': 'Lobos de la Montaña',
    'esencia': 'La 5ta Esencia',
    'playwright': 'Playwright Automation',
    'scraper': 'Playwright Automation',
    'fine-tuning': 'Fine-tuning Demo',
    'fine tuning': 'Fine-tuning Demo',
    'distilbert': 'Fine-tuning Demo',
  }

  for (const [keyword, projectTitle] of Object.entries(projectMap)) {
    if (lower.includes(keyword)) {
      actions.push({ type: 'highlight', project: projectTitle })
      // Navigate to projects if not already navigating
      if (!actions.some(a => a.target === '#projects')) {
        actions.push({ type: 'navigate', target: '#projects' })
      }
      break
    }
  }

  // ── Navigate to all projects when asking about projects generically ──
  if (actions.length === 0 && /project|proyecto|demo|built|construi|portafolio/i.test(lower)) {
    actions.push({ type: 'navigate', target: '#projects' })
  }

  return actions
}

// ─── COMPREHENSIVE PORTFOLIO KNOWLEDGE ─────────────────────────────────────
// Embedded in every Groq request so the LLM has full context about Christian
const PORTFOLIO_SYSTEM_CONTEXT = `
## About Christian
- AI Engineer with 3+ years experience
- Creator of AIOS — AI Engineering OS published on PyPI (pip install aios-kiro-master)
- Based in CDMX, Mexico. Available remote or on-site.
- Contact: christianescamilla15@gmail.com | +52 55 7960 5324

## Projects (20+ production systems, 1,500+ tests):

1. NexusForge AI — AI SaaS orchestration platform (FLAGSHIP)
   - 24 AI agents, 6 swarm topologies, 3-tier memory, self-healing
   - Auth + Stripe billing (Free/Pro $29/Team $99/Enterprise)
   - AI Workflow Wizard — generates DAGs from natural language
   - Drag-and-drop visual workflow builder
   - 4 LLM providers (Groq, Claude, GPT-4o, GPT-4o-mini) — users bring their own keys
   - 10 integrations (Email, Notion, Slack, WhatsApp, Drive, Gmail, Calendar, Webhook)
   - API keys, audit trail, custom agents, rate limiting
   - 260 pytest tests
   - Demo: https://nexusforge-two.vercel.app

2. MultiAgente — Resident support system (9 AI agents)
   - 9 agents including SalesAgent with 3 apartment tiers (Estandar/Deluxe/Penthouse)
   - WhatsApp bot with #soporte 5-min sessions, voice transcription (Groq Whisper)
   - Real-time WebSocket dashboard, OTP verification, 500 residents
   - Demo: https://chatbot-multiagente-ia.vercel.app

3. MindScrolling — Anti doom-scrolling Flutter app
   - Published on Google Play Store, 19K+ quotes, 81 users, 428 authors
   - Social feed, streaks, home screen widget, push notifications (FCM)
   - Stripe payments (7 products: Inside $4.99, 6 packs $2.99)
   - Multi-interest onboarding, RLS security on 12 tables

4. AIOS — AI Engineering Operating System
   - Published on PyPI: pip install aios-kiro-master
   - 30 CLI commands, persistent memory (17KB after 6 months)
   - Voice input (mic, WhatsApp, audio file), memory-aware routing
   - Kiro IDE Power + VS Code extension + MCP server (8 tools)
   - Auto-steering generator, session continuity detection

5. FinanceAI Dashboard — Anomaly detection + forecasting (83 tests)
   - Demo: https://finance-ai-dashboard-omega.vercel.app
6. HRScout — CV screening with 4 agents (103 tests)
   - Demo: https://hr-scout-llm.vercel.app
7. ContentStudio AI — 7-agent content generator (103 tests)
   - Demo: https://content-studio-ai-blush.vercel.app
8. ClientHub — AI client portal with Kanban (113 tests)
   - Demo: https://client-hub-nocode.vercel.app

## Portfolio & Links
- Portfolio: https://ch65-portfolio.vercel.app
- GitHub: https://github.com/christianescamilla15-cell
- LinkedIn: https://linkedin.com/in/christian-hernandez-escamilla
- AIOS PyPI: https://pypi.org/project/aios-kiro-master/

## Tech Stack
Python, FastAPI, React, Node.js, Flutter, PostgreSQL, Supabase, pgvector, Redis, Stripe, Firebase, Docker, Terraform, Groq, Claude API, OpenAI, Kiro IDE

## Skills
- AI/ML: Claude API, Groq, OpenAI GPT-4o, LangChain, CrewAI, RAG, embeddings, RLHF
- Multi-agent orchestration, swarm topologies, self-healing, MCP servers
- Full-stack: React, FastAPI, Node.js, Flutter, Stripe, Firebase
- DevOps: Docker, Terraform, GitHub Actions, CI/CD, Render, Vercel
- Testing: 1,500+ tests (pytest, Vitest)
- Tools: AIOS (own framework), Kiro IDE, VS Code extensions

## Response rules
- Respond in the same language as the user's message (Spanish or English).
- Be helpful, specific, and reference real project details.
- ALWAYS use markdown link format: [Project Name](demo_url).
- ONLY use URLs listed above. NEVER invent URLs.
- If asked about hiring/availability, mention available immediately for remote or on-site.
- Keep responses concise (3-6 sentences). Use bullet points for lists.
`
