import { useLang } from '../hooks/useLanguage'

const steps = [
  { number: '1', label: { es: 'Definir problema', en: 'Define problem' } },
  { number: '2', label: { es: 'Diseñar arquitectura', en: 'Design architecture' } },
  { number: '3', label: { es: 'Construir sistema', en: 'Build full-stack system' } },
  { number: '4', label: { es: 'Agregar métricas / testing', en: 'Add metrics / testing' } },
  { number: '5', label: { es: 'Desplegar e iterar', en: 'Deploy and iterate' } },
]

const quote = {
  es: 'Construyo alrededor de claridad arquitectónica, outputs medibles, y delivery orientado a producto.',
  en: 'I build around architecture clarity, measurable outputs, and product-oriented delivery.',
}

export default function HowIBuild() {
  const lang = useLang()

  return (
    <section style={{
      padding: '80px 24px',
      maxWidth: 1100,
      margin: '0 auto',
    }}>
      <div className="reveal" style={{ marginBottom: 40 }}>
        <h2 style={{
          fontSize: 24,
          fontWeight: 700,
          color: '#111827',
        }}>
          {lang === 'es' ? 'Cómo Construyo' : 'How I Build'}
        </h2>
      </div>

      <div className="reveal" style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        position: 'relative',
        marginBottom: 48,
      }}>
        {/* Connecting line */}
        <div style={{
          position: 'absolute',
          top: 20,
          left: '10%',
          right: '10%',
          height: 1,
          background: '#E5E7EB',
          zIndex: 0,
        }} />

        {steps.map((step, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            position: 'relative',
            zIndex: 1,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '2px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 700,
              color: '#111827',
              marginBottom: 12,
            }}>
              {step.number}
            </div>
            <span style={{
              fontSize: 13,
              color: '#4B5563',
              textAlign: 'center',
              maxWidth: 120,
              lineHeight: 1.4,
            }}>
              {step.label[lang]}
            </span>
          </div>
        ))}
      </div>

      <div className="reveal" style={{
        textAlign: 'center',
        maxWidth: 700,
        margin: '0 auto',
      }}>
        <p style={{
          fontSize: 16,
          color: '#6B7280',
          fontStyle: 'italic',
          lineHeight: 1.6,
          margin: 0,
        }}>
          &ldquo;{quote[lang]}&rdquo;
        </p>
      </div>
    </section>
  )
}
