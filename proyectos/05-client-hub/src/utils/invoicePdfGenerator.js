import { fmt } from "./invoiceCalculator.js";

/**
 * Generates print-ready HTML for an invoice.
 * @param {object} invoice - Invoice object with id, date, concept, amount, status, dueDate
 * @param {string} lang - "es" or "en"
 * @returns {string} Full HTML document string
 */
export function generateInvoiceHTML(invoice, lang = "es") {
  const isEs = lang === "es";

  const labels = {
    title: isEs ? "Factura" : "Invoice",
    invoiceNo: isEs ? "No. Factura" : "Invoice No.",
    date: isEs ? "Fecha" : "Date",
    dueDate: isEs ? "Vencimiento" : "Due Date",
    status: isEs ? "Estado" : "Status",
    billTo: isEs ? "Facturar a" : "Bill To",
    from: isEs ? "De" : "From",
    concept: isEs ? "Concepto" : "Concept",
    amount: isEs ? "Monto" : "Amount",
    subtotal: "Subtotal",
    tax: isEs ? "IVA (16%)" : "Tax (16%)",
    total: "Total",
    paymentTerms: isEs ? "Terminos de Pago" : "Payment Terms",
    paymentTermsText: isEs
      ? "Pago a 15 dias naturales a partir de la fecha de emision. Transferencia bancaria o deposito."
      : "Payment due within 15 calendar days from issue date. Bank transfer or deposit.",
    currency: "MXN",
    companyName: "Impulso IA",
    companyAddress: "Ciudad de Mexico, Mexico",
    companyEmail: "contacto@impulso-ia.com",
    clientName: "Empresa Demo S.A.",
    clientAddress: "Monterrey, Nuevo Leon, Mexico",
  };

  const subtotal = invoice.amount;
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${labels.title} ${invoice.id}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; color: #1a1a2e; background: #fff; padding: 40px; max-width: 800px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #6366F1; }
  .logo { font-size: 28px; font-weight: 800; color: #0F172A; letter-spacing: -0.04em; }
  .logo span { color: #6366F1; }
  .invoice-title { font-size: 32px; font-weight: 800; color: #6366F1; text-align: right; }
  .invoice-id { font-size: 14px; color: #64748B; text-align: right; margin-top: 4px; }
  .meta { display: flex; justify-content: space-between; margin-bottom: 36px; }
  .meta-block { }
  .meta-block h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #94A3B8; margin-bottom: 8px; font-weight: 700; }
  .meta-block p { font-size: 13px; color: #334155; line-height: 1.6; }
  .meta-block .name { font-weight: 700; font-size: 14px; color: #0F172A; }
  .details { display: flex; gap: 40px; margin-bottom: 36px; }
  .detail-item { }
  .detail-item .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #94A3B8; font-weight: 700; }
  .detail-item .value { font-size: 14px; font-weight: 600; color: #0F172A; margin-top: 2px; }
  .status-badge { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .status-pagada { background: #F0FDF4; color: #15803D; }
  .status-pendiente { background: #FFF7ED; color: #C2410C; }
  .status-vencida { background: #FFF1F2; color: #BE123C; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  thead th { background: #F8FAFC; padding: 10px 16px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #94A3B8; font-weight: 700; border-bottom: 2px solid #E2E8F0; }
  thead th:last-child { text-align: right; }
  tbody td { padding: 14px 16px; font-size: 13px; color: #334155; border-bottom: 1px solid #F1F5F9; }
  tbody td:last-child { text-align: right; font-family: 'Courier New', monospace; font-weight: 600; }
  .totals { display: flex; justify-content: flex-end; margin-bottom: 36px; }
  .totals-table { width: 280px; }
  .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #64748B; }
  .totals-row.total { border-top: 2px solid #6366F1; padding-top: 10px; margin-top: 6px; font-size: 18px; font-weight: 800; color: #0F172A; }
  .totals-row .val { font-family: 'Courier New', monospace; font-weight: 600; }
  .payment-terms { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px 20px; margin-bottom: 30px; }
  .payment-terms h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #94A3B8; font-weight: 700; margin-bottom: 6px; }
  .payment-terms p { font-size: 12px; color: #64748B; line-height: 1.6; }
  .footer { text-align: center; font-size: 10px; color: #CBD5E1; padding-top: 20px; border-top: 1px solid #F1F5F9; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="logo">client<span>hub</span></div>
    <p style="font-size:10px;color:#94A3B8;margin-top:2px;">powered by Impulso IA</p>
  </div>
  <div>
    <div class="invoice-title">${labels.title}</div>
    <div class="invoice-id">${invoice.id}</div>
  </div>
</div>

<div class="meta">
  <div class="meta-block">
    <h4>${labels.from}</h4>
    <p class="name">${labels.companyName}</p>
    <p>${labels.companyAddress}</p>
    <p>${labels.companyEmail}</p>
  </div>
  <div class="meta-block">
    <h4>${labels.billTo}</h4>
    <p class="name">${labels.clientName}</p>
    <p>${labels.clientAddress}</p>
  </div>
</div>

<div class="details">
  <div class="detail-item">
    <div class="label">${labels.invoiceNo}</div>
    <div class="value">${invoice.id}</div>
  </div>
  <div class="detail-item">
    <div class="label">${labels.date}</div>
    <div class="value">${invoice.date}</div>
  </div>
  <div class="detail-item">
    <div class="label">${labels.dueDate}</div>
    <div class="value">${invoice.dueDate}</div>
  </div>
  <div class="detail-item">
    <div class="label">${labels.status}</div>
    <div class="value"><span class="status-badge status-${invoice.status.toLowerCase()}">${invoice.status}</span></div>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th>${labels.concept}</th>
      <th>${labels.amount} (${labels.currency})</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${invoice.concept}</td>
      <td>${fmt(invoice.amount)}</td>
    </tr>
  </tbody>
</table>

<div class="totals">
  <div class="totals-table">
    <div class="totals-row"><span>${labels.subtotal}</span><span class="val">${fmt(subtotal)}</span></div>
    <div class="totals-row"><span>${labels.tax}</span><span class="val">${fmt(tax)}</span></div>
    <div class="totals-row total"><span>${labels.total}</span><span class="val">${fmt(total)}</span></div>
  </div>
</div>

<div class="payment-terms">
  <h4>${labels.paymentTerms}</h4>
  <p>${labels.paymentTermsText}</p>
</div>

<div class="footer">
  ${labels.companyName} &mdash; ${labels.companyAddress} &mdash; ${labels.companyEmail}
</div>
</body>
</html>`;
}
