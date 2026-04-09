import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { T } from "../../constants/translations.js";
import { fmt } from "../../utils/invoiceCalculator.js";
import ProgressBar from "../common/ProgressBar.jsx";

const APPLE_EASE = [0.16, 1, 0.3, 1];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: APPLE_EASE },
  }),
};

function AnimatedValue({ value, prefix = "", isCurrency = false }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const numericVal = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]/g, "")) : value;
    if (isNaN(numericVal)) { setDisplay(value); return; }
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (numericVal - start) * eased);
      if (isCurrency) {
        setDisplay(`$${current.toLocaleString("en-US")}`);
      } else {
        setDisplay(current);
      }
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, isCurrency]);

  return <>{prefix}{display}</>;
}

export default function DashboardView({ projects, invoices, tickets, documents, recentActions, lang }) {
  const activeProjects = projects.filter(p => p.status !== "Completado").length;
  const pendingInvoicesTotal = invoices.filter(i => i.status !== "Pagada").reduce((s, i) => s + i.amount, 0);
  const openTickets = tickets.filter(t => t.status !== "Resuelto").length;

  const kpis = [
    { label: T.kpiActiveProjects[lang], value: activeProjects, color: "#6366F1", icon: "\u25C8", isCurrency: false },
    { label: T.kpiPendingInvoices[lang], value: pendingInvoicesTotal, color: "#F59E0B", icon: "\u25CE", isCurrency: true },
    { label: T.kpiOpenTickets[lang], value: openTickets, color: "#EF4444", icon: "\u25C9", isCurrency: false },
    { label: T.kpiDocuments[lang], value: documents.length, color: "#10B981", icon: "\u25EB", isCurrency: false },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16, padding: "18px 20px",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              cursor: "default",
            }}
            whileHover={{ y: -3, boxShadow: `0 8px 30px ${k.color}15` }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 18, color: k.color, filter: `drop-shadow(0 0 6px ${k.color}40)` }}>{k.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{k.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: k.color, fontFamily: "'DM Mono', monospace" }}>
              <AnimatedValue value={k.value} isCurrency={k.isCurrency} />
            </p>
          </motion.div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Project Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: APPLE_EASE }}
          style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: 20,
            backdropFilter: "blur(12px)",
          }}
        >
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#FAFAFA" }}>{T.projectOverview[lang]}</h3>
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.06, duration: 0.4, ease: APPLE_EASE }}
              style={{ marginBottom: i < projects.length - 1 ? 12 : 0 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{p.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: p.progress === 100 ? "#22C55E" : "#6366F1" }}>{p.progress}%</span>
              </div>
              <ProgressBar value={p.progress} />
            </motion.div>
          ))}
        </motion.div>
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: APPLE_EASE }}
          style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: 20,
            backdropFilter: "blur(12px)",
          }}
        >
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#FAFAFA" }}>{T.recentActivity[lang]}</h3>
          {recentActions.length === 0 ? (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>{T.noRecentActivity[lang]}</p>
          ) : (
            <div style={{ maxHeight: 240, overflowY: "auto" }}>
              {[...recentActions].reverse().slice(0, 10).map((action, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.04, duration: 0.35, ease: APPLE_EASE }}
                  style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, paddingBottom: 10, borderBottom: i < 9 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366F1", marginTop: 5, flexShrink: 0, boxShadow: "0 0 6px rgba(99,102,241,0.4)" }} />
                  <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{typeof action === 'string' ? action : action.text}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
