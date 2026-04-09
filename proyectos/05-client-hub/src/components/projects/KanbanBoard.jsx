import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { T } from "../../constants/translations.js";
import { fmt } from "../../utils/invoiceCalculator.js";
import StatusBadge from "../common/StatusBadge.jsx";
import ProgressBar from "../common/ProgressBar.jsx";

const APPLE_EASE = [0.16, 1, 0.3, 1];

const STATUS_TO_COLUMN = {
  "Planificacion": "pendiente",
  "Planificación": "pendiente",
  "En progreso": "enProgreso",
  "Revisión": "enProgreso",
  "Completado": "completado",
};

const COLUMN_TO_STATUS = {
  pendiente: "Planificación",
  enProgreso: "En progreso",
  completado: "Completado",
};

const COLUMNS = ["pendiente", "enProgreso", "completado"];

const COLUMN_LABELS = {
  pendiente: "pendienteCol",
  enProgreso: "enProgresoCol",
  completado: "completadoCol",
};

const COLUMN_COLORS = {
  pendiente: { border: "#F59E0B", bg: "rgba(245,158,11,0.08)" },
  enProgreso: { border: "#3B82F6", bg: "rgba(59,130,246,0.08)" },
  completado: { border: "#22C55E", bg: "rgba(34,197,94,0.08)" },
};

export default function KanbanBoard({ projects, onUpdateProgress, onUpdateStatus, lang }) {
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const getColumn = (project) => STATUS_TO_COLUMN[project.status] || "pendiente";

  const columnProjects = {};
  COLUMNS.forEach(col => { columnProjects[col] = []; });
  projects.forEach(p => {
    const col = getColumn(p);
    columnProjects[col].push(p);
  });

  const handleDragStart = (e, projectId) => {
    setDraggedId(projectId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(projectId));
  };

  const handleDragOver = (e, col) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(col);
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e, col) => {
    e.preventDefault();
    setDragOverCol(null);
    if (draggedId == null) return;

    const project = projects.find(p => p.id === draggedId);
    if (!project) return;

    const currentCol = getColumn(project);
    if (currentCol === col) { setDraggedId(null); return; }

    const newStatus = COLUMN_TO_STATUS[col];
    if (onUpdateStatus) {
      onUpdateStatus(draggedId, newStatus);
    }
    if (col === "completado") {
      onUpdateProgress(draggedId, 100);
    }
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverCol(null);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, minHeight: 400 }}>
      {COLUMNS.map((col, colIdx) => {
        const colColor = COLUMN_COLORS[col];
        const isOver = dragOverCol === col;
        return (
          <motion.div
            key={col}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: colIdx * 0.1, duration: 0.5, ease: APPLE_EASE }}
            onDragOver={(e) => handleDragOver(e, col)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col)}
            style={{
              background: isOver ? `${colColor.bg}` : "rgba(255,255,255,0.02)",
              border: `2px dashed ${isOver ? colColor.border : "rgba(255,255,255,0.08)"}`,
              borderRadius: 16,
              padding: 14,
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              minHeight: 300,
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 14, paddingBottom: 10, borderBottom: `2px solid ${colColor.border}`,
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FAFAFA" }}>
                {T[COLUMN_LABELS[col]][lang]}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 8px",
                borderRadius: 10, background: `${colColor.border}20`, color: colColor.border,
              }}>
                {columnProjects[col].length}
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {columnProjects[col].map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: APPLE_EASE }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, p.id)}
                  onDragEnd={handleDragEnd}
                  role="listitem"
                  aria-label={`${p.name} — ${T.dragToMove[lang]}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      const currentIdx = COLUMNS.indexOf(col);
                      const nextCol = COLUMNS[(currentIdx + 1) % COLUMNS.length];
                      const newStatus = COLUMN_TO_STATUS[nextCol];
                      if (onUpdateStatus) onUpdateStatus(p.id, newStatus);
                      if (nextCol === "completado") onUpdateProgress(p.id, 100);
                    }
                  }}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: draggedId === p.id ? "2px solid #6366F1" : "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 10,
                    cursor: "grab",
                    opacity: draggedId === p.id ? 0.5 : 1,
                    backdropFilter: "blur(12px)",
                  }}
                  whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(99,102,241,0.12)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#FAFAFA" }}>{p.name}</p>
                    <StatusBadge status={p.status} lang={lang} />
                  </div>
                  <p style={{ margin: "0 0 8px", fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                    {T.pm[lang]} {p.manager}
                  </p>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>{T.progress[lang]}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: p.progress === 100 ? "#22C55E" : "#6366F1" }}>{p.progress}%</span>
                    </div>
                    <ProgressBar value={p.progress} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{T.budget[lang]}: {fmt(p.budget)}</span>
                    <span style={{ fontSize: 10, color: p.spent / p.budget > 0.9 ? "#EF4444" : "#10B981" }}>{fmt(p.spent)}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {columnProjects[col].length === 0 && (
              <div style={{
                padding: 20, textAlign: "center",
                color: "rgba(255,255,255,0.2)", fontSize: 12, fontStyle: "italic",
              }}>
                {T.dragToMove[lang]}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
