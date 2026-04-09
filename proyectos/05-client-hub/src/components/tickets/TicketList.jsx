import { useState } from "react";
import { motion } from "framer-motion";
import { T, tPriority } from "../../constants/translations.js";
import { PRIORITY_COLORS } from "../../constants/colors.js";
import { timeAgo } from "../../utils/projectUtils.js";
import StatusBadge from "../common/StatusBadge.jsx";

const APPLE_EASE = [0.16, 1, 0.3, 1];

export default function TicketList({ tickets, onNewTicket, onChangeStatus, onAddComment, lang }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [commentText, setCommentText] = useState("");

  const handleAddComment = (ticketId) => {
    if (!commentText.trim()) return;
    onAddComment(ticketId, commentText.trim());
    setCommentText("");
  };

  if (selectedTicket) {
    const t = tickets.find(tk => tk.id === selectedTicket);
    if (!t) { setSelectedTicket(null); return null; }
    return (
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: APPLE_EASE }}
      >
        <button onClick={() => setSelectedTicket(null)}
          aria-label={T.backToList[lang]}
          style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8,
            padding: "6px 14px", fontSize: 12, color: "rgba(255,255,255,0.5)", cursor: "pointer", marginBottom: 14,
            fontFamily: "'DM Sans', sans-serif", backdropFilter: "blur(12px)",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
        >&larr; {T.backToList[lang]}</button>
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16,
          padding: 24, backdropFilter: "blur(12px)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#FAFAFA" }}>{t.title}</p>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{t.id} &middot; {t.project} &middot; {t.createdTs ? timeAgo(t.createdTs, lang) : t.created}</p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: PRIORITY_COLORS[t.priority] }}>&#9679; {tPriority(t.priority, lang)}</span>
              <StatusBadge status={t.status} lang={lang} />
            </div>
          </div>
          {t.assignee && (
            <p style={{ margin: "0 0 12px", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{T.assignTo[lang]}: <strong style={{ color: "#FAFAFA" }}>{t.assignee}</strong></p>
          )}
          {t.description && <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{t.description}</p>}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
            <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#FAFAFA" }}>Thread ({(t.comments || []).length})</h4>
            <div style={{ maxHeight: 220, overflowY: "auto", marginBottom: 12 }}>
              {(t.comments || []).map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: APPLE_EASE }}
                  style={{
                    display: "flex", gap: 10, marginBottom: 10, padding: "8px 12px",
                    background: "rgba(255,255,255,0.03)", borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#818CF8", flexShrink: 0 }}>
                    {c.author.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{c.author}</span>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{timeAgo(c.ts, lang)}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{c.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleAddComment(t.id); }}
                placeholder={T.commentPlaceholder[lang]}
                aria-label={T.commentPlaceholder[lang]}
                style={{
                  flex: 1, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                  padding: "8px 12px", fontSize: 12, color: "#FAFAFA",
                  fontFamily: "'DM Sans', sans-serif",
                  background: "rgba(255,255,255,0.03)",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                }}
                onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
              />
              <button onClick={() => handleAddComment(t.id)}
                aria-label={T.addComment[lang]}
                style={{
                  background: "#6366F1", border: "none", borderRadius: 8, padding: "8px 16px",
                  fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                }}>{T.addComment[lang]}</button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button onClick={onNewTicket}
          aria-label={T.newTicket[lang]}
          style={{
            background: "#6366F1", border: "none", borderRadius: 12,
            padding: "9px 18px", fontSize: 12, fontWeight: 700,
            color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(99,102,241,0.45)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.35)"; }}
        >
          {T.newTicket[lang]}
        </button>
      </div>
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, overflow: "hidden",
        backdropFilter: "blur(12px)",
      }}>
        {tickets.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4, ease: APPLE_EASE }}
            onClick={() => setSelectedTicket(t.id)}
            role="button" tabIndex={0} aria-label={`${t.title} — ${t.id}`}
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedTicket(t.id); } }}
            style={{
              display: "grid", gridTemplateColumns: "auto 1fr auto auto auto",
              padding: "14px 18px", borderBottom: i < tickets.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              alignItems: "center", gap: 14,
              transition: "background 0.3s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace" }}>{t.id}</span>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 600, color: "#FAFAFA" }}>{t.title}</p>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{t.project} &middot; {t.createdTs ? timeAgo(t.createdTs, lang) : t.created}{t.assignee ? ` &middot; ${t.assignee}` : ""}</p>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: PRIORITY_COLORS[t.priority] }}>&#9679; {tPriority(t.priority, lang)}</span>
            <StatusBadge status={t.status} lang={lang} />
            <div>
              {t.status !== "Resuelto" ? (
                <button onClick={(e) => { e.stopPropagation(); onChangeStatus(t.id); }}
                  aria-label={`${t.status === "Abierto" ? T.start[lang] : T.resolve[lang]} ${t.id}`}
                  style={{
                    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 6,
                    padding: "4px 10px", fontSize: 10, fontWeight: 700, color: "#818CF8",
                    cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; }}
                >
                  {t.status === "Abierto" ? T.start[lang] : T.resolve[lang]}
                </button>
              ) : (
                <span style={{ fontSize: 10, color: "#4ADE80", fontWeight: 600 }}>{T.closed[lang]}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
