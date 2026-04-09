import { useState, useEffect, useCallback } from 'react'
import { LangContext } from './hooks/useLanguage'

import Navbar from './components/layout/Navbar'
import Hero from './components/hero/Hero'
import ProofBar from './components/ProofBar'
import AboutNew from './components/about/AboutNew'
import FeaturedProjects from './components/projects/FeaturedProjects'
import SupportingProjects from './components/projects/SupportingProjects'
import OtherProjects from './components/projects/OtherProjects'
import TechStack from './components/TechStack'
import HowIBuild from './components/HowIBuild'
import ArchitectureSection from './components/ArchitectureSection'
import CaseStudies from './components/CaseStudies'
import EngineeringPrinciples from './components/EngineeringPrinciples'
import CTASection from './components/CTASection'
import Contact from './components/contact/Contact'
import Footer from './components/layout/Footer'
import PortfolioChatbot from './PortfolioChatbot'

export default function App() {
  const [lang, setLang] = useState('es')
  const toggleLang = useCallback(() => setLang(p => (p === 'es' ? 'en' : 'es')), [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
  }, [])

  // Scroll reveal
  useEffect(() => {
    const revealElements = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
        const rect = el.getBoundingClientRect()
        const inView = rect.top < window.innerHeight + 100 && rect.bottom > -100
        if (inView) el.classList.add('visible')
      })
    }

    revealElements()
    window.addEventListener('scroll', revealElements, { passive: true })

    const interval = setInterval(revealElements, 500)
    const timeout = setTimeout(() => clearInterval(interval), 10000)

    return () => {
      window.removeEventListener('scroll', revealElements)
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <LangContext.Provider value={lang}>
      <Navbar lang={lang} setLang={setLang} />

      <main id="main-content" role="main">
        <Hero />
        <ProofBar />

        {/* Systems overview */}
        <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 60px', textAlign: 'center' }}>
          <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            {[
              { icon: '\uD83E\uDD16', label: 'AI Orchestration System' },
              { icon: '\uD83D\uDD17', label: 'Retrieval Pipeline' },
              { icon: '\uD83D\uDCF1', label: 'Mobile AI Product' },
              { icon: '\uD83D\uDCCA', label: 'Data Analytics Platform' },
              { icon: '\u2699\uFE0F', label: 'Automation Infrastructure' },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 12,
                background: '#F9FAFB', border: '1px solid #E5E7EB',
                fontSize: 14, fontWeight: 500, color: '#374151',
              }}>
                <span>{s.icon}</span> {s.label}
              </div>
            ))}
          </div>
        </section>

        <ArchitectureSection />
        <FeaturedProjects />
        <SupportingProjects />
        <CaseStudies />
        <EngineeringPrinciples />
        <TechStack />
        <OtherProjects />
        <Contact />
        <CTASection />
      </main>

      <Footer />
      <PortfolioChatbot />
    </LangContext.Provider>
  )
}
