import { useEffect, useRef, useState } from 'react'
import { motion, useInView as useFramerInView } from 'framer-motion'
import { useT, useLang, LangContext } from '../../hooks/useLanguage'
import CountUp from '../../ui/CountUp'
import { IconLocation } from '../../ui/Icons'
import { STRINGS } from '../../data/strings'

/* ───────────── GitHub Activity Feed ────────────── */

const DEMO_GITHUB_DATA = {
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
    { repo: 'langchain-pipeline', date: new Date().toISOString(), commits: 2, message: 'feat: Event-driven microservices pipeline' },
    { repo: 'MindScrolling', date: new Date().toISOString(), commits: 1, message: 'fix: pgvector similarity search optimization' },
    { repo: 'ai-document-pipeline', date: new Date().toISOString(), commits: 1, message: 'feat: CrewAI agents + MCP servers integration' },
  ],
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  const days = Math.floor(seconds / 86400)
  return `${days}d`
}

export function GitHubActivity({ lang }) {
  const [data, setData] = useState(null)
  const ref = useRef(null)
  const inView = useFramerInView(ref, { once: true })

  useEffect(() => {
    fetch('/api/github-stats')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData(DEMO_GITHUB_DATA))
  }, [])

  if (!data) return null

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
          {STRINGS.recentActivity[lang]}
        </span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          {data.public_repos} repos
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.recent_events.slice(0, 5).map((event, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px',
              background: 'rgba(255,255,255,0.02)', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#818CF8', minWidth: 0, flexShrink: 0, maxWidth: '40%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.repo}
            </span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
              {event.message}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>
              {timeAgo(event.date)}
            </span>
          </motion.div>
        ))}
      </div>

      <ContributionHeatmap />
    </motion.div>
  )
}

/* ───────────── Contribution Heatmap ────────────── */

function ContributionHeatmap() {
  const ref = useRef(null)
  const inView = useFramerInView(ref, { once: true })

  // Deterministic pseudo-random using seed
  const cells = useRef(Array.from({ length: 364 }, (_, i) => {
    const seed = (i * 2654435761) >>> 0
    const r = (seed % 100) / 100
    return {
      count: r > 0.35 ? Math.floor(r * 8) : 0,
      date: new Date(Date.now() - (364 - i) * 86400000),
    }
  })).current

  const getColor = (count) => {
    if (count === 0) return 'rgba(255,255,255,0.03)'
    if (count <= 2) return 'rgba(99,102,241,0.2)'
    if (count <= 4) return 'rgba(99,102,241,0.4)'
    if (count <= 6) return 'rgba(99,102,241,0.6)'
    return 'rgba(99,102,241,0.8)'
  }

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ overflowX: 'auto', marginTop: 24 }}
    >
      <svg viewBox="0 0 728 112" style={{ width: '100%', maxWidth: 728 }}>
        {months.map((m, i) => (
          <text key={m} x={i * 60 + 10} y={10} fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="DM Sans, sans-serif">{m}</text>
        ))}
        {cells.map((cell, i) => (
          <rect key={i}
            x={(Math.floor(i / 7)) * 14}
            y={(i % 7) * 14 + 16}
            width={10} height={10} rx={2}
            fill={inView ? getColor(cell.count) : 'rgba(255,255,255,0.03)'}
            style={{ transition: `fill 0.5s ease ${i * 0.002}s` }}
          />
        ))}
      </svg>
    </motion.div>
  )
}

/* ───────────── How I Built This ────────────── */

export function HowIBuiltThis({ lang }) {
  const ref = useRef(null)
  const inView = useFramerInView(ref, { once: true, margin: '-80px' })

  const stack = [
    { name: 'React 18', role: lang === 'en' ? 'UI Framework' : 'Framework UI' },
    { name: 'GSAP + ScrollTrigger', role: lang === 'en' ? 'Scroll animations' : 'Animaciones scroll' },
    { name: 'Framer Motion', role: lang === 'en' ? 'Component animations' : 'Animaciones de componentes' },
    { name: 'Lenis', role: 'Smooth scroll' },
    { name: 'Groq API', role: 'AI Chatbot (Llama 3.3 70B)' },
    { name: 'Supabase + pgvector', role: lang === 'en' ? 'Semantic search' : 'Búsqueda semántica' },
    { name: 'Vercel', role: 'Deployment' },
    { name: 'Claude Code', role: lang === 'en' ? 'Primary development tool' : 'Herramienta principal de desarrollo' },
  ]

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#818CF8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {lang === 'en' ? 'How I Built This Portfolio' : 'Cómo construí este portafolio'}
        </span>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 12,
      }}>
        {stack.map((item, i) => (
          <motion.div key={item.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: '14px 16px',
              transition: 'border-color 0.3s ease, background 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA', marginBottom: 4 }}>{item.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{item.role}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ───────────────────────── About ───────────────────────── */

export default function About() {
  const t = useT()
  const lang = useLang()
  const isMobileRef = useRef(typeof window !== 'undefined' && window.innerWidth < 768)
  const statementRef = useRef(null)
  const bentoRef = useRef(null)
  const bentoInView = useFramerInView(bentoRef, { once: true, margin: '-80px' })
  const statementText = t('aboutStatement')
  const words = statementText.split(' ')

  return (
    <section id="about" className="reveal" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="about-statement-container" style={{
        height: isMobileRef.current ? 'auto' : '200vh',
        position: 'relative',
      }}>
        <div style={{
          position: isMobileRef.current ? 'relative' : 'sticky',
          top: 0,
          height: isMobileRef.current ? 'auto' : '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobileRef.current ? '80px 16px 60px' : '0 24px',
        }}>
          <p ref={statementRef} className="about-statement velocity-skew" style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(1.8rem, 5vw, 4rem)',
            fontWeight: 700,
            color: '#FAFAFA',
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: 900,
            letterSpacing: '-0.02em',
            overflowWrap: 'break-word',
          }}>
            {words.map((word, i) => {
              const cleaned = word.replace(/[.,!?]/g, '').toLowerCase()
              const isProduction = cleaned === 'production' || cleaned === 'producción' || cleaned === 'produccion'
              return (
                <span key={`${lang}-${i}`} className="about-word" style={{
                  display: 'inline-block',
                  marginRight: '0.3em',
                  opacity: 1,
                  willChange: 'opacity, filter, transform',
                  ...(isProduction ? {
                    color: '#6366F1',
                  } : {}),
                }}>
                  {word}
                </span>
              )
            })}
          </p>
        </div>
      </div>

      <div ref={bentoRef} style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 24px 120px',
        position: 'relative',
      }}>
        <motion.div
          className="about-bento"
          initial={{ opacity: 0, y: 40 }}
          animate={bentoInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gridTemplateRows: 'auto auto',
            gap: 16,
          }}
        >
          <div className="about-bio-card" style={{
            background: 'rgba(255,255,255,.03)',
            border: '1px solid rgba(255,255,255,.06)',
            borderRadius: 16, padding: isMobileRef.current ? '28px 20px' : '40px 36px',
            gridRow: 'span 2',
            transition: 'border-color 0.3s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,.2)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)' }}
          >
            <div style={{
              width: 72, height: 72, borderRadius: 18,
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #A78BFA)',
              padding: 2, marginBottom: 24,
            }}>
              <span style={{
                  fontSize: 24, fontWeight: 700, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '100%', height: '100%', borderRadius: 16,
                  objectFit: 'cover',
                  display: 'block',
                }}>CH</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 16, lineHeight: 1.8 }}>
              {t('aboutBody')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
              {['AI/ML', 'Full-Stack', 'Multi-Agent', 'RLHF', 'Production'].map(tag => (
                <span key={tag} className="skill-tag" style={{
                  background: 'rgba(99,102,241,.08)', color: '#818CF8',
                  fontSize: 12, fontWeight: 500, padding: '5px 14px', borderRadius: 100,
                  border: '1px solid rgba(99,102,241,.12)', letterSpacing: '0.02em',
                  cursor: 'default',
                }}>{tag}</span>
              ))}
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,.03)',
            border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, padding: '28px 24px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            transition: 'border-color 0.3s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,.2)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)' }}
          >
            <div style={{
              fontSize: 40, fontWeight: 700, fontFamily: 'Syne, sans-serif',
              letterSpacing: '-0.02em',
              color: '#6366F1', marginBottom: 4,
            }}><CountUp target={3} suffix="+" /> {t('experienceYears').replace('3+ ', '')}</div>
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 14, fontWeight: 500 }}>{t('experienceLabel')}</div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <span style={{ background: 'rgba(16,185,129,.08)', color: '#34D399', fontSize: 11, padding: '4px 10px', borderRadius: 100, border: '1px solid rgba(16,185,129,.12)', fontWeight: 600 }}>Scale AI</span>
              <span style={{ background: 'rgba(16,185,129,.08)', color: '#34D399', fontSize: 11, padding: '4px 10px', borderRadius: 100, border: '1px solid rgba(16,185,129,.12)', fontWeight: 600 }}>6+ Apps</span>
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,.03)',
            border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, padding: '28px 24px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            transition: 'border-color 0.3s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,.2)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)' }}
          >
            <div style={{ color: '#6366F1', marginBottom: 12 }}><IconLocation /></div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#FAFAFA', marginBottom: 4, fontFamily: 'Syne, sans-serif' }}>{t('location')}</div>
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>{t('locationLabel')}</div>
            <div style={{
              marginTop: 12, background: 'rgba(16,185,129,.08)', color: '#34D399',
              fontSize: 11, padding: '4px 10px', borderRadius: 100,
              border: '1px solid rgba(16,185,129,.12)', fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 4, width: 'fit-content',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }} />
              {t('remoteOk')}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
