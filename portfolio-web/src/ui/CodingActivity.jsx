import { useState, useEffect } from 'react'
import { useLang } from '../hooks/useLanguage'

/**
 * Phase 8, Feature 4: Live Coding Activity
 * Shows a simulated "currently building" widget that rotates project names.
 */
const PROJECTS = [
  'NexusForge AI',
  'Multi-Agent Chatbot',
  'Content Studio',
  'Finance AI Dashboard',
  'HR Scout',
  'Client Hub Portal',
  'Portfolio Web',
]

export default function CodingActivity() {
  const [idx, setIdx] = useState(0)
  const [fade, setFade] = useState(true)
  const lang = useLang()

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIdx(prev => (prev + 1) % PROJECTS.length)
        setFade(true)
      }, 300)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 14px',
      borderRadius: 100,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      fontSize: 12,
      color: 'rgba(255,255,255,0.4)',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Pulsing green dot */}
      <span style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: '#34D399',
        boxShadow: '0 0 6px #34D399',
        animation: 'pulse 2s infinite',
        flexShrink: 0,
      }} />
      <span>
        {lang === 'es' ? 'Construyendo: ' : 'Building: '}
        <span style={{
          color: '#A5B4FC',
          fontWeight: 600,
          transition: 'opacity 0.3s ease',
          opacity: fade ? 1 : 0,
        }}>
          {PROJECTS[idx]}
        </span>
      </span>
    </div>
  )
}
