import { useRef, useState, useEffect } from 'react'

export function useScrollReveal(delay = 0) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay)
          obs.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return [ref, visible]
}
