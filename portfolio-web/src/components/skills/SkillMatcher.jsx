import { useState, useMemo, useEffect } from 'react'
import { SKILL_BARS } from '../../data/skills'
import { PROJECTS } from '../../data/projects'
import { trackEvent } from '../../hooks/useAnalytics'

const accent = '#6366F1'

// Flatten all known skills into a lookup
const ALL_SKILLS = SKILL_BARS.flatMap(bar =>
  bar.items.map(item => item.toLowerCase())
)

// Also include stack items from projects
const ALL_STACK = [...new Set(PROJECTS.flatMap(p => p.stack.map(s => s.toLowerCase())))]

const SKILL_SYNONYMS = {
  'python': ['python', 'py'],
  'javascript': ['javascript', 'js', 'ecmascript'],
  'typescript': ['typescript', 'ts'],
  'react': ['react', 'react.js', 'reactjs'],
  'node.js': ['node.js', 'nodejs', 'node'],
  'vue.js': ['vue.js', 'vuejs', 'vue'],
  'docker': ['docker', 'containerization', 'containers'],
  'kubernetes': ['kubernetes', 'k8s'],
  'aws': ['aws', 'amazon web services', 'amazon'],
  'postgresql': ['postgresql', 'postgres', 'psql'],
  'redis': ['redis', 'cache'],
  'fastapi': ['fastapi', 'fast api'],
  'langchain': ['langchain', 'lang chain'],
  'ci/cd': ['ci/cd', 'cicd', 'continuous integration', 'continuous deployment', 'github actions'],
  'testing': ['testing', 'tests', 'tdd', 'test-driven', 'unit testing', 'e2e'],
  'sql': ['sql', 'mysql', 'sqlite', 'postgresql', 'database'],
  'machine learning': ['machine learning', 'ml', 'deep learning', 'ai', 'artificial intelligence'],
  'llm': ['llm', 'large language model', 'gpt', 'claude', 'language model'],
  'tailwind': ['tailwind', 'tailwindcss', 'tailwind css'],
  'flutter': ['flutter', 'dart'],
  'kotlin': ['kotlin', 'android'],
  'laravel': ['laravel', 'php'],
  'rest api': ['rest', 'restful', 'api', 'rest api'],
  'agile': ['agile', 'scrum', 'kanban', 'sprint'],
  'git': ['git', 'github', 'version control'],
  'prompt engineering': ['prompt engineering', 'prompt', 'prompting'],
  'rag': ['rag', 'retrieval augmented generation', 'retrieval'],
}

function extractKeywords(text) {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s./+#-]/g, ' ')
  const words = normalized.split(/\s+/).filter(w => w.length > 1)

  const found = new Set()

  // Check for exact matches against known skills/stack
  const combinedKnown = [...ALL_SKILLS, ...ALL_STACK]
  combinedKnown.forEach(skill => {
    if (normalized.includes(skill)) found.add(skill)
  })

  // Check synonyms
  Object.entries(SKILL_SYNONYMS).forEach(([canonical, synonyms]) => {
    synonyms.forEach(syn => {
      if (normalized.includes(syn)) found.add(canonical)
    })
  })

  // Check individual words
  words.forEach(word => {
    combinedKnown.forEach(skill => {
      if (skill.includes(word) || word.includes(skill)) found.add(skill)
    })
  })

  return [...found]
}

function matchSkills(keywords) {
  const matched = []
  const unmatched = []

  keywords.forEach(kw => {
    const kwLower = kw.toLowerCase()
    let isMatched = false

    SKILL_BARS.forEach(bar => {
      bar.items.forEach(item => {
        if (item.toLowerCase().includes(kwLower) || kwLower.includes(item.toLowerCase())) {
          if (!matched.find(m => m.skill === item)) {
            matched.push({ skill: item, category: bar.name, color: bar.color })
          }
          isMatched = true
        }
      })
    })

    // Also check synonyms
    Object.entries(SKILL_SYNONYMS).forEach(([canonical, synonyms]) => {
      if (synonyms.includes(kwLower) || canonical === kwLower) {
        SKILL_BARS.forEach(bar => {
          bar.items.forEach(item => {
            if (item.toLowerCase().includes(canonical) || canonical.includes(item.toLowerCase())) {
              if (!matched.find(m => m.skill === item)) {
                matched.push({ skill: item, category: bar.name, color: bar.color })
              }
              isMatched = true
            }
          })
        })
      }
    })

    if (!isMatched) unmatched.push(kw)
  })

  return { matched, unmatched }
}

function findRelevantProjects(keywords) {
  return PROJECTS
    .map(p => {
      let score = 0
      const stackLower = p.stack.map(s => s.toLowerCase())
      keywords.forEach(kw => {
        const kwLower = kw.toLowerCase()
        stackLower.forEach(s => {
          if (s.includes(kwLower) || kwLower.includes(s)) score += 2
        })
        const desc = (p.description_en || p.description || '').toLowerCase()
        if (desc.includes(kwLower)) score += 1
      })
      return { ...p, matchScore: score }
    })
    .filter(p => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5)
}

export default function SkillMatcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [jdText, setJdText] = useState('')

  const results = useMemo(() => {
    if (jdText.trim().length < 10) return null
    const keywords = extractKeywords(jdText)
    if (keywords.length === 0) return null
    const { matched, unmatched } = matchSkills(keywords)
    const relevantProjects = findRelevantProjects(keywords)
    const totalKnown = ALL_SKILLS.length
    const matchPercentage = Math.min(100, Math.round((matched.length / Math.max(keywords.length, 1)) * 100))
    return { keywords, matched, unmatched, relevantProjects, matchPercentage }
  }, [jdText])

  // Feature 9: Track skill matcher usage when results are computed
  useEffect(() => {
    if (results) {
      trackEvent('skill_match', {
        matchPercent: results.matchPercentage,
        matchedCount: results.matched.length,
        totalSkills: results.keywords.length,
      })
    }
  }, [results?.matchPercentage]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 10,
          background: `${accent}10`,
          border: `1px solid ${accent}25`,
          color: '#A5B4FC', fontSize: 13, fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          cursor: 'pointer', transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${accent}20`; e.currentTarget.style.borderColor = `${accent}40` }}
        onMouseLeave={e => { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.borderColor = `${accent}25` }}
      >
        {'\uD83C\uDFAF'} Match my skills to a job
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeInUp 0.3s ease',
    }} onClick={() => setIsOpen(false)}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#0F1624', border: `1px solid ${accent}20`,
        borderRadius: 20, padding: 'clamp(20px, 4vw, 32px)',
        width: '90vw', maxWidth: 600, maxHeight: '85vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: `0 16px 64px rgba(0,0,0,0.5)`,
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 16,
        }}>
          <h3 style={{
            fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700,
            color: '#FAFAFA', margin: 0,
          }}>{'\uD83C\uDFAF'} Skill Matcher</h3>
          <button onClick={() => setIsOpen(false)} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
            fontSize: 20, cursor: 'pointer', padding: 4,
          }}>&times;</button>
        </div>

        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
          Paste a job description below and I will show you how my skills match.
        </p>

        <textarea
          value={jdText}
          onChange={e => setJdText(e.target.value)}
          placeholder="Paste job description here..."
          style={{
            width: '100%', minHeight: 120, maxHeight: 160,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: 16,
            color: '#FAFAFA', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            resize: 'vertical', outline: 'none',
            lineHeight: 1.6,
          }}
          onFocus={e => e.currentTarget.style.borderColor = `${accent}40`}
          onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
        />

        {results && (
          <div style={{ marginTop: 20, overflowY: 'auto', flex: 1 }}>
            {/* Match percentage */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `conic-gradient(${accent} ${results.matchPercentage * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
                position: 'relative',
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: '#0F1624', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 700, color: accent, fontFamily: 'Syne, sans-serif',
                }}>{results.matchPercentage}%</div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>
                  {results.matched.length} skills matched
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                  {results.keywords.length} keywords detected
                </div>
              </div>
            </div>

            {/* Matched skills */}
            {results.matched.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  Matched Skills
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {results.matched.map(m => (
                    <span key={m.skill} style={{
                      fontSize: 12, padding: '4px 12px', borderRadius: 100,
                      background: `${m.color}15`, color: m.color,
                      border: `1px solid ${m.color}30`, fontWeight: 500,
                    }}>{m.skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Relevant projects */}
            {results.relevantProjects.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#818CF8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  Recommended Projects
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {results.relevantProjects.map(p => (
                    <a key={p.id} href={p.demo || p.github || '#'} target="_blank" rel="noopener noreferrer" style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 12px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      textDecoration: 'none', transition: 'all 0.2s ease',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${accent}08`; e.currentTarget.style.borderColor = `${accent}20` }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
                    >
                      <span style={{ fontSize: 20 }}>{p.emoji}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#FAFAFA' }}>{p.title}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                          {p.stack.slice(0, 4).join(' + ')}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
