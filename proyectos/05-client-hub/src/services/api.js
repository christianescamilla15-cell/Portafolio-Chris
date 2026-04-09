import { CURRENT_USER } from "../constants/mockData.js";
import { T, tStatus, tPriority } from "../constants/translations.js";
import { fmt } from "../utils/invoiceCalculator.js";

// ─── CLAUDE TOOL USE DEFINITIONS ────────────────────────────────────────────
const TOOLS = [
  {
    name: "query_projects",
    description: "Get project details including status, progress percentage, budget, spent amount, manager, and due date. Can optionally filter by status.",
    input_schema: {
      type: "object",
      properties: {
        status: { type: "string", description: "Filter by status: 'En progreso', 'Revisión', 'Planificación', 'Completado'. Leave empty for all." }
      },
      required: []
    }
  },
  {
    name: "query_invoices",
    description: "Get invoice data including amounts, status, due dates, and concepts. Can optionally filter by status.",
    input_schema: {
      type: "object",
      properties: {
        status: { type: "string", description: "Filter by status: 'Pagada', 'Pendiente', 'Vencida'. Leave empty for all." }
      },
      required: []
    }
  },
  {
    name: "query_tickets",
    description: "Get support tickets including priority, status, assignee, and related project. Can filter by priority or status.",
    input_schema: {
      type: "object",
      properties: {
        priority: { type: "string", description: "Filter by priority: 'Alta', 'Media', 'Baja'. Leave empty for all." },
        status: { type: "string", description: "Filter by status: 'Abierto', 'En progreso', 'Resuelto'. Leave empty for all." }
      },
      required: []
    }
  },
  {
    name: "query_documents",
    description: "List documents including type, associated project, upload date, and file size.",
    input_schema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "create_ticket",
    description: "Create a new support ticket with a title, priority, and description.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Title of the support ticket" },
        priority: { type: "string", enum: ["Alta", "Media", "Baja"], description: "Priority level" },
        description: { type: "string", description: "Detailed description of the issue" }
      },
      required: ["title", "priority"]
    }
  },
  {
    name: "get_dashboard_summary",
    description: "Get a KPI summary of the portal: active projects count, pending invoices total, open tickets count, and document count.",
    input_schema: {
      type: "object",
      properties: {},
      required: []
    }
  }
];

function executeClientTool(toolName, toolInput, projects, invoices, tickets, documents) {
  switch (toolName) {
    case "query_projects": {
      let data = projects;
      if (toolInput.status) data = data.filter(p => p.status === toolInput.status);
      return JSON.stringify(data.map(p => ({
        id: p.id, name: p.name, status: p.status, progress: p.progress,
        budget: p.budget, spent: p.spent, manager: p.manager, dueDate: p.dueDate
      })));
    }
    case "query_invoices": {
      let data = invoices;
      if (toolInput.status) data = data.filter(i => i.status === toolInput.status);
      return JSON.stringify(data.map(i => ({
        id: i.id, concept: i.concept, amount: i.amount, status: i.status, dueDate: i.dueDate
      })));
    }
    case "query_tickets": {
      let data = tickets;
      if (toolInput.priority) data = data.filter(t => t.priority === toolInput.priority);
      if (toolInput.status) data = data.filter(t => t.status === toolInput.status);
      return JSON.stringify(data.map(t => ({
        id: t.id, title: t.title, priority: t.priority, status: t.status,
        project: t.project, assignee: t.assignee
      })));
    }
    case "query_documents": {
      return JSON.stringify(documents.map(d => ({
        id: d.id, name: d.name, size: d.size, project: d.project, date: d.date
      })));
    }
    case "create_ticket": {
      const newTicket = {
        id: `TK-${String(tickets.length + 1).padStart(3, "0")}`,
        title: toolInput.title,
        priority: toolInput.priority || "Media",
        status: "Abierto",
        project: "General",
        assignee: "Sin asignar",
        description: toolInput.description || ""
      };
      return JSON.stringify({ success: true, ticket: newTicket });
    }
    case "get_dashboard_summary": {
      const activeProjects = projects.filter(p => p.status !== "Completado").length;
      const pendingInvoices = invoices.filter(i => i.status !== "Pagada");
      const pendingTotal = pendingInvoices.reduce((s, i) => s + i.amount, 0);
      const openTickets = tickets.filter(t => t.status !== "Resuelto").length;
      return JSON.stringify({
        activeProjects, pendingInvoices: pendingInvoices.length,
        pendingTotal, openTickets, totalDocuments: documents.length,
        totalBudget: projects.reduce((s, p) => s + p.budget, 0),
        totalSpent: projects.reduce((s, p) => s + p.spent, 0)
      });
    }
    default:
      return JSON.stringify({ error: "Unknown tool" });
  }
}

export async function chatWithToolUse(userMessage, projects, invoices, tickets, documents, lang, apiKey) {
  const groqKey = localStorage.getItem('groq_api_key') || '';
  if (!apiKey && !groqKey) return getDemoAssistantResponse(userMessage, lang);
  try {
    const systemPrompt = `You are an AI assistant for ClientHub, a client portal for ${CURRENT_USER.name} (Plan ${CURRENT_USER.plan}).
Use the available tools to query REAL portal data before answering — do NOT guess or make up numbers.
Respond concisely in ${lang === "en" ? "English" : "Spanish"}. Use **bold** for key figures. Keep answers to 3-5 lines max.
When the user asks to create a ticket, use the create_ticket tool and confirm the details back.`;

    // Try Groq first (simple, no tool_use)
    if (groqKey) {
      try {
        const groqResp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile", max_tokens: 800, temperature: 0.3,
            messages: [{ role: "system", content: systemPrompt + "\nNote: tools are not available. Use your knowledge to give helpful answers about projects, invoices, tickets, and documents." }, { role: "user", content: userMessage }],
          }),
        });
        if (groqResp.ok) {
          const groqData = await groqResp.json();
          return groqData.choices?.[0]?.message?.content || getDemoAssistantResponse(userMessage, lang);
        }
      } catch {}
    }

    // Fallback to Claude with tool_use
    if (!apiKey) return getDemoAssistantResponse(userMessage, lang);

    let messages = [{ role: "user", content: userMessage }];
    const MAX_TURNS = 5;

    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: systemPrompt,
          tools: TOOLS,
          messages
        })
      });
      if (!response.ok) return getDemoAssistantResponse(userMessage, lang);
      const data = await response.json();

      // If stop reason is end_turn or no tool_use blocks, extract text and return
      if (data.stop_reason === "end_turn" || !data.content.some(b => b.type === "tool_use")) {
        const textBlock = data.content.find(b => b.type === "text");
        return textBlock?.text || null;
      }

      // Process tool calls
      messages.push({ role: "assistant", content: data.content });
      const toolResults = [];
      for (const block of data.content) {
        if (block.type === "tool_use") {
          const result = executeClientTool(block.name, block.input, projects, invoices, tickets, documents);
          toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
        }
      }
      messages.push({ role: "user", content: toolResults });
    }
    // If we exhausted turns, return whatever text we got
    return null;
  } catch { return null; }
}

// ─── DEMO MODE — Context-aware assistant responses (bilingual) ────────────────
export function getDemoAssistantResponse(userInput, projects, invoices, tickets, documents, recentActions, lang = "es") {
  const q = userInput.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const pending = invoices.filter(i => i.status !== "Pagada");
  const pendingTotal = pending.reduce((s, i) => s + i.amount, 0);
  const openTickets = tickets.filter(t => t.status !== "Resuelto");
  const activeProjects = projects.filter(p => p.status !== "Completado");
  const lastAction = recentActions.length > 0 ? recentActions[recentActions.length - 1] : null;
  const isEn = lang === "en";

  // Context-aware: mention recent actions
  if (q.includes("ultimo") || q.includes("reciente") || q.includes("acabo") || q.includes("hice") || q.includes("recent") || q.includes("last")) {
    if (lastAction) {
      return isEn ? `Your last action was: ${lastAction}. Need anything else?` : `Tu ultima accion fue: ${lastAction}. ¿Necesitas algo mas?`;
    }
    return isEn ? "No recent actions recorded in this session. How can I help?" : "No he registrado acciones recientes en esta sesion. ¿En que puedo ayudarte?";
  }

  if (q.includes("proyecto") || q.includes("estado") || q.includes("progreso") || q.includes("avance") || q.includes("project") || q.includes("status") || q.includes("progress")) {
    if (q.includes("crm") || q.includes("erp") || q.includes("integracion") || q.includes("integration")) {
      const p = projects.find(x => x.name.toLowerCase().includes("crm")) || projects[1];
      return isEn
        ? `Project "${p.name}" is in **${tStatus(p.status, lang)}** phase at ${p.progress}%. Manager: ${p.manager}. Due: ${p.dueDate}. Spent: ${fmt(p.spent)} of ${fmt(p.budget)}.`
        : `El proyecto "${p.name}" esta en fase de **${tStatus(p.status, lang)}** con un avance del ${p.progress}%. Manager: ${p.manager}. Fecha de entrega: ${p.dueDate}. Presupuesto ejercido: ${fmt(p.spent)} de ${fmt(p.budget)}.`;
    }
    if (q.includes("app") || q.includes("movil") || q.includes("flutter") || q.includes("mobile")) {
      const p = projects.find(x => x.name.toLowerCase().includes("flutter")) || projects[2];
      return isEn
        ? `"${p.name}" is in **${tStatus(p.status, lang)}** phase at ${p.progress}%. Manager: ${p.manager}. Due: ${p.dueDate}. Budget: ${fmt(p.spent)} spent of ${fmt(p.budget)}.`
        : `La "${p.name}" esta en fase de **${tStatus(p.status, lang)}** con ${p.progress}% de avance. Manager: ${p.manager}. La entrega esta programada para ${p.dueDate}. Presupuesto: ${fmt(p.spent)} ejercido de ${fmt(p.budget)}.`;
    }
    if (q.includes("web") || q.includes("corporativo") || q.includes("rediseno") || q.includes("redesign") || q.includes("corporate")) {
      const p = projects.find(x => x.name.toLowerCase().includes("web")) || projects[0];
      return isEn
        ? `"${p.name}" is at ${p.progress}% — **${tStatus(p.status, lang)}**. Manager: ${p.manager}. Due: ${p.dueDate}. Spent ${fmt(p.spent)} of ${fmt(p.budget)} budget.`
        : `El "${p.name}" avanza al ${p.progress}% — esta **${tStatus(p.status, lang)}**. Manager: ${p.manager}. Entrega estimada: ${p.dueDate}. Se ha ejercido ${fmt(p.spent)} del presupuesto de ${fmt(p.budget)}.`;
    }
    if (q.includes("dashboard") || q.includes("analytics")) {
      const p = projects.find(x => x.name.toLowerCase().includes("dashboard")) || projects[3];
      return isEn
        ? `"${p.name}" is at ${p.progress}% — **${tStatus(p.status, lang)}**. Managed by ${p.manager}. Final budget: ${fmt(p.spent)} of ${fmt(p.budget)}.`
        : `El "${p.name}" esta al ${p.progress}% — **${tStatus(p.status, lang)}**. Fue gestionado por ${p.manager}. Presupuesto final: ${fmt(p.spent)} de ${fmt(p.budget)}.`;
    }
    return isEn
      ? `You have ${activeProjects.length} active projects:\n${projects.map(p => `\u2022 **${p.name}**: ${tStatus(p.status, lang)} (${p.progress}%) — due ${p.dueDate}`).join("\n")}\n\nWant more detail on any specific one?`
      : `Tienes ${activeProjects.length} proyectos activos:\n${projects.map(p => `\u2022 **${p.name}**: ${tStatus(p.status, lang)} (${p.progress}%) — entrega ${p.dueDate}`).join("\n")}\n\n¿Quieres mas detalle de alguno en especifico?`;
  }

  if (q.includes("factura") || q.includes("pendiente") || q.includes("cobrar") || q.includes("pago") || q.includes("debo") || q.includes("cuanto") || q.includes("invoice") || q.includes("billing") || q.includes("payment") || q.includes("owe")) {
    if (pending.length === 0) {
      return isEn ? "You have no pending invoices. All invoices are up to date." : "No tienes facturas pendientes de pago. Todas tus facturas estan al corriente.";
    }
    const overdueNote = pending.some(i => i.status === "Vencida")
      ? (isEn ? "There is an overdue invoice. We recommend settling it soon." : "Hay una factura vencida. Te recomiendo regularizarla a la brevedad.")
      : (isEn ? "All are within the payment period." : "Todas estan dentro de plazo de pago.");
    return isEn
      ? `You have **${pending.length} pending invoices** totaling **${fmt(pendingTotal)}**:\n${pending.map(i => `\u2022 ${i.id}: ${i.concept} — ${fmt(i.amount)} (${tStatus(i.status, lang)}, due ${i.dueDate})`).join("\n")}\n\n${overdueNote}`
      : `Tienes **${pending.length} facturas pendientes** por un total de **${fmt(pendingTotal)}**:\n${pending.map(i => `\u2022 ${i.id}: ${i.concept} — ${fmt(i.amount)} (${tStatus(i.status, lang)}, vence ${i.dueDate})`).join("\n")}\n\n${overdueNote}`;
  }

  if (q.includes("ticket") || q.includes("soporte") || q.includes("problema") || q.includes("error") || q.includes("abierto") || q.includes("support") || q.includes("issue") || q.includes("open")) {
    if (openTickets.length === 0) {
      return isEn ? "You have no open tickets. All support is up to date." : "No tienes tickets abiertos en este momento. Todo el soporte esta al dia.";
    }
    return isEn
      ? `You have **${openTickets.length} active tickets**:\n${openTickets.map(t => `\u2022 ${t.id}: "${t.title}" — ${tPriority(t.priority, lang)} priority, ${tStatus(t.status, lang)} (${t.project})`).join("\n")}\n\nThe support team is working on them. Need to escalate any?`
      : `Tienes **${openTickets.length} tickets activos**:\n${openTickets.map(t => `\u2022 ${t.id}: "${t.title}" — Prioridad ${tPriority(t.priority, lang)}, ${tStatus(t.status, lang)} (${t.project})`).join("\n")}\n\nEl equipo de soporte esta trabajando en ellos. ¿Necesitas escalar alguno?`;
  }

  if (q.includes("documento") || q.includes("archivo") || q.includes("contrato") || q.includes("propuesta") || q.includes("document") || q.includes("file") || q.includes("contract")) {
    return isEn
      ? `You have ${documents.length} documents in your portal:\n${documents.map(d => `\u2022 ${d.name} (${d.size}) — ${d.project}`).join("\n")}\n\nYou can download them from the Documents section.`
      : `Tienes ${documents.length} documentos en tu portal:\n${documents.map(d => `\u2022 ${d.name} (${d.size}) — ${d.project}`).join("\n")}\n\nPuedes descargarlos desde la seccion de Documentos.`;
  }

  if (q.includes("presupuesto") || q.includes("gasto") || q.includes("costo") || q.includes("inversion") || q.includes("budget") || q.includes("spending") || q.includes("cost")) {
    const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
    const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
    const topProject = [...projects].sort((a, b) => (b.spent / b.budget) - (a.spent / a.budget))[0].name;
    return isEn
      ? `Investment summary:\n\u2022 Total budget: **${fmt(totalBudget)}**\n\u2022 Spent: **${fmt(totalSpent)}** (${Math.round(totalSpent / totalBudget * 100)}%)\n\u2022 Available: **${fmt(totalBudget - totalSpent)}**\n\nThe project with the highest budget execution is "${topProject}".`
      : `Resumen de inversion:\n\u2022 Presupuesto total: **${fmt(totalBudget)}**\n\u2022 Ejercido: **${fmt(totalSpent)}** (${Math.round(totalSpent / totalBudget * 100)}%)\n\u2022 Disponible: **${fmt(totalBudget - totalSpent)}**\n\nEl proyecto con mayor ejecucion presupuestal es "${topProject}".`;
  }

  if (q.includes("hola") || q.includes("hey") || q.includes("buenos") || q.includes("buenas") || q.includes("hello") || q.includes("hi")) {
    return isEn
      ? `Hi! Welcome to ${CURRENT_USER.name}'s portal. You have ${activeProjects.length} active projects, ${pending.length} pending invoices (${fmt(pendingTotal)}), and ${openTickets.length} open tickets. How can I help you today?`
      : `Hola! Bienvenido al portal de ${CURRENT_USER.name}. Tienes ${activeProjects.length} proyectos activos, ${pending.length} facturas pendientes (${fmt(pendingTotal)}) y ${openTickets.length} tickets abiertos. ¿En que puedo ayudarte hoy?`;
  }

  if (q.includes("ayuda") || q.includes("que puedes") || q.includes("como funciona") || q.includes("help") || q.includes("what can") || q.includes("how does")) {
    return isEn
      ? "I can help you with:\n\u2022 **Project status** — progress, dates, budget\n\u2022 **Invoices** — pending, amounts, due dates\n\u2022 **Support tickets** — status, priority\n\u2022 **Documents** — contracts, proposals\n\u2022 **General summary** of your account\n\nJust ask me what you need."
      : "Puedo ayudarte con:\n\u2022 **Estado de proyectos** — avance, fechas, presupuesto\n\u2022 **Facturas** — pendientes, montos, vencimientos\n\u2022 **Tickets de soporte** — estado, prioridad\n\u2022 **Documentos** — contratos, propuestas\n\u2022 **Resumen general** de tu cuenta\n\nSolo preguntame lo que necesites.";
  }

  return isEn
    ? `Based on your account (${CURRENT_USER.name}, Plan ${CURRENT_USER.plan}):\n\u2022 ${activeProjects.length} active projects\n\u2022 ${fmt(pendingTotal)} in pending invoices\n\u2022 ${openTickets.length} open support tickets\n\nYou can ask me about your project status, pending invoices, tickets, or documents. How can I help?`
    : `Segun tu cuenta (${CURRENT_USER.name}, Plan ${CURRENT_USER.plan}):\n\u2022 ${activeProjects.length} proyectos activos\n\u2022 ${fmt(pendingTotal)} en facturas pendientes\n\u2022 ${openTickets.length} tickets de soporte abiertos\n\nPuedes preguntarme sobre el estado de tus proyectos, facturas pendientes, tickets o documentos. ¿Como te ayudo?`;
}

export const getSuggestionChips = (lang) => [
  T.chipProjects[lang],
  T.chipInvoices[lang],
  T.chipTickets[lang],
  T.chipBudget[lang],
];
