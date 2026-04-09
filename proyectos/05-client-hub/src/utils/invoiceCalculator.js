export const fmt = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);

export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const calculateInvoiceTotals = (invoices) => {
  const total = invoices.reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter(i => i.status !== "Pagada").reduce((s, i) => s + i.amount, 0);
  return { total, pending };
};
