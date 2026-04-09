import { getTagColor, getTagBg, getTagBorder } from '../data/tagColors'

export default function StackTag({ tag }) {
  const color = getTagColor(tag)
  const bg = getTagBg(tag)
  const border = getTagBorder(tag)

  return (
    <span
      style={{
        background: bg, color: color,
        fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 100,
        border: `1px solid ${border}`,
        letterSpacing: '0.02em',
        display: 'inline-block',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
        e.currentTarget.style.boxShadow = `0 4px 12px ${color}30`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >{tag}</span>
  )
}
