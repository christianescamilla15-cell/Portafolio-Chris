// ─── HISTORY & ANALYTICS HELPERS ─────────────────────────────────────────────

const HISTORY_KEY = "cs_history";
const MAX_HISTORY = 20;
const STATS_KEY = "cs_stats";

export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
}

export function saveToHistory(entry) {
  const hist = loadHistory();
  hist.unshift(entry);
  if (hist.length > MAX_HISTORY) hist.length = MAX_HISTORY;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
  return hist;
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function loadStats() {
  try { return JSON.parse(localStorage.getItem(STATS_KEY) || '{"total":0,"platforms":{},"tones":{},"formats":{},"ai":0,"template":0}'); } catch { return { total: 0, platforms: {}, tones: {}, formats: {}, ai: 0, template: 0 }; }
}

export function trackGeneration(platform, tone, format, usedAI) {
  const st = loadStats();
  st.total++;
  st.platforms[platform] = (st.platforms[platform] || 0) + 1;
  st.tones[tone] = (st.tones[tone] || 0) + 1;
  st.formats[format] = (st.formats[format] || 0) + 1;
  if (usedAI) st.ai++; else st.template++;
  localStorage.setItem(STATS_KEY, JSON.stringify(st));
  return st;
}

export function topEntry(obj) {
  let top = "-", max = 0;
  for (const [k, v] of Object.entries(obj || {})) { if (v > max) { max = v; top = k; } }
  return top;
}
