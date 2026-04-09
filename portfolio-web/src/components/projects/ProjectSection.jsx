import { PROJECTS } from '../../data/projects'
import ProjectCardNew from './ProjectCardNew'

const SECTION_MAP = {
  'ai-systems': (p) => p.category === 'ai',
  'data-analytics': (p) => [3, 17].includes(p.id),
  'product-mobile': (p) => p.category === 'mobile',
  'automation-infra': (p) => p.category === 'automation' || p.id === 5,
}

export default function ProjectSection({ title, description, sectionKey }) {
  const filter = SECTION_MAP[sectionKey]
  if (!filter) return null

  const projects = PROJECTS.filter(p => filter(p) && p.tier !== 'other')
  if (projects.length === 0) return null

  return (
    <section style={{
      padding: '60px 24px',
      maxWidth: 1100,
      margin: '0 auto',
    }}>
      <div className="reveal" style={{ marginBottom: 32 }}>
        <h2 style={{
          fontSize: 24,
          fontWeight: 700,
          color: '#111827',
          margin: '0 0 8px',
        }}>
          {title}
        </h2>
        {description && (
          <p style={{
            fontSize: 15,
            color: '#6B7280',
            margin: 0,
          }}>
            {description}
          </p>
        )}
      </div>

      <div className="reveal-stagger reveal" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 28,
      }}>
        {projects.map(project => (
          <ProjectCardNew key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
