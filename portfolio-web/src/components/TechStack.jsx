import { useLang } from '../hooks/useLanguage'

const blocks = [
  {
    title: 'Backend',
    items: ['FastAPI', 'Node.js', 'Fastify', 'Flask'],
  },
  {
    title: 'Frontend',
    items: ['React', 'Vite', 'HTML/CSS/JS'],
  },
  {
    title: { es: 'Datos / IA', en: 'Data / AI' },
    items: ['Python', 'PostgreSQL', 'pgvector', 'NLP', 'LLM APIs'],
  },
  {
    title: { es: 'Móvil / Infra', en: 'Mobile / Infra' },
    items: ['Flutter', 'Kotlin', 'Docker', 'Supabase', 'Playwright'],
  },
]

export default function TechStack() {
  const lang = useLang()

  return (
    <section id="stack" style={{
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
          {lang === 'es' ? 'Stack Tecnológico' : 'Tech Stack'}
        </h2>
      </div>

      <div className="reveal-stagger reveal" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
      }}>
        {blocks.map((block, i) => {
          const title = typeof block.title === 'string'
            ? block.title
            : (block.title[lang] || block.title.en)

          return (
            <div key={i} style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 12,
              padding: 24,
            }}>
              <h3 style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#111827',
                margin: '0 0 16px',
              }}>
                {title}
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}>
                {block.items.map((item, j) => (
                  <li key={j} style={{
                    fontSize: 14,
                    color: '#4B5563',
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
