import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";

// Constants & data
import { T, tStatus } from "./constants/translations.js";
import { CURRENT_USER, INITIAL_PROJECTS, INITIAL_INVOICES, INITIAL_TICKETS, INITIAL_DOCUMENTS } from "./constants/mockData.js";
import { TICKET_STATUS_FLOW } from "./constants/colors.js";
import { getNavItems, getSectionTitles } from "./constants/navigation.js";

// Utils
import { fmt, todayStr } from "./utils/invoiceCalculator.js";
import { generateNotifications } from "./utils/projectUtils.js";
import { fileTypeFromName } from "./utils/documentUtils.js";
import { LS_KEYS, lsGet, lsSet } from "./utils/searchFilter.js";

// Components
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import ToastContainer from "./components/common/ToastContainer.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import Header from "./components/layout/Header.jsx";
import ContactBar from "./components/layout/ContactBar.jsx";
import DashboardView from "./components/layout/DashboardView.jsx";
import ProjectList from "./components/projects/ProjectList.jsx";
import KanbanBoard from "./components/projects/KanbanBoard.jsx";
import InvoiceList from "./components/invoices/InvoiceList.jsx";
import InvoiceForm from "./components/invoices/InvoiceForm.jsx";
import TicketList from "./components/tickets/TicketList.jsx";
import TicketForm from "./components/tickets/TicketForm.jsx";
import DocumentList from "./components/documents/DocumentList.jsx";
import AIAssistant from "./components/assistant/AIAssistant.jsx";
import SalesforceDashboard from "./components/salesforce/SalesforceDashboard.jsx";
import OnboardingTour from "./components/tour/OnboardingTour.jsx";

const APPLE_EASE = [0.16, 1, 0.3, 1];

const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: APPLE_EASE } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25, ease: APPLE_EASE } },
};

export default function ClientPortal() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAI, setShowAI] = useState(false);
  const [visitedSections, setVisitedSections] = useState({ dashboard: true });
  const [lang, setLang] = useState("es");
  const [showTour, setShowTour] = useState(true);
  const [projectViewMode, setProjectViewMode] = useState("list");
  const aiSendRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  // ── API Key ──
  const [apiKey, setApiKey] = useState(() => lsGet(LS_KEYS.apiKey, ""));
  const [showApiKey, setShowApiKey] = useState(false);

  // ── Live state (restore from localStorage or use defaults) ──
  const [projects, setProjects] = useState(() => lsGet(LS_KEYS.projects, INITIAL_PROJECTS));
  const [invoices, setInvoices] = useState(() => lsGet(LS_KEYS.invoices, INITIAL_INVOICES));
  const [tickets, setTickets] = useState(() => lsGet(LS_KEYS.tickets, INITIAL_TICKETS));
  const [documents, setDocuments] = useState(() => lsGet(LS_KEYS.documents, INITIAL_DOCUMENTS));
  const [recentActions, setRecentActions] = useState(() => lsGet(LS_KEYS.actions, []));

  // ── Notifications ──
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Persist to localStorage on state changes
  useEffect(() => { lsSet(LS_KEYS.projects, projects); }, [projects]);
  useEffect(() => { lsSet(LS_KEYS.invoices, invoices); }, [invoices]);
  useEffect(() => { lsSet(LS_KEYS.tickets, tickets); }, [tickets]);
  useEffect(() => { lsSet(LS_KEYS.documents, documents); }, [documents]);
  useEffect(() => { lsSet(LS_KEYS.actions, recentActions); }, [recentActions]);
  useEffect(() => { lsSet(LS_KEYS.apiKey, apiKey); }, [apiKey]);

  // Generate notifications from current data
  useEffect(() => {
    setNotifications(generateNotifications(invoices, tickets, projects, lang));
  }, [invoices, tickets, projects, lang]);

  const resetDemoData = () => {
    setProjects(INITIAL_PROJECTS);
    setInvoices(INITIAL_INVOICES);
    setTickets(INITIAL_TICKETS);
    setDocuments(INITIAL_DOCUMENTS);
    setRecentActions([]);
    Object.values(LS_KEYS).forEach(k => { if (k !== LS_KEYS.apiKey) localStorage.removeItem(k); });
    addToast(lang === "es" ? "Datos restaurados" : "Data reset", "info");
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;
  const markAllNotificationsRead = () => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); };

  // ── Toast system ──
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback((message, type = "success") => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const logAction = useCallback((text) => {
    setRecentActions(prev => [...prev.slice(-19), text]);
  }, []);

  // ── New Ticket Modal ──
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketProject, setTicketProject] = useState(INITIAL_PROJECTS[0].name);
  const [ticketPriority, setTicketPriority] = useState("Media");
  const [ticketDesc, setTicketDesc] = useState("");
  const [ticketError, setTicketError] = useState("");

  // ── New Invoice Modal ──
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [invConcept, setInvConcept] = useState("");
  const [invAmount, setInvAmount] = useState("");
  const [invDueDate, setInvDueDate] = useState("");
  const [invError, setInvError] = useState("");

  // ── Counters ──
  const ticketCounter = useRef(42);
  const invoiceCounter = useRef(39);

  const switchSection = (id) => {
    setActiveSection(id);
    setVisitedSections(prev => ({ ...prev, [id]: true }));
  };

  // ── Handlers ──
  const handleSubmitTicket = () => {
    if (!ticketTitle.trim() || ticketTitle.trim().length < 5) {
      setTicketError(T.ticketTitleError[lang]);
      return;
    }
    const newId = `TKT-${String(ticketCounter.current++).padStart(4, "0")}`;
    const newTicket = {
      id: newId, title: ticketTitle.trim(), priority: ticketPriority,
      status: "Abierto", created: todayStr(), createdTs: Date.now(),
      project: ticketProject, description: ticketDesc, assignee: "", comments: [],
    };
    setTickets(prev => [newTicket, ...prev]);
    setTicketError(""); setShowNewTicket(false);
    setTicketTitle(""); setTicketProject(projects[0]?.name || "");
    setTicketPriority("Media"); setTicketDesc("");
    addToast(T.toastTicketCreated[lang](newId, newTicket.title), "success");
    logAction(`Creaste el ticket ${newId}: "${newTicket.title}" (${ticketPriority}, ${ticketProject})`);
  };

  const handleChangeTicketStatus = (ticketId) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      const idx = TICKET_STATUS_FLOW.indexOf(t.status);
      if (idx < 0 || idx >= TICKET_STATUS_FLOW.length - 1) return t;
      const newStatus = TICKET_STATUS_FLOW[idx + 1];
      addToast(T.toastTicketChanged[lang](t.id, tStatus(newStatus, lang)), "info");
      logAction(`Cambiaste el ticket ${t.id} de "${t.status}" a "${newStatus}"`);
      return { ...t, status: newStatus };
    }));
  };

  const handleMarkInvoicePaid = (invoiceId) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      addToast(T.toastInvoicePaid[lang](inv.id, fmt(inv.amount)), "success");
      logAction(`Marcaste la factura ${inv.id} como pagada — ${fmt(inv.amount)}`);
      return { ...inv, status: "Pagada" };
    }));
  };

  const handleSubmitInvoice = () => {
    if (!invConcept.trim()) { setInvError(T.conceptRequired[lang]); return; }
    const amount = parseFloat(invAmount);
    if (!amount || amount <= 0) { setInvError(T.amountInvalid[lang]); return; }
    if (!invDueDate) { setInvError(T.dueDateRequired[lang]); return; }
    const newId = `FAC-2026-${String(invoiceCounter.current++).padStart(3, "0")}`;
    const newInv = { id: newId, date: todayStr(), concept: invConcept.trim(), amount, status: "Pendiente", dueDate: invDueDate };
    setInvoices(prev => [newInv, ...prev]);
    setInvError(""); setShowNewInvoice(false);
    setInvConcept(""); setInvAmount(""); setInvDueDate("");
    addToast(T.toastInvoiceCreated[lang](newId, fmt(amount)), "success");
    logAction(`Creaste la factura ${newId}: "${invConcept.trim()}" por ${fmt(amount)}`);
  };

  const handleUpdateProgress = (projectId, newProgress) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const logEntry = { text: `Progreso actualizado a ${newProgress}%`, ts: Date.now() };
      addToast(T.toastProjectUpdated[lang](p.name, newProgress), "info");
      logAction(`Actualizaste el progreso de "${p.name}" de ${p.progress}% a ${newProgress}%`);
      return { ...p, progress: newProgress, log: [...p.log, logEntry] };
    }));
  };

  const handleUpdateProjectStatus = useCallback((projectId, newStatus) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const logEntry = { text: `Estado cambiado a ${newStatus}`, ts: Date.now() };
      addToast(T.toastProjectUpdated[lang](p.name, p.progress), "info");
      logAction(`Cambiaste el estado de "${p.name}" a "${newStatus}"`);
      return { ...p, status: newStatus, log: [...p.log, logEntry] };
    }));
  }, [addToast, logAction, lang]);

  const handleUploadDocument = (fileInfo) => {
    const newDoc = {
      id: documents.length + 1 + Date.now(), name: fileInfo.name,
      type: fileInfo.type, size: fileInfo.size, date: todayStr(), project: fileInfo.project,
    };
    setDocuments(prev => [newDoc, ...prev]);
    addToast(T.toastDocUploaded[lang](fileInfo.name), "success");
    logAction(`Subiste el documento "${fileInfo.name}" (${fileInfo.size})`);
  };

  const handleAddComment = (ticketId, text) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      const newComment = { author: CURRENT_USER.name, text, ts: Date.now() };
      return { ...t, comments: [...(t.comments || []), newComment] };
    }));
    logAction(`Comentaste en ticket ${ticketId}`);
  };

  // ── Derived (memoized) ──
  const NAV = useMemo(() => getNavItems(lang, projects, invoices, tickets), [lang, projects, invoices, tickets]);
  const SECTION_TITLES = useMemo(() => getSectionTitles(lang), [lang]);

  return (
    <>
    <ErrorBoundary lang={lang}>
    <div style={{ minHeight: "100vh", background: "#09090B", fontFamily: "'DM Sans', sans-serif", display: "flex", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-8px) } to { opacity:1; transform:translateX(0) } }
        @keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        * { box-sizing: border-box; }
        input:focus { outline: none; }
        textarea:focus { outline: none; }
        select:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        ::-webkit-scrollbar-track { background: transparent; }
        button { font-family: 'DM Sans', sans-serif; }
        input[type="range"] { height: 6px; }
        html { background: #09090B; }
        body { background: #09090B; }
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
          background: "linear-gradient(90deg, #6366F1, #818CF8)",
          transition: "width 0.1s linear",
          borderRadius: "0 1px 1px 0",
        }} />
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <Sidebar
        lang={lang} activeSection={activeSection} visitedSections={visitedSections}
        navItems={NAV} showAI={showAI}
        onSwitchSection={switchSection} onToggleAI={() => setShowAI(v => !v)}
        apiKey={apiKey} showApiKey={showApiKey}
        onToggleApiKey={() => setShowApiKey(v => !v)}
        onApiKeyChange={setApiKey} onResetData={resetDemoData}
      />

      <div role="main" style={{ marginLeft: 240, flex: 1, padding: "28px 28px" }}>
        <Header
          lang={lang} setLang={setLang} sectionTitle={SECTION_TITLES[activeSection]}
          notifications={notifications} showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          unreadNotifCount={unreadNotifCount} markAllNotificationsRead={markAllNotificationsRead}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            variants={sectionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {activeSection === "dashboard" && (
              <ErrorBoundary lang={lang}>
                <div data-tour="dashboard-kpis"><DashboardView projects={projects} invoices={invoices} tickets={tickets} documents={documents} recentActions={recentActions} lang={lang} /></div>
              </ErrorBoundary>
            )}
            {activeSection === "proyectos" && (
              <ErrorBoundary lang={lang}>
                <div data-tour="projects-section">
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14, gap: 8 }}>
                    <button
                      onClick={() => setProjectViewMode("list")}
                      aria-label={T.listView[lang]}
                      style={{
                        padding: "7px 14px", borderRadius: 12, fontSize: 11, fontWeight: 700, cursor: "pointer",
                        background: projectViewMode === "list" ? "#6366F1" : "rgba(255,255,255,0.03)",
                        color: projectViewMode === "list" ? "#fff" : "rgba(255,255,255,0.5)",
                        border: projectViewMode === "list" ? "none" : "1px solid rgba(255,255,255,0.06)",
                        backdropFilter: "blur(12px)",
                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >{T.listView[lang]}</button>
                    <button
                      onClick={() => setProjectViewMode("kanban")}
                      aria-label={T.kanbanView[lang]}
                      style={{
                        padding: "7px 14px", borderRadius: 12, fontSize: 11, fontWeight: 700, cursor: "pointer",
                        background: projectViewMode === "kanban" ? "#6366F1" : "rgba(255,255,255,0.03)",
                        color: projectViewMode === "kanban" ? "#fff" : "rgba(255,255,255,0.5)",
                        border: projectViewMode === "kanban" ? "none" : "1px solid rgba(255,255,255,0.06)",
                        backdropFilter: "blur(12px)",
                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >{T.kanbanView[lang]}</button>
                  </div>
                  {projectViewMode === "list"
                    ? <ProjectList projects={projects} onUpdateProgress={handleUpdateProgress} lang={lang} />
                    : <KanbanBoard projects={projects} onUpdateProgress={handleUpdateProgress} onUpdateStatus={handleUpdateProjectStatus} lang={lang} />
                  }
                </div>
              </ErrorBoundary>
            )}
            {activeSection === "facturas" && (
              <ErrorBoundary lang={lang}>
                <div data-tour="invoices-section"><InvoiceList invoices={invoices} onMarkPaid={handleMarkInvoicePaid} onNewInvoice={() => setShowNewInvoice(true)} lang={lang} /></div>
              </ErrorBoundary>
            )}
            {activeSection === "tickets" && (
              <ErrorBoundary lang={lang}>
                <div data-tour="tickets-section"><TicketList tickets={tickets} onNewTicket={() => setShowNewTicket(true)} onChangeStatus={handleChangeTicketStatus} onAddComment={handleAddComment} lang={lang} /></div>
              </ErrorBoundary>
            )}
            {activeSection === "documentos" && (
              <ErrorBoundary lang={lang}>
                <div data-tour="docs-section"><DocumentList documents={documents} onUpload={handleUploadDocument} projects={projects} lang={lang} /></div>
              </ErrorBoundary>
            )}
            {activeSection === "salesforce" && (
              <ErrorBoundary lang={lang}>
                <SalesforceDashboard lang={lang} />
              </ErrorBoundary>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAI && (
          <ErrorBoundary lang={lang}>
            <AIAssistant onClose={() => setShowAI(false)} projects={projects} invoices={invoices} tickets={tickets} documents={documents} recentActions={recentActions} lang={lang} apiKey={apiKey} sendRef={aiSendRef} />
          </ErrorBoundary>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewTicket && (
          <TicketForm
            lang={lang} projects={projects}
            ticketTitle={ticketTitle} ticketProject={ticketProject}
            ticketPriority={ticketPriority} ticketDesc={ticketDesc} ticketError={ticketError}
            onTitleChange={(v) => { setTicketTitle(v); setTicketError(""); }}
            onProjectChange={setTicketProject} onPriorityChange={setTicketPriority}
            onDescChange={setTicketDesc} onSubmit={handleSubmitTicket}
            onClose={() => { setShowNewTicket(false); setTicketError(""); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewInvoice && (
          <InvoiceForm
            lang={lang}
            invConcept={invConcept} invAmount={invAmount} invDueDate={invDueDate} invError={invError}
            onConceptChange={(v) => { setInvConcept(v); setInvError(""); }}
            onAmountChange={(v) => { setInvAmount(v); setInvError(""); }}
            onDueDateChange={(v) => { setInvDueDate(v); setInvError(""); }}
            onSubmit={handleSubmitInvoice}
            onClose={() => { setShowNewInvoice(false); setInvError(""); }}
          />
        )}
      </AnimatePresence>
    </div>
    </ErrorBoundary>
    <ContactBar lang={lang} />
    {showTour && (
      <OnboardingTour
        lang={lang} setLang={setLang} onNavigate={switchSection}
        onOpenNotifications={() => setShowNotifications(true)}
        onMarkInvoicePaid={handleMarkInvoicePaid} invoices={invoices}
        onOpenNewTicket={() => setShowNewTicket(true)}
        setTicketTitle={setTicketTitle} setTicketProject={setTicketProject}
        setTicketPriority={setTicketPriority} setTicketDesc={setTicketDesc}
        onSubmitTicket={handleSubmitTicket} onOpenAI={() => setShowAI(true)}
        aiSendMessage={(msg) => { setTimeout(() => { if (aiSendRef.current) aiSendRef.current(msg); }, 600); }}
        onFinish={() => setShowTour(false)}
      />
    )}
    </>
  );
}
