import { useState } from 'react'
import { useLang } from '../hooks/useLanguage'

const caseStudies = [
  {
    title: { es: 'Diseño de un Sistema de Orquestación Multi-Agente con Auto-Reparación', en: 'Designing a Self-Healing Multi-Agent Orchestration System' },
    project: 'NexusForge AI',
    problem: {
      es: 'Los agentes LLM fallan frecuentemente en pipelines de producción por errores de herramientas, límites de contexto e inconsistencias en retrieval. Se necesitaba una capa de orquestación resiliente capaz de coordinar múltiples agentes y recuperarse automáticamente de fallos.',
      en: 'LLM agents frequently fail in production pipelines due to tool errors, context limits, and retrieval inconsistencies. Goal: design a resilient orchestration layer capable of coordinating multiple agents while recovering automatically from failures.',
    },
    diagram: ['User', 'FastAPI Gateway', 'Agent Orchestrator', 'Agent Swarm (22 agents)', 'Memory Layer (pgvector)', 'PostgreSQL + Redis'],
    decisions: {
      es: ['Topología swarm en lugar de cadena lineal', 'Estrategia de reintentos + fallback por agente', 'Capa de memoria vectorial para contexto compartido', 'Agentes stateless con memoria externa'],
      en: ['Swarm topology instead of linear chain', 'Retry + fallback strategy per agent', 'Vector memory layer for shared context', 'Stateless agents with external memory'],
    },
    tradeoffs: {
      es: ['Mayor complejidad de orquestación', 'Latencia incrementada por coordinación', 'Mayor observabilidad requerida'],
      en: ['Higher orchestration complexity', 'Increased latency due to coordination', 'More observability required'],
    },
    results: [
      { value: '22', label: { es: 'Agentes orquestados', en: 'Agents orchestrated' } },
      { value: '6', label: { es: 'Topologías swarm', en: 'Swarm topologies' } },
      { value: '247', label: { es: 'Tests escritos', en: 'Tests written' } },
    ],
    resultNote: { es: 'Auto-reparación de fallos de agentes sin intervención manual', en: 'Self-healing recovery for agent failures without manual intervention' },
  },
  {
    title: { es: 'Diseño de un Sistema de Recomendación Conductual para un Producto Móvil de IA', en: 'Designing a Behavioral Recommendation System for a Mobile AI Product' },
    project: 'MindScrolling',
    problem: {
      es: 'La mayoría de feeds sociales optimizan engagement. MindScrolling necesitaba optimizar para reflexión y reducir el doom-scrolling, requiriendo un sistema de recomendación basado en comportamiento, no en clicks.',
      en: 'Most social feeds optimize engagement. MindScrolling needed to optimize for reflection and reduce doom-scrolling behavior, requiring a recommendation system based on behavior, not clicks.',
    },
    diagram: ['Flutter App', 'Fastify Backend', 'Recommendation Engine', 'pgvector Similarity', 'Quote Knowledge Base'],
    decisions: {
      es: ['Recomendación híbrida (vectores + heurísticas)', 'Arquitectura mobile offline-first', 'Puntuación conductual en lugar de tracking de clicks'],
      en: ['Hybrid recommendation (vector + heuristics)', 'Offline-first mobile architecture', 'Behavior scoring instead of click tracking'],
    },
    tradeoffs: {
      es: ['Métricas de engagement tradicional más bajas', 'Lógica de recomendación más compleja', 'Modelo conductual requiere ajuste continuo'],
      en: ['Lower traditional engagement metrics', 'More complex recommendation logic', 'Behavioral model requires continuous tuning'],
    },
    results: [
      { value: '13K+', label: { es: 'Citas indexadas', en: 'Quotes indexed' } },
      { value: 'Hybrid', label: { es: 'Motor de recomendación', en: 'Recommendation engine' } },
      { value: 'Play Store', label: { es: 'Publicada', en: 'Published' } },
    ],
    resultNote: { es: 'Producto real con usuarios consumiendo contenido curado por IA diariamente', en: 'Real product with users consuming AI-curated content daily' },
  },
  {
    title: { es: 'Construcción de un Pipeline ETL Unificado de Analytics de Marketing', en: 'Building a Unified Marketing Analytics ETL Pipeline' },
    project: 'Ad Analytics Pipeline',
    problem: {
      es: 'Los datos de marketing están fragmentados entre plataformas. Los equipos necesitan analytics unificados y detección de anomalías en tiempo real a través de Meta Ads, Google Ads y GA4.',
      en: 'Marketing data is fragmented across platforms. Teams need unified analytics and anomaly detection across Meta Ads, Google Ads, and GA4 in real time.',
    },
    diagram: ['Meta Ads + Google Ads + GA4', 'FastAPI ETL Pipeline', 'Data Processing + OCR', 'Z-Score Anomaly Detection', 'Analytics Dashboard'],
    decisions: {
      es: ['Arquitectura ETL con FastAPI', 'Detección estadística de anomalías con Z-score', 'Capa de agregación multi-cuenta', 'OCR de facturas con puntuación de confianza'],
      en: ['ETL architecture with FastAPI', 'Z-score statistical anomaly detection', 'Multi-account aggregation layer', 'Invoice OCR with confidence scoring'],
    },
    tradeoffs: {
      es: ['Límites de API requieren batching cuidadoso', 'Z-score asume distribución normal', 'Normalización de schemas cross-platform agrega complejidad'],
      en: ['API rate limits require careful batching', 'Z-score assumes normal distribution', 'Cross-platform schema normalization adds complexity'],
    },
    results: [
      { value: '3', label: { es: 'Plataformas de ads integradas', en: 'Ad platforms integrated' } },
      { value: '124', label: { es: 'Tests escritos', en: 'Tests written' } },
      { value: 'Real-time', label: { es: 'Alertas de anomalías', en: 'Anomaly alerts' } },
    ],
    resultNote: { es: 'ETL unificado para 3 plataformas con alertas automáticas de anomalías', en: 'Unified ETL for 3 platforms with automated anomaly alerts' },
  },
]

function DiagramFlow({ steps }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {steps.map((step, i) => (
        <div key={i}>
          <div style={{
            background: '#FFFFFF', border: '1px solid #E5E7EB',
            borderRadius: 8, padding: '8px 14px',
            fontSize: 13, fontWeight: 500, color: '#374151', textAlign: 'center',
          }}>{step}</div>
          {i < steps.length - 1 && (
            <div style={{ textAlign: 'center', color: '#D1D5DB', fontSize: 12, lineHeight: '16px' }}>↓</div>
          )}
        </div>
      ))}
    </div>
  )
}

function CaseStudyCard({ study, lang, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <article style={{
      background: '#FFFFFF', border: '1px solid #E5E7EB',
      borderRadius: 20, overflow: 'hidden',
      transition: 'box-shadow 0.3s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Header — always visible */}
      <div style={{ padding: 24, cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#9CA3AF', display: 'block', marginBottom: 6,
            }}>{study.project}</span>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.3 }}>
              {typeof study.title === 'object' ? (study.title[lang] || study.title.en) : study.title}
            </h3>
          </div>
          <span style={{
            fontSize: 20, color: '#9CA3AF', flexShrink: 0,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s ease',
          }}>▾</span>
        </div>

        {/* Problem — always visible */}
        <div style={{ marginTop: 16 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#9CA3AF', margin: '0 0 6px',
          }}>{lang === 'es' ? 'Problema' : 'Problem'}</p>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: '#6B7280', margin: 0 }}>
            {study.problem[lang] || study.problem.en}
          </p>
        </div>
      </div>

      {/* Expanded content */}
      <div style={{
        maxHeight: expanded ? 1200 : 0,
        opacity: expanded ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.4s ease, opacity 0.3s ease',
      }}>
        <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Architecture */}
          <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 14, padding: 16 }}>
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#9CA3AF', margin: '0 0 12px',
            }}>{lang === 'es' ? 'Arquitectura' : 'Architecture'}</p>
            <DiagramFlow steps={study.diagram} />
          </div>

          {/* Decisions + Tradeoffs side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ borderLeft: '2px solid #10B981', paddingLeft: 16 }}>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#9CA3AF', margin: '0 0 8px',
              }}>{lang === 'es' ? 'Decisiones Clave' : 'Key Decisions'}</p>
              {(study.decisions[lang] || study.decisions.en).map((d, i) => (
                <p key={i} style={{ fontSize: 13, color: '#4B5563', margin: '0 0 4px', lineHeight: 1.5 }}>
                  • {d}
                </p>
              ))}
            </div>
            <div style={{ borderLeft: '2px solid #F59E0B', paddingLeft: 16 }}>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#9CA3AF', margin: '0 0 8px',
              }}>{lang === 'es' ? 'Compromisos' : 'Tradeoffs'}</p>
              {(study.tradeoffs[lang] || study.tradeoffs.en).map((t, i) => (
                <p key={i} style={{ fontSize: 13, color: '#4B5563', margin: '0 0 4px', lineHeight: 1.5 }}>
                  • {t}
                </p>
              ))}
            </div>
          </div>

          {/* Results */}
          <div>
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#9CA3AF', margin: '0 0 12px',
            }}>{lang === 'es' ? 'Resultados' : 'Results'}</p>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${study.results.length}, 1fr)`, gap: 10 }}>
              {study.results.map((r, i) => (
                <div key={i} style={{
                  background: '#F9FAFB', border: '1px solid #E5E7EB',
                  borderRadius: 12, padding: '10px 14px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>{r.value}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{typeof r.label === 'object' ? (r.label[lang] || r.label.en) : r.label}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: '#6B7280', marginTop: 10, fontStyle: 'italic' }}>
              {study.resultNote[lang] || study.resultNote.en}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function CaseStudies() {
  const lang = useLang()

  return (
    <section id="case-studies" style={{
      maxWidth: 900, margin: '0 auto',
      padding: '80px 24px', borderTop: '1px solid #F3F4F6',
    }}>
      <div className="reveal" style={{ marginBottom: 40 }}>
        <span style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: '#9CA3AF',
        }}>
          {lang === 'es' ? 'Estudios de Caso de Ingeniería' : 'Engineering Case Studies'}
        </span>
        <h2 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700,
          color: '#111827', marginTop: 8, letterSpacing: '-0.02em',
        }}>
          {lang === 'es'
            ? 'Decisiones técnicas en sistemas de IA seleccionados'
            : 'Deep dives into selected AI systems and engineering decisions'}
        </h2>
      </div>

      <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {caseStudies.map((study, i) => (
          <CaseStudyCard key={i} study={study} lang={lang} defaultExpanded={i === 0} />
        ))}
      </div>
    </section>
  )
}
