import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '../../constants/colors.js';

const TOTAL_STEPS = 6;
const APPLE_EASE = [0.16, 1, 0.3, 1];

// ─── Tour Text (bilingual) ──────────────────────────────────────────────────
const TOUR = {
  en: {
    welcomeTitle: 'CV Optimizer \u2014 ATS Score Analyzer',
    welcomeBody: 'Optimize your CV for Applicant Tracking Systems. Paste your resume and a job description, and the AI will score, compare, and rewrite your CV for maximum ATS compatibility.\n\nLet me show you with real actions!',
    startTour: 'Start Tour \u2192',
    skipTour: 'Skip',
    skipLabel: 'Skip Tour',
    next: 'Next \u2192',
    tryIt: 'Try it \u2192',
    watchAction: 'Watch the magic...',
    restartTour: 'Restart Tour',
    explore: 'Start Optimizing',
    completeTitle: "You're Ready!",
    completeBody: 'You\'ve seen a full analysis flow: CV input, job matching, ATS scoring, keyword analysis, industry benchmarks, and diff comparison. Paste your own CV and job description to start!',
    pagesVisited: 'Features Explored',
    demosPlayed: 'Real Actions',
    featuresExplored: 'Steps Completed',
    steps: [
      { title: 'Step 1 \u2014 Load Example CV', body: 'Watch as I load a sample CV and job description. In real use, paste your own CV text or upload a file.' },
      { title: 'Step 2 \u2014 Job Description', body: 'The job description is now loaded. The AI compares your CV against these requirements to find matches and gaps.' },
      { title: 'Step 3 \u2014 ATS Score', body: 'Click Analyze to score your CV 0-100 for ATS compatibility. Watch the gauge animate!' },
      { title: 'Step 4 \u2014 Keyword Analysis', body: 'Green keywords match the job description, red ones are missing. Click any keyword for details.' },
      { title: 'Step 5 \u2014 Industry Benchmarks', body: 'Compare your score against industry averages. The comparison tab shows a side-by-side view.' },
      { title: 'Step 6 \u2014 Diff View', body: 'See exactly what changed between your original CV and the optimized version. Green = additions, red = removals.' },
    ],
    stepOf: (c, t) => `${c} / ${t}`,
  },
  es: {
    welcomeTitle: 'CV Optimizer \u2014 Analizador de Score ATS',
    welcomeBody: 'Optimiza tu CV para Sistemas de Seguimiento de Candidatos. Pega tu curriculum y una descripci\u00f3n del puesto, y la IA puntuar\u00e1, comparar\u00e1 y reescribir\u00e1 tu CV para m\u00e1xima compatibilidad ATS.\n\n\u00a1D\u00e9jame mostrarte con acciones reales!',
    startTour: 'Iniciar Tour \u2192',
    skipTour: 'Omitir',
    skipLabel: 'Omitir Tour',
    next: 'Siguiente \u2192',
    tryIt: 'Probar \u2192',
    watchAction: 'Observa la magia...',
    restartTour: 'Reiniciar Tour',
    explore: 'Empezar a Optimizar',
    completeTitle: '\u00a1Listo para empezar!',
    completeBody: 'Has visto el flujo completo: entrada de CV, coincidencia con vacante, puntuaci\u00f3n ATS, an\u00e1lisis de keywords, benchmarks de industria y vista de diferencias. \u00a1Pega tu propio CV y descripci\u00f3n del puesto!',
    pagesVisited: 'Features Exploradas',
    demosPlayed: 'Acciones Reales',
    featuresExplored: 'Pasos Completados',
    steps: [
      { title: 'Paso 1 \u2014 Cargar CV de Ejemplo', body: 'Observa c\u00f3mo cargo un CV y descripci\u00f3n de puesto de ejemplo. En uso real, pega tu propio CV o sube un archivo.' },
      { title: 'Paso 2 \u2014 Descripci\u00f3n del Puesto', body: 'La descripci\u00f3n del puesto est\u00e1 cargada. La IA compara tu CV contra estos requisitos para encontrar coincidencias y brechas.' },
      { title: 'Paso 3 \u2014 Score ATS', body: 'Haz clic en Analizar para puntuar tu CV de 0-100 en compatibilidad ATS. \u00a1Observa la animaci\u00f3n del medidor!' },
      { title: 'Paso 4 \u2014 An\u00e1lisis de Keywords', body: 'Keywords verdes coinciden con la vacante, las rojas faltan. Haz clic en cualquier keyword para detalles.' },
      { title: 'Paso 5 \u2014 Benchmarks de Industria', body: 'Compara tu puntaje contra promedios de la industria. La pesta\u00f1a de comparaci\u00f3n muestra una vista lado a lado.' },
      { title: 'Paso 6 \u2014 Vista de Diferencias', body: 'Ve exactamente qu\u00e9 cambi\u00f3 entre tu CV original y la versi\u00f3n optimizada. Verde = adiciones, rojo = eliminaciones.' },
    ],
    stepOf: (c, t) => `${c} / ${t}`,
  },
};

// ─── Keyframes ───────────────────────────────────────────────────────────────
const tourKeyframes = `
@keyframes tourPulse {
  0%, 100% { border-color: rgba(139,92,246,0.6); box-shadow: 0 0 0 0 rgba(139,92,246,0.2); }
  50% { border-color: rgba(139,92,246,0.9); box-shadow: 0 0 20px 4px rgba(139,92,246,0.15); }
}
@keyframes tourActionPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
@keyframes tourFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes tourScaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
`;

// ─── Spotlight ───────────────────────────────────────────────────────────────
function TourSpotlight({ rect, padding = 12 }) {
  if (!rect) return null;
  const { top, left, width, height } = rect;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        clipPath: `polygon(
          0% 0%, 100% 0%, 100% 100%, 0% 100%,
          0% ${top - padding}px,
          ${left - padding}px ${top - padding}px,
          ${left - padding}px ${top + height + padding}px,
          ${left + width + padding}px ${top + height + padding}px,
          ${left + width + padding}px ${top - padding}px,
          0% ${top - padding}px
        )`,
      }} />
      <div style={{
        position: 'absolute',
        top: top - padding, left: left - padding,
        width: width + padding * 2, height: height + padding * 2,
        border: `2px solid rgba(139,92,246,0.6)`,
        borderRadius: 12,
        animation: 'tourPulse 2s ease-in-out infinite',
      }} />
    </div>
  );
}

// ─── Completion Modal ────────────────────────────────────────────────────────
function CompletionModal({ t, lang, setLang, onRestart, onExplore }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.8)', animation: 'tourFadeIn 0.4s ease-out',
      cursor: 'pointer',
    }} onClick={(e) => {
      if (e.target.closest('[data-tour-completion]') || e.target.closest('button')) return;
      onExplore();
    }}>
      <div data-tour-completion style={{
        background: '#111114', border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: 20, padding: '36px 40px', maxWidth: 460, width: '90%',
        textAlign: 'center', animation: 'tourScaleIn 0.4s ease-out',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: `linear-gradient(135deg, ${COLORS.accent}, #6D28D9)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', boxShadow: '0 0 30px rgba(139,92,246,0.3)',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, color: COLORS.text, marginBottom: 8 }}>{t.completeTitle}</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 24, whiteSpace: 'pre-line' }}>{t.completeBody}</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 28 }}>
          {[
            { value: '6', label: t.featuresExplored, color: COLORS.accent },
            { value: '4', label: t.demosPlayed, color: '#10B981' },
            { value: '8', label: t.pagesVisited, color: '#F59E0B' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
          {['es', 'en'].map(code => (
            <button key={code} onClick={() => setLang(code)} style={{
              padding: '5px 16px', borderRadius: 8, fontSize: 12, fontWeight: lang === code ? 700 : 400, cursor: 'pointer',
              background: lang === code ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${lang === code ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
              color: lang === code ? '#A78BFA' : 'rgba(255,255,255,0.4)',
              fontFamily: "'DM Mono', monospace",
            }}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={onRestart} style={{
            padding: '10px 24px', borderRadius: 10,
            border: '1px solid rgba(139,92,246,0.3)', background: 'transparent',
            color: '#A78BFA', fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>
            {t.restartTour}
          </button>
          <button onClick={onExplore} style={{
            padding: '10px 28px', borderRadius: 10, border: 'none',
            background: `linear-gradient(135deg, ${COLORS.accent}, #6D28D9)`,
            color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 0 24px rgba(139,92,246,0.3)',
          }}>
            {t.explore}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main OnboardingTour ─────────────────────────────────────────────────────
export default function OnboardingTour({ isES, onLanguageChange, onLoadExample, onAnalyze, onSwitchTab, refs }) {
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [actionRunning, setActionRunning] = useState(false);
  const [targetRect, setTargetRect] = useState(null);
  const timeoutsRef = useRef([]);
  const lang = isES ? 'es' : 'en';
  const t = TOUR[lang];

  const addTimeout = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(id => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => () => clearTimeouts(), [clearTimeouts]);

  // Measure target element from refs
  const measureTarget = useCallback(() => {
    if (!refs) { setTargetRect(null); return; }
    const refMap = {
      1: refs.cvInputRef,
      2: refs.jobInputRef,
      3: refs.analyzeBtnRef,
      4: refs.resultsRef,
      5: refs.resultsRef,
      6: refs.resultsRef,
    };
    const ref = refMap[step];
    if (ref?.current) {
      const r = ref.current.getBoundingClientRect();
      setTargetRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    } else {
      setTargetRect(null);
    }
  }, [step, refs]);

  useEffect(() => {
    if (step === 0 || !active || showCompletion) { setTargetRect(null); return; }
    measureTarget();
    const timer = setTimeout(measureTarget, 300);
    window.addEventListener('resize', measureTarget);
    return () => { clearTimeout(timer); window.removeEventListener('resize', measureTarget); };
  }, [step, active, showCompletion, measureTarget]);

  if (!active && !showCompletion) return null;

  const handleSkip = () => {
    clearTimeouts();
    setActionRunning(false);
    setActive(false);
  };

  const handleRestart = () => {
    clearTimeouts();
    setActionRunning(false);
    setShowCompletion(false);
    setTargetRect(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(0);
    setActive(true);
  };

  const handleExplore = () => {
    setShowCompletion(false);
    setActive(false);
  };

  const handleNext = () => {
    if (actionRunning) return;
    clearTimeouts();

    if (step === 0) {
      // Welcome -> Step 1: Load Example
      setStep(1);
      setActionRunning(true);
      addTimeout(() => {
        if (onLoadExample) onLoadExample();
      }, 400);
      addTimeout(() => {
        measureTarget();
        setActionRunning(false);
      }, 1000);

    } else if (step === 1) {
      // Step 1 -> Step 2: Show job input
      setStep(2);
      addTimeout(() => {
        if (refs?.jobInputRef?.current) {
          refs.jobInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        measureTarget();
      }, 200);

    } else if (step === 2) {
      // Step 2 -> Step 3: Click Analyze
      setStep(3);
      setActionRunning(true);
      addTimeout(() => {
        if (refs?.analyzeBtnRef?.current) {
          refs.analyzeBtnRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      addTimeout(() => {
        if (onAnalyze) onAnalyze();
      }, 500);
      // Wait for analysis to complete (~2500ms)
      addTimeout(() => {
        setActionRunning(false);
        measureTarget();
      }, 3200);

    } else if (step === 3) {
      // Step 3 -> Step 4: Show analysis results (keyword cloud)
      setStep(4);
      addTimeout(() => {
        if (refs?.resultsRef?.current) {
          refs.resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        measureTarget();
      }, 200);

    } else if (step === 4) {
      // Step 4 -> Step 5: Show comparison tab
      setStep(5);
      setActionRunning(true);
      addTimeout(() => {
        if (onSwitchTab) onSwitchTab('comparison');
      }, 300);
      addTimeout(() => {
        if (refs?.resultsRef?.current) {
          refs.resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setActionRunning(false);
        measureTarget();
      }, 700);

    } else if (step === 5) {
      // Step 5 -> Step 6: Show diff tab
      setStep(6);
      setActionRunning(true);
      addTimeout(() => {
        if (onSwitchTab) onSwitchTab('diff');
      }, 300);
      addTimeout(() => {
        if (refs?.resultsRef?.current) {
          refs.resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setActionRunning(false);
        measureTarget();
      }, 700);

    } else if (step === 6) {
      // Finish -> Completion
      setActive(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setShowCompletion(true);
    }
  };

  // Completion modal
  if (showCompletion) {
    return (
      <>
        <style>{tourKeyframes}</style>
        <CompletionModal t={t} lang={lang} setLang={(l) => onLanguageChange && onLanguageChange(l)} onRestart={handleRestart} onExplore={handleExplore} />
      </>
    );
  }

  if (!active) return null;

  // Welcome screen
  if (step === 0) {
    return (
      <>
        <style>{tourKeyframes}</style>
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'tourFadeIn 0.3s ease-out',
          fontFamily: "'DM Sans', sans-serif",
          cursor: 'pointer',
        }} onClick={(e) => {
          if (e.target.closest('[data-tour-tooltip]') || e.target.closest('button')) return;
          handleNext();
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: APPLE_EASE }}
            data-tour-tooltip
            style={{
              background: '#111114', border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: 16, padding: '36px 32px', width: '92%', maxWidth: 480,
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.15)',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
              {['es', 'en'].map(code => (
                <button key={code} onClick={() => onLanguageChange && onLanguageChange(code)} style={{
                  padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  background: lang === code ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${lang === code ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: lang === code ? '#A78BFA' : 'rgba(255,255,255,0.4)',
                  fontFamily: "'DM Mono', monospace",
                }}>
                  {code.toUpperCase()}
                </button>
              ))}
            </div>

            <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: COLORS.text }}>{t.welcomeTitle}</h2>
            <p style={{ margin: '14px 0 20px', fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, whiteSpace: 'pre-line', textAlign: 'left' }}>{t.welcomeBody}</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <button onClick={handleSkip} style={{
                padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.4)',
              }}>
                {t.skipTour}
              </button>
              <button onClick={handleNext} style={{
                padding: '10px 28px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                background: `linear-gradient(135deg, ${COLORS.accent}, #6D28D9)`, border: 'none',
                color: '#fff', boxShadow: '0 0 20px rgba(139,92,246,0.4)',
              }}>
                {t.startTour}
              </button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  // Active steps 1-6: spotlight + tooltip
  const stepData = t.steps[step - 1];
  if (!stepData) return null;

  // Tooltip positioning
  let tooltipPos = {};
  if (targetRect) {
    const viewH = window.innerHeight;
    const viewW = window.innerWidth;
    const spaceBelow = viewH - (targetRect.top + targetRect.height + 20);
    if (spaceBelow >= 220) {
      tooltipPos = { position: 'fixed', top: targetRect.top + targetRect.height + 16, left: Math.max(16, Math.min(targetRect.left, viewW - 380)) };
    } else {
      tooltipPos = { position: 'fixed', top: Math.max(16, targetRect.top - 260), left: Math.max(16, Math.min(targetRect.left, viewW - 380)) };
    }
  } else {
    tooltipPos = { position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)' };
  }

  return (
    <>
      <style>{tourKeyframes}</style>

      {targetRect ? (
        <TourSpotlight rect={targetRect} />
      ) : (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.75)', pointerEvents: 'none' }} />
      )}

      <div style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        pointerEvents: actionRunning ? 'none' : 'auto',
        background: 'transparent',
        cursor: 'pointer',
      }} onClick={(e) => {
        if (e.target.closest('[data-tour-tooltip]') || e.target.closest('button')) return;
        handleNext();
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: APPLE_EASE }}
            style={{ ...tooltipPos, zIndex: 10001, width: 360, maxWidth: 'calc(100vw - 32px)' }}
          >
            <div data-tour-tooltip style={{
              background: '#111114', border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: 14, padding: '20px 22px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              fontFamily: "'DM Sans', sans-serif", pointerEvents: 'auto',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: COLORS.accent, letterSpacing: '0.1em' }}>
                  {t.stepOf(step, TOTAL_STEPS)}
                </span>
                {!actionRunning && (
                  <button onClick={handleSkip} style={{
                    background: 'none', border: 'none', fontSize: 11,
                    color: 'rgba(255,255,255,0.3)', cursor: 'pointer',
                  }}>
                    {t.skipLabel}
                  </button>
                )}
              </div>

              <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 700, color: COLORS.text, lineHeight: 1.3 }}>
                {stepData.title}
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                {stepData.body}
              </p>

              {actionRunning && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', borderRadius: 8, marginBottom: 14,
                  background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', background: COLORS.accent,
                    animation: 'tourActionPulse 1s ease-in-out infinite',
                  }} />
                  <span style={{ fontSize: 12, color: '#A78BFA', fontWeight: 500 }}>{t.watchAction}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: 4, marginBottom: 14, justifyContent: 'center' }}>
                {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                  <div key={i} style={{
                    width: i + 1 === step ? 18 : 6, height: 6, borderRadius: 3,
                    background: i + 1 < step ? COLORS.accent : i + 1 === step ? '#A78BFA' : 'rgba(255,255,255,0.1)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }} />
                ))}
              </div>

              {!actionRunning && (
                <button onClick={handleNext} style={{
                  padding: '10px 24px',
                  background: `linear-gradient(135deg, ${COLORS.accent}, #6D28D9)`,
                  border: 'none', borderRadius: 10,
                  fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer',
                  boxShadow: '0 0 24px rgba(139,92,246,0.3)',
                }}>
                  {step === 3 ? t.tryIt : t.next}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
