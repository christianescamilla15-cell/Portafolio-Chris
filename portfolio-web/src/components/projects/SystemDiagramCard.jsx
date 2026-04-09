import { useLang } from '../../hooks/useLanguage'

const statusColors = {
  Production: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
  Active: { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
  Demo: { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' },
  Prototype: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
}

export default function SystemDiagramCard({ project }) {
  const lang = useLang()
  const highlight = typeof project.highlight === 'object' ? (project.highlight[lang] || project.highlight.en) : (project.highlight || '')
  const desc = typeof project.shortDescription === 'object' ? (project.shortDescription[lang] || project.shortDescription.en) : (project.shortDescription || (lang === 'en' && project.description_en ? project.description_en : project.description))
  const architecture = typeof project.architecture === 'object' ? (project.architecture[lang] || project.architecture.en) : (project.architecture || '')
  const businessValue = typeof project.businessValue === 'object' ? (project.businessValue[lang] || project.businessValue.en) : (project.businessValue || '')
  const techStack = project.techStack || project.stack || []
  const metrics = (project.metrics || []).slice(0, 3)
  const status = project.status || 'Demo'
  const statusStyle = statusColors[status] || statusColors.Demo
  const diagram = project.diagram || []
  const section = (project.section || '').replace(/-/g, ' ')

  return (
    <article style={{
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: 28,
      padding: 28,
      display: 'flex', flexDirection: 'column', height: '100%',
      position: 'relative', overflow: 'hidden',
      transition: 'box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = '#D1D5DB'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = '#E5E7EB'
      }}
    >
      {/* Top labels */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        <span style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: '#6B7280', background: '#F9FAFB', border: '1px solid #E5E7EB',
          padding: '5px 14px', borderRadius: 100,
        }}>{section}</span>
        <span style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#111827', background: '#111827', border: '1px solid #111827',
          padding: '5px 14px', borderRadius: 100, color: '#FFFFFF',
        }}>Flagship</span>
        <span style={{
          fontSize: 12, fontWeight: 600,
          color: statusStyle.text, background: statusStyle.bg,
          border: `1px solid ${statusStyle.border}`,
          padding: '5px 14px', borderRadius: 100,
        }}>{status}</span>
        {project.isNew && (
          <span style={{
            fontSize: 12, fontWeight: 700,
            color: '#92400E', background: '#FFFBEB',
            border: '1px solid #FDE68A',
            padding: '5px 14px', borderRadius: 100,
          }}>NEW</span>
        )}
      </div>

      {/* Title block */}
      <h3 style={{
        fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em',
        color: '#111827', margin: '0 0 8px', lineHeight: 1.2,
      }}>{project.title}</h3>

      {highlight && (
        <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.5, color: '#111827', margin: '0 0 8px' }}>
          {highlight}
        </p>
      )}

      <p style={{ fontSize: 15, lineHeight: 1.7, color: '#6B7280', margin: '0 0 20px' }}>
        {desc}
      </p>

      {/* System Flow Diagram */}
      {diagram.length > 0 && (
        <div style={{
          background: '#F9FAFB', border: '1px solid #E5E7EB',
          borderRadius: 16, padding: 16, marginBottom: 20,
        }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#9CA3AF', margin: '0 0 12px',
          }}>{lang === 'es' ? 'Flujo del Sistema' : 'System Flow'}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {diagram.map((step, i) => (
              <div key={i}>
                <div style={{
                  background: '#FFFFFF', border: '1px solid #E5E7EB',
                  borderRadius: 12, padding: '10px 16px',
                  fontSize: 14, fontWeight: 500, color: '#374151',
                }}>{step}</div>
                {i < diagram.length - 1 && (
                  <div style={{ textAlign: 'center', color: '#D1D5DB', fontSize: 14, lineHeight: '20px' }}>↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech stack */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {techStack.slice(0, 6).map((t, i) => (
          <span key={i} style={{
            background: '#F3F4F6', color: '#4B5563', fontSize: 12, fontWeight: 500,
            padding: '5px 12px', borderRadius: 100,
          }}>{t}</span>
        ))}
        {techStack.length > 6 && (
          <span style={{
            background: '#F3F4F6', color: '#9CA3AF', fontSize: 12,
            padding: '5px 12px', borderRadius: 100,
          }}>+{techStack.length - 6}</span>
        )}
      </div>

      {/* Metrics */}
      {metrics.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${metrics.length}, 1fr)`,
          gap: 10, marginBottom: 20,
        }}>
          {metrics.map((m, i) => (
            <div key={i} style={{
              background: '#FFFFFF', border: '1px solid #E5E7EB',
              borderRadius: 16, padding: '12px 16px',
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>{m.value}</div>
              <div style={{
                fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#9CA3AF', marginTop: 2,
              }}>{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Business Value */}
      {businessValue && (
        <div style={{ borderLeft: '2px solid #E5E7EB', paddingLeft: 16, marginBottom: 20 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#9CA3AF', margin: '0 0 4px',
          }}>{lang === 'es' ? 'Valor de Negocio' : 'Business Value'}</p>
          <p style={{ fontSize: 14, lineHeight: 1.5, color: '#6B7280', margin: 0 }}>
            {businessValue}
          </p>
        </div>
      )}

      {/* CTAs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 'auto' }}>
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center',
            background: '#111827', color: '#FFFFFF',
            fontSize: 14, fontWeight: 600,
            padding: '11px 22px', borderRadius: 12,
            textDecoration: 'none', border: '1px solid #111827',
            transition: 'opacity 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >{lang === 'es' ? '🚀 Demo en Vivo' : '🚀 Live Demo'}</a>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center',
            background: '#FFFFFF', color: '#374151',
            fontSize: 14, fontWeight: 600,
            padding: '11px 22px', borderRadius: 12,
            textDecoration: 'none', border: '1px solid #D1D5DB',
            transition: 'background 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
            onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
          >{lang === 'es' ? 'Ver Código' : 'View Code'}</a>
        )}
      </div>
    </article>
  )
}
