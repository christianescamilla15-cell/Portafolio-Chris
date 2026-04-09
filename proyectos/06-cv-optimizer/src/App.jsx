import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

// Constants
import { COLORS } from './constants/colors.js';
import { SAMPLE_CV_ES, SAMPLE_JOB_ES, SAMPLE_CV_EN, SAMPLE_JOB_EN } from './constants/sampleData.js';

// Utils
import { analyzeCVvsJob } from './utils/atsScorer.js';

// Components
import CVInput from './components/input/CVInput.jsx';
import JobInput from './components/input/JobInput.jsx';
import TabButton from './components/common/TabButton.jsx';
import LoadingStep from './components/common/LoadingStep.jsx';
import ContactBar from './components/common/ContactBar.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import OnboardingTour from './components/common/OnboardingTour.jsx';
import AnalysisTab from './components/analysis/AnalysisTab.jsx';
import OptimizedTab from './components/output/OptimizedTab.jsx';
import ComparisonTab from './components/output/ComparisonTab.jsx';
import DiffView from './components/output/DiffView.jsx';

const MIN_INPUT_LENGTH = 50;
const MAX_CV_LENGTH = 50000;
const APPLE_EASE = [0.16, 1, 0.3, 1];

const tabVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: APPLE_EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: APPLE_EASE } },
};

export default function App() {
  const [cvText, setCvText] = useState('');
  const [jobText, setJobText] = useState('');
  const [language, setLanguage] = useState('es');
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');
  const [loading, setLoading] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState([false, false, false, false]);
  const [analysisError, setAnalysisError] = useState(null);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const isES = language === 'es';
  const canAnalyze = cvText.trim().length >= MIN_INPUT_LENGTH && jobText.trim().length >= MIN_INPUT_LENGTH;

  // ── Tour refs ──
  const cvInputRef = useRef(null);
  const jobInputRef = useRef(null);
  const analyzeBtnRef = useRef(null);
  const resultsRef = useRef(null);

  // ── Lenis smooth scroll ──
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // ── Scroll progress ──
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(scrollHeight > 0 ? scrollTop / scrollHeight : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Validation errors
  const cvValidationError = useMemo(() => {
    if (!hasAttempted && cvText.length === 0) return null;
    if (cvText.length > 0 && cvText.trim().length < MIN_INPUT_LENGTH) {
      return isES
        ? `El CV necesita al menos ${MIN_INPUT_LENGTH} caracteres (actual: ${cvText.trim().length})`
        : `CV needs at least ${MIN_INPUT_LENGTH} characters (current: ${cvText.trim().length})`;
    }
    if (cvText.length > MAX_CV_LENGTH) {
      return isES
        ? `El CV no puede exceder ${MAX_CV_LENGTH.toLocaleString()} caracteres`
        : `CV cannot exceed ${MAX_CV_LENGTH.toLocaleString()} characters`;
    }
    return null;
  }, [cvText, isES, hasAttempted]);

  const jobValidationError = useMemo(() => {
    if (!hasAttempted && jobText.length === 0) return null;
    if (hasAttempted && jobText.trim().length === 0) {
      return isES
        ? 'La descripcion de la vacante no puede estar vacia'
        : 'Job description cannot be empty';
    }
    if (jobText.length > 0 && jobText.trim().length < MIN_INPUT_LENGTH) {
      return isES
        ? `La vacante necesita al menos ${MIN_INPUT_LENGTH} caracteres (actual: ${jobText.trim().length})`
        : `Job description needs at least ${MIN_INPUT_LENGTH} characters (current: ${jobText.trim().length})`;
    }
    return null;
  }, [jobText, isES, hasAttempted]);

  const analysisScores = useMemo(() => {
    if (!results) return null;
    return {
      matchScore: results.matchScore,
      matchedKeywords: results.matchedKeywords,
      totalKeywords: results.totalKeywords,
      strengthsCount: results.strengths.length,
      weaknessesCount: results.weaknesses.length,
      recommendationsCount: results.recommendations.length,
    };
  }, [results]);

  const loadExample = useCallback(() => {
    if (isES) {
      setCvText(SAMPLE_CV_ES);
      setJobText(SAMPLE_JOB_ES);
    } else {
      setCvText(SAMPLE_CV_EN);
      setJobText(SAMPLE_JOB_EN);
    }
    setResults(null);
    setAnalysisError(null);
    setHasAttempted(false);
  }, [isES]);

  const handleAnalyze = useCallback(() => {
    setHasAttempted(true);
    if (!canAnalyze) return;

    setLoading(true);
    setResults(null);
    setAnalysisError(null);
    setLoadingSteps([false, false, false, false]);
    setActiveTab('analysis');

    const steps = [400, 900, 1400, 2000];
    steps.forEach((delay, idx) => {
      setTimeout(() => {
        setLoadingSteps((prev) => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
      }, delay);
    });

    setTimeout(() => {
      try {
        const result = analyzeCVvsJob(cvText, jobText, language);
        setResults(result);
        setAnalysisError(null);
      } catch (err) {
        console.error('[Analysis Error]', err);
        setAnalysisError(
          isES
            ? 'Error al analizar el CV. Intenta de nuevo.'
            : 'Error analyzing CV. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    }, 2400);
  }, [cvText, jobText, language, canAnalyze, isES]);

  const loadingLabels = isES
    ? ['Extrayendo keywords...', 'Analizando experiencia...', 'Calculando match...', 'Generando CV optimizado...']
    : ['Extracting keywords...', 'Analyzing experience...', 'Calculating match...', 'Generating optimized CV...'];

  return (
    <>
    <OnboardingTour
      isES={isES}
      onLanguageChange={setLanguage}
      onLoadExample={loadExample}
      onAnalyze={handleAnalyze}
      onSwitchTab={setActiveTab}
      refs={{ cvInputRef, jobInputRef, analyzeBtnRef, resultsRef }}
    />
    <div style={{
      minHeight: '100vh',
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Global styles */}
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${COLORS.bg}; margin: 0; }
        html { background: ${COLORS.bg}; }
        ::selection { background: ${COLORS.accentDim}; color: ${COLORS.accent}; }
        textarea:focus, button:focus-visible { outline: 2px solid ${COLORS.accent}; outline-offset: 2px; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Film grain overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9998, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        opacity: 0.4,
      }} />

      {/* Scroll progress bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 9999,
        background: "rgba(255,255,255,0.03)",
      }}>
        <div style={{
          height: "100%", width: `${scrollProgress * 100}%`,
          background: `linear-gradient(90deg, ${COLORS.accent}, #A78BFA)`,
          transition: "width 0.1s linear",
          borderRadius: "0 1px 1px 0",
        }} />
      </div>

      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: APPLE_EASE }}
        style={{
          borderBottom: `1px solid ${COLORS.border}`,
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${COLORS.accent}, #6D28D9)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: '#fff',
            boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
          }}>
            CV
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.text }}>
              CV Optimizer <span style={{ color: COLORS.accent }}>AI</span>
            </div>
            <div style={{ fontSize: 12, color: COLORS.textMuted }}>
              {isES ? 'Analiza y optimiza tu CV con inteligencia artificial' : 'Analyze and optimize your CV with artificial intelligence'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex', borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            overflow: 'hidden',
            backdropFilter: 'blur(12px)',
          }} role="group" aria-label={isES ? 'Selector de idioma' : 'Language selector'}>
            {['es', 'en'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                aria-label={lang === 'es' ? 'Espanol' : 'English'}
                aria-pressed={language === lang}
                style={{
                  padding: '6px 14px',
                  background: language === lang ? COLORS.accent : 'transparent',
                  color: language === lang ? '#fff' : COLORS.textDim,
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13,
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {lang === 'es' ? 'ES' : 'EN'}
              </button>
            ))}
          </div>

          <button
            onClick={loadExample}
            aria-label={isES ? 'Cargar ejemplo de CV y vacante' : 'Load example CV and job description'}
            style={{
              padding: '6px 16px',
              background: 'transparent',
              color: COLORS.accent,
              border: `1px solid rgba(139,92,246,0.3)`,
              borderRadius: 12,
              cursor: 'pointer',
              fontFamily: 'DM Sans',
              fontWeight: 600,
              fontSize: 13,
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {isES ? 'Cargar ejemplo' : 'Load example'}
          </button>
        </div>
      </motion.header>

      {/* MAIN CONTENT */}
      <div style={{
        display: 'flex',
        minHeight: 'calc(100vh - 69px)',
      }}>
        {/* LEFT PANEL - INPUTS */}
        <ErrorBoundary>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: APPLE_EASE }}
            style={{
              width: '42%',
              minWidth: 380,
              borderRight: `1px solid ${COLORS.border}`,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              overflowY: 'auto',
            }}
          >
            <div ref={cvInputRef}>
              <CVInput cvText={cvText} setCvText={setCvText} isES={isES} validationError={cvValidationError} />
            </div>
            <div ref={jobInputRef}>
              <JobInput jobText={jobText} setJobText={setJobText} isES={isES} validationError={jobValidationError} />
            </div>

            {/* Analyze Button */}
            <motion.button
              ref={analyzeBtnRef}
              whileHover={canAnalyze && !loading ? { y: -2, boxShadow: '0 8px 30px rgba(139,92,246,0.4)' } : {}}
              whileTap={canAnalyze && !loading ? { scale: 0.98 } : {}}
              onClick={handleAnalyze}
              disabled={!canAnalyze || loading}
              aria-label={isES ? 'Analizar CV contra vacante' : 'Analyze CV against job description'}
              aria-busy={loading}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: canAnalyze && !loading
                  ? `linear-gradient(135deg, ${COLORS.accent}, #6D28D9)`
                  : COLORS.bgInput,
                color: canAnalyze && !loading ? '#fff' : COLORS.textMuted,
                border: 'none',
                borderRadius: 16,
                cursor: canAnalyze && !loading ? 'pointer' : 'not-allowed',
                fontFamily: 'DM Sans',
                fontWeight: 700,
                fontSize: 16,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: canAnalyze && !loading ? 1 : 0.5,
                boxShadow: canAnalyze && !loading ? '0 4px 20px rgba(139,92,246,0.3)' : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Shine effect */}
              {canAnalyze && !loading && (
                <div style={{
                  position: 'absolute', top: 0, left: '-100%', width: '200%', height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                  animation: 'shimmer 3s ease-in-out infinite',
                }} />
              )}
              <style>{`@keyframes shimmer { 0% { transform: translateX(-50%); } 100% { transform: translateX(50%); } }`}</style>
              <span style={{ position: 'relative', zIndex: 1 }}>
                {loading
                  ? (isES ? 'Analizando...' : 'Analyzing...')
                  : (isES ? 'Analizar CV' : 'Analyze CV')}
              </span>
            </motion.button>

            {!canAnalyze && (cvText.length > 0 || jobText.length > 0) && !cvValidationError && !jobValidationError && (
              <div style={{ fontSize: 12, color: COLORS.textMuted, textAlign: 'center' }} role="status">
                {isES
                  ? 'Ambos campos necesitan al menos 50 caracteres'
                  : 'Both fields need at least 50 characters'}
              </div>
            )}
          </motion.div>
        </ErrorBoundary>

        {/* RIGHT PANEL - RESULTS */}
        <div
          style={{
            flex: 1,
            padding: 24,
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 69px)',
          }}
          aria-live="polite"
          aria-busy={loading}
        >
          {/* Empty state */}
          {!results && !loading && !analysisError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: APPLE_EASE }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', height: '100%', gap: 16,
                color: COLORS.textMuted,
              }}
            >
              <div style={{
                width: 80, height: 80, borderRadius: 20,
                background: COLORS.accentDim,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32,
                boxShadow: '0 0 40px rgba(139,92,246,0.15)',
              }}>
                <span style={{ color: COLORS.accent }}>CV</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.textDim }}>
                {isES ? 'Los resultados apareceran aqui' : 'Results will appear here'}
              </div>
              <div style={{ fontSize: 14, maxWidth: 350, textAlign: 'center', lineHeight: 1.5 }}>
                {isES
                  ? 'Pega tu CV y la descripcion de la vacante, luego haz clic en "Analizar CV"'
                  : 'Paste your CV and job description, then click "Analyze CV"'}
              </div>
            </motion.div>
          )}

          {/* Loading state */}
          {loading && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', height: '100%', gap: 24,
            }} role="status" aria-label={isES ? 'Analizando CV' : 'Analyzing CV'}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                border: `3px solid ${COLORS.border}`,
                borderTopColor: COLORS.accent,
                animation: 'spin 1s linear infinite',
              }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {loadingLabels.map((label, idx) => (
                  <LoadingStep key={idx} text={label} done={loadingSteps[idx]} />
                ))}
              </div>
            </div>
          )}

          {/* Error state with retry */}
          {analysisError && !loading && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', height: '100%', gap: 16,
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: APPLE_EASE }}
                role="alert" style={{
                  background: COLORS.redBg,
                  border: `1px solid ${COLORS.redBorder}`,
                  borderRadius: 16,
                  padding: 24,
                  textAlign: 'center',
                  maxWidth: 400,
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.red, marginBottom: 8 }}>
                  {isES ? 'Error en el analisis' : 'Analysis Error'}
                </div>
                <div style={{ fontSize: 14, color: COLORS.textDim, marginBottom: 16, lineHeight: 1.5 }}>
                  {analysisError}
                </div>
                <button
                  onClick={handleAnalyze}
                  aria-label={isES ? 'Reintentar analisis' : 'Retry analysis'}
                  style={{
                    padding: '10px 24px',
                    background: `linear-gradient(135deg, ${COLORS.accent}, #6D28D9)`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontFamily: 'DM Sans',
                    fontWeight: 600,
                    fontSize: 14,
                    boxShadow: '0 4px 16px rgba(139,92,246,0.3)',
                  }}
                >
                  {isES ? 'Reintentar' : 'Retry'}
                </button>
              </motion.div>
            </div>
          )}

          {/* Results */}
          {results && !loading && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: APPLE_EASE }}
            >
              {/* Tabs */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 24 }} role="tablist" aria-label={isES ? 'Pestanas de resultados' : 'Results tabs'}>
                <TabButton active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')}>
                  {isES ? 'Analisis' : 'Analysis'}
                </TabButton>
                <TabButton active={activeTab === 'optimized'} onClick={() => setActiveTab('optimized')}>
                  {isES ? 'CV Optimizado' : 'Optimized CV'}
                </TabButton>
                <TabButton active={activeTab === 'comparison'} onClick={() => setActiveTab('comparison')}>
                  {isES ? 'Comparacion' : 'Comparison'}
                </TabButton>
                <TabButton active={activeTab === 'diff'} onClick={() => setActiveTab('diff')}>
                  {isES ? 'Diferencias' : 'Diff'}
                </TabButton>
              </div>

              <ErrorBoundary>
                <AnimatePresence mode="wait">
                  <motion.div key={activeTab} variants={tabVariants} initial="initial" animate="animate" exit="exit" role="tabpanel" aria-label={activeTab}>
                    {activeTab === 'analysis' && <AnalysisTab results={results} isES={isES} jobText={jobText} />}
                    {activeTab === 'optimized' && <OptimizedTab results={results} language={language} cvText={cvText} isES={isES} />}
                    {activeTab === 'comparison' && <ComparisonTab results={results} cvText={cvText} isES={isES} />}
                    {activeTab === 'diff' && <DiffView results={results} cvText={cvText} isES={isES} />}
                  </motion.div>
                </AnimatePresence>
              </ErrorBoundary>
            </motion.div>
          )}
        </div>
      </div>
    </div>
    <ContactBar />
    </>
  );
}
