export default function ScrollRevealText({ text, startProgress, endProgress, scrollProgress, style }) {
  const words = text.split(' ')
  return (
    <span style={{ display: 'inline', ...style }}>
      {words.map((word, i) => {
        const wordStart = startProgress + (i / words.length) * (endProgress - startProgress)
        const wordEnd = wordStart + (1 / words.length) * (endProgress - startProgress)
        const opacity = Math.max(0, Math.min(1, (scrollProgress - wordStart) / (wordEnd - wordStart || 0.001)))
        return (
          <span key={i} style={{
            opacity,
            filter: `blur(${(1 - opacity) * 4}px)`,
            transition: 'none',
            willChange: 'opacity, filter',
          }}>
            {word}{' '}
          </span>
        )
      })}
    </span>
  )
}
