import { useLang } from '../../hooks/useLanguage'

const chips = ['Python', 'FastAPI', 'React', 'PostgreSQL', 'pgvector', 'Flutter', 'Docker', 'Claude API']

const eyebrow = { es: 'PORTAFOLIO DE INGENIERO IA', en: 'AI ENGINEER PORTFOLIO' }
const headlineText = {
  es: 'Construyo sistemas multi-agente de IA, pipelines LLM, y productos inteligentes.',
  en: 'I build multi-agent AI systems, LLM pipelines, and intelligent products.',
}
const subheadlineText = {
  es: 'AI Engineer especializado en sistemas multi-agente y pipelines LLM en producción.',
  en: 'AI Engineer specialized in multi-agent systems and LLM pipelines in production.',
}
const credentials = {
  es: [
    '20+ sistemas de IA desplegados',
    '1,500+ tests automatizados',
    'AIOS publicado en PyPI + Kiro IDE Power',
  ],
  en: [
    '20+ AI systems deployed',
    '1,500+ automated tests',
    'AIOS published on PyPI + Kiro IDE Power',
  ],
}
const ctaProjects = { es: 'Ver Proyectos Destacados', en: 'View Featured Projects' }
const ctaGithub = 'GitHub'

export default function Hero() {
  const lang = useLang()

  const scrollTo = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '120px 24px 80px',
    }}>
      <div className="reveal" style={{
        maxWidth: 800,
        margin: '0 auto',
        width: '100%',
        textAlign: 'center',
      }}>
        {/* Eyebrow */}
        <span style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#2563EB',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: 24,
        }}>
          {eyebrow[lang]}
        </span>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: 700,
          color: '#111827',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          margin: '0 0 24px',
        }}>
          {headlineText[lang]}
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: 18,
          color: '#6B7280',
          lineHeight: 1.6,
          maxWidth: 620,
          margin: '0 auto 16px',
        }}>
          {subheadlineText[lang]}
        </p>

        {/* Credentials */}
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: '0 auto 40px',
          maxWidth: 620,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          {credentials[lang].map((cred, i) => (
            <li key={i} style={{
              fontSize: 16,
              color: '#4B5563',
              lineHeight: 1.5,
            }}>
              {'• '}{cred}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 40,
        }}>
          <a
            href="#featured-projects"
            onClick={scrollTo('featured-projects')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#2563EB',
              color: '#FFFFFF',
              padding: '14px 28px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid #2563EB',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1D4ED8'}
            onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}
          >
            {ctaProjects[lang]} <span className="link-chevron">&rarr;</span>
          </a>
          <a
            href="https://github.com/christianescamilla15-cell"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#FFFFFF',
              color: '#111827',
              padding: '14px 28px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid #E5E7EB',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#9CA3AF'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
          >
            {ctaGithub}
          </a>
        </div>

        {/* Stack chips */}
        <div style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {chips.map((chip, i) => (
            <span key={i} style={{
              background: '#F3F4F6',
              color: '#4B5563',
              fontSize: 13,
              fontWeight: 500,
              padding: '6px 14px',
              borderRadius: 100,
            }}>
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
