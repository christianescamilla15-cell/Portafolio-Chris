import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { trackEvent } from './hooks/useAnalytics'

// ─── QUICK ACTIONS ──────────────────────────────────────────────────────────
const QUICK_ACTIONS = {
  en: [
    { label: "View all projects", query: "Show me all of Christian's projects with demos", icon: "grid" },
    { label: "AI experience", query: "What AI and LLM experience does Christian have?", icon: "brain" },
    { label: "Technical skills", query: "What programming languages and tools does Christian use?", icon: "code" },
    { label: "Contact info", query: "How can I contact Christian?", icon: "mail" },
    { label: "Best projects", query: "What are Christian's top 3 most impressive projects?", icon: "star" },
    { label: "Summary for recruiter", query: "Summarize for recruiter", icon: "briefcase" },
  ],
  es: [
    { label: "Ver proyectos", query: "Muéstrame todos los proyectos de Christian con demos", icon: "grid" },
    { label: "Experiencia IA", query: "¿Qué experiencia tiene Christian en IA y LLMs?", icon: "brain" },
    { label: "Skills técnicos", query: "¿Qué lenguajes y herramientas usa Christian?", icon: "code" },
    { label: "Contacto", query: "¿Cómo puedo contactar a Christian?", icon: "mail" },
    { label: "Mejores proyectos", query: "¿Cuáles son los 3 proyectos más impresionantes de Christian?", icon: "star" },
    { label: "Resumen para reclutador", query: "Resume para reclutador", icon: "briefcase" },
  ]
}

const HOVER_MENU = {
  en: [
    { label: "AI Projects", query: "Show me projects with AI and chatbots", icon: "🤖" },
    { label: "Full Stack", query: "Show me full stack projects", icon: "⚡" },
    { label: "Mobile Apps", query: "Show me mobile apps", icon: "📱" },
    { label: "Talk to me", query: null, icon: "💬" },
  ],
  es: [
    { label: "Proyectos IA", query: "Muéstrame proyectos de IA y chatbots", icon: "🤖" },
    { label: "Full Stack", query: "Muéstrame proyectos full stack", icon: "⚡" },
    { label: "Apps Mobile", query: "Muéstrame las apps móviles", icon: "📱" },
    { label: "Hablar", query: null, icon: "💬" },
  ]
}

const WELCOME = {
  en: "Hi! I'm Christian's AI assistant. I can navigate you through his portfolio, show specific projects, and answer any questions. Try asking me anything!",
  es: "¡Hola! Soy el asistente IA de Christian. Puedo navegar por su portafolio, mostrarte proyectos específicos y responder cualquier pregunta. ¡Pregúntame lo que quieras!"
}

// ─── ROLE-BASED SUMMARY PROMPTS (Phase 8, Feature 2) ─────────────────────
const SUMMARY_ROLES = {
  recruiter: {
    en: 'Summarize Christian\'s portfolio for a technical recruiter. Highlight: production-ready systems, test coverage (1,500+ tests), team collaboration, availability, and why he\'s a strong hire. Be concise and persuasive.',
    es: 'Resume el portafolio de Christian para un reclutador técnico. Destaca: sistemas en producción, cobertura de tests (1,500+), colaboración en equipo, disponibilidad, y por qué es un candidato fuerte. Sé conciso y persuasivo.',
  },
  cto: {
    en: 'Summarize Christian\'s portfolio for a CTO or VP of Engineering. Focus on: system architecture, scalability decisions, multi-agent orchestration patterns, production deployment strategy, and technical trade-offs. Be detailed and technical.',
    es: 'Resume el portafolio de Christian para un CTO o VP de Ingeniería. Enfócate en: arquitectura de sistemas, decisiones de escalabilidad, patrones de orquestación multi-agente, estrategia de despliegue a producción, y trade-offs técnicos.',
  },
  developer: {
    en: 'Summarize Christian\'s portfolio for a fellow developer. Focus on: tech stack choices (React, Node.js, Python, Claude API), code quality patterns, testing strategy, CI/CD, and interesting implementation details.',
    es: 'Resume el portafolio de Christian para un desarrollador. Enfócate en: stack tecnológico (React, Node.js, Python, Claude API), patrones de calidad de código, estrategia de testing, CI/CD, y detalles interesantes de implementación.',
  },
  investor: {
    en: 'Summarize Christian\'s portfolio for an investor or business stakeholder. Focus on: business impact, ROI of AI automation, market-ready products, and scalability potential.',
    es: 'Resume el portafolio de Christian para un inversionista. Enfócate en: impacto de negocio, ROI de automatización con IA, productos listos para mercado, y potencial de escalabilidad.',
  },
  designer: {
    en: 'Summarize Christian\'s portfolio for a UI/UX designer. Focus on: design system, animation approach (GSAP, Lenis), responsive design, accessibility, and user experience decisions.',
    es: 'Resume el portafolio de Christian para un diseñador UI/UX. Enfócate en: sistema de diseño, approach de animaciones (GSAP, Lenis), diseño responsivo, accesibilidad, y decisiones de UX.',
  },
}

function detectSummaryRole(text) {
  const lower = text.toLowerCase()
  const match = lower.match(/(?:summarize|resume|resumen)\s+(?:for|para)\s+(?:a\s+|un\s+)?(\w+)/)
  if (!match) return null
  const role = match[1]
  // Map aliases
  const aliases = {
    recruiter: 'recruiter', reclutador: 'recruiter', reclutadora: 'recruiter', hr: 'recruiter',
    cto: 'cto', vp: 'cto', architect: 'cto', arquitecto: 'cto',
    developer: 'developer', dev: 'developer', programador: 'developer', desarrollador: 'developer',
    investor: 'investor', inversionista: 'investor', business: 'investor', negocio: 'investor',
    designer: 'designer', disenador: 'designer', diseñador: 'designer', ux: 'designer', ui: 'designer',
  }
  return aliases[role] || null
}

// ─── LANGUAGE DETECTION ─────────────────────────────────────────────────────
function detectLanguage(text) {
  const esWords = ['hola', 'que', 'como', 'cuales', 'tiene', 'puede', 'sobre', 'quiero', 'saber', 'dime', 'muestra', 'cual', 'proyecto', 'experiencia', 'habilidad', 'contacto', 'disponible', 'contratar', 'muestrame', 'cuantos', 'donde']
  const enWords = ['hello', 'hi', 'what', 'how', 'which', 'has', 'can', 'about', 'want', 'tell', 'show', 'project', 'experience', 'skill', 'contact', 'available', 'hire', 'does', 'the', 'his', 'have']
  const norm = text.toLowerCase()
  let es = 0, en = 0
  esWords.forEach(w => { if (norm.includes(w)) es++ })
  enWords.forEach(w => { if (norm.includes(w)) en++ })
  return en > es ? 'en' : 'es'
}

// ─── DISPATCH ACTION TO APP ─────────────────────────────────────────────────
function dispatchActions(actions) {
  if (!actions?.length) return
  actions.forEach(action => {
    window.dispatchEvent(new CustomEvent('chat-action', { detail: action }))
  })
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────
let msgId = 0
const ts = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
const accent = '#6366F1'

export default function PortfolioChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [lang, setLang] = useState('es')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const recognitionRef = useRef(null)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768)
  const [feedbackGiven, setFeedbackGiven] = useState({}) // { [msgId]: 'up' | 'down' }
  const msgsRef = useRef(null)
  const inputRef = useRef(null)
  const menuTimer = useRef(null)
  const bubbleRef = useRef(null)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Feature 2: Proactive recruiter greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      const ref = window.__portfolioRef || ''
      if (ref.includes('linkedin') || ref.includes('recruiter') || ref.includes('indeed')) {
        if (!isOpen && messages.length === 0) {
          setIsOpen(true)
          const recruiterGreeting = lang === 'es'
            ? '¡Hola! Veo que vienes de LinkedIn. ¿Te gustaría ver mis 3 mejores proyectos o descargar mi CV?'
            : "Hi! I see you came from LinkedIn. Would you like to see my top 3 projects or download my CV?"
          setTimeout(() => {
            setMessages([{ id: ++msgId, role: 'bot', text: recruiterGreeting, ts: ts(), source: null }])
          }, 300)
        }
      }
    }, 10000)
    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const scroll = () => setTimeout(() => msgsRef.current?.scrollTo({ top: msgsRef.current.scrollHeight, behavior: 'smooth' }), 50)

  const open = useCallback(() => {
    setIsOpen(true)
    setShowMenu(false)
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([{ id: ++msgId, role: 'bot', text: WELCOME[lang], ts: ts(), source: null }])
        scroll()
      }, 200)
    }
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [messages.length, lang])

  // Feature 3: Send chat analytics summary on close
  const close = useCallback(() => {
    setIsOpen(false)
    const userMsgs = messages.filter(m => m.role === 'user')
    const botMsgs = messages.filter(m => m.role === 'bot')
    const fallbacks = botMsgs.filter(m => m.source === 'offline')
    if (userMsgs.length > 0) {
      trackEvent('chat_session', {
        totalMessages: userMsgs.length,
        botResponses: botMsgs.length,
        fallbackCount: fallbacks.length,
        fallbackRate: botMsgs.length > 0 ? Math.round((fallbacks.length / botMsgs.length) * 100) : 0,
        lang,
      })
    }
  }, [messages, lang])

  const toggleLang = useCallback(() => {
    const newLang = lang === 'es' ? 'en' : 'es'
    setLang(newLang)
    const note = newLang === 'en' ? 'Switched to English.' : 'Cambiado a español.'
    setMessages(prev => [...prev, { id: ++msgId, role: 'bot', text: note, ts: ts(), source: null }])
    setShowQuickActions(true)
    scroll()
  }, [lang])

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim()
    if (!trimmed || loading) return
    setInput('')
    setShowQuickActions(false)

    const detected = detectLanguage(trimmed)
    if (messages.length < 4 && detected !== lang) setLang(detected)
    const activeLang = messages.length < 4 ? detected : lang

    setMessages(prev => [...prev, { id: ++msgId, role: 'user', text: trimmed, ts: ts(), source: null }])
    scroll()
    setLoading(true)

    try {
      // Build conversation history from existing messages (exclude system/welcome)
      const history = messages
        .filter(m => m.role === 'user' || m.role === 'bot')
        .slice(-10)
        .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text }))

      // Phase 8: Detect "summarize for [role]" command
      const summaryRole = detectSummaryRole(trimmed)
      const payload = { message: trimmed, history, lang: activeLang }
      if (summaryRole && SUMMARY_ROLES[summaryRole]) {
        payload.systemHint = SUMMARY_ROLES[summaryRole][activeLang] || SUMMARY_ROLES[summaryRole].en
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, {
          id: ++msgId,
          role: 'bot',
          text: data.response,
          ts: ts(),
          source: data.source || 'local',
        }])
        scroll()
        setLoading(false)

        // Execute UI actions from the API
        if (data.actions?.length) {
          setTimeout(() => dispatchActions(data.actions), 300)
        }
        return
      }
    } catch { /* fallback */ }

    const fallback = activeLang === 'es'
      ? 'Disculpa, el servicio no está disponible. Contacta a Christian en chris_231011@hotmail.com'
      : "Sorry, the service is unavailable. Reach Christian at chris_231011@hotmail.com"
    setMessages(prev => [...prev, { id: ++msgId, role: 'bot', text: fallback, ts: ts(), source: 'offline' }])
    scroll()
    setLoading(false)
  }, [input, loading, messages, lang])

  const quickActions = useMemo(() => QUICK_ACTIONS[lang], [lang])
  const hoverMenu = useMemo(() => HOVER_MENU[lang], [lang])

  // Feature 4: Chatbot Satisfaction Feedback
  const handleFeedback = useCallback((msgId, rating) => {
    setFeedbackGiven(prev => ({ ...prev, [msgId]: rating }))
    trackEvent('chat_feedback', { msgId, rating, lang })
  }, [lang])

  const formatMsg = (text) => text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#818CF8;text-decoration:underline;word-break:break-all">$1</a>')
    .replace(/(?<!\])\(?(https?:\/\/[^\s)<>]+)\)?/g, (match, url) => {
      // Skip if already inside an href (already converted by markdown link above)
      if (match.includes('href=')) return match
      const clean = url.replace(/[.,;:!?)]+$/, '')
      const label = clean.replace(/^https?:\/\//, '').replace(/\/$/, '').slice(0, 40)
      return `<a href="${clean}" target="_blank" rel="noopener" style="color:#818CF8;text-decoration:underline;word-break:break-all">${label}</a>`
    })
    .replace(/\n/g, '<br/>')

  const sourceBadge = (source) => {
    if (!source || source === 'offline') return ''
    const labels = { groq: 'Llama 3.3 70B', cloudflare: 'Llama 3.1', local: 'Local AI' }
    const text = labels[source] || source
    return ` <span style="display:inline-block;margin-top:4px;padding:1px 6px;border-radius:6px;font-size:9px;font-weight:600;background:${accent}15;color:${accent};border:1px solid ${accent}25">${text}</span>`
  }

  return (
    <div style={{ position: 'fixed', bottom: isMobile ? 0 : 24, right: isMobile ? 0 : 24, zIndex: 9999, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ─── HOVER MENU (shows on bubble hover) ─── */}
      {showMenu && !isOpen && (
        <div
          onMouseEnter={() => clearTimeout(menuTimer.current)}
          onMouseLeave={() => { menuTimer.current = setTimeout(() => setShowMenu(false), 400) }}
          style={{
            position: 'absolute', bottom: 68, right: 0,
            display: 'flex', flexDirection: 'column', gap: 6,
            animation: 'menuSlideIn 0.25s ease',
          }}
        >
          {hoverMenu.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                if (item.query) {
                  open()
                  setTimeout(() => sendMessage(item.query), 400)
                } else {
                  open()
                }
                setShowMenu(false)
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#161E2E', border: `1px solid ${accent}25`,
                borderRadius: 14, padding: '10px 18px', cursor: 'pointer',
                color: '#D1D5DB', fontSize: 13, fontWeight: 500,
                whiteSpace: 'nowrap', transition: 'all 0.2s',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                fontFamily: "'DM Sans', sans-serif",
                animation: `menuItemIn 0.2s ease ${i * 0.05}s both`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${accent}20`; e.currentTarget.style.borderColor = `${accent}50` }}
              onMouseLeave={e => { e.currentTarget.style.background = '#161E2E'; e.currentTarget.style.borderColor = `${accent}25` }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* ─── FLOATING BUBBLE ─── */}
      <div
        ref={bubbleRef}
        onMouseEnter={() => { clearTimeout(menuTimer.current); if (!isOpen) setShowMenu(true) }}
        onMouseLeave={() => { menuTimer.current = setTimeout(() => setShowMenu(false), 400) }}
        style={{ display: 'flex', alignItems: 'center', gap: 0 }}
      >
        {/* "Preguntame" label */}
        {!isOpen && (
          <div
            onClick={open}
            style={{
              background: '#161E2E', border: `1px solid ${accent}30`,
              borderRight: 'none', borderRadius: '14px 0 0 14px',
              padding: '12px 16px 12px 18px', cursor: 'pointer',
              color: '#C7D2FE', fontSize: 13, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
              transition: 'all 0.3s ease',
              animation: 'labelPulse 3s ease-in-out infinite',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${accent}20`; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#161E2E'; e.currentTarget.style.color = '#C7D2FE' }}
          >
            {lang === 'es' ? 'Pregúntame' : 'Ask me'}
          </div>
        )}

        {/* FAB button */}
        <button
          onClick={() => { if (isOpen) close(); else open() }}
          style={{
            width: 54, height: 54,
            borderRadius: isOpen ? '50%' : '0 50% 50% 0',
            border: 'none',
            background: `linear-gradient(135deg, ${accent}, #818CF8)`,
            color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 24px ${accent}40`,
            transition: 'all 0.3s ease',
            position: 'relative', zIndex: 2, flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = `0 6px 32px ${accent}60` }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 4px 24px ${accent}40` }}
        >
          {isOpen ? (
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          )}
          {/* Notification dot */}
          {!isOpen && messages.length === 0 && (
            <span style={{
              position: 'absolute', top: -2, right: -2, width: 12, height: 12,
              background: '#10B981', borderRadius: '50%', border: '2px solid #0F1624',
              animation: 'pulse 2s infinite',
            }} />
          )}
        </button>
      </div>

      {/* ─── CHAT PANEL ─── */}
      <div style={{
        position: isMobile ? 'fixed' : 'absolute',
        bottom: isMobile ? 0 : 68,
        right: isMobile ? 0 : 0,
        width: isMobile ? '100vw' : 400,
        height: isMobile ? '100vh' : undefined,
        maxHeight: isMobile ? '100vh' : (isOpen ? 560 : 0),
        overflow: 'hidden',
        background: '#0F1624', border: isMobile ? 'none' : `1px solid ${accent}20`,
        borderRadius: isMobile ? 0 : 20, boxShadow: `0 16px 64px rgba(0,0,0,0.5), 0 0 0 1px ${accent}08`,
        display: 'flex', flexDirection: 'column',
        opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.95)',
        transition: 'max-height 0.35s ease, opacity 0.25s ease, transform 0.25s ease',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}>

        {/* Header */}
        <div style={{
          padding: '14px 18px', borderBottom: `1px solid ${accent}12`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0, background: `linear-gradient(135deg, ${accent}08, transparent)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              background: `linear-gradient(135deg, ${accent}, #818CF8)`,
              padding: 1.5, overflow: 'hidden',
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>CH</span>
            </div>
            <div>
              <span style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#F9FAFB' }}>
                {lang === 'es' ? 'Asistente IA' : 'AI Assistant'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 6px #34D399' }} />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                  {lang === 'es' ? 'Navega tu portafolio' : 'Navigate your portfolio'}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Lang toggle */}
            <button onClick={toggleLang} style={{
              background: `${accent}12`, border: `1px solid ${accent}25`, borderRadius: 8,
              padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700,
              color: '#818CF8', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
            }}>
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={msgsRef} style={{
          flex: 1, overflowY: 'auto', padding: 14, display: 'flex',
          flexDirection: 'column', gap: 10, maxHeight: isMobile ? 'none' : 340, minHeight: 80,
        }}>
          {messages.map(msg => (
            <div key={msg.id} style={{
              maxWidth: '88%',
              alignSelf: msg.role === 'bot' ? 'flex-start' : 'flex-end',
              animation: 'msgIn 0.25s ease',
            }}>
              <div style={{
                padding: '10px 14px', borderRadius: 14, fontSize: 12.5, lineHeight: 1.6,
                wordBreak: 'break-word', overflowWrap: 'break-word',
                ...(msg.role === 'bot'
                  ? { background: '#161E2E', color: '#D1D5DB', borderBottomLeftRadius: 4 }
                  : { background: `${accent}20`, color: '#C7D2FE', borderBottomRightRadius: 4 }),
              }} dangerouslySetInnerHTML={{
                __html: formatMsg(msg.text) + (msg.role === 'bot' ? sourceBadge(msg.source) : '')
              }} />
              {msg.role === 'bot' && msg.source && msg.source !== 'offline' && (
                <div style={{ display: 'flex', gap: 4, marginTop: 2, marginLeft: 4 }}>
                  <button
                    onClick={() => handleFeedback(msg.id, 'up')}
                    disabled={!!feedbackGiven[msg.id]}
                    style={{
                      background: 'none', border: 'none', cursor: feedbackGiven[msg.id] ? 'default' : 'pointer',
                      opacity: feedbackGiven[msg.id] === 'up' ? 1 : feedbackGiven[msg.id] ? 0.2 : 0.35,
                      fontSize: 13, padding: '2px 4px', transition: 'opacity 0.2s',
                      filter: feedbackGiven[msg.id] === 'up' ? 'none' : 'grayscale(0.5)',
                    }}
                    title="Helpful"
                  >{'\uD83D\uDC4D'}</button>
                  <button
                    onClick={() => handleFeedback(msg.id, 'down')}
                    disabled={!!feedbackGiven[msg.id]}
                    style={{
                      background: 'none', border: 'none', cursor: feedbackGiven[msg.id] ? 'default' : 'pointer',
                      opacity: feedbackGiven[msg.id] === 'down' ? 1 : feedbackGiven[msg.id] ? 0.2 : 0.35,
                      fontSize: 13, padding: '2px 4px', transition: 'opacity 0.2s',
                      filter: feedbackGiven[msg.id] === 'down' ? 'none' : 'grayscale(0.5)',
                    }}
                    title="Not helpful"
                  >{'\uD83D\uDC4E'}</button>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{
              alignSelf: 'flex-start', display: 'flex', gap: 5,
              padding: '12px 16px', background: '#161E2E', borderRadius: 14, borderBottomLeftRadius: 4,
            }}>
              {[0,1,2].map(i => <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%', background: '#818CF8',
                animation: `pulseDot 1.2s ease-in-out ${i*0.2}s infinite`,
              }} />)}
            </div>
          )}
        </div>

        {/* Quick Actions (first message) */}
        {showQuickActions && messages.length <= 1 && (
          <div style={{ padding: '4px 14px 8px', display: 'flex', flexWrap: 'wrap', gap: 5, maxHeight: isMobile ? 80 : 'none', overflowY: isMobile ? 'auto' : 'visible' }}>
            {quickActions.map(qa => (
              <button key={qa.label} onClick={() => { trackEvent('chat_quick_action', { label: qa.label, lang }); sendMessage(qa.query) }} disabled={loading} style={{
                background: `${accent}08`, border: `1px solid ${accent}20`, color: '#A5B4FC',
                padding: '5px 12px', borderRadius: 14, fontSize: 10, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', transition: 'all 0.15s',
                fontWeight: 500,
              }}
                onMouseEnter={e => { e.target.style.background = `${accent}18`; e.target.style.color = '#C7D2FE' }}
                onMouseLeave={e => { e.target.style.background = `${accent}08`; e.target.style.color = '#A5B4FC' }}
              >{qa.label}</button>
            ))}
          </div>
        )}

        {/* Suggestion pills */}
        {(!showQuickActions || messages.length > 1) && (
          <div style={{
            display: 'flex', gap: 5, padding: '4px 14px 8px',
            overflowX: 'auto', flexWrap: 'nowrap', flexShrink: 0,
          }}>
            {(lang === 'es'
              ? ['Ver proyectos IA', 'Full Stack', 'Mobile', 'Skills', 'Contacto']
              : ['AI Projects', 'Full Stack', 'Mobile', 'Skills', 'Contact']
            ).map(s => (
              <button key={s} onClick={() => sendMessage(s)} disabled={loading} style={{
                background: 'transparent', border: `1px solid ${accent}18`, color: '#818CF8',
                padding: '4px 10px', borderRadius: 14, fontSize: 10, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', flexShrink: 0,
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.target.style.background = `${accent}12` }}
                onMouseLeave={e => { e.target.style.background = 'transparent' }}
              >{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{
          display: 'flex', gap: 6, padding: '8px 12px 12px',
          borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
        }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage() }}
            ref={inputRef}
            placeholder={recording ? (lang === 'es' ? 'Escuchando...' : 'Listening...') : (lang === 'es' ? 'Pregunta sobre Christian...' : 'Ask about Christian...')}
            style={{
              flex: 1, border: `1px solid ${recording ? '#EF4444' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10,
              padding: '8px 12px', background: recording ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.03)', color: '#F9FAFB',
              fontSize: 12, fontFamily: "'DM Sans', sans-serif", outline: 'none',
              transition: 'all 0.3s',
            }} />
          {/* Voice button */}
          <button onClick={() => {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
              alert(lang === 'es' ? 'Tu navegador no soporta voz' : 'Your browser does not support voice')
              return
            }
            if (recording) {
              recognitionRef.current?.stop()
              setRecording(false)
              return
            }
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            const recognition = new SpeechRecognition()
            recognition.lang = lang === 'es' ? 'es-MX' : 'en-US'
            recognition.interimResults = false
            recognition.maxAlternatives = 1
            recognition.onresult = (event) => {
              const transcript = event.results[0][0].transcript
              setInput(transcript)
              setRecording(false)
              // Auto-send after short delay
              setTimeout(() => sendMessage(transcript), 300)
            }
            recognition.onerror = () => setRecording(false)
            recognition.onend = () => setRecording(false)
            recognitionRef.current = recognition
            recognition.start()
            setRecording(true)
          }} style={{
            width: 36, height: 36, border: 'none', borderRadius: 10,
            background: recording ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)',
            color: recording ? '#EF4444' : '#9CA3AF',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transition: 'all 0.2s',
            animation: recording ? 'pulse 1s ease-in-out infinite' : 'none',
          }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
          </button>
          {/* Send button */}
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
            width: 36, height: 36, border: 'none', borderRadius: 10,
            background: input.trim() && !loading ? `linear-gradient(135deg, ${accent}, #818CF8)` : 'rgba(255,255,255,0.04)',
            color: '#fff', cursor: input.trim() && !loading ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transition: 'all 0.2s',
          }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulseDot { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes msgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes menuSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes menuItemIn { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes labelPulse { 0%,100%{box-shadow:0 4px 20px rgba(0,0,0,0.3)} 50%{box-shadow:0 4px 20px rgba(99,102,241,0.15)} }
      `}</style>
    </div>
  )
}
