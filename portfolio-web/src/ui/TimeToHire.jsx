import { useRef } from 'react'
import { motion, useInView as useFramerInView } from 'framer-motion'

const accent = '#6366F1'

const TIMELINE_STEPS = [
  { week: 'Week 1', label: 'Setup & Onboarding', icon: '\uD83D\uDE80', color: '#818CF8' },
  { week: 'Week 2', label: 'First PR Merged', icon: '\u2705', color: '#34D399' },
  { week: 'Week 3', label: 'Full Velocity', icon: '\u26A1', color: '#F59E0B' },
]

export default function TimeToHire() {
  const ref = useRef(null)
  const inView = useFramerInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: 'clamp(20px, 4vw, 32px)',
        marginTop: 32,
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 12, marginBottom: 24, flexWrap: 'wrap',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 600, color: '#34D399',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#10B981',
            animation: 'pulse 2s infinite',
          }} />
          Available immediately
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: `${accent}08`, border: `1px solid ${accent}20`,
          borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 600, color: '#818CF8',
        }}>
          Remote & On-site
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)',
        }}>
          CDMX, Mexico
        </div>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'center', gap: 0,
        position: 'relative',
      }}>
        {TIMELINE_STEPS.map((step, i) => (
          <motion.div
            key={step.week}
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              flex: 1, textAlign: 'center', position: 'relative',
              padding: '0 8px',
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: `${step.color}15`,
              border: `1px solid ${step.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px', fontSize: 18,
            }}>
              {step.icon}
            </div>
            <div style={{
              fontSize: 11, fontWeight: 700, color: step.color,
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4,
            }}>
              {step.week}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
              {step.label}
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div style={{
                position: 'absolute', top: 20, right: 0,
                width: '50%', height: 1,
                background: `linear-gradient(90deg, ${step.color}40, ${TIMELINE_STEPS[i + 1].color}40)`,
              }} />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
