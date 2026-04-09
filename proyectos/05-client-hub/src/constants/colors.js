export const STATUS_STYLES = {
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

export const PRIORITY_COLORS = { "Alta": "#EF4444", "Media": "#F59E0B", "Baja": "#10B981" };

export const TICKET_STATUS_FLOW = ["Abierto", "En progreso", "Resuelto"];

export const FILE_ICONS = {
  PDF: { icon: "PDF", bg: "#FEE2E2", color: "#DC2626", border: "#FECACA" },
  Figma: { icon: "FIG", bg: "#F3E8FF", color: "#7C3AED", border: "#DDD6FE" },
  IMG: { icon: "IMG", bg: "#FEF3C7", color: "#D97706", border: "#FDE68A" },
  DOC: { icon: "DOC", bg: "#DBEAFE", color: "#2563EB", border: "#BFDBFE" },
  XLS: { icon: "XLS", bg: "#D1FAE5", color: "#059669", border: "#A7F3D0" },
  ZIP: { icon: "ZIP", bg: "#E0E7FF", color: "#4338CA", border: "#C7D2FE" },
  default: { icon: "FILE", bg: "#F1F5F9", color: "#64748B", border: "#E2E8F0" },
};
