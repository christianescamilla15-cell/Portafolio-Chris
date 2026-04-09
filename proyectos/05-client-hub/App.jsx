import { useState } from "react";

// ─── DATA (simula Airtable como backend) ──────────────────────────────────────
const CURRENT_USER = { name: "Empresa Demo S.A.", plan: "Pro", avatar: "ED", since: "Ene 2025" };

const PROJECTS = [
  { id: 1, name: "Rediseño Web Corporativo", status: "En progreso", progress: 68, dueDate: "2026-04-15", manager: "Ana López", budget: 85000, spent: 57800, tags: ["Diseño", "Dev"] },
  { id: 2, name: "Integración CRM + ERP", status: "Revisión", progress: 91, dueDate: "2026-03-28", manager: "Carlos Vega", budget: 120000, spent: 109000, tags: ["Backend", "IA"] },
  { id: 3, name: "App Móvil Flutter", status: "Planificación", progress: 12, dueDate: "2026-06-30", manager: "Sofia Castro", budget: 200000, spent: 18000, tags: ["Mobile", "Flutter"] },
  { id: 4, name: "Dashboard Analytics", status: "Completado", progress: 100, dueDate: "2026-02-28", manager: "Miguel Torres", budget: 45000, spent: 43200, tags: ["Data", "BI"] },
];

const INVOICES = [
  { id: "FAC-2026-031", date: "2026-03-01", concept: "Desarrollo Sprint 6 — CRM", amount: 28500, status: "Pagada", dueDate: "2026-03-15" },
  { id: "FAC-2026-028", date: "2026-02-15", concept: "Diseño UI — Web Corporativo", amount: 15000, status: "Pagada", dueDate: "2026-03-01" },
  { id: "FAC-2026-035", date: "2026-03-10", concept: "Backend API REST + Documentación", amount: 32000, status: "Pendiente", dueDate: "2026-03-25" },
  { id: "FAC-2026-038", date: "2026-03-18", concept: "Onboarding App Móvil — Sprint 1", amount: 18000, status: "Vencida", dueDate: "2026-03-20" },
];

const TICKETS = [
  { id: "TKT-0041", title: "Error al exportar reportes PDF", priority: "Alta", status: "Abierto", created: "2026-03-18", project: "Dashboard Analytics" },
  { id: "TKT-0039", title: "Ajuste de colores en dashboard móvil", priority: "Baja", status: "En progreso", created: "2026-03-15", project: "App Móvil Flutter" },
  { id: "TKT-0037", title: "Configurar webhook de pagos Stripe", priority: "Media", status: "Resuelto", created: "2026-03-10", project: "Integración CRM + ERP" },
  { id: "TKT-0035", title: "Optimizar velocidad de carga home page", priority: "Media", status: "Resuelto", created: "2026-03-05", project: "Rediseño Web Corporativo" },
];

const DOCUMENTS = [
  { id: 1, name: "Propuesta Técnica — App Móvil.pdf", type: "PDF", size: "2.4 MB", date: "2026-03-01", project: "App Móvil Flutter" },
  { id: 2, name: "Contrato de Servicios 2026.pdf", type: "PDF", size: "0.8 MB", date: "2026-01-15", project: "General" },
  { id: 3, name: "Wireframes UI v3.fig", type: "Figma", size: "18.2 MB", date: "2026-03-12", project: "Rediseño Web Corporativo" },
  { id: 4, name: "Manual de Usuario Dashboard.pdf", type: "PDF", size: "1.1 MB", date: "2026-02-28", project: "Dashboard Analytics" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = n => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);

const STATUS_STYLES = {
  "En progreso": { bg: "#EFF6FF", color: "#2563EB", dot: "#3B82F6" },
  "Revisión":    { bg: "#FFF7ED", color: "#C2410C", dot: "#F97316" },
  "Planificación": { bg: "#F5F3FF", color: "#6D28D9", dot: "#8B5CF6" },
  "Completado":  { bg: "#F0FDF4", color: "#15803D", dot: "#22C55E" },
  "Pagada":      { bg: "#F0FDF4", color: "#15803D", dot: "#22C55E" },
  "Pendiente":   { bg: "#FFF7ED", color: "#C2410C", dot: "#F97316" },
  "Vencida":     { bg: "#FFF1F2", color: "#BE123C", dot: "#F43F5E" },
  "Abierto":     { bg: "#FFF1F2", color: "#BE123C", dot: "#F43F5E" },
  "En progreso_ticket": { bg: "#EFF6FF", color: "#2563EB", dot: "#3B82F6" },
  "Resuelto":    { bg: "#F0FDF4", color: "#15803D", dot: "#22C55E" },
};

const PRIORITY = { "Alta": "#EF4444", "Media": "#F59E0B", "Baja": "#10B981" };

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 600, padding: "3px 9px",
      borderRadius: 20, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function ProgressBar({ value, color = "#6366F1" }) {
  return (
    <div style={{ height: 5, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${value}%`,
        background: value === 100 ? "#22C55E" : color,
        borderRadius: 3, transition: "width 0.8s ease",
      }} />
    </div>
  );
}

// ─── SECCIONES ────────────────────────────────────────────────────────────────
function ProjectsView() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {PROJECTS.map((p, i) => (
          <div key={p.id} style={{
            background: "#fff", borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: 20,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            animation: `fadeUp 0.4s ease ${i * 0.07}s both`,
            cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{p.name}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#94A3B8" }}>PM: {p.manager} · Entrega {p.dueDate}</p>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: "#64748B" }}>Progreso</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: p.progress === 100 ? "#22C55E" : "#6366F1" }}>{p.progress}%</span>
              </div>
              <ProgressBar value={p.progress} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "#94A3B8" }}>Presupuesto</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{fmt(p.budget)}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 11, color: "#94A3B8" }}>Ejercido</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: p.spent / p.budget > 0.9 ? "#EF4444" : "#10B981" }}>{fmt(p.spent)}</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {p.tags.map(t => (
                  <span key={t} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "#F1F5F9", color: "#64748B", fontWeight: 600, letterSpacing: "0.05em" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InvoicesView() {
  const total = INVOICES.reduce((s, i) => s + i.amount, 0);
  const pending = INVOICES.filter(i => i.status !== "Pagada").reduce((s, i) => s + i.amount, 0);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Facturado", value: fmt(total), color: "#6366F1" },
          { label: "Por Cobrar", value: fmt(pending), color: "#F59E0B" },
          { label: "Facturas", value: INVOICES.length, color: "#10B981" },
        ].map((k, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <p style={{ margin: "0 0 4px", fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{k.label}</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: k.color, fontFamily: "'DM Mono', monospace" }}>{k.value}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto auto auto", padding: "10px 18px", borderBottom: "1px solid #F1F5F9", background: "#FAFAFA" }}>
          {["No. Factura", "Concepto", "Monto", "Vencimiento", "Estado"].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</span>
          ))}
        </div>
        {INVOICES.map((inv, i) => (
          <div key={inv.id} style={{
            display: "grid", gridTemplateColumns: "1fr 2fr auto auto auto",
            padding: "13px 18px", borderBottom: i < INVOICES.length - 1 ? "1px solid #F8FAFC" : "none",
            alignItems: "center", gap: 8,
            animation: `fadeUp 0.3s ease ${i * 0.06}s both`,
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6366F1", fontFamily: "'DM Mono', monospace" }}>{inv.id}</span>
            <span style={{ fontSize: 12, color: "#334155" }}>{inv.concept}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", fontFamily: "'DM Mono', monospace" }}>{fmt(inv.amount)}</span>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>{inv.dueDate}</span>
            <StatusBadge status={inv.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TicketsView({ onNewTicket }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button onClick={onNewTicket} style={{
          background: "#6366F1", border: "none", borderRadius: 8,
          padding: "9px 18px", fontSize: 12, fontWeight: 700,
          color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
        }}>
          + Nuevo Ticket
        </button>
      </div>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        {TICKETS.map((t, i) => (
          <div key={t.id} style={{
            display: "grid", gridTemplateColumns: "auto 1fr auto auto auto",
            padding: "14px 18px", borderBottom: i < TICKETS.length - 1 ? "1px solid #F8FAFC" : "none",
            alignItems: "center", gap: 14,
            animation: `fadeUp 0.3s ease ${i * 0.06}s both`,
          }}>
            <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "'DM Mono', monospace" }}>{t.id}</span>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{t.title}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#94A3B8" }}>{t.project} · {t.created}</p>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: PRIORITY[t.priority] }}>● {t.priority}</span>
            <StatusBadge status={t.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsView() {
  const icons = { PDF: "📄", Figma: "🎨", default: "📁" };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
      {DOCUMENTS.map((d, i) => (
        <div key={d.id} style={{
          background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12,
          padding: "14px 16px", display: "flex", gap: 12, alignItems: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          cursor: "pointer", transition: "box-shadow 0.15s",
          animation: `fadeUp 0.3s ease ${i * 0.06}s both`,
        }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"}
        >
          <span style={{ fontSize: 28 }}>{icons[d.type] || icons.default}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</p>
            <p style={{ margin: 0, fontSize: 10, color: "#94A3B8" }}>{d.project} · {d.size} · {d.date}</p>
          </div>
          <button style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6, padding: "5px 10px", fontSize: 11, color: "#6366F1", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
            Descargar
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── AI ASSISTANT ─────────────────────────────────────────────────────────────
function AIAssistant({ onClose }) {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "¡Hola! Soy tu asistente IA integrado al portal. Puedo ayudarte a revisar el estado de tus proyectos, facturas pendientes, tickets abiertos o cualquier duda sobre tu cuenta. ¿En qué te ayudo?",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const context = `
Contexto del cliente: ${CURRENT_USER.name}, Plan ${CURRENT_USER.plan}, cliente desde ${CURRENT_USER.since}.
Proyectos activos: ${PROJECTS.map(p => `${p.name} (${p.status}, ${p.progress}%)`).join(", ")}.
Facturas pendientes: ${INVOICES.filter(i => i.status !== "Pagada").map(i => `${i.id} por ${fmt(i.amount)} — ${i.status}`).join(", ")}.
Tickets abiertos: ${TICKETS.filter(t => t.status !== "Resuelto").map(t => `${t.id}: ${t.title} (${t.priority})`).join(", ")}.
`;

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          system: `Eres el asistente IA del portal de clientes de una agencia de desarrollo de software. 
Tienes acceso al contexto del cliente y respondes de forma concisa, amigable y útil en español.
${context}
Máximo 3-4 líneas de respuesta. Sé directo y práctico.`,
          messages: updated,
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content?.[0]?.text || "Error al responder." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Error de conexión. Intenta de nuevo." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 1000,
      width: 360, background: "#fff",
      border: "1px solid #E2E8F0", borderRadius: 18,
      boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      overflow: "hidden", animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px) scale(0.95) } to { opacity:1; transform:translateY(0) scale(1) } }`}</style>
      <div style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff" }}>Asistente IA</p>
            <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Powered by Claude</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, width: 26, height: 26, cursor: "pointer", color: "#fff", fontSize: 14 }}>✕</button>
      </div>
      <div style={{ height: 260, overflowY: "auto", padding: "14px 16px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10, display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: 8 }}>
            <div style={{
              maxWidth: "82%", padding: "9px 13px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              background: m.role === "user" ? "#6366F1" : "#F8FAFC",
              border: m.role === "user" ? "none" : "1px solid #E2E8F0",
              fontSize: 12, lineHeight: 1.65,
              color: m.role === "user" ? "#fff" : "#334155",
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 5, padding: "8px 12px" }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366F1", animation: `bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
          </div>
        )}
      </div>
      <div style={{ padding: "10px 14px", borderTop: "1px solid #F1F5F9", display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Escribe tu pregunta..."
          style={{
            flex: 1, border: "1px solid #E2E8F0", borderRadius: 8,
            padding: "8px 12px", fontSize: 12, color: "#334155",
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
        <button onClick={send} disabled={!input.trim() || loading} style={{
          background: input.trim() && !loading ? "#6366F1" : "#F1F5F9",
          border: "none", borderRadius: 8, width: 34, height: 34,
          cursor: input.trim() && !loading ? "pointer" : "default",
          color: input.trim() && !loading ? "#fff" : "#CBD5E1",
          fontSize: 14, transition: "all 0.15s",
        }}>↑</button>
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function ClientPortal() {
  const [activeSection, setActiveSection] = useState("proyectos");
  const [showAI, setShowAI] = useState(false);
  const [showNewTicket, setShowNewTicket] = useState(false);

  const NAV = [
    { id: "proyectos", label: "Proyectos", icon: "◈", count: PROJECTS.filter(p => p.status !== "Completado").length },
    { id: "facturas",  label: "Facturas",  icon: "◎", count: INVOICES.filter(i => i.status !== "Pagada").length },
    { id: "tickets",   label: "Soporte",   icon: "◉", count: TICKETS.filter(t => t.status === "Abierto").length },
    { id: "documentos",label: "Documentos",icon: "◫", count: null },
  ];

  const SECTION_TITLES = { proyectos: "Mis Proyectos", facturas: "Facturación", tickets: "Soporte & Tickets", documentos: "Documentos" };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        * { box-sizing: border-box; }
        input:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 2px; }
        button { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{
        width: 240, background: "#fff",
        borderRight: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column",
        padding: "24px 0", position: "fixed",
        top: 0, left: 0, bottom: 0, zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #F1F5F9" }}>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.04em" }}>
            client<span style={{ color: "#6366F1" }}>hub</span>
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 10, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Portal de Clientes
          </p>
        </div>

        {/* User */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #6366F1, #4F46E5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, color: "#fff",
            }}>
              {CURRENT_USER.avatar}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#0F172A" }}>{CURRENT_USER.name}</p>
              <span style={{ fontSize: 10, background: "#EEF2FF", color: "#6366F1", padding: "1px 7px", borderRadius: 10, fontWeight: 600 }}>
                Plan {CURRENT_USER.plan}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 12px" }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 12px", borderRadius: 10, marginBottom: 2,
              background: activeSection === item.id ? "#EEF2FF" : "transparent",
              border: "none", cursor: "pointer",
              transition: "background 0.15s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16, color: activeSection === item.id ? "#6366F1" : "#94A3B8" }}>{item.icon}</span>
                <span style={{ fontSize: 13, fontWeight: activeSection === item.id ? 700 : 500, color: activeSection === item.id ? "#6366F1" : "#64748B" }}>
                  {item.label}
                </span>
              </div>
              {item.count > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "1px 7px",
                  background: activeSection === item.id ? "#6366F1" : "#F1F5F9",
                  color: activeSection === item.id ? "#fff" : "#64748B",
                  borderRadius: 10,
                }}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* AI Button */}
        <div style={{ padding: "12px 12px 0" }}>
          <button onClick={() => setShowAI(v => !v)} style={{
            width: "100%", padding: "11px 14px",
            background: showAI ? "linear-gradient(135deg, #6366F1, #4F46E5)" : "#F8FAFC",
            border: `1px solid ${showAI ? "transparent" : "#E2E8F0"}`,
            borderRadius: 10, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10,
            transition: "all 0.2s",
            boxShadow: showAI ? "0 4px 14px rgba(99,102,241,0.35)" : "none",
          }}>
            <span style={{ fontSize: 16 }}>✦</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: showAI ? "#fff" : "#6366F1" }}>
              Asistente IA
            </span>
            <span style={{ marginLeft: "auto", fontSize: 9, padding: "2px 6px", borderRadius: 4, background: showAI ? "rgba(255,255,255,0.2)" : "#EEF2FF", color: showAI ? "#fff" : "#6366F1", fontWeight: 700 }}>
              CLAUDE
            </span>
          </button>
        </div>

        <p style={{ margin: "12px 20px 0", fontSize: 9, color: "#CBD5E1", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Built with Softr + Airtable + Claude API
        </p>
      </div>

      {/* MAIN */}
      <div style={{ marginLeft: 240, flex: 1, padding: "28px 28px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em" }}>
              {SECTION_TITLES[activeSection]}
            </h1>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94A3B8" }}>
              Bienvenido, {CURRENT_USER.name}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ fontSize: 11, color: "#64748B", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 14px" }}>
              📅 {new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ animation: "fadeUp 0.3s ease" }} key={activeSection}>
          {activeSection === "proyectos"  && <ProjectsView />}
          {activeSection === "facturas"   && <InvoicesView />}
          {activeSection === "tickets"    && <TicketsView onNewTicket={() => setShowNewTicket(true)} />}
          {activeSection === "documentos" && <DocumentsView />}
        </div>
      </div>

      {/* AI Assistant */}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setShowNewTicket(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 18, padding: 28,
            width: 440, boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
            animation: "fadeUp 0.3s ease",
          }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>Nuevo Ticket de Soporte</h3>
            {["Título del problema", "Proyecto relacionado", "Descripción detallada"].map((label, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
                {i === 2
                  ? <textarea rows={3} style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#334155", resize: "none" }} />
                  : <input style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#334155" }} />
                }
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
              <button onClick={() => setShowNewTicket(false)} style={{ padding: "9px 18px", border: "1px solid #E2E8F0", borderRadius: 8, background: "#fff", fontSize: 13, cursor: "pointer", color: "#64748B" }}>Cancelar</button>
              <button onClick={() => setShowNewTicket(false)} style={{ padding: "9px 18px", border: "none", borderRadius: 8, background: "#6366F1", fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#fff", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}>Enviar Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
