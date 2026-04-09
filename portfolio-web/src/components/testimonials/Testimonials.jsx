import { useRef } from 'react'
import { motion, useInView as useFramerInView } from 'framer-motion'
import { useT, useLang } from '../../hooks/useLanguage'
import { TESTIMONIALS } from '../../data/testimonials'
import SpotlightCard from '../../ui/SpotlightCard'

export default function Testimonials() {
  const t = useT()
  const lang = useLang()
  const sectionRef = useRef(null)
  const inView = useFramerInView(sectionRef, { once: true, margin: '-80px' })
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <section id="testimonials" ref={sectionRef} className="reveal" style={{ padding: '120px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: 16 }}
        >
          <span style={{
            color: '#818CF8', fontSize: 12, fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>{t('testimonialsLabel')}</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700, color: '#FAFAFA', textAlign: 'center',
            letterSpacing: '-0.02em', marginBottom: 64,
          }}
        >
          {t('testimonialsTitle')}
        </motion.h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 20,
        }}>
          {TESTIMONIALS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.12 }}
            >
              <SpotlightCard
                className="glass-card"
                style={{
                  background: 'rgba(255,255,255,.03)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,.08)',
                  borderRadius: 20, padding: 'clamp(24px, 4vw, 32px) clamp(20px, 3.5vw, 28px)',
                  height: '100%',
                  display: 'flex', flexDirection: 'column',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,.2)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)' }}
              >
                <span style={{
                  position: 'absolute', top: 16, left: 24,
                  fontSize: 72, fontFamily: 'Syne, sans-serif', fontWeight: 800,
                  lineHeight: 1,
                  background: 'linear-gradient(135deg, rgba(99,102,241,.3), rgba(167,139,250,.15))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  pointerEvents: 'none', userSelect: 'none',
                }}>&ldquo;</span>

                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontStyle: 'italic',
                  fontSize: 15, lineHeight: 1.8,
                  color: 'rgba(255,255,255,.6)',
                  flex: 1,
                  marginTop: 32, marginBottom: 24,
                  position: 'relative', zIndex: 1,
                }}>
                  {item.quote[lang] || item.quote.es}
                </p>

                <div style={{
                  height: 1,
                  background: 'linear-gradient(90deg, rgba(99,102,241,.2), transparent)',
                  marginBottom: 16,
                }} />

                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>{item.author}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>{item.company}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    <span style={{
                      display: 'inline-block',
                      background: 'rgba(99,102,241,.08)', color: '#818CF8',
                      fontSize: 11, fontWeight: 500, padding: '4px 12px', borderRadius: 100,
                      border: '1px solid rgba(99,102,241,.12)',
                    }}>{item.role}</span>
                  </div>
                  {item.evaluated && (
                    <div style={{
                      marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.25)',
                      fontStyle: 'italic',
                    }}>
                      {lang === 'en' ? 'Evaluated' : 'Evaluó'}: {item.evaluated[lang] || item.evaluated.es}
                    </div>
                  )}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
