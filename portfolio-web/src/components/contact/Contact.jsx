import { useLang } from '../../hooks/useLanguage'

const headline = { es: 'Conectemos', en: "Let's Connect" }
const location = { es: 'CDMX, México', en: 'Mexico City, Mexico' }

export default function Contact() {
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
    <section id="contact" className="reveal" style={{
      padding: '80px 24px',
      maxWidth: 600,
      margin: '0 auto',
      textAlign: 'center',
    }}>
      <h2 style={{
        fontSize: 32,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 32,
      }}>
        {headline[lang]}
      </h2>

      <div style={{
        display: 'flex',
        gap: 12,
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: 32,
      }}>
        {/* Email — primary blue */}
        <a
          href="mailto:christianescamilla15@gmail.com"
          style={{
            ...btnBase,
            background: '#2563EB',
            color: '#FFFFFF',
            border: '1px solid #2563EB',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#1D4ED8'}
          onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}
        >
          Email
        </a>

        {/* WhatsApp — green outline */}
        <a
          href="https://wa.me/525579605324"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...btnBase,
            background: '#FFFFFF',
            color: '#16A34A',
            border: '1px solid #16A34A',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#F0FDF4'}
          onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
        >
          WhatsApp
        </a>

        {/* CV download — gray outline */}
        <a
          href="/CV_Christian_Hernandez.pdf"
          download
          style={{
            ...btnBase,
            background: '#FFFFFF',
            color: '#4B5563',
            border: '1px solid #E5E7EB',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#9CA3AF'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
        >
          {lang === 'es' ? 'Descargar CV' : 'Download CV'}
        </a>
      </div>

      {/* Social row */}
      <div style={{
        display: 'flex',
        gap: 16,
        justifyContent: 'center',
        marginBottom: 24,
      }}>
        {[
          { href: 'https://github.com/christianescamilla15-cell', label: 'GitHub' },
          { href: 'https://linkedin.com/in/christianescamilla15-cell', label: 'LinkedIn' },
          { href: 'mailto:christianescamilla15@gmail.com', label: 'Email' },
          { href: 'tel:+525579605324', label: '55 7960 5324' },
        ].map((item, i) => (
          <a key={i} href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            style={{
              fontSize: 13,
              color: '#9CA3AF',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#2563EB'}
            onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Location */}
      <p style={{
        fontSize: 14,
        color: '#9CA3AF',
        margin: 0,
      }}>
        {location[lang]}
      </p>
    </section>
  )
}
