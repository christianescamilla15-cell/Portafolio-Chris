import { motion } from "framer-motion";
import { T } from "../../constants/translations.js";

const APPLE_EASE = [0.16, 1, 0.3, 1];

const inputStyle = {
  width: "100%", borderRadius: 12, padding: "9px 12px", fontSize: 13,
  color: "#FAFAFA", background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  fontFamily: "'DM Sans', sans-serif",
  transition: "border-color 0.3s, box-shadow 0.3s",
};

const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)",
  marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em",
};

export default function InvoiceForm({
  lang, invConcept, invAmount, invDueDate, invError,
  onConceptChange, onAmountChange, onDueDateChange,
  onSubmit, onClose
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      }} onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.35, ease: APPLE_EASE }}
        onClick={e => e.stopPropagation()} role="dialog" aria-modal="true"
        style={{
          background: "rgba(20,20,25,0.95)", borderRadius: 20, padding: 28,
          width: 440, border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          backdropFilter: "blur(20px)",
        }}
      >
        <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: "#FAFAFA" }}>{T.newInvoiceTitle[lang]}</h3>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>{T.conceptLabel[lang]}</label>
          <input
            value={invConcept}
            onChange={e => onConceptChange(e.target.value)}
            aria-label={T.conceptLabel[lang]}
            style={{ ...inputStyle, borderColor: invError && !invConcept.trim() ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)" }}
            placeholder={T.conceptPlaceholder[lang]}
            onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>{T.amountLabel[lang]}</label>
          <input
            type="number"
            value={invAmount}
            onChange={e => onAmountChange(e.target.value)}
            aria-label={T.amountLabel[lang]}
            style={inputStyle}
            placeholder={T.amountPlaceholder[lang]}
            min="0"
            onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>{T.dueDateLabel[lang]}</label>
          <input
            type="date"
            value={invDueDate}
            onChange={e => onDueDateChange(e.target.value)}
            aria-label={T.dueDateLabel[lang]}
            style={{ ...inputStyle, colorScheme: "dark" }}
            onFocus={e => { e.target.style.borderColor = "rgba(99,102,241,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {invError && (
          <p style={{ margin: "0 0 10px", fontSize: 11, color: "#F87171" }}>{invError}</p>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
          <button onClick={onClose} aria-label={T.cancel[lang]} style={{
            padding: "9px 18px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, background: "rgba(255,255,255,0.03)",
            fontSize: 13, cursor: "pointer", color: "rgba(255,255,255,0.5)", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            backdropFilter: "blur(12px)",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
          >
            {T.cancel[lang]}
          </button>
          <button onClick={onSubmit} aria-label={T.createInvoice[lang]} style={{
            padding: "9px 18px", border: "none", borderRadius: 12, background: "#6366F1",
            fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#fff",
            boxShadow: "0 4px 16px rgba(99,102,241,0.4)", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(99,102,241,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.4)"; }}
          >
            {T.createInvoice[lang]}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
