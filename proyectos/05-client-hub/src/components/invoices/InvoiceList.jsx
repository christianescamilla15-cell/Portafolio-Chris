import { motion } from "framer-motion";
import { T } from "../../constants/translations.js";
import { fmt } from "../../utils/invoiceCalculator.js";
import StatusBadge from "../common/StatusBadge.jsx";
import InvoicePdfButton from "./InvoicePdfButton.jsx";

const APPLE_EASE = [0.16, 1, 0.3, 1];

export default function InvoiceList({ invoices, onMarkPaid, onNewInvoice, lang }) {
  const total = invoices.reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter(i => i.status !== "Pagada").reduce((s, i) => s + i.amount, 0);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button onClick={onNewInvoice}
          aria-label={T.newInvoice[lang]}
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
          {T.newInvoice[lang]}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: T.totalBilled[lang], value: fmt(total), color: "#6366F1" },
          { label: T.outstanding[lang], value: fmt(pending), color: "#F59E0B", highlight: pending > 0 },
          { label: T.invoicesCount[lang], value: invoices.length, color: "#10B981" },
        ].map((k, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: APPLE_EASE }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: k.highlight ? `1px solid rgba(245,158,11,0.3)` : "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16, padding: "14px 18px",
              backdropFilter: "blur(12px)",
              boxShadow: k.highlight ? "0 0 20px rgba(245,158,11,0.08)" : "none",
              position: "relative", overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {k.highlight && (
              <span style={{
                position: "absolute", top: 8, right: 10,
                fontSize: 9, fontWeight: 800, color: "#fff",
                background: "#F59E0B", padding: "2px 8px", borderRadius: 10,
                letterSpacing: "0.05em",
              }}>
                {T.pending[lang]}
              </span>
            )}
            <p style={{ margin: "0 0 4px", fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{k.label}</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: k.color, fontFamily: "'DM Mono', monospace" }}>{k.value}</p>
          </motion.div>
        ))}
      </div>
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, overflow: "hidden",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto auto auto auto auto", padding: "10px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
          {[T.invoiceNo[lang], T.concept[lang], T.amount[lang], T.dueDate[lang], T.status[lang], T.invoicePdf[lang], T.action[lang]].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</span>
          ))}
        </div>
        {invoices.map((inv, i) => (
          <motion.div
            key={inv.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4, ease: APPLE_EASE }}
            style={{
              display: "grid", gridTemplateColumns: "1fr 2fr auto auto auto auto auto",
              padding: "13px 18px", borderBottom: i < invoices.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              alignItems: "center", gap: 8,
              transition: "background 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "#818CF8", fontFamily: "'DM Mono', monospace" }}>{inv.id}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{inv.concept}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#FAFAFA", fontFamily: "'DM Mono', monospace" }}>{fmt(inv.amount)}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{inv.dueDate}</span>
            <StatusBadge status={inv.status} lang={lang} />
            <InvoicePdfButton invoice={inv} lang={lang} />
            <div>
              {inv.status !== "Pagada" ? (
                <button onClick={() => onMarkPaid(inv.id)}
                  aria-label={`${T.markPaid[lang]} ${inv.id}`}
                  style={{
                    background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 6,
                    padding: "4px 10px", fontSize: 10, fontWeight: 700, color: "#4ADE80",
                    cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,197,94,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(34,197,94,0.1)"; }}
                >
                  {T.markPaid[lang]}
                </button>
              ) : (
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>—</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
