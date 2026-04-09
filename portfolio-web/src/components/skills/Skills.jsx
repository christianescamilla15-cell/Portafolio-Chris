import { useRef, useState } from 'react'
import { motion, useInView as useFramerInView } from 'framer-motion'
import { useT, useLang } from '../../hooks/useLanguage'
import { SKILL_BARS } from '../../data/skills'
import { PROJECTS } from '../../data/projects'
import CountUp from '../../ui/CountUp'
import SkillMatcher from './SkillMatcher'

/* ───────────── Skills Radar (Spider Chart) ────────────── */

function SkillsRadar() {
  const ref = useRef(null)
  const inView = useFramerInView(ref, { once: true })

  const categories = [
    { label: 'AI & LLMs', value: 95, color: '#818CF8' },
    { label: 'Backend', value: 85, color: '#34D399' },
    { label: 'Frontend', value: 80, color: '#67E8F9' },
    { label: 'DevOps', value: 75, color: '#FDBA74' },
    { label: 'Testing', value: 85, color: '#F472B6' },
  ]

  const cx = 150, cy = 150, maxR = 120
  const n = categories.length

  const getPoint = (index, value) => {
    const angle = (index * 2 * Math.PI / n) - Math.PI / 2
    const r = (value / 100) * maxR
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  }

  const rings = [25, 50, 75, 100]
  const points = categories.map((cat, i) => getPoint(i, inView ? cat.value : 0))
  const polygonStr = points.map(p => `${p.x},${p.y}`).join(' ')
  const axisEnds = categories.map((_, i) => getPoint(i, 100))

  return (
    <motion.div ref={ref} className="skills-radar-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
    >
      <svg viewBox="0 0 300 300" style={{ width: '100%', maxWidth: 300, height: 'auto' }}>
        {rings.map(pct => {
          const ringPoints = categories.map((_, i) => getPoint(i, pct))
          return (
            <polygon key={pct}
              points={ringPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"
            />
          )
        })}

        {axisEnds.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y}
            stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        ))}

        <polygon
          points={polygonStr}
          fill="rgba(99,102,241,0.15)"
          stroke="#6366F1" strokeWidth="2"
          style={{ transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />

        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4"
            fill={categories[i].color} stroke="#09090B" strokeWidth="2"
            style={{ transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        ))}

        {categories.map((cat, i) => {
          const labelPoint = getPoint(i, 115)
          return (
            <text key={i} x={labelPoint.x} y={labelPoint.y}
              textAnchor="middle" dominantBaseline="central"
              fill={cat.color} fontSize="11" fontWeight="600"
              fontFamily="DM Sans, sans-serif"
            >
              {cat.label}
            </text>
          )
        })}
      </svg>
    </motion.div>
  )
}

/* ───────────── Skill Bar with Framer Motion ────────────── */

/* ───────────── Skill detail descriptions ────────────── */
const SKILL_DETAILS = {
  'AI & LLMs': 'Building production AI systems with Claude, Groq, LangChain, CrewAI. Experienced in RLHF annotation (Scale AI), RAG pipelines with pgvector, and multi-agent orchestration patterns.',
  'Backend & APIs': 'RESTful APIs with FastAPI, Express, Laravel. Database design with PostgreSQL, Redis caching, Supabase real-time. Microservices and event-driven architectures.',
  'Frontend & Mobile': 'React 18 SPAs with Vite, Flutter cross-platform apps, Vue.js dashboards. GSAP/Framer Motion animations, responsive design, accessibility-first approach.',
  'DevOps & Infra': 'Docker containerization, Terraform IaC, Kubernetes orchestration. CI/CD with GitHub Actions, deployments on AWS, Vercel, Render. Monitoring and observability.',
  'Testing & QA': '1,500+ tests across all projects. TDD workflow with Vitest, pytest, PHPUnit. Integration testing, E2E with Playwright, automated CI pipelines with quality gates.',
}

function SkillBarAnimated({ skill, index }) {
  const ref = useRef(null)
  const inView = useFramerInView(ref, { once: true, margin: '-50px' })
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      style={{ marginBottom: 36 }}
    >
      {/* Feature 6: Card Flip */}
      <div
        style={{ perspective: 800, cursor: 'pointer' }}
        onClick={() => setFlipped(!flipped)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped(!flipped) } }}
        aria-label={`${skill.name} - click to ${flipped ? 'show skill bar' : 'show details'}`}
      >
        <div style={{
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}>
          {/* Front face: skill bar */}
          <div style={{ backfaceVisibility: 'hidden' }}>
            <div style={{
              background: 'rgba(255,255,255,.02)',
              border: '1px solid rgba(255,255,255,.06)',
              borderRadius: 16,
              padding: '20px 24px',
              transition: 'border-color 0.3s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,.15)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <span style={{ color: '#FAFAFA', fontSize: 16, fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>{skill.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: skill.color, fontSize: 14, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>{skill.level}%</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>tap to flip</span>
                </div>
              </div>

              <div style={{
                width: '100%', height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 2,
                overflow: 'hidden', marginBottom: 16,
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.level}%` } : {}}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 + 0.3 }}
                  style={{ height: '100%', background: skill.color, borderRadius: 2 }}
                />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skill.items.map((item, i) => (
                  <motion.span key={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.6 + i * 0.05 }}
                    className="stack-tag-hover"
                    style={{
                      background: 'rgba(255,255,255,.04)', color: 'rgba(255,255,255,.6)',
                      fontSize: 13, fontWeight: 500, padding: '6px 14px', borderRadius: 100,
                      border: '1px solid rgba(255,255,255,.08)',
                      transition: 'border-color 0.3s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,.2)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)' }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* Back face: detailed descriptions */}
          <div style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: 'absolute',
            top: 0, left: 0, right: 0,
          }}>
            <div style={{
              background: 'rgba(255,255,255,.03)',
              border: `1px solid ${skill.color}25`,
              borderRadius: 16,
              padding: '24px 28px',
              minHeight: 120,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                <span style={{
                  color: skill.color, fontSize: 16, fontWeight: 700, fontFamily: 'Syne, sans-serif',
                }}>{skill.name}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>tap to flip back</span>
              </div>
              <p style={{
                color: 'rgba(255,255,255,.55)', fontSize: 14, lineHeight: 1.7,
                fontFamily: 'DM Sans, sans-serif',
              }}>
                {SKILL_DETAILS[skill.name] || `Proficiency: ${skill.level}%`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ───────────── Floating Tag Cloud ────────────── */

function FloatingTagCloud() {
  const ref = useRef(null)
  const inView = useFramerInView(ref, { once: true })
  const containerRef = useRef(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  // Count tech usage across projects
  const techCounts = useRef(() => {
    const counts = {}
    PROJECTS.forEach(p => {
      p.stack.forEach(tech => {
        counts[tech] = (counts[tech] || 0) + 1
      })
    })
    return counts
  }).current()

  const techs = Object.entries(techCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))

  const maxCount = Math.max(...techs.map(t => t.count))

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMouse({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    })
  }

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
      style={{ marginBottom: 60 }}
    >
      <div ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMouse({ x: 0, y: 0 })}
        style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: 10, padding: '20px 0',
        }}
      >
        {techs.map((tech, i) => {
          const size = 11 + (tech.count / maxCount) * 8
          const opacity = 0.3 + (tech.count / maxCount) * 0.5
          // Subtle repulsion from mouse
          const angle = ((i * 137.5) % 360) * (Math.PI / 180)
          const repelX = -mouse.x * 8 * Math.cos(angle)
          const repelY = -mouse.y * 8 * Math.sin(angle)
          const floatY = Math.sin((Date.now() / 2000) + i * 0.5) * 3

          return (
            <motion.span key={tech.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.02, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: size, fontWeight: tech.count >= maxCount - 1 ? 600 : 500,
                color: `rgba(255,255,255,${opacity})`,
                padding: '4px 12px', borderRadius: 100,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                transform: `translate(${repelX}px, ${repelY}px)`,
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                cursor: 'default',
                animation: `floatTag${i % 3} ${3 + (i % 3)}s ease-in-out infinite`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = '#818CF8' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = `rgba(255,255,255,${opacity})` }}
            >
              {tech.name}
              {tech.count > 1 && (
                <span style={{ fontSize: 9, marginLeft: 4, opacity: 0.5 }}>{tech.count}x</span>
              )}
            </motion.span>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ───────────── CSS Confetti ────────────── */

function ConfettiBurst({ active }) {
  if (!active) return null
  const particles = Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * 360
    const distance = 40 + Math.random() * 60
    const size = 3 + Math.random() * 4
    const colors = ['#6366F1', '#A78BFA', '#818CF8', '#10B981', '#34D399', '#F59E0B']
    const color = colors[i % colors.length]
    return { angle, distance, size, color, delay: Math.random() * 0.3 }
  })

  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none', zIndex: 10 }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: p.size, height: p.size,
          borderRadius: p.size > 5 ? 1 : '50%',
          background: p.color,
          animation: `confetti-burst 1s ease-out ${p.delay}s forwards`,
          '--angle': `${p.angle}deg`,
          '--distance': `${p.distance}px`,
          opacity: 0,
        }} />
      ))}
    </div>
  )
}

/* ───────────── Skills Section ────────────── */

export default function Skills() {
  const t = useT()
  const lang = useLang()
  const statementRef = useRef(null)
  const isMobileRef = useRef(typeof window !== 'undefined' && window.innerWidth < 768)

  const statement = t('skillsStatement')
  const words = statement.split(' ')

  return (
    <section id="skills" className="reveal" style={{ padding: '120px 24px', position: 'relative' }}>
      <style>{`
        @keyframes floatTag0 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes floatTag1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes floatTag2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
      `}</style>
      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
        <div className="skills-statement velocity-skew" style={{ textAlign: 'center', marginBottom: 80, position: 'relative' }}>
          <p ref={statementRef} style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 700,
            color: '#FAFAFA',
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
          }}>
            {words.map((word, i) => {
              const is861 = word === '1500'
              return (
                <span key={`${lang}-${i}`} className="skills-word" style={{
                  display: 'inline-block', marginRight: '0.3em',
                  opacity: 1,
                  willChange: 'opacity, filter',
                  ...(is861 ? {
                    color: '#6366F1',
                  } : {}),
                }}>
                  {is861 ? <span style={{ display: 'inline-block', minWidth: '4.5em', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}><CountUp target={1500} duration={2.5} /></span> : word}
                </span>
              )
            })}
          </p>
        </div>

        <SkillsRadar />

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
          <SkillMatcher />
        </div>

        <FloatingTagCloud />

        {SKILL_BARS.map((skill, i) => (
          <SkillBarAnimated key={skill.name} skill={skill} index={i} />
        ))}
      </div>
    </section>
  )
}
