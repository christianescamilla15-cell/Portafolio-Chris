// ─── LOCALSTORAGE PERSISTENCE ─────────────────────────────────────────────────
export const LS_KEYS = {
  projects: 'ch_projects',
  invoices: 'ch_invoices',
  tickets: 'ch_tickets',
  documents: 'ch_documents',
  actions: 'ch_actions',
  apiKey: 'ch_claude_key',
};

export const lsGet = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

export const lsSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota */ }
};
