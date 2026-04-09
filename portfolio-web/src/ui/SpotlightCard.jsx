import { useRef, useState } from 'react'

export default function SpotlightCard({ children, className, style, ...props }) {
  const cardRef = useRef(null)
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false })

  const handleMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    setSpotlight({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    })
  }

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={() => setSpotlight(s => ({ ...s, active: false }))}
      style={{
        position: 'relative', overflow: 'hidden',
        ...style,
      }}
      {...props}
    >
      {/* Spotlight gradient */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: spotlight.active ? 1 : 0,
        background: `radial-gradient(600px circle at ${spotlight.x}% ${spotlight.y}%, rgba(99,102,241,0.08), transparent 40%)`,
        transition: 'opacity 0.3s ease',
        zIndex: 1,
      }} />
      {/* Card content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}
