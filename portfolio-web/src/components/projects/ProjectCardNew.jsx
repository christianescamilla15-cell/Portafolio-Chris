import { useLang } from '../../hooks/useLanguage'

const statusColors = {
  Production: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
  Active: { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
  Demo: { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' },
  Prototype: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
}

export default function ProjectCardNew({ project, compact = false }) {
  const lang = useLang()
  const highlight = typeof project.highlight === 'object' ? (project.highlight[lang] || project.highlight.en) : (project.highlight || '')
  const desc = typeof project.shortDescription === 'object' ? (project.shortDescription[lang] || project.shortDescription.en) : (project.shortDescription || (lang === 'en' && project.description_en ? project.description_en : project.description))
  const architecture = typeof project.architecture === 'object' ? (project.architecture[lang] || project.architecture.en) : (project.architecture || '')
  const businessValue = typeof project.businessValue === 'object' ? (project.businessValue[lang] || project.businessValue.en) : (project.businessValue || '')
  const techStack = project.techStack || project.stack || []
  const metrics = project.metrics || []
  const links = project.links || []
  const status = project.status || 'Demo'
  const statusStyle = statusColors[status] || statusColors.Demo
  const section = project.section || project.category || ''

  // Compact mode for "Other Projects"
  if (compact) {
    return (
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 16,
        padding: 20,
        display: 'flex', flexDirection: 'column', height: '100%',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: '0 0 8px' }}>
          {project.title}
        </h3>
        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5, margin: '0 0 12px', flex: 1 }}>
          {highlight || desc}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
          {techStack.slice(0, 4).map((t, i) => (
            <span key={i} style={{
              background: '#F3F4F6', color: '#6B7280', fontSize: 11,
              padding: '2px 8px', borderRadius: 100,
            }}>{t}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" style={{
              fontSize: 13, fontWeight: 600, color: '#2563EB', textDecoration: 'none',
            }}>Demo</a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
              fontSize: 13, fontWeight: 600, color: '#6B7280', textDecoration: 'none',
            }}>GitHub</a>
          )}
        </div>
      </div>
    )
  }

  // Premium card
  return (
    <article style={{
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: 24,
      padding: 24,
      display: 'flex', flexDirection: 'column', height: '100%',
      position: 'relative', overflow: 'hidden',
      transition: 'box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = '#D1D5DB'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = '#E5E7EB'
      }}
    >
      {/* Top: Category + Status badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        <span style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#6B7280', background: '#F9FAFB', border: '1px solid #E5E7EB',
          padding: '4px 10px', borderRadius: 100,
        }}>
          {section.replace('-', ' & ').replace('ai systems', 'AI Systems')}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 600,
          color: statusStyle.text, background: statusStyle.bg,
          border: `1px solid ${statusStyle.border}`,
          padding: '4px 10px', borderRadius: 100,
        }}>
          {status}
        </span>
        {project.isNew && (
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: '#92400E', background: '#FFFBEB',
            border: '1px solid #FDE68A',
            padding: '4px 10px', borderRadius: 100,
          }}>NEW</span>
        )}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em',
        color: '#111827', margin: '0 0 10px',
      }}>
        {project.title}
      </h3>

      {/* Highlight */}
      {highlight && (
        <p style={{
          fontSize: 14, fontWeight: 500, lineHeight: 1.5,
          color: '#111827', margin: '0 0 8px',
        }}>
          {highlight}
        </p>
      )}

      {/* Description */}
      <p style={{
        fontSize: 14, lineHeight: 1.6,
        color: '#6B7280', margin: '0 0 16px',
      }}>
        {desc}
      </p>

      {/* Architecture strip */}
      {architecture && (
        <div style={{
          background: '#F9FAFB', border: '1px solid #E5E7EB',
          borderRadius: 16, padding: '12px 16px', marginBottom: 16,
        }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#9CA3AF', margin: '0 0 4px',
          }}>{lang === 'es' ? 'Arquitectura' : 'Architecture'}</p>
          <p style={{
            fontSize: 13, lineHeight: 1.5, color: '#4B5563', margin: 0,
          }}>
            {architecture}
          </p>
        </div>
      )}

      {/* Tech stack */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {techStack.slice(0, 6).map((t, i) => (
          <span key={i} style={{
            background: '#F3F4F6', color: '#4B5563', fontSize: 12, fontWeight: 500,
            padding: '4px 12px', borderRadius: 100,
          }}>{t}</span>
        ))}
        {techStack.length > 6 && (
          <span style={{
            background: '#F3F4F6', color: '#9CA3AF', fontSize: 12,
            padding: '4px 12px', borderRadius: 100,
          }}>+{techStack.length - 6}</span>
        )}
      </div>

      {/* Metrics */}
      {metrics.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(metrics.length, 3)}, 1fr)`,
          gap: 8, marginBottom: 16,
        }}>
          {metrics.slice(0, 3).map((m, i) => (
            <div key={i} style={{
              background: '#FFFFFF', border: '1px solid #E5E7EB',
              borderRadius: 16, padding: '10px 14px',
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
                {m.value}
              </div>
              <div style={{
                fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#9CA3AF', marginTop: 2,
              }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Problem + Business Value strip */}
      {(project.problem || businessValue) && (
        <div style={{
          display: 'grid', gridTemplateColumns: project.problem && businessValue ? '1fr 1fr' : '1fr',
          gap: 16, marginBottom: 16,
        }}>
          {project.problem && (
            <div style={{ borderLeft: '2px solid #E5E7EB', paddingLeft: 16 }}>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#9CA3AF', margin: '0 0 4px',
              }}>{lang === 'es' ? 'Problema' : 'Problem'}</p>
              <p style={{ fontSize: 13, lineHeight: 1.5, color: '#6B7280', margin: 0 }}>
                {typeof project.problem === 'object' ? (project.problem[lang] || project.problem.en) : project.problem}
              </p>
            </div>
          )}
          {businessValue && (
            <div style={{ borderLeft: '2px solid #E5E7EB', paddingLeft: 16 }}>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#9CA3AF', margin: '0 0 4px',
              }}>{lang === 'es' ? 'Valor de Negocio' : 'Business Value'}</p>
              <p style={{ fontSize: 13, lineHeight: 1.5, color: '#6B7280', margin: 0 }}>
                {businessValue}
              </p>
            </div>
          )}
        </div>
      )}

      {/* CTA row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 'auto' }}>
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: '#111827', color: '#FFFFFF',
            fontSize: 14, fontWeight: 600,
            padding: '10px 20px', borderRadius: 12,
            textDecoration: 'none', border: '1px solid #111827',
            transition: 'opacity 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {lang === 'es' ? '🚀 Demo en Vivo' : '🚀 Live Demo'}
          </a>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: '#FFFFFF', color: '#374151',
            fontSize: 14, fontWeight: 600,
            padding: '10px 20px', borderRadius: 12,
            textDecoration: 'none', border: '1px solid #D1D5DB',
            transition: 'background 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
            onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
          >
            {lang === 'es' ? 'Ver Código' : 'View Code'}
          </a>
        )}
      </div>
    </article>
  )
}
