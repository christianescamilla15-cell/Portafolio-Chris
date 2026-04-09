import { useLang } from '../hooks/useLanguage'

const metrics = [
  { number: '20+', label: { es: 'Sistemas IA Desplegados', en: 'AI Systems Deployed' } },
  { number: '1,500+', label: { es: 'Tests Automatizados', en: 'Automated Tests' } },
  { number: '24', label: { es: 'Agentes en Sistema Flagship', en: 'Agents in Flagship System' } },
  { number: '3+', label: { es: 'Años Trabajando con LLMs', en: 'Years Working with LLMs' } },
]

export default function ProofBar() {
  const lang = useLang()

  return (
    <section style={{
      padding: '48px 24px',
      maxWidth: 1000,
      margin: '0 auto',
    }}>
      <div className="reveal" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        flexWrap: 'wrap',
      }}>
        {metrics.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 140,
            flex: '1 1 140px',
            maxWidth: 200,
          }}>
            <span style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#111827',
              lineHeight: 1.2,
            }}>
              {m.number}
            </span>
            <span style={{
              fontSize: 13,
              color: '#9CA3AF',
              marginTop: 4,
              textAlign: 'center',
            }}>
              {m.label[lang] || m.label.en}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
