import { useRef, useState, useEffect } from 'react'
import { useInView as useFramerInView } from 'framer-motion'

export default function CountUp({ target, suffix = '', prefix = '', duration = 2, onComplete }) {
  const ref = useRef(null)
  const inView = useFramerInView(ref, { once: true, margin: '-50px' })
  const [count, setCount] = useState(0)
  const completedRef = useRef(false)

  useEffect(() => {
    if (!inView) return
    const end = parseInt(target)
    if (isNaN(end)) { setCount(target); return }

    let start = 0
    const step = end / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
        if (onComplete && !completedRef.current) {
          completedRef.current = true
          onComplete()
        }
      }
      else setCount(Math.floor(start))
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [inView, target, duration, onComplete])

  return <span ref={ref}>{prefix}{typeof count === 'number' ? count.toLocaleString() : count}{suffix}</span>
}
