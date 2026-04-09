import { useLang } from '../hooks/useLanguage'

const principles = [
  {
    number: '01',
    title: { es: 'Arquitectura Primero', en: 'Architecture First' },
    body: {
      es: 'Antes de escribir código defino los límites del sistema. Cada sistema de IA empieza con una arquitectura clara: interfaces, capa de orquestación, capa de memoria, y observabilidad. Esto reduce la complejidad a medida que el sistema crece.',
      en: 'Before writing code I define the system boundaries. Every AI system starts with a clear architecture: interfaces, orchestration layer, memory layer, and observability. This reduces complexity as the system grows.',
    },
  },
  {
    number: '02',
    title: { es: 'Los Sistemas de IA Necesitan Guardrails', en: 'AI Systems Need Guardrails' },
    body: {
      es: 'Los sistemas LLM fallan de formas impredecibles. Diseño pipelines con reintentos, fallbacks, monitoreo y capas determinísticas alrededor del modelo.',
      en: 'LLM systems fail in unpredictable ways. I design pipelines with retries, fallbacks, monitoring, and deterministic layers around the model.',
    },
  },
  {
    number: '03',
    title: { es: 'Medir Todo', en: 'Measure Everything' },
    body: {
      es: 'Los sistemas de IA solo son útiles si su comportamiento es medible. Me enfoco en evaluación, tests, outputs observables y métricas de rendimiento.',
      en: 'AI systems are only useful if their behavior is measurable. I focus on evaluation, tests, observable outputs, and performance metrics.',
    },
  },
  {
    number: '04',
    title: { es: 'Simplicidad Sobre Novedad', en: 'Simplicity Over Novelty' },
    body: {
      es: 'Muchas arquitecturas de IA se vuelven innecesariamente complejas. Mi preferencia: componentes simples, interfaces claras y comportamiento predecible.',
      en: 'Many AI architectures become unnecessarily complex. My preference: simple components, clear interfaces, and predictable behavior.',
    },
  },
  {
    number: '05',
    title: { es: 'Enviar Sistemas, No Demos', en: 'Ship Systems, Not Demos' },
    body: {
      es: 'Una demo funcional no es suficiente. Me enfoco en sistemas que corren de forma confiable, pueden desplegarse, testearse y extenderse.',
      en: 'A working demo is not enough. I focus on systems that run reliably, can be deployed, tested, and extended.',
    },
  },
]

export default function EngineeringPrinciples() {
  const lang = useLang()

  return (
    <section style={{
      maxWidth: 900, margin: '0 auto',
      padding: '80px 24px', borderTop: '1px solid #F3F4F6',
    }}>
      <div className="reveal" style={{ marginBottom: 40 }}>
        <span style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: '#9CA3AF',
        }}>
          {lang === 'es' ? 'Principios de Ingeniería' : 'Engineering Principles'}
        </span>
        <h2 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700,
          color: '#111827', marginTop: 8, letterSpacing: '-0.02em',
        }}>
          {lang === 'es'
            ? 'Cómo pienso como Ingeniero de IA'
            : 'How I Think as an AI Engineer'}
        </h2>
        <p style={{ fontSize: 15, color: '#6B7280', marginTop: 8, maxWidth: 600, lineHeight: 1.6 }}>
          {lang === 'es'
            ? 'Principios que sigo al diseñar sistemas de IA y software de producción.'
            : 'Principles I follow when designing AI systems and production software.'}
        </p>
      </div>

      <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {principles.map((p, i) => (
          <div key={i} style={{
            display: 'flex', gap: 20, alignItems: 'flex-start',
            background: '#FFFFFF', border: '1px solid #E5E7EB',
            borderRadius: 16, padding: 24,
            transition: 'box-shadow 0.3s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <span style={{
              fontSize: 28, fontWeight: 800, color: '#E5E7EB',
              fontFamily: 'monospace', lineHeight: 1, flexShrink: 0, minWidth: 40,
            }}>{p.number}</span>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
                {p.title[lang] || p.title.en}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: '#6B7280', margin: 0 }}>
                {p.body[lang] || p.body.en}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
