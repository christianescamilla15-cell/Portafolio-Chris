import { useState, useEffect } from 'react'
import { useLang } from '../../hooks/useLanguage'

const navLinks = [
  { label: { es: 'Proyectos', en: 'Featured' }, href: '#featured-projects' },
  { label: { es: 'Arquitectura', en: 'Architecture' }, href: '#architecture' },
  { label: 'Stack', href: '#stack' },
  { label: 'GitHub', href: 'https://github.com/christianescamilla15-cell', external: true },
]

export default function Navbar({ lang, setLang }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const currentLang = useLang()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const closeOnResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', closeOnResize)
    return () => window.removeEventListener('resize', closeOnResize)
  }, [])

  const getLabel = (link) => typeof link.label === 'string' ? link.label : (link.label[currentLang] || link.label.en)

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 16px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderRadius: 16, padding: '12px 20px',
          border: '1px solid',
          borderColor: scrolled ? 'rgba(229,231,235,0.8)' : '#E5E7EB',
          background: scrolled ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: scrolled ? '0 1px 3px rgba(0,0,0,0.04)' : 'none',
          transition: 'all 0.3s ease',
        }}>
          {/* Brand */}
          <a href="#hero" style={{
            display: 'flex', alignItems: 'center', gap: 12,
            textDecoration: 'none', color: '#111827', minWidth: 0,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              border: '1px solid #E5E7EB', background: '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}>CH</div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                Christian Hernandez
              </span>
              <span style={{ fontSize: 12, color: '#6B7280' }}>AI Engineer</span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navLinks.map(link => (
              <a key={link.href} href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={link.external ? undefined : (e) => {
                  e.preventDefault()
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                style={{
                  padding: '8px 16px', borderRadius: 12,
                  fontSize: 14, fontWeight: 500, color: '#4B5563',
                  textDecoration: 'none', transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#111827' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4B5563' }}
              >{getLabel(link)}</a>
            ))}

            {/* Language toggle */}
            <div style={{
              background: '#F3F4F6', border: '1px solid #E5E7EB',
              borderRadius: 100, padding: 3, display: 'flex', marginLeft: 8,
            }}>
              {['es', 'en'].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  background: lang === l ? '#111827' : 'transparent',
                  color: lang === l ? '#fff' : '#6B7280',
                  border: 'none', fontSize: 12, fontWeight: 600, padding: '5px 12px',
                  borderRadius: 100, cursor: 'pointer', transition: 'all 0.2s',
                }}>{l.toUpperCase()}</button>
              ))}
            </div>

            {/* CTA */}
            <a href="#featured-projects" onClick={(e) => {
              e.preventDefault()
              document.querySelector('#featured-projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: '#111827', color: '#FFFFFF',
              fontSize: 14, fontWeight: 600, padding: '8px 18px', borderRadius: 12,
              textDecoration: 'none', marginLeft: 8,
              transition: 'opacity 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {currentLang === 'es' ? 'Ver Proyectos' : 'View Projects'}
            </a>
          </nav>

          {/* Mobile toggle */}
          <button className="nav-burger" onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none', width: 40, height: 40, borderRadius: 12,
              border: '1px solid #E5E7EB', background: '#FFFFFF',
              color: '#374151', cursor: 'pointer',
              fontSize: 20, alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Menu" aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        <div style={{
          overflow: 'hidden',
          maxHeight: menuOpen ? 400 : 0,
          opacity: menuOpen ? 1 : 0,
          transition: 'all 0.3s ease',
          paddingTop: menuOpen ? 12 : 0,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.95)', border: '1px solid #E5E7EB',
            borderRadius: 16, padding: 12, backdropFilter: 'blur(20px)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            {navLinks.map(link => (
              <a key={link.href} href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={link.external ? () => setMenuOpen(false) : (e) => {
                  e.preventDefault(); setMenuOpen(false)
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                style={{
                  display: 'block', padding: '14px 16px', borderRadius: 12,
                  fontSize: 15, fontWeight: 500, color: '#374151',
                  textDecoration: 'none', transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >{getLabel(link)}</a>
            ))}
            <div style={{ paddingTop: 8 }}>
              <a href="#featured-projects" onClick={(e) => {
                e.preventDefault(); setMenuOpen(false)
                document.querySelector('#featured-projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#111827', color: '#FFFFFF',
                fontSize: 14, fontWeight: 600, padding: '12px 20px', borderRadius: 12,
                textDecoration: 'none', width: '100%',
              }}>
                {currentLang === 'es' ? 'Ver Proyectos' : 'View Projects'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
