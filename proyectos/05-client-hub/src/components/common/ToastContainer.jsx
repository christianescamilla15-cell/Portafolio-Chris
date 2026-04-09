import { motion, AnimatePresence } from "framer-motion";

const APPLE_EASE = [0.16, 1, 0.3, 1];

const TOAST_STYLES = {
  success: { bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)", color: "#4ADE80" },
  error:   { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", color: "#F87171" },
  info:    { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)", color: "#60A5FA" },
};

export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      <AnimatePresence>
        {toasts.map(t => {
          const s = TOAST_STYLES[t.type] || TOAST_STYLES.info;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.95 }}
              transition={{ duration: 0.3, ease: APPLE_EASE }}
              style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                color: s.color,
                borderRadius: 16, padding: "12px 18px", fontSize: 13, fontWeight: 600,
                boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                display: "flex", alignItems: "center", gap: 10,
                minWidth: 280, maxWidth: 400, fontFamily: "'DM Sans', sans-serif",
                backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <span style={{ fontSize: 16 }}>{t.type === "success" ? "\u2713" : t.type === "error" ? "\u2717" : "\u2139"}</span>
              <span style={{ flex: 1 }}>{t.message}</span>
              <button onClick={() => onDismiss(t.id)} style={{
                background: "none", border: "none", cursor: "pointer", fontSize: 14,
                color: "inherit", opacity: 0.6, padding: 0, lineHeight: 1,
              }}>&times;</button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
