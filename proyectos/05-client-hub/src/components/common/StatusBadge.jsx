import { memo } from "react";
import { tStatus } from "../../constants/translations.js";

const DARK_STATUS_STYLES = {
  "Planificacion":  { bg: "rgba(245,158,11,0.1)", color: "#FBBF24", dot: "#F59E0B" },
  "Planificación":  { bg: "rgba(245,158,11,0.1)", color: "#FBBF24", dot: "#F59E0B" },
  "En progreso":    { bg: "rgba(59,130,246,0.1)", color: "#60A5FA", dot: "#3B82F6" },
  "Revisión":       { bg: "rgba(139,92,246,0.1)", color: "#A78BFA", dot: "#8B5CF6" },
  "Completado":     { bg: "rgba(34,197,94,0.1)", color: "#4ADE80", dot: "#22C55E" },
  "Pendiente":      { bg: "rgba(245,158,11,0.1)", color: "#FBBF24", dot: "#F59E0B" },
  "Pagada":         { bg: "rgba(34,197,94,0.1)", color: "#4ADE80", dot: "#22C55E" },
  "Vencida":        { bg: "rgba(239,68,68,0.1)", color: "#F87171", dot: "#EF4444" },
  "Abierto":        { bg: "rgba(59,130,246,0.1)", color: "#60A5FA", dot: "#3B82F6" },
  "En proceso":     { bg: "rgba(245,158,11,0.1)", color: "#FBBF24", dot: "#F59E0B" },
  "Resuelto":       { bg: "rgba(34,197,94,0.1)", color: "#4ADE80", dot: "#22C55E" },
};

const DEFAULT_STYLE = { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", dot: "rgba(255,255,255,0.3)" };

const StatusBadge = memo(function StatusBadge({ status, lang = "es" }) {
  const s = DARK_STATUS_STYLES[status] || DEFAULT_STYLE;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 600, padding: "3px 9px",
      borderRadius: 20, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0, boxShadow: `0 0 6px ${s.dot}50` }} />
      {tStatus(status, lang)}
    </span>
  );
});

export default StatusBadge;
