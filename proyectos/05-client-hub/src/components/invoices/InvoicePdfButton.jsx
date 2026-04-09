import { T } from "../../constants/translations.js";
import { generateInvoiceHTML } from "../../utils/invoicePdfGenerator.js";

export default function InvoicePdfButton({ invoice, lang }) {
  const handleGeneratePdf = (e) => {
    e.stopPropagation();
    const html = generateInvoiceHTML(invoice, lang);
    const pdfWindow = window.open("", "_blank");
    if (pdfWindow) {
      pdfWindow.document.write(html);
      pdfWindow.document.close();
    }
  };

  return (
    <button
      onClick={handleGeneratePdf}
      aria-label={`${T.generatePdf[lang]} ${invoice.id}`}
      style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6,
        padding: "4px 10px", fontSize: 10, fontWeight: 700, color: "#818CF8",
        cursor: "pointer", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", whiteSpace: "nowrap",
        backdropFilter: "blur(12px)",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
    >
      {T.generatePdf[lang]}
    </button>
  );
}
