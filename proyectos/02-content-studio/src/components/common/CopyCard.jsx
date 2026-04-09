import { useState, memo } from "react";

const CopyCard = memo(function CopyCard({ label, content, accent, onCopied, s }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(Array.isArray(content) ? content.map(t => `#${t}`).join(" ") : content);
    setCopied(true);
    if (onCopied) onCopied(s ? s.copiedToClipboard(label) : `"${label}" copiado al portapapeles`);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 16, padding: "14px 16px",
      marginBottom: 10,
      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", color: accent,
          fontFamily: "'DM Mono', monospace",
        }}>{label}</span>
        <button onClick={copy} aria-label={`${s ? s.copy : "Copiar"} ${label}`} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 11, color: copied ? "#4ADE80" : "rgba(255,255,255,0.3)",
          fontFamily: "sans-serif", transition: "color 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          {copied ? `\u2713 ${s ? s.copied : "Copiado"}` : (s ? s.copy : "Copiar")}
        </button>
      </div>
      <p style={{
        margin: 0, fontSize: 13, lineHeight: 1.65,
        color: "#E2E8F0", fontFamily: "'DM Sans', sans-serif",
      }}>
        {Array.isArray(content) ? content.map(t => `#${t}`).join(" ") : content}
      </p>
    </div>
  );
});

export default CopyCard;
