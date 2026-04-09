import { useState } from 'react'
import { useLang } from '../../hooks/useLanguage'
import { PROJECTS } from '../../data/projects'

const otherProjects = PROJECTS.filter(p => p.tier === 'other')

export default function OtherProjects() {
  const lang = useLang()
  const [expanded, setExpanded] = useState(false)

  const count = otherProjects.length

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
          {lang === 'es' ? 'Otros Proyectos' : 'Other Projects'}
        </h2>
      </div>

      {expanded && (
        <div className="reveal-stagger reveal" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}>
          {otherProjects.map(project => (
            <div key={project.id} style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 12,
              padding: 20,
              transition: 'box-shadow 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <h3 style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#111827',
                margin: '0 0 12px',
              }}>
                {project.title}
              </h3>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 4,
                marginBottom: 12,
              }}>
                {project.stack.slice(0, 4).map((tech, i) => (
                  <span key={i} style={{
                    background: '#F3F4F6',
                    color: '#4B5563',
                    fontSize: 11,
                    fontWeight: 500,
                    padding: '3px 8px',
                    borderRadius: 4,
                  }}>
                    {tech}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#2563EB',
                    textDecoration: 'none',
                  }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Demo
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#2563EB',
                    textDecoration: 'none',
                  }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: expanded ? 24 : 0 }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: 14,
            fontWeight: 600,
            color: '#4B5563',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#9CA3AF'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
        >
          {expanded
            ? (lang === 'es' ? 'Ver menos' : 'Show less')
            : (lang === 'es' ? `Ver más proyectos (${count})` : `View more projects (${count})`)
          }
        </button>
      </div>
    </section>
  )
}
