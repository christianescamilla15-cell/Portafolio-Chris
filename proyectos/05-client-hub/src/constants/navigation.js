import { T } from "./translations.js";

export const getNavItems = (lang, projects, invoices, tickets) => [
  { id: "dashboard", label: T.navDashboard[lang], icon: "\u25A3", count: null },
  { id: "proyectos", label: T.navProjects[lang], icon: "\u25C8", count: projects.filter(p => p.status !== "Completado").length },
  { id: "facturas",  label: T.navInvoices[lang],  icon: "\u25CE", count: invoices.filter(i => i.status !== "Pagada").length },
  { id: "tickets",   label: T.navSupport[lang],   icon: "\u25C9", count: tickets.filter(t => t.status === "Abierto").length },
  { id: "documentos",label: T.navDocuments[lang],icon: "\u25EB", count: null },
  { id: "salesforce",label: T.navSalesforce[lang],icon: "\u2601", count: null },
];

export const getSectionTitles = (lang) => ({
  dashboard: T.titleDashboard[lang],
  proyectos: T.titleProjects[lang],
  facturas: T.titleInvoices[lang],
  tickets: T.titleTickets[lang],
  documentos: T.titleDocuments[lang],
  salesforce: T.titleSalesforce[lang],
});
