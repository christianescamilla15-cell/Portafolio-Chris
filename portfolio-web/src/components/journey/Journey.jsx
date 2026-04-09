import { useRef, useContext } from 'react'
import { motion, useInView as useFramerInView } from 'framer-motion'
import { LangContext } from '../../hooks/useLanguage'
import { STRINGS } from '../../data/strings'
import { TIMELINE } from '../../data/timeline'

function JourneyMilestone({ item, index }) {
  const lang = useContext(LangContext)
  const ref = useRef(null)
  const isInView = useFramerInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        display: 'flex',
        gap: 24,
        paddingLeft: 28,
        position: 'relative',
        paddingBottom: index < TIMELINE.length - 1 ? 48 : 0,
      }}
    >
      <div style={{
        position: 'absolute',
        left: -6,
        top: 6,
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: item.color,
        boxShadow: `0 0 12px ${item.color}60, 0 0 24px ${item.color}30`,
        zIndex: 2,
        flexShrink: 0,
      }} />

      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: 700,
          background: `linear-gradient(135deg, ${item.color}, ${item.color}99)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 4,
          lineHeight: 1.2,
        }}>
          {item.year}
        </div>

        <h3 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
          fontWeight: 600,
          color: '#FAFAFA',
          marginBottom: 8,
          letterSpacing: '-0.01em',
        }}>
          {item.title[lang]}
        </h3>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
          color: 'rgba(255,255,255,.5)',
          lineHeight: 1.6,
          marginBottom: 12,
          maxWidth: 520,
        }}>
          {item.desc[lang]}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {item.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 12,
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: 100,
              background: `${item.color}12`,
              color: item.color,
              border: `1px solid ${item.color}25`,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '0.02em',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Journey() {
  const lang = useContext(LangContext)
  const t = (key) => STRINGS[key]?.[lang] || STRINGS[key]?.en || key
  const timelineRef = useRef(null)
  const lineRef = useRef(null)

  return (
    <section id="journey" className="reveal" style={{ position: 'relative' }}>
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: '0 24px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#6366F1',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {t('journeyLabel')}
          </span>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 600,
            color: '#FAFAFA',
            marginTop: 8,
            letterSpacing: '-0.02em',
          }}>
            {t('journeyTitle')}
          </h2>
        </motion.div>

        <div ref={timelineRef} style={{ position: 'relative', paddingLeft: 0 }}>
          <div
            ref={lineRef}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 2,
              background: 'linear-gradient(180deg, #6366F1, #A855F7)',
              transformOrigin: 'top center',
              borderRadius: 1,
            }}
          />

          {TIMELINE.map((item, i) => (
            <JourneyMilestone key={item.year} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
