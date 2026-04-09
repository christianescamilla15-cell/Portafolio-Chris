import { useLang } from '../../hooks/useLanguage'
import { secondaryProjects } from '../../data/projects'
import ProjectCardNew from './ProjectCardNew'

export default function SupportingProjects() {
  const lang = useLang()
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px', borderTop: '1px solid #F3F4F6' }}>
      <div className="reveal" style={{ marginBottom: 32 }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9CA3AF' }}>
          {lang === 'es' ? 'Sistemas de Soporte' : 'Supporting Systems'}
        </span>
        <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.75rem)', fontWeight: 700, color: '#111827', marginTop: 8, letterSpacing: '-0.02em' }}>
          {lang === 'es' ? 'Más sistemas en producción' : 'More production systems'}
        </h2>
      </div>
      <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {secondaryProjects.map(p => (
          <ProjectCardNew key={p.id} project={p} />
        ))}
      </div>
    </section>
  )
}
