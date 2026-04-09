import { useState, useRef, useCallback } from "react";
import { T } from "../../constants/translations.js";

export default function OnboardingTour({ lang, setLang, onNavigate, onOpenNotifications, onMarkInvoicePaid, invoices, onOpenNewTicket, setTicketTitle, setTicketProject, setTicketPriority, setTicketDesc, onSubmitTicket, onOpenAI, aiSendMessage, onFinish }) {
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(true);
  const totalSteps = 10;
  const spotlightRef = useRef(null);
  const [spotlightRect, setSpotlightRect] = useState(null);
  const [tourLang, setTourLang] = useState(lang);

  const tl = tourLang;

  const updateSpotlight = useCallback((selector) => {
    if (!selector) { setSpotlightRect(null); return; }
    setTimeout(() => {
      const el = document.querySelector(selector);
      if (el) {
        const r = el.getBoundingClientRect();
        setSpotlightRect({ top: r.top - 8, left: r.left - 8, width: r.width + 16, height: r.height + 16 });
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setSpotlightRect(null);
      }
    }, 400);
  }, []);

  const [showCompletion, setShowCompletion] = useState(false);
  const skip = () => { setActive(false); onFinish(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const restartTour = () => { setShowCompletion(false); setStep(0); };

  const goStep = useCallback(async (nextStep) => {
    setStep(nextStep);
    // Auto-actions per step
    switch (nextStep) {
      case 1: // Dashboard KPIs
        onNavigate("dashboard");
        updateSpotlight("[data-tour='dashboard-kpis']");
        break;
      case 2: // Notifications
        updateSpotlight("[data-tour='notif-bell']");
        break;
      case 3: // Projects
        onNavigate("proyectos");
        updateSpotlight("[data-tour='projects-section']");
        break;
      case 4: // Invoices
        onNavigate("facturas");
        updateSpotlight("[data-tour='invoices-section']");
        break;
      case 5: // Mark invoice paid
        {
          const unpaid = invoices.find(i => i.status !== "Pagada");
          if (unpaid) onMarkInvoicePaid(unpaid.id);
        }
        updateSpotlight("[data-tour='invoices-section']");
        break;
      case 6: // Tickets
        onNavigate("tickets");
        updateSpotlight("[data-tour='tickets-section']");
        break;
      case 7: // Create ticket
        onOpenNewTicket();
        setTimeout(() => {
          setTicketTitle(tl === "en" ? "Test ticket from tour" : "Ticket de prueba del tour");
          setTicketProject("Dashboard Analytics");
          setTicketPriority("Media");
          setTicketDesc(tl === "en" ? "This is an automatically created test ticket." : "Este es un ticket de prueba creado automaticamente.");
          setTimeout(() => {
            onSubmitTicket();
            updateSpotlight("[data-tour='tickets-section']");
          }, 600);
        }, 500);
        break;
      case 8: // Documents
        onNavigate("documentos");
        updateSpotlight("[data-tour='docs-section']");
        break;
      case 9: // AI Assistant
        onOpenAI();
        setTimeout(() => {
          aiSendMessage(tl === "en" ? "project status" : "estado de proyectos");
        }, 800);
        setSpotlightRect(null);
        break;
      case 10: // Finish
        setSpotlightRect(null);
        break;
      default:
        break;
    }
  }, [tl, onNavigate, updateSpotlight, onMarkInvoicePaid, invoices, onOpenNewTicket, setTicketTitle, setTicketProject, setTicketPriority, setTicketDesc, onSubmitTicket, onOpenAI, aiSendMessage]);

  if (!active) return null;

  const stepConfig = [
    // Step 0 — Welcome
    { title: T.tourWelcomeTitle[tl], text: T.tourWelcomeText[tl], isWelcome: true },
    // Step 1 — Dashboard
    { title: T.tourDashboardTitle[tl], text: T.tourDashboardText[tl] },
    // Step 2 — Notifications
    { title: T.tourNotifTitle[tl], text: T.tourNotifText[tl], tryIt: true, tryAction: () => { onOpenNotifications(); } },
    // Step 3 — Projects
    { title: T.tourProjectsTitle[tl], text: T.tourProjectsText[tl] },
    // Step 4 — Invoices
    { title: T.tourInvoicesTitle[tl], text: T.tourInvoicesText[tl] },
    // Step 5 — Mark paid
    { title: T.tourInvoicePaidTitle[tl], text: T.tourInvoicePaidText[tl] },
    // Step 6 — Tickets
    { title: T.tourTicketsTitle[tl], text: T.tourTicketsText[tl] },
    // Step 7 — Create ticket
    { title: T.tourCreateTicketTitle[tl], text: T.tourCreateTicketText[tl] },
    // Step 8 — Documents
    { title: T.tourDocsTitle[tl], text: T.tourDocsText[tl] },
    // Step 9 — AI
    { title: T.tourAITitle[tl], text: T.tourAIText[tl] },
    // Step 10 — Finish
    { title: T.tourFinishTitle[tl], text: T.tourFinishText[tl], isFinish: true },
  ];

  const current = stepConfig[step] || stepConfig[0];

  const handleNext = () => {
    if (step >= totalSteps) { skip(); return; }
    goStep(step + 1);
  };

  const handleTryIt = () => {
    if (current.tryAction) current.tryAction();
    setTimeout(() => handleNext(), 800);
  };

  const handleStart = () => {
    setLang(tourLang);
    goStep(1);
  };

  // Backdrop + spotlight overlay
  const backdropStyle = {
    position: "fixed", inset: 0, zIndex: 10000,
    background: "rgba(0,0,0,0.6)",
    transition: "all 0.3s ease",
  };

  const spotlightStyle = spotlightRect ? {
    position: "fixed",
    top: spotlightRect.top, left: spotlightRect.left,
    width: spotlightRect.width, height: spotlightRect.height,
    borderRadius: 14,
    boxShadow: "0 0 0 9999px rgba(0,0,0,0.55), 0 0 30px 4px rgba(99,102,241,0.4)",
    zIndex: 10001,
    pointerEvents: "none",
    transition: "all 0.4s ease",
  } : null;

  const tooltipStyle = {
    position: "fixed", zIndex: 10002,
    background: "#fff", borderRadius: 18, padding: "24px 28px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
    maxWidth: 420, width: "90vw",
    animation: "fadeUp 0.35s ease",
    fontFamily: "'DM Sans', sans-serif",
  };

  // Position tooltip near spotlight or center
  const getTooltipPos = () => {
    if (step === 0 || !spotlightRect || current.isFinish) {
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }
    const below = spotlightRect.top + spotlightRect.height + 16;
    const above = spotlightRect.top - 220;
    if (below + 220 < window.innerHeight) {
      return { top: below, left: Math.max(16, Math.min(spotlightRect.left, window.innerWidth - 440)) };
    }
    return { top: Math.max(16, above), left: Math.max(16, Math.min(spotlightRect.left, window.innerWidth - 440)) };
  };

  const pos = getTooltipPos();

  return (
    <>
      {/* Backdrop — tap anywhere to advance (when NO spotlight: welcome/finish screens) */}
      {!spotlightRect && <div style={{ ...backdropStyle, cursor: 'pointer' }} onClick={(e) => {
        if (e.target.closest('[data-tour-tooltip]') || e.target.closest('button')) return;
        if (current.isWelcome) { handleStart(); } else if (current.isFinish) { skip(); } else { handleNext(); }
      }} />}

      {/* Spotlight */}
      {spotlightStyle && <div ref={spotlightRef} style={spotlightStyle} />}

      {/* Spotlight backdrop — tap anywhere to advance */}
      {spotlightRect && <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'transparent', cursor: 'pointer' }} onClick={(e) => {
        if (e.target.closest('[data-tour-tooltip]') || e.target.closest('button')) return;
        if (current.tryIt) { handleTryIt(); } else { handleNext(); }
      }} />}

      {/* Tooltip */}
      <div data-tour-tooltip style={{ ...tooltipStyle, ...pos }}>
        {/* Step counter */}
        {step > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {T.tourStepOf[tl](step, totalSteps)}
            </span>
            <button onClick={skip} style={{
              background: "none", border: "none", fontSize: 11, color: "#94A3B8",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              textDecoration: "underline", padding: 0,
            }}>{T.tourSkip[tl]}</button>
          </div>
        )}

        {/* Progress bar */}
        {step > 0 && (
          <div style={{ height: 3, background: "#F1F5F9", borderRadius: 2, marginBottom: 16, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(step / totalSteps) * 100}%`, background: "#6366F1", borderRadius: 2, transition: "width 0.5s ease" }} />
          </div>
        )}

        <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
          {current.title}
        </h3>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748B", lineHeight: 1.7, whiteSpace: "pre-line" }}>
          {current.text}
        </p>

        {/* Welcome step: language selector */}
        {current.isWelcome && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {T.tourLangSelect[tl]}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["es", "en"].map(l => (
                <button key={l} onClick={() => setTourLang(l)} style={{
                  padding: "8px 20px", borderRadius: 8,
                  background: tourLang === l ? "#6366F1" : "#F8FAFC",
                  color: tourLang === l ? "#fff" : "#64748B",
                  border: tourLang === l ? "none" : "1px solid #E2E8F0",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  transition: "all 0.15s",
                }}>
                  {l === "es" ? "Espanol" : "English"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          {current.isWelcome && (
            <>
              <button onClick={skip} style={{
                padding: "10px 20px", border: "1px solid #E2E8F0", borderRadius: 10,
                background: "#fff", fontSize: 13, color: "#64748B", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              }}>{T.tourSkip[tl]}</button>
              <button onClick={handleStart} style={{
                padding: "10px 24px", border: "none", borderRadius: 10,
                background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
                boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                transition: "transform 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >{T.tourStartBtn[tl]}</button>
            </>
          )}

          {!current.isWelcome && !current.isFinish && (
            <>
              {current.tryIt ? (
                <button onClick={handleTryIt} style={{
                  padding: "10px 24px", border: "none", borderRadius: 10,
                  background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                  fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                }}>{T.tourTryIt[tl]}</button>
              ) : (
                <button onClick={handleNext} style={{
                  padding: "10px 24px", border: "none", borderRadius: 10,
                  background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                  fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                }}>{T.tourNext[tl]}</button>
              )}
            </>
          )}

          {current.isFinish && !showCompletion && (
            <button onClick={() => { setShowCompletion(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{
              padding: "10px 24px", border: "none", borderRadius: 10,
              background: "linear-gradient(135deg, #22C55E, #16A34A)",
              fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
              boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
            }}>{T.tourFinish[tl]}</button>
          )}

          {current.isFinish && showCompletion && (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 20 }}>
                {["113 Tests", "Salesforce CRM", "Kanban", "AI Assistant"].map(tag => (
                  <span key={tag} style={{
                    padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
                    color: "#6366F1", fontFamily: "'DM Mono', monospace",
                  }}>{tag}</span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                <button onClick={restartTour} style={{
                  padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.3)",
                  color: "#6366F1", fontFamily: "'DM Sans', sans-serif",
                }}>
                  {tl === "en" ? "Restart Tour" : "Reiniciar Tour"}
                </button>
                <button onClick={skip} style={{
                  padding: "10px 24px", border: "none", borderRadius: 10,
                  background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                  fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                }}>
                  {tl === "en" ? "Explore" : "Explorar"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
