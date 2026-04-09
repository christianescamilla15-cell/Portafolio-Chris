import { useState } from "react";
import { motion } from "framer-motion";
import { T } from "../../constants/translations.js";
import { fmt } from "../../utils/invoiceCalculator.js";
import { timeAgo } from "../../utils/projectUtils.js";
import StatusBadge from "../common/StatusBadge.jsx";
import ProgressBar from "../common/ProgressBar.jsx";

const APPLE_EASE = [0.16, 1, 0.3, 1];

export default function ProjectList({ projects, onUpdateProgress, lang }) {
  const [editingId, setEditingId] = useState(null);
  const [sliderVal, setSliderVal] = useState(0);

  const startEdit = (p) => {
    setEditingId(p.id);
    setSliderVal(p.progress);
  };

  const confirmEdit = (p) => {
    onUpdateProgress(p.id, sliderVal);
    setEditingId(null);
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {projects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.5, ease: APPLE_EASE }}
            whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(99,102,241,0.12)" }}
            style={{
              background: "rgba(255,255,255,0.03)", borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.06)",
              padding: 20,
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              cursor: "pointer",
              transition: "border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#FAFAFA" }}>{p.name}</p>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{T.pm[lang]} {p.manager} · {T.delivery[lang]} {p.dueDate}</p>
              </div>
              <StatusBadge status={p.status} lang={lang} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{T.progress[lang]}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: p.progress === 100 ? "#22C55E" : "#6366F1" }}>{p.progress}%</span>
                  {editingId !== p.id && (
                    <button onClick={(e) => { e.stopPropagation(); startEdit(p); }}
                      aria-label={`${T.edit[lang]} ${p.name}`}
                      style={{
                        background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 4,
                        fontSize: 9, color: "#818CF8", cursor: "pointer", padding: "2px 6px", fontWeight: 600,
                        transition: "all 0.2s",
                      }}>{T.edit[lang]}</button>
                  )}
                </div>
              </div>
              {editingId === p.id ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={e => e.stopPropagation()}>
                  <input type="range" min={0} max={100} value={sliderVal}
                    onChange={e => setSliderVal(Number(e.target.value))}
                    aria-label={`${T.progress[lang]} ${p.name}`}
                    style={{ flex: 1, accentColor: "#6366F1", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#6366F1", minWidth: 32, textAlign: "right" }}>{sliderVal}%</span>
                  <button onClick={() => confirmEdit(p)}
                    aria-label={lang === "es" ? "Confirmar" : "Confirm"}
                    style={{
                      background: "#6366F1", border: "none", borderRadius: 6,
                      padding: "4px 10px", fontSize: 11, color: "#fff", cursor: "pointer", fontWeight: 700,
                      boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                    }}>OK</button>
                  <button onClick={() => setEditingId(null)}
                    aria-label={lang === "es" ? "Cancelar edicion" : "Cancel editing"}
                    style={{
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
                      padding: "4px 8px", fontSize: 11, color: "rgba(255,255,255,0.5)", cursor: "pointer",
                    }}>X</button>
                </div>
              ) : (
                <ProgressBar value={p.progress} />
              )}
            </div>
            {/* Activity log */}
            {p.log && p.log.length > 0 && (
              <div style={{ marginBottom: 8, borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 6 }}>
                {p.log.slice(-2).map((entry, li) => (
                  <p key={li} style={{ margin: "2px 0", fontSize: 10, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
                    {entry.text} — {timeAgo(entry.ts, lang)}
                  </p>
                ))}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{T.budget[lang]}</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#FAFAFA" }}>{fmt(p.budget)}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{T.spent[lang]}</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: p.spent / p.budget > 0.9 ? "#EF4444" : "#10B981" }}>{fmt(p.spent)}</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {p.tags.map(t => (
                  <span key={t} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)", fontWeight: 600, letterSpacing: "0.05em" }}>{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
