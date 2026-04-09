import { useEffect, useCallback } from 'react'

const ANALYTICS_ENDPOINT = '/api/analytics-event'

/**
 * Fire-and-forget analytics event sender.
 * Used by all tracking hooks and components.
 */
export function trackEvent(type, data = {}) {
  try {
    fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...data, timestamp: new Date().toISOString() }),
    }).catch(() => {})
  } catch {
    // Silently fail — analytics should never break the app
  }
}

/**
 * Feature 1: Section Dwell Time Tracking
 * Tracks how long a user spends viewing each portfolio section
 * using IntersectionObserver with a 30% visibility threshold.
 * Sends accumulated dwell times via sendBeacon on page unload.
 */
export function useDwellTimeTracker() {
  useEffect(() => {
    const sections = ['hero', 'about', 'journey', 'projects', 'skills', 'testimonials', 'contact']
    const dwellTimes = {}
    const observers = []

    sections.forEach(id => {
      dwellTimes[id] = { visible: false, totalMs: 0, lastStart: null }
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          dwellTimes[id].visible = true
          dwellTimes[id].lastStart = Date.now()
        } else if (dwellTimes[id].visible) {
          dwellTimes[id].visible = false
          dwellTimes[id].totalMs += Date.now() - dwellTimes[id].lastStart
        }
      }, { threshold: 0.3 })
      obs.observe(el)
      observers.push(obs)
    })

    const handleUnload = () => {
      // Finalize any currently-visible sections
      sections.forEach(id => {
        if (dwellTimes[id].visible && dwellTimes[id].lastStart) {
          dwellTimes[id].totalMs += Date.now() - dwellTimes[id].lastStart
        }
      })
      const payload = {
        type: 'dwell_time',
        sections: Object.fromEntries(
          sections.map(id => [id, { totalMs: dwellTimes[id].totalMs }])
        ),
        timestamp: new Date().toISOString(),
      }
      navigator.sendBeacon(ANALYTICS_ENDPOINT, JSON.stringify(payload))
    }

    window.addEventListener('beforeunload', handleUnload)

    return () => {
      observers.forEach(o => o.disconnect())
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [])
}

/**
 * Feature 6: Scroll Depth Tracking
 * Tracks the maximum scroll depth (0-100%) reached by the visitor.
 * Sends via sendBeacon on page unload.
 */
export function useScrollDepthTracker() {
  useEffect(() => {
    let maxDepth = 0

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return
      const depth = Math.round((window.scrollY / scrollHeight) * 100)
      if (depth > maxDepth) maxDepth = depth
    }

    const handleUnload = () => {
      navigator.sendBeacon(ANALYTICS_ENDPOINT, JSON.stringify({
        type: 'scroll_depth',
        maxDepth,
        timestamp: new Date().toISOString(),
      }))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [])
}

/**
 * Feature 7: Referrer Tracking
 * Records document.referrer, UTM params, and basic user agent on page load.
 */
export function useReferrerTracker() {
  useEffect(() => {
    const referrer = document.referrer || 'direct'
    const params = new URLSearchParams(window.location.search)
    const utm = params.get('ref') || params.get('utm_source') || ''
    trackEvent('visit', {
      referrer,
      utm,
      userAgent: navigator.userAgent.slice(0, 100),
    })
  }, [])
}

/**
 * Feature 8: Language Preference Tracking
 * Tracks when the visitor switches languages.
 */
export function useLangTracker(lang) {
  const isFirst = typeof window !== 'undefined'
    ? (window.__langTrackerInit === undefined)
    : true

  useEffect(() => {
    // Skip initial render — only track actual switches
    if (window.__langTrackerInit === undefined) {
      window.__langTrackerInit = lang
      return
    }
    trackEvent('lang_switch', { lang })
  }, [lang])
}

/**
 * Hook returning a memoized trackEvent function for use in components.
 */
export function useTrackEvent() {
  return useCallback((type, data) => trackEvent(type, data), [])
}
