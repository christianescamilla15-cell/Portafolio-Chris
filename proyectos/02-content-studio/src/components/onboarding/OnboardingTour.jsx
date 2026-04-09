import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_STEPS = 9;
const APPLE_EASE = [0.16, 1, 0.3, 1];
const ACCENT = "#6366F1";

// ─── Keyframes ───────────────────────────────────────────────────────────────
const tourKeyframes = `
@keyframes tourPulse {
  0%, 100% { border-color: rgba(99,102,241,0.6); box-shadow: 0 0 0 0 rgba(99,102,241,0.2); }
  50% { border-color: rgba(99,102,241,0.9); box-shadow: 0 0 20px 4px rgba(99,102,241,0.15); }
}
@keyframes tourActionPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
@keyframes tourFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes tourScaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
`;

// ─── Spotlight Overlay (clipPath cutout) ─────────────────────────────────────
function TourSpotlight({ targetRect, padding = 12 }) {
  if (!targetRect) return null;
  const { top, left, width, height } = targetRect;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, pointerEvents: "none" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.75)",
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
        position: "absolute",
        top: top - padding, left: left - padding,
        width: width + padding * 2, height: height + padding * 2,
        border: "2px solid rgba(99,102,241,0.6)",
        borderRadius: 12,
        animation: "tourPulse 2s ease-in-out infinite",
        pointerEvents: "none",
      }} />
    </div>
  );
}

// ─── Completion Modal ────────────────────────────────────────────────────────
function CompletionModal({ t, tourLang, setTourLang, onRestart, onExplore }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.8)",
      animation: "tourFadeIn 0.4s ease-out",
      cursor: "pointer",
    }} onClick={(e) => {
      if (e.target.closest('[data-tour-completion]') || e.target.closest('button')) return;
      onExplore();
    }}>
      <div data-tour-completion style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: 20, padding: "36px 40px",
        maxWidth: 460, width: "90%",
        textAlign: "center",
        animation: "tourScaleIn 0.4s ease-out",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Success icon */}
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: `linear-gradient(135deg, ${ACCENT}, #818CF8)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow: "0 0 30px rgba(99,102,241,0.3)",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#F8F4E8", marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>
          {t.completeTitle}
        </h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 24, whiteSpace: "pre-line" }}>
          {t.completeBody}
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
          {[
            { value: "9", label: t.featuresExplored, color: ACCENT },
            { value: "5", label: t.demosPlayed, color: "#10B981" },
            { value: "10", label: t.pagesVisited, color: "#F59E0B" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Language toggle */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
          {["en", "es"].map(l => (
            <button key={l} onClick={() => setTourLang(l)} style={{
              background: tourLang === l ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${tourLang === l ? ACCENT : "rgba(255,255,255,0.1)"}`,
              borderRadius: 8, padding: "5px 16px",
              fontSize: 12, fontWeight: tourLang === l ? 700 : 400,
              color: tourLang === l ? ACCENT : "rgba(255,255,255,0.4)",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>
              {l === "en" ? "EN" : "ES"}
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onRestart} style={{
            padding: "10px 24px", borderRadius: 10,
            border: "1px solid rgba(99,102,241,0.3)",
            background: "transparent", color: "#A5B4FC",
            fontSize: 14, fontWeight: 500, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {t.restartTour}
          </button>
          <button onClick={onExplore} style={{
            padding: "10px 28px", borderRadius: 10, border: "none",
            background: `linear-gradient(135deg, ${ACCENT}, #818CF8)`,
            color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 0 24px rgba(99,102,241,0.3)",
          }}>
            {t.explore}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────
function TourTooltip({ step, t, tourLang, setTourLang, actionRunning, onNext, onSkip }) {
  const stepConfig = {
    1: { title: t.step1Title, body: t.step1Body },
    2: { title: t.step2Title, body: t.step2Body },
    3: { title: t.step3Title, body: t.step3Body },
    4: { title: t.step4Title, body: t.step4Body },
    5: { title: t.step5Title, body: t.step5Body },
    6: { title: t.step6Title, body: t.step6Body },
    7: { title: t.step7Title, body: t.step7Body },
    8: { title: t.step8Title, body: t.step8Body },
    9: { title: t.step9Title, body: t.step9Body },
  };

  const cfg = stepConfig[step];
  if (!cfg) return null;

  const btnLabel = step === 4 ? t.generate : t.tryIt;

  return (
    <div data-tour-tooltip style={{
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      border: "1px solid rgba(99,102,241,0.2)",
      borderRadius: 14, padding: "20px 22px",
      width: 360, maxWidth: "calc(100vw - 32px)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
      fontFamily: "'DM Sans', sans-serif",
      pointerEvents: "auto",
    }}>
      {/* Step counter + skip */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{
          fontSize: 10, fontFamily: "'DM Mono', monospace",
          color: ACCENT, letterSpacing: "0.1em",
        }}>
          {t.stepOf(step, TOTAL_STEPS)}
        </span>
        {!actionRunning && (
          <button onClick={onSkip} style={{
            background: "none", border: "none", fontSize: 11,
            color: "rgba(255,255,255,0.3)", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {t.skipLabel}
          </button>
        )}
      </div>

      {/* Title */}
      <h3 style={{
        margin: "0 0 10px", fontSize: 16, fontWeight: 700,
        color: "#F8F4E8", fontFamily: "'Playfair Display', serif",
        lineHeight: 1.3,
      }}>
        {cfg.title}
      </h3>

      {/* Body */}
      <p style={{
        margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.55)",
        lineHeight: 1.7, whiteSpace: "pre-line",
      }}>
        {cfg.body}
      </p>

      {/* Action running indicator */}
      {actionRunning && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 12px", borderRadius: 8, marginBottom: 14,
          background: "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.2)",
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: ACCENT,
            animation: "tourActionPulse 1s ease-in-out infinite",
          }} />
          <span style={{ fontSize: 12, color: "#A5B4FC", fontWeight: 500 }}>
            {t.watchAction}
          </span>
        </div>
      )}

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 4, marginBottom: 14, justifyContent: "center" }}>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div key={i} style={{
            width: i + 1 === step ? 18 : 6, height: 6,
            borderRadius: 3,
            background: i + 1 < step ? ACCENT : i + 1 === step ? "#818CF8" : "rgba(255,255,255,0.1)",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }} />
        ))}
      </div>

      {/* Next button */}
      {!actionRunning && (
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onNext} style={{
            padding: "10px 24px",
            background: `linear-gradient(135deg, ${ACCENT}, #818CF8)`,
            border: "none", borderRadius: 10,
            fontSize: 13, fontWeight: 700,
            color: "#FFFFFF", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 0 24px rgba(99,102,241,0.3)",
          }}>
            {btnLabel}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main OnboardingTour ─────────────────────────────────────────────────────
const OnboardingTour = memo(function OnboardingTour({
  step, t, tourLang, setTourLang, actionRunning, onNext, onSkip, onRestart, onExplore, refs,
}) {
  const [targetRect, setTargetRect] = useState(null);

  // Map step -> ref
  const stepRefMap = {
    1: refs.brandRef,
    2: refs.platformRef,
    3: refs.toneFormatRef,
    4: refs.generateBtnRef,
    5: refs.resultCopyRef,
    6: refs.resultVisualRef,
    7: refs.variantBtnRef,
    8: refs.calendarTabRef,
    9: refs.templateRef,
  };

  // Measure target element
  const measureTarget = useCallback(() => {
    if (step === 0 || step === -1 || step > TOTAL_STEPS) {
      setTargetRect(null);
      return;
    }
    const ref = stepRefMap[step];
    if (ref?.current) {
      const r = ref.current.getBoundingClientRect();
      setTargetRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    } else {
      setTargetRect(null);
    }
  }, [step]);

  useEffect(() => {
    measureTarget();
    const timer = setTimeout(measureTarget, 250);
    const handleResize = () => measureTarget();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [step, measureTarget]);

  if (step === -1) return null;

  // Welcome screen (step 0)
  if (step === 0) {
    return (
      <>
        <style>{tourKeyframes}</style>
        <div style={{
          position: "fixed", inset: 0, zIndex: 10000,
          background: "rgba(0,0,0,0.8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "tourFadeIn 0.3s ease-out",
          cursor: "pointer",
        }} onClick={(e) => {
          if (e.target.closest('[data-tour-tooltip]') || e.target.closest('button')) return;
          onNext();
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: APPLE_EASE }}
            data-tour-tooltip
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 16, padding: "32px 28px",
              maxWidth: 440, width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              fontFamily: "'DM Sans', sans-serif",
              textAlign: "center",
            }}
          >
            {/* Language toggle */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
              {["en", "es"].map(l => (
                <button key={l} onClick={() => setTourLang(l)} style={{
                  background: tourLang === l ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${tourLang === l ? ACCENT : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 10, padding: "6px 18px",
                  fontSize: 13, fontWeight: tourLang === l ? 700 : 400,
                  color: tourLang === l ? ACCENT : "rgba(255,255,255,0.4)",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}>
                  {l === "en" ? "English" : "Espa\u00f1ol"}
                </button>
              ))}
            </div>

            <h3 style={{
              margin: "0 0 10px", fontSize: 22, fontWeight: 700,
              color: "#F8F4E8", fontFamily: "'Playfair Display', serif",
              lineHeight: 1.3,
            }}>
              {t.welcomeTitle}
            </h3>
            <p style={{
              margin: "0 0 20px", fontSize: 13, color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7, whiteSpace: "pre-line",
            }}>
              {t.welcomeBody}
            </p>

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={onNext} style={{
                padding: "10px 24px",
                background: `linear-gradient(135deg, ${ACCENT}, #818CF8)`,
                border: "none", borderRadius: 10,
                fontSize: 13, fontWeight: 700,
                color: "#FFFFFF", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 0 24px rgba(99,102,241,0.3)",
              }}>
                {t.startTour}
              </button>
              <button onClick={onSkip} style={{
                padding: "10px 20px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10, fontSize: 13,
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>
                {t.skipTour}
              </button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  // Completion screen (step > TOTAL_STEPS)
  if (step > TOTAL_STEPS) {
    return (
      <>
        <style>{tourKeyframes}</style>
        <CompletionModal t={t} tourLang={tourLang} setTourLang={setTourLang} onRestart={onRestart} onExplore={onExplore} />
      </>
    );
  }

  // Active steps 1-9: spotlight + tooltip
  // Calculate tooltip position
  let tooltipPos = {};
  if (targetRect) {
    const viewH = window.innerHeight;
    const viewW = window.innerWidth;
    const spaceBelow = viewH - (targetRect.top + targetRect.height + 20);
    const spaceAbove = targetRect.top - 20;

    if (spaceBelow >= 220) {
      tooltipPos = {
        position: "fixed",
        top: targetRect.top + targetRect.height + 16,
        left: Math.max(16, Math.min(targetRect.left, viewW - 380)),
      };
    } else if (spaceAbove >= 220) {
      tooltipPos = {
        position: "fixed",
        top: Math.max(16, targetRect.top - 260),
        left: Math.max(16, Math.min(targetRect.left, viewW - 380)),
      };
    } else {
      tooltipPos = {
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
      };
    }
  } else {
    tooltipPos = {
      position: "fixed",
      bottom: 24,
      left: "50%",
      transform: "translateX(-50%)",
    };
  }

  return (
    <>
      <style>{tourKeyframes}</style>

      {/* Spotlight with cutout OR full overlay */}
      {targetRect ? (
        <TourSpotlight targetRect={targetRect} />
      ) : (
        <div style={{
          position: "fixed", inset: 0, zIndex: 10000,
          background: "rgba(0,0,0,0.3)", pointerEvents: "none",
        }} />
      )}

      {/* Clickable overlay — tap anywhere to advance */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 10000,
        pointerEvents: actionRunning ? "none" : "auto",
        background: "transparent",
        cursor: "pointer",
      }} onClick={(e) => {
        if (e.target.closest('[data-tour-tooltip]') || e.target.closest('button')) return;
        onNext();
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: APPLE_EASE }}
            style={{ ...tooltipPos, zIndex: 10001 }}
          >
            <TourTooltip
              step={step}
              t={t}
              tourLang={tourLang}
              setTourLang={setTourLang}
              actionRunning={actionRunning}
              onNext={onNext}
              onSkip={onSkip}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
});

export default OnboardingTour;
