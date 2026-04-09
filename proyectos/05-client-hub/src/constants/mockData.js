// ─── INITIAL DATA (simula Airtable como backend) ─────────────────────────────
export const CURRENT_USER = { name: "Empresa Demo S.A.", plan: "Pro", avatar: "ED", since: "Ene 2025" };

export const INITIAL_PROJECTS = [
  { id: 1, name: "Rediseño Web Corporativo", status: "En progreso", progress: 68, dueDate: "2026-04-15", manager: "Ana López", budget: 85000, spent: 57800, tags: ["Diseño", "Dev"], log: [] },
  { id: 2, name: "Integración CRM + ERP", status: "Revisión", progress: 91, dueDate: "2026-03-28", manager: "Carlos Vega", budget: 120000, spent: 109000, tags: ["Backend", "IA"], log: [] },
  { id: 3, name: "App Móvil Flutter", status: "Planificación", progress: 12, dueDate: "2026-06-30", manager: "Sofia Castro", budget: 200000, spent: 18000, tags: ["Mobile", "Flutter"], log: [] },
  { id: 4, name: "Dashboard Analytics", status: "Completado", progress: 100, dueDate: "2026-02-28", manager: "Miguel Torres", budget: 45000, spent: 43200, tags: ["Data", "BI"], log: [] },
];

export const INITIAL_INVOICES = [
  { id: "FAC-2026-031", date: "2026-03-01", concept: "Desarrollo Sprint 6 — CRM", amount: 28500, status: "Pagada", dueDate: "2026-03-15" },
  { id: "FAC-2026-028", date: "2026-02-15", concept: "Diseño UI — Web Corporativo", amount: 15000, status: "Pagada", dueDate: "2026-03-01" },
  { id: "FAC-2026-035", date: "2026-03-10", concept: "Backend API REST + Documentación", amount: 32000, status: "Pendiente", dueDate: "2026-03-25" },
  { id: "FAC-2026-038", date: "2026-03-18", concept: "Onboarding App Móvil — Sprint 1", amount: 18000, status: "Vencida", dueDate: "2026-03-20" },
];

export const INITIAL_TICKETS = [
  { id: "TKT-0041", title: "Error al exportar reportes PDF", priority: "Alta", status: "Abierto", created: "2026-03-18", createdTs: Date.now() - 6 * 24 * 3600000, project: "Dashboard Analytics", description: "", assignee: "Ana Lopez", comments: [{ author: "Ana Lopez", text: "Revisando el modulo de exportacion.", ts: Date.now() - 5 * 24 * 3600000 }] },
  { id: "TKT-0039", title: "Ajuste de colores en dashboard móvil", priority: "Baja", status: "En progreso", created: "2026-03-15", createdTs: Date.now() - 9 * 24 * 3600000, project: "App Móvil Flutter", description: "", assignee: "Sofia Castro", comments: [] },
  { id: "TKT-0037", title: "Configurar webhook de pagos Stripe", priority: "Media", status: "Resuelto", created: "2026-03-10", createdTs: Date.now() - 14 * 24 * 3600000, project: "Integración CRM + ERP", description: "", assignee: "Carlos Vega", comments: [{ author: "Carlos Vega", text: "Webhook configurado y probado.", ts: Date.now() - 12 * 24 * 3600000 }] },
  { id: "TKT-0035", title: "Optimizar velocidad de carga home page", priority: "Media", status: "Resuelto", created: "2026-03-05", createdTs: Date.now() - 19 * 24 * 3600000, project: "Rediseño Web Corporativo", description: "", assignee: "Miguel Torres", comments: [] },
];

export const INITIAL_DOCUMENTS = [
  { id: 1, name: "Propuesta Técnica — App Móvil.pdf", type: "PDF", size: "2.4 MB", date: "2026-03-01", project: "App Móvil Flutter" },
  { id: 2, name: "Contrato de Servicios 2026.pdf", type: "PDF", size: "0.8 MB", date: "2026-01-15", project: "General" },
  { id: 3, name: "Wireframes UI v3.fig", type: "Figma", size: "18.2 MB", date: "2026-03-12", project: "Rediseño Web Corporativo" },
  { id: 4, name: "Manual de Usuario Dashboard.pdf", type: "PDF", size: "1.1 MB", date: "2026-02-28", project: "Dashboard Analytics" },
];
