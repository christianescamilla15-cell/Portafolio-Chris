// ─── TEMPLATE SAVE/LOAD MANAGEMENT ───────────────────────────────────────────

const TEMPLATES_KEY = "content-studio-templates";
const MAX_TEMPLATES = 20;

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(TEMPLATES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveToStorage(templates) {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

export function saveTemplate(name, config) {
  const templates = loadFromStorage();
  if (templates.length >= MAX_TEMPLATES) {
    return { error: "max", templates };
  }
  const entry = {
    name,
    brand: config.brand || "",
    platform: config.platform || "instagram",
    tone: config.tone || "Profesional",
    format: config.format || "Producto",
    timestamp: new Date().toISOString(),
  };
  templates.unshift(entry);
  saveToStorage(templates);
  return { error: null, templates };
}

export function loadTemplates() {
  return loadFromStorage();
}

export function deleteTemplate(index) {
  const templates = loadFromStorage();
  if (index >= 0 && index < templates.length) {
    templates.splice(index, 1);
    saveToStorage(templates);
  }
  return templates;
}

export { MAX_TEMPLATES };
