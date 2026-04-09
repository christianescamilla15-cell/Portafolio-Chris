import { useState, useEffect } from 'react'

export function useActiveSection() {
  const [active, setActive] = useState('hero')
  useEffect(() => {
    const sections = ['hero', 'about', 'journey', 'projects', 'skills', 'testimonials', 'contact']
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { threshold: 0.3 }
    )
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])
  return active
}
