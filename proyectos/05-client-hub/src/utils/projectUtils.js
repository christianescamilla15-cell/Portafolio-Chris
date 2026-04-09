import { T } from "../constants/translations.js";

export const timeAgo = (ts, lang = "es") => {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return T.justNow[lang];
  if (mins < 60) return T.minsAgo[lang](mins);
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return T.hoursAgo[lang](hrs);
  return T.daysAgo[lang](Math.floor(hrs / 24));
};

export const generateNotifications = (invoices, tickets, projects, lang) => {
  const notifs = [];
  invoices.forEach(inv => {
    if (inv.status === "Vencida") {
      notifs.push({ id: `notif-inv-${inv.id}`, type: "overdue", text: T.notifOverdueInv[lang](inv.id), ts: Date.now() - 3600000, read: false });
    }
  });
  tickets.forEach(t => {
    if (t.priority === "Alta" && t.status === "Abierto") {
      notifs.push({ id: `notif-tkt-${t.id}`, type: "ticket", text: T.notifHighTicket[lang](t.id), ts: Date.now() - 7200000, read: false });
    }
  });
  projects.forEach(p => {
    if (p.progress >= 90 && p.progress < 100) {
      notifs.push({ id: `notif-prj-${p.id}`, type: "milestone", text: T.notifMilestone[lang](p.name, p.progress), ts: Date.now() - 1800000, read: false });
    }
  });
  return notifs;
};
