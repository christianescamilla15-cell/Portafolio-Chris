import { useLang } from '../hooks/useLanguage'

const headline = {
  es: 'Explora los repositorios, demos en vivo y sistemas flagship',
  en: 'Explore the repositories, live demos, and flagship systems',
}

const subtitle = {
  es: 'Revisa la arquitectura, implementaci\u00f3n y profundidad t\u00e9cnica.',
  en: 'Review architecture, implementation, and technical depth.',
}

export default function CTASection() {
  const lang = useLang()

  const btnBase = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 28px',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  }

  return (
    <section style={{
      padding: '80px 24px 100px',
      textAlign: 'center',
      maxWidth: 700,
      margin: '0 auto',
    }}>
      <div className="reveal">
        <h2 style={{
          fontSize: 28,
          fontWeight: 700,
          color: '#111827',
          marginBottom: 12,
          lineHeight: 1.3,
        }}>
          {headline[lang]}
        </h2>

        <p style={{
          fontSize: 16,
          color: '#6B7280',
          marginBottom: 32,
        }}>
          {subtitle[lang]}
        </p>

        {/* Primary buttons */}
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 24,
        }}>
          <a
            href="#featured-projects"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              ...btnBase,
              background: '#111827',
              color: '#FFFFFF',
              border: '1px solid #111827',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1F2937'}
            onMouseLeave={e => e.currentTarget.style.background = '#111827'}
          >
            {lang === 'es' ? 'Ver Sistemas Flagship' : 'View Flagship Systems'}
          </a>
          <a
            href="https://github.com/christianescamilla15-cell"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...btnBase,
              background: '#FFFFFF',
              color: '#111827',
              border: '1px solid #E5E7EB',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#9CA3AF'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/christianescamilla15-cell"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...btnBase,
              background: '#FFFFFF',
              color: '#111827',
              border: '1px solid #E5E7EB',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#9CA3AF'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
          >
            LinkedIn
          </a>
        </div>

        {/* Secondary row */}
        <div style={{
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          flexWrap: 'wrap',
          fontSize: 14,
          color: '#6B7280',
        }}>
          <a
            href="mailto:christianescamilla15@gmail.com"
            style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            christianescamilla15@gmail.com
          </a>
          <span style={{ color: '#D1D5DB' }}>|</span>
          <a
            href="https://wa.me/5215583043811"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            WhatsApp
          </a>
          <span style={{ color: '#D1D5DB' }}>|</span>
          <a
            href="/cv-christian-hernandez.pdf"
            download
            style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            {lang === 'es' ? 'Descargar CV' : 'Download CV'}
          </a>
        </div>
      </div>
    </section>
  )
}
