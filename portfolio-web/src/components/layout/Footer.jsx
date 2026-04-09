import { useLang } from '../../hooks/useLanguage'

const navLinks = [
  { label: { es: 'Proyectos Destacados', en: 'Featured Projects' }, href: '#featured-projects' },
  { label: { es: 'Sobre mí', en: 'About' }, href: '#about' },
  { label: { es: 'Stack Técnico', en: 'Tech Stack' }, href: '#stack' },
]

const externalLinks = [
  { label: 'GitHub', href: 'https://github.com/christianescamilla15-cell' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/christianescamilla15-cell' },
  { label: 'NexusForge AI Demo', href: 'https://nexusforge-two.vercel.app' },
]

const coreStack = ['FastAPI', 'React', 'PostgreSQL', 'pgvector', 'Flutter', 'Docker', 'Claude API', 'Python']

export default function Footer() {
  const lang = useLang()
  const linkStyle = { fontSize: 14, color: '#6B7280', textDecoration: 'none', transition: 'color 0.2s ease', display: 'block', padding: '2px 0' }

  return (
    <footer style={{ borderTop: '1px solid #F3F4F6', background: '#FFFFFF' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid #E5E7EB', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>CH</div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>Christian Hernandez</p>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>AI Engineer</p>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#6B7280', maxWidth: 320 }}>
              {lang === 'es' ? 'Construyo sistemas de IA, plataformas multi-agente, herramientas de analytics y aplicaciones orientadas a producto.' : 'Building AI systems, multi-agent platforms, analytics tools, and product-oriented applications.'}
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 16px' }}>{lang === 'es' ? 'Navegación' : 'Navigation'}</h4>
            {navLinks.map(link => (
              <a key={link.href} href={link.href} style={linkStyle} onMouseEnter={e => e.currentTarget.style.color = '#111827'} onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}>{link.label[lang] || link.label.en}</a>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9CA3AF', margin: '0 0 16px' }}>{lang === 'es' ? 'Proyectos & Links' : 'Projects & Links'}</h4>
            {externalLinks.map(link => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" style={linkStyle} onMouseEnter={e => e.currentTarget.style.color = '#111827'} onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}>{link.label}</a>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 64, borderTop: '1px solid #F3F4F6', paddingTop: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 16 }}>Core Stack</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {coreStack.map(tech => (
              <span key={tech} style={{ padding: '6px 14px', fontSize: 13, borderRadius: 100, background: '#F3F4F6', color: '#4B5563' }}>{tech}</span>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 64, borderTop: '1px solid #F3F4F6', paddingTop: 32, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <p style={{ fontSize: 14, color: '#9CA3AF', margin: 0 }}>© {new Date().getFullYear()} Christian Hernandez. Built with React & deployed on Vercel.</p>
          <a href="https://github.com/christianescamilla15-cell" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 18px', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#374151', border: '1px solid #D1D5DB', textDecoration: 'none', background: '#FFFFFF', transition: 'background 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'} onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}>{lang === 'es' ? 'Ver GitHub' : 'View GitHub'}</a>
        </div>
      </div>
    </footer>
  )
}
