import { useLang } from '../hooks/useLanguage'

const architectures = [
  {
    title: 'NexusForge AI System',
    subtitle: { es: 'Orquestación Multi-Agente', en: 'Multi-Agent Orchestration' },
    diagram: [
      'User Interface',
      'FastAPI Gateway',
      'Agent Orchestrator',
      'Agent Swarm (22 agents)',
      'Memory Layer (pgvector)',
      'PostgreSQL / Redis',
    ],
    features: {
      es: ['Orquestación con auto-reparación', 'Topologías swarm (6 modos)', 'Capa de memoria RAG', 'SDK + CLI tooling'],
      en: ['Self-healing orchestration', 'Swarm topologies (6 modes)', 'RAG memory layer', 'SDK + CLI tooling'],
    },
  },
  {
    title: 'MindScrolling AI Product',
    subtitle: { es: 'Producto Móvil con IA', en: 'AI Mobile Product' },
    diagram: [
      'Mobile App (Flutter)',
      'Fastify Backend',
      'Recommendation Engine',
      'Vector Similarity (pgvector)',
      'Quote Knowledge Base',
    ],
    features: {
      es: ['Puntuación conductual', 'Recomendación híbrida', 'Ponderación de sentimiento', 'Publicada en Play Store'],
      en: ['Behavioral scoring', 'Hybrid recommendation', 'Sentiment weighting', 'Published on Play Store'],
    },
  },
  {
    title: 'Ad Analytics Pipeline',
    subtitle: { es: 'Ingeniería de Datos', en: 'Data Engineering' },
    diagram: [
      'Meta Ads + Google Ads + GA4',
      'ETL Pipeline (FastAPI)',
      'Data Cleaning & OCR',
      'Anomaly Detection (z-score)',
      'Analytics Dashboard',
    ],
    features: {
      es: ['ETL multi-plataforma', 'Parsing OCR de facturas', 'Alertas de anomalías en tiempo real', '124 tests automatizados'],
      en: ['Multi-platform ETL', 'Invoice OCR parsing', 'Real-time anomaly alerts', '124 automated tests'],
    },
  },
]

const capabilities = {
  es: [
    'Orquestación multi-agente',
    'Pipelines de retrieval (RAG)',
    'Bases de datos vectoriales (pgvector)',
    'Sistemas de analytics con IA',
    'Infraestructura de testing en producción',
    'Diseño de pipelines LLM',
  ],
  en: [
    'Multi-agent orchestration',
    'Retrieval pipelines (RAG)',
    'Vector databases (pgvector)',
    'AI analytics systems',
    'Production testing infrastructure',
    'LLM pipeline design',
  ],
}

function DiagramFlow({ steps }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {steps.map((step, i) => (
        <div key={i}>
          <div style={{
            background: '#FFFFFF', border: '1px solid #E5E7EB',
            borderRadius: 10, padding: '10px 16px',
            fontSize: 14, fontWeight: 500, color: '#374151',
            textAlign: 'center',
          }}>{step}</div>
          {i < steps.length - 1 && (
            <div style={{ textAlign: 'center', color: '#D1D5DB', fontSize: 13, lineHeight: '18px' }}>↓</div>
          )}
        </div>
      ))}
    </div>
  )
}

function ArchitectureCard({ arch, lang }) {
  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #E5E7EB',
      borderRadius: 20, padding: 24,
      transition: 'box-shadow 0.3s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
        {arch.title}
      </h3>
      <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 16px', fontWeight: 500 }}>
        {arch.subtitle[lang] || arch.subtitle.en}
      </p>

      <div style={{
        background: '#F9FAFB', border: '1px solid #E5E7EB',
        borderRadius: 14, padding: 16, marginBottom: 16,
      }}>
        <DiagramFlow steps={arch.diagram} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {(arch.features[lang] || arch.features.en).map((f, i) => (
          <span key={i} style={{
            fontSize: 12, color: '#4B5563', background: '#F3F4F6',
            padding: '5px 12px', borderRadius: 100, fontWeight: 500,
          }}>✓ {f}</span>
        ))}
      </div>
    </div>
  )
}

export default function ArchitectureSection() {
  const lang = useLang()

  return (
    <section id="architecture" style={{
      maxWidth: 1200, margin: '0 auto',
      padding: '80px 24px', borderTop: '1px solid #F3F4F6',
    }}>
      {/* Header */}
      <div className="reveal" style={{ marginBottom: 48 }}>
        <span style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: '#9CA3AF',
        }}>
          {lang === 'es' ? 'Arquitectura de Sistemas' : 'Systems Architecture'}
        </span>
        <h2 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700,
          color: '#111827', marginTop: 8, letterSpacing: '-0.02em',
        }}>
          {lang === 'es'
            ? 'Cómo diseño sistemas de IA para producción'
            : 'How I design AI systems for production'}
        </h2>
      </div>

      {/* Architecture cards grid */}
      <div className="reveal" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 24, marginBottom: 48,
      }}>
        {architectures.map((arch, i) => (
          <ArchitectureCard key={i} arch={arch} lang={lang} />
        ))}
      </div>

      {/* Core Capabilities */}
      <div className="reveal" style={{
        background: '#F9FAFB', border: '1px solid #E5E7EB',
        borderRadius: 20, padding: 32, textAlign: 'center',
      }}>
        <h3 style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: '#9CA3AF', margin: '0 0 20px',
        }}>
          {lang === 'es' ? 'Capacidades Core' : 'Core Capabilities'}
        </h3>
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10,
        }}>
          {(capabilities[lang] || capabilities.en).map((cap, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', borderRadius: 12,
              background: '#FFFFFF', border: '1px solid #E5E7EB',
              fontSize: 14, fontWeight: 500, color: '#374151',
            }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span> {cap}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
