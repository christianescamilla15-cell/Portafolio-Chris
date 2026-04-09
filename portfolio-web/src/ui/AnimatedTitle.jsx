export default function AnimatedTitle({ text, visible, style }) {
  const words = text.split(' ')
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.3em', ...style }}>
      {words.map((word, i) => (
        <span key={i} style={{
          display: 'inline-block',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: `opacity 0.5s cubic-bezier(.4,0,.2,1) ${i * 0.05 + 0.1}s, transform 0.5s cubic-bezier(.4,0,.2,1) ${i * 0.05 + 0.1}s`,
        }}>{word}</span>
      ))}
    </span>
  )
}
