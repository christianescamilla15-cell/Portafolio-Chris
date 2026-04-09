import { useState, useEffect, useRef, useMemo } from 'react'
import { useT, useLang } from '../../hooks/useLanguage'
import { PROJECTS, CATEGORIES, FEATURED_ORDER } from '../../data/projects'
import StackTag from '../../ui/StackTag'
import { IconGitHub, IconExternalLink } from '../../ui/Icons'
import { trackEvent } from '../../hooks/useAnalytics'

/* ── Feature 2: Project Click-Through Tracking ── */
function trackProjectClick(projectName, linkType) {
  trackEvent('project_click', { project: projectName, link: linkType })
}

/* ───────────── Terminal Content ────────────── */

function TerminalContent({ lines }) {
  const [visibleChars, setVisibleChars] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const termRef = useRef(null)
  const fullText = (lines || ['$ loading...']).join('\n')

  useEffect(() => {
    const el = termRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted) {
        setHasStarted(true)
        setVisibleChars(0)
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    setVisibleChars(0)
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleChars(i)
      if (i >= fullText.length) {
        clearInterval(interval)
        setTimeout(() => { setHasStarted(false); setVisibleChars(0) }, 4000)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [hasStarted, fullText])

  const displayed = fullText.substring(0, visibleChars)

  return (
    <div ref={termRef} style={{
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 13, lineHeight: 1.6, color: '#10B981',
      padding: '20px 24px', height: '100%',
      background: '#0A0B0F',
      whiteSpace: 'pre-wrap', overflow: 'hidden',
    }}>
      {displayed.split('\n').map((line, i) => (
        <div key={i} style={{
          color: line.startsWith('$') ? '#A78BFA' :
                 line.startsWith('\u2713') ? '#10B981' :
                 line.startsWith('\u2192') ? '#818CF8' :
                 line.startsWith('>') ? '#F59E0B' : 'rgba(255,255,255,0.5)',
        }}>{line}</div>
      ))}
      <span style={{ animation: 'blink 1s step-end infinite', color: '#10B981' }}>_</span>
    </div>
  )
}

/* ───────────── Browser Mockup ────────────── */

function BrowserMockup({ url, title, emoji, color, terminalLines }) {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div style={{
      width: '100%', maxWidth: 500,
      borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.1)',
      overflow: 'hidden',
      boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${color}15`,
      position: 'relative',
    }}
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      <div style={{
        padding: '10px 16px',
        background: 'rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
        </div>
        <div style={{
          flex: 1, padding: '4px 12px', borderRadius: 6,
          background: 'rgba(255,255,255,0.06)',
          fontSize: 11, color: 'rgba(255,255,255,0.4)',
          fontFamily: 'ui-monospace, monospace',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {url}
        </div>
      </div>
      <div style={{ height: 280, overflow: 'hidden', position: 'relative' }}>
        <TerminalContent lines={terminalLines} />
        {/* Play icon overlay (Feature 7) */}
        {url && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
            opacity: showPreview ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: showPreview ? 'auto' : 'none',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: `linear-gradient(135deg, ${color}, ${color}99)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 24px ${color}40`,
              marginBottom: 12,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="8,5 20,12 8,19" /></svg>
            </div>
            <span style={{
              fontSize: 13, fontWeight: 600, color: '#FAFAFA',
              textAlign: 'center', maxWidth: 200,
            }}>
              {title}
            </span>
            <span style={{
              fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4,
            }}>
              Click to open live demo
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ───────────── CountUp Metric ────────────── */

function CountUpMetric({ value, color }) {
  const [count, setCount] = useState(0)
  const numericValue = parseInt(value) || 0
  const isNumeric = !isNaN(parseInt(value))
  const ref = useRef(null)
  const inView = useFramerInView(ref, { once: true })

  useEffect(() => {
    if (!inView || !isNumeric) return
    let startTime = null
    const duration = 1500
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * numericValue))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, numericValue, isNumeric])

  return (
    <div ref={ref} style={{
      background: 'rgba(255,255,255,0.04)', borderRadius: 12,
      padding: '16px 20px', minWidth: 110, textAlign: 'center',
      borderTop: `3px solid ${color}`,
    }}>
      <div style={{
        fontSize: 36, fontWeight: 700, fontFamily: 'Syne, sans-serif',
        background: `linear-gradient(135deg, ${color}, #FAFAFA)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        {isNumeric ? count + (value.includes('+') ? '+' : value.includes('%') ? '%' : '') : value}
      </div>
    </div>
  )
}

/* ───────────── Project Card — Apple minimal ────────────── */

function ProjectCard({ project, index, isFeatured }) {
  const lang = useLang()
  const t = useT()
  const desc = lang === 'en' && project.description_en ? project.description_en : project.description

  return (
    <div style={{
      background: 'var(--card-bg, rgba(255,255,255,0.03))',
      border: '1px solid var(--border, rgba(255,255,255,0.06))',
      borderRadius: 16,
      padding: 'clamp(20px, 3vw, 28px)',
      display: 'flex', flexDirection: 'column', height: '100%',
      transition: 'border-color 0.3s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border, rgba(255,255,255,0.06))'}
    >
      {/* Header: emoji + title + metric */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>{project.emoji}</span>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700,
            color: '#FAFAFA', margin: 0, letterSpacing: '-0.01em',
          }}>{project.title}{project.isNew && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
              background: '#F59E0B', color: '#000', letterSpacing: '0.05em',
              textTransform: 'uppercase', marginLeft: 8, verticalAlign: 'middle',
            }}>Nuevo</span>
          )}</h3>
        </div>
        {isFeatured && (
          <span style={{
            background: '#6366F1', color: '#fff',
            fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>★</span>
        )}
      </div>

      {/* Metric badge */}
      {project.keyMetric && (
        <span style={{
          display: 'inline-block', alignSelf: 'flex-start',
          background: 'rgba(99,102,241,0.06)', color: '#818CF8',
          fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6,
          marginBottom: 12,
        }}>{project.keyMetric}</span>
      )}

      {/* Description */}
      <p style={{
        color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.65,
        margin: '0 0 16px', flex: 1,
      }}>{desc}</p>

      {/* Stack tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
        {project.stack.slice(0, 6).map(s => (
          <StackTag key={s} tag={s} />
        ))}
        {project.stack.length > 6 && (
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', padding: '2px 6px' }}>
            +{project.stack.length - 6}
          </span>
        )}
      </div>

      {/* CTA links — Apple style: max 2 */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noopener noreferrer"
            onClick={() => trackProjectClick(project.title, 'demo')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#6366F1', color: '#fff',
              fontSize: 13, fontWeight: 600,
              padding: '9px 18px', borderRadius: 10, textDecoration: 'none',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Ver Demo <span className="link-chevron">&rarr;</span>
          </a>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            onClick={() => trackProjectClick(project.title, 'github')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'transparent', color: 'rgba(255,255,255,0.5)',
              fontSize: 13, fontWeight: 600, padding: '9px 18px', borderRadius: 10,
              textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)',
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            <IconGitHub /> GitHub
          </a>
        )}
      </div>
    </div>
  )
}

/* ───────────── Theater Panel (desktop) ────────────── */

function TheaterPanel({ project, index, total, catColor }) {
  const lang = useLang()
  const t = useT()
  const [hovered, setHovered] = useState(false)
  const desc = lang === 'en' && project.description_en ? project.description_en : project.description
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const featuredEntry = FEATURED_ORDER.find(f => f.id === project.id)
  const caseStudy = featuredEntry?.caseStudy || null
  const metrics = featuredEntry
    ? featuredEntry.metrics
    : PROJECT_METRICS[project.id] || [{n: String(project.stack.length), l:'Stack'},{n: project.keyMetric || 'Live', l:'Status'},{n: project.category, l:'Type'}]

  const glowColor = featuredEntry
    ? featuredEntry.glowColor
    : catColor ? catColor.replace(')', ',0.12)').replace('rgb', 'rgba') : 'rgba(99,102,241,0.12)'

  const indexLabel = String(index + 1).padStart(2, '0')
  const mockupUrl = project.demo || ''

  return (
    <div
      className="theater-panel"
      style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center',
        padding: '80px clamp(32px, 6vw, 80px) 60px',
        position: 'relative', overflow: 'hidden',
        cursor: project.demo ? 'pointer' : 'default',
        transition: 'background 0.3s ease',
      }}
      onClick={() => {
        if (project.demo) window.open(project.demo, '_blank')
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: `radial-gradient(circle, ${glowColor || 'rgba(99,102,241,0.12)'} 0%, transparent 60%)`,
        top: '-10%', right: '-5%', filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: `radial-gradient(circle, ${catColor || '#6366F1'}15 0%, transparent 60%)`,
        bottom: '10%', left: '20%', filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {project.demo && (
        <div style={{
          position: 'absolute', bottom: 80, right: 60,
          color: catColor || 'rgba(99,102,241,0.6)',
          fontSize: 14, fontWeight: 500, letterSpacing: '0.02em',
          opacity: hovered ? 0.7 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          pointerEvents: 'none',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {lang === 'en' ? 'Click to explore' : 'Click para explorar'} <span style={{ fontSize: 18 }}>&rarr;</span>
        </div>
      )}

      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        border: `1px solid ${catColor || '#6366F1'}`,
        opacity: hovered ? 0.15 : 0,
        transition: 'opacity 0.4s ease',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(32px, 4vw, 64px)', width: '100%', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 700, position: 'relative', zIndex: 1, flex: '1 1 auto', minWidth: 0 }}>
        <div style={{
          position: 'absolute', top: '50%', left: '-5%', transform: 'translateY(-50%)',
          fontSize: 'clamp(8rem, 15vw, 12rem)', fontWeight: 900, fontFamily: 'Syne, sans-serif',
          color: 'rgba(255,255,255,0.06)', lineHeight: 1, pointerEvents: 'none',
          userSelect: 'none', letterSpacing: '-0.04em',
        }}>{indexLabel}</div>

        <h3 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 4vw, 4rem)',
          fontWeight: 700, color: '#FAFAFA', margin: '0 0 12px',
          letterSpacing: '-0.02em', lineHeight: 1.1,
        }}>{project.title}{project.isNew && (
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
            background: '#F59E0B', color: '#000', letterSpacing: '0.05em',
            textTransform: 'uppercase', marginLeft: 12, verticalAlign: 'middle',
          }}>Nuevo</span>
        )}</h3>

        <div style={{
          width: 80, height: 3, borderRadius: 2, marginBottom: 16,
          background: `linear-gradient(90deg, ${catColor || '#6366F1'}, ${catColor ? catColor + '99' : '#A78BFA'})`,
        }} />

        {(project.tagline?.es || project.tagline?.en) && (
          <div style={{
            fontSize: 18, fontWeight: 600, color: catColor || '#818CF8',
            lineHeight: 1.4, margin: '0 0 16px',
            fontFamily: 'DM Sans, sans-serif',
          }}>
            {lang === 'es' ? (project.tagline?.es || '') : (project.tagline?.en || project.tagline?.es || '')}
          </div>
        )}

        <p style={{
          color: 'rgba(255,255,255,.5)', fontSize: 17, lineHeight: 1.8,
          margin: '0 0 16px', maxWidth: 560,
        }}>{desc}</p>

        {project.impactMetric && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 8, padding: '6px 14px', marginBottom: 16,
          }}>
            <span style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>
              {lang === 'es' ? project.impactMetric.es : project.impactMetric.en}
            </span>
          </div>
        )}

        {caseStudy && (
          <div style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['problem', 'solution', 'result'].map(key => (
              <div key={key} style={{
                flex: '1 1 160px', padding: '10px 12px', borderRadius: 10,
                background: key === 'result' ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${key === 'result' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}`,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: key === 'problem' ? '#EF4444' : key === 'solution' ? '#6366F1' : '#10B981', marginBottom: 4 }}>
                  {key === 'problem' ? 'Problem' : key === 'solution' ? 'Solution' : 'Result'}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  {lang === 'es' ? caseStudy[key].es : caseStudy[key].en}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <CountUpMetric value={m.n} color={catColor || '#6366F1'} />
              <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, fontWeight: 500, marginTop: 4, textAlign: 'center' }}>{m.l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
          {project.stack.map(s => <StackTag key={s} tag={s} />)}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer"
              className="btn-shine"
              onClick={() => trackProjectClick(project.title, 'demo')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: `linear-gradient(135deg, ${catColor || '#6366F1'}, ${catColor ? catColor + '99' : '#8B5CF6'})`, color: '#fff',
                fontSize: 14, fontWeight: 600, padding: '12px 24px', borderRadius: 12,
                textDecoration: 'none', boxShadow: `0 4px 20px ${catColor ? catColor + '4D' : 'rgba(99,102,241,.3)'}`,
                position: 'relative', overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {t('viewDemo')} <IconExternalLink />
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              onClick={() => trackProjectClick(project.title, 'github')}
              style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,.03)', color: 'rgba(255,255,255,.6)',
              fontSize: 14, fontWeight: 600, padding: '12px 24px', borderRadius: 12,
              textDecoration: 'none', border: '1px solid rgba(255,255,255,.08)',
              transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,.2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)' }}
            >
              <IconGitHub /> GitHub
            </a>
          )}
          {project.apk && (
            <a href={project.apk} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(16,185,129,.08)', color: '#34D399',
              fontSize: 14, fontWeight: 600, padding: '12px 24px', borderRadius: 12,
              textDecoration: 'none', border: '1px solid rgba(16,185,129,.15)',
              transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,185,129,.15)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16,185,129,.08)' }}
            >
              {t('downloadApk')}
            </a>
          )}
        </div>
      </div>

      {!isMobile && mockupUrl && (
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => e.stopPropagation()}
        >
          <a href={mockupUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <BrowserMockup
              url={mockupUrl}
              title={project.title}
              emoji={project.emoji}
              color={catColor || '#6366F1'}
              terminalLines={project.terminalLines}
            />
          </a>
        </div>
      )}
      </div>
    </div>
  )
}

/* ───────────── Project Comparison Table ────────────── */

function ProjectTable({ lang }) {
  const t = useT()
  const [sortKey, setSortKey] = useState('title')
  const [sortDir, setSortDir] = useState(1)

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => -d)
    else { setSortKey(key); setSortDir(1) }
  }

  const getTestCount = (p) => {
    const m = PROJECT_METRICS[p.id]
    if (!m) return 0
    const testEntry = m.find(e => e.l === 'Tests')
    if (!testEntry) return 0
    return parseInt(testEntry.n) || 0
  }

  const sorted = [...PROJECTS].sort((a, b) => {
    if (sortKey === 'title') return sortDir * a.title.localeCompare(b.title)
    if (sortKey === 'category') return sortDir * a.category.localeCompare(b.category)
    if (sortKey === 'tests') return sortDir * (getTestCount(a) - getTestCount(b))
    if (sortKey === 'stack') return sortDir * (a.stack.length - b.stack.length)
    return 0
  })

  const headerStyle = (key) => ({
    padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    color: sortKey === key ? '#818CF8' : 'rgba(255,255,255,0.4)',
    cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
  })

  const cellStyle = {
    padding: '10px 14px', fontSize: 13, color: 'rgba(255,255,255,0.6)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
        <thead>
          <tr>
            <th style={headerStyle('title')} onClick={() => handleSort('title')}>
              {lang === 'en' ? 'Name' : 'Nombre'} {sortKey === 'title' ? (sortDir === 1 ? '\u2191' : '\u2193') : ''}
            </th>
            <th style={headerStyle('category')} onClick={() => handleSort('category')}>
              {lang === 'en' ? 'Category' : 'Categoría'} {sortKey === 'category' ? (sortDir === 1 ? '\u2191' : '\u2193') : ''}
            </th>
            <th style={headerStyle('tests')} onClick={() => handleSort('tests')}>
              Tests {sortKey === 'tests' ? (sortDir === 1 ? '\u2191' : '\u2193') : ''}
            </th>
            <th style={headerStyle('stack')} onClick={() => handleSort('stack')}>
              Stack {sortKey === 'stack' ? (sortDir === 1 ? '\u2191' : '\u2193') : ''}
            </th>
            <th style={{ ...headerStyle('demo'), cursor: 'default' }}>Demo</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(p => {
            const catObj = CATEGORIES.find(c => c.key === p.category)
            return (
              <tr key={p.id} style={{ transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ ...cellStyle, color: '#FAFAFA', fontWeight: 600 }}>
                  <span style={{ marginRight: 8 }}>{p.emoji}</span>{p.title}
                </td>
                <td style={cellStyle}>
                  <span style={{
                    background: `${catObj?.color || '#818CF8'}15`, color: catObj?.color || '#818CF8',
                    fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6,
                    border: `1px solid ${catObj?.color || '#818CF8'}25`,
                  }}>
                    {catObj ? (catObj.label[lang] || catObj.label.es) : p.category}
                  </span>
                </td>
                <td style={cellStyle}>{getTestCount(p) || '-'}</td>
                <td style={cellStyle}>{p.stack.length}</td>
                <td style={cellStyle}>
                  {p.demo ? (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" style={{
                      color: '#818CF8', fontSize: 12, fontWeight: 600, textDecoration: 'none',
                    }}>{t('viewDemo')}</a>
                  ) : '-'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ───────────── Projects Section ────────────── */

// Feature 10: Referrer-based category order
const DEFAULT_CAT_ORDER = ['ai', 'fullstack', 'mobile', 'automation']
function getReferrerCategoryOrder() {
  const ref = (window.__portfolioRef || '').toLowerCase()
  const docRef = document.referrer.toLowerCase()
  if (ref.includes('linkedin') || docRef.includes('linkedin')) return ['ai', 'fullstack', 'automation', 'mobile']
  if (ref.includes('github') || docRef.includes('github')) return ['ai', 'automation', 'fullstack', 'mobile']
  if (ref.includes('indeed') || docRef.includes('indeed')) return ['fullstack', 'ai', 'automation', 'mobile']
  return DEFAULT_CAT_ORDER
}

export default function Projects() {
  const t = useT()
  const lang = useLang()
  const isMobileRef = useRef(typeof window !== 'undefined' && window.innerWidth < 768)
  const [viewMode, setViewMode] = useState('cards')
  const [activeFilter, setActiveFilter] = useState('all')
  const [categoryOrder] = useState(() => getReferrerCategoryOrder())

  const orderedCategories = useMemo(() => {
    return categoryOrder
      .map(key => CATEGORIES.find(c => c.key === key))
      .filter(Boolean)
  }, [categoryOrder])

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return PROJECTS
    return PROJECTS.filter(p => p.category === activeFilter)
  }, [activeFilter])

  const isMobile = isMobileRef.current

  return (
    <section id="projects" className="reveal" style={{ position: 'relative', zIndex: 2 }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: isMobile ? '80px 16px' : '120px clamp(24px, 4vw, 80px) 80px',
      }}>
        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            color: '#6366F1', fontSize: 12, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.15em',
          }}>{t('portfolioLabel')}</span>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700, color: '#FAFAFA',
            margin: '12px 0 8px', letterSpacing: '-0.03em', lineHeight: 1.1,
          }}>{t('projectsTitle')}</h2>
          <p style={{
            color: 'rgba(255,255,255,0.4)', fontSize: 16, maxWidth: 600,
            margin: '0 auto', lineHeight: 1.6,
          }}>{t('projectsSubtitle')}</p>
        </div>

        {/* ── Filter pills + view toggle ── */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 8, marginBottom: 48, flexWrap: 'wrap',
        }}>
          <button onClick={() => setActiveFilter('all')} style={{
            padding: '8px 20px', borderRadius: 20, fontSize: 13, fontWeight: 600,
            border: '1px solid',
            borderColor: activeFilter === 'all' ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)',
            background: activeFilter === 'all' ? 'rgba(99,102,241,0.12)' : 'transparent',
            color: activeFilter === 'all' ? '#818CF8' : 'rgba(255,255,255,0.45)',
            cursor: 'pointer', transition: 'all 0.3s ease',
          }}>
            {lang === 'en' ? 'All' : 'Todos'} ({PROJECTS.length})
          </button>
          {orderedCategories.map(cat => {
            const count = PROJECTS.filter(p => p.category === cat.key).length
            if (count === 0) return null
            const catLabel = cat.label[lang] || cat.label['es']
            return (
              <button key={cat.key} onClick={() => setActiveFilter(cat.key)} style={{
                padding: '8px 20px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                border: '1px solid',
                borderColor: activeFilter === cat.key ? `${cat.color}66` : 'rgba(255,255,255,0.08)',
                background: activeFilter === cat.key ? `${cat.color}18` : 'transparent',
                color: activeFilter === cat.key ? cat.color : 'rgba(255,255,255,0.45)',
                cursor: 'pointer', transition: 'all 0.3s ease',
              }}>
                {catLabel} ({count})
              </button>
            )
          })}

          {!isMobile && (
            <div style={{ marginLeft: 16, display: 'flex', gap: 4 }}>
              {['cards', 'table'].map(mode => (
                <button key={mode} onClick={() => setViewMode(mode)} style={{
                  padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                  border: '1px solid',
                  borderColor: viewMode === mode ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)',
                  background: viewMode === mode ? 'rgba(99,102,241,0.08)' : 'transparent',
                  color: viewMode === mode ? '#818CF8' : 'rgba(255,255,255,0.35)',
                  cursor: 'pointer', transition: 'all 0.3s ease',
                }}>
                  {mode === 'cards' ? '▦' : '☰'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Table view ── */}
        {!isMobile && viewMode === 'table' ? (
          <ProjectTable lang={lang} />

        /* ── Cards view — ALL 18 projects, grouped by category ── */
        ) : activeFilter === 'all' ? (
          /* Show grouped by category when "All" is selected */
          orderedCategories.map(cat => {
            const catProjects = PROJECTS.filter(p => p.category === cat.key)
            if (catProjects.length === 0) return null
            const catLabel = cat.label[lang] || cat.label['es']

            return (
              <div key={cat.key} style={{ marginBottom: 64 }}>
                {/* Category header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  marginBottom: 28, paddingBottom: 12,
                  borderBottom: `1px solid rgba(255,255,255,0.06)`,
                }}>
                  <div style={{
                    width: 4, height: 28, borderRadius: 2,
                    background: cat.color,
                  }} />
                  <span style={{
                    fontSize: 14, fontWeight: 700, color: cat.color,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    fontFamily: 'Syne, sans-serif',
                  }}>{catLabel}</span>
                  <span style={{
                    fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 500,
                  }}>{catProjects.length} {catProjects.length === 1 ? 'proyecto' : 'proyectos'}</span>
                </div>

                {/* Projects grid */}
                <div className="reveal-stagger visible" style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile
                    ? '1fr'
                    : catProjects.length === 1
                      ? '1fr'
                      : 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: 20,
                }}>
                  {catProjects.map((p, i) => {
                    const isFeatured = FEATURED_ORDER.some(f => f.id === p.id)
                    return (
                      <ProjectCard key={p.id} project={p} index={i} isFeatured={isFeatured} highlighted={false} />
                    )
                  })}
                </div>
              </div>
            )
          })

        ) : (
          /* Show filtered projects */
          <div className="reveal-stagger visible" style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 20,
          }}>
            {filteredProjects.map((p, i) => {
              const isFeatured = FEATURED_ORDER.some(f => f.id === p.id)
              return (
                <ProjectCard key={p.id} project={p} index={i} isFeatured={isFeatured} highlighted={false} />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
