import { useLang } from '../../hooks/useLanguage'
import { featuredProjects } from '../../data/projects'
import SystemDiagramCard from './SystemDiagramCard'

export default function FeaturedProjects() {
  const lang = useLang()
  const [firstProject, ...restProjects] = featuredProjects

  return (
    <section id="featured-projects" style={{
      maxWidth: 1200, margin: '0 auto',
      padding: '80px 24px',
      borderTop: '1px solid #F3F4F6',
    }}>
      {/* Section header */}
      <div className="reveal" style={{ marginBottom: 48 }}>
        <span style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: '#9CA3AF',
        }}>
          {lang === 'es' ? 'Proyectos Destacados' : 'Featured Projects'}
        </span>
        <h2 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700,
          color: '#111827', marginTop: 8, letterSpacing: '-0.02em',
        }}>
          {lang === 'es'
            ? 'Sistemas de IA Flagship y Plataformas de Producto'
            : 'Flagship AI Systems and Product Platforms'}
        </h2>
        <p style={{
          fontSize: 15, color: '#6B7280', marginTop: 8, maxWidth: 700, lineHeight: 1.6,
        }}>
          {lang === 'es'
            ? 'Selección curada de los proyectos más fuertes del portafolio, elegidos por profundidad técnica, relevancia de negocio y ejecución full-stack.'
            : 'A curated selection of the strongest projects, chosen for technical depth, business relevance, and full-stack execution.'}
        </p>
      </div>

      {/* Hero flagship — NexusForge full width */}
      {firstProject && (
        <div className="reveal" style={{ marginBottom: 24 }}>
          <SystemDiagramCard project={firstProject} />
        </div>
      )}

      {/* Remaining featured — 2 column grid */}
      {restProjects.length > 0 && (
        <div className="reveal-stagger visible" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
          gap: 32,
        }}>
          {restProjects.map((project) => (
            <SystemDiagramCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}
