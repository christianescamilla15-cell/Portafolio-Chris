import { useLang } from '../../hooks/useLanguage'

const content = {
  leftTitle: { es: 'Qué construyo', en: 'What I Build' },
  rightTitle: { es: 'Cómo pienso', en: 'How I Think' },
  left: {
    es: [
      'Sistemas multi-agente de IA para producción',
      'Pipelines LLM con retrieval y orquestación',
      'Plataformas de analytics potenciadas por IA',
      'Productos full-stack con mobile',
    ],
    en: [
      'Multi-agent AI systems for production',
      'LLM pipelines with retrieval and orchestration',
      'AI-powered analytics platforms',
      'Full-stack products with mobile',
    ],
  },
  right: {
    es: [
      'Enfoque architecture-first',
      'Outputs medibles (tests, coverage, métricas)',
      'Ship a producción, no prototipos',
      'Experiencia Scale AI RLHF entrenando Claude & GPT-4o',
    ],
    en: [
      'Architecture-first approach',
      'Measurable outputs (tests, coverage, metrics)',
      'Ship to production, not prototypes',
      'Scale AI RLHF experience training Claude & GPT-4o',
    ],
  },
}

export default function AboutNew() {
  const lang = useLang()

  const columnStyle = {
    flex: '1 1 400px',
    minWidth: 0,
  }

  const titleStyle = {
    fontSize: 20,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 20,
  }

  const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  }

  const itemStyle = {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 1.6,
    paddingLeft: 16,
    position: 'relative',
  }

  return (
    <section id="about" className="reveal" style={{
      padding: '80px 24px',
      maxWidth: 1000,
      margin: '0 auto',
    }}>
      <div style={{
        display: 'flex',
        gap: 48,
        flexWrap: 'wrap',
      }}>
        <div style={columnStyle}>
          <h2 style={titleStyle}>{content.leftTitle[lang]}</h2>
          <ul style={listStyle}>
            {content.left[lang].map((item, i) => (
              <li key={i} style={itemStyle}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: '#9CA3AF',
                }}>&mdash;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div style={columnStyle}>
          <h2 style={titleStyle}>{content.rightTitle[lang]}</h2>
          <ul style={listStyle}>
            {content.right[lang].map((item, i) => (
              <li key={i} style={itemStyle}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: '#9CA3AF',
                }}>&mdash;</span>
                {item}
              </li>
            ))}
          </ul>
          <p style={{
            fontSize: 15,
            fontStyle: 'italic',
            color: '#374151',
            marginTop: 12,
            margin: '12px 0 0',
          }}>
            {lang === 'es'
              ? '— Sistemas de IA diseñados para confiabilidad en producción'
              : '— AI systems designed for production reliability'}
          </p>
        </div>
      </div>
    </section>
  )
}
