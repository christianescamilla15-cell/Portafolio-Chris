// ─── PLATFORM, TONE, FORMAT DEFINITIONS ─────────────────────────────────────

export const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: "\ud83d\udcf8", dims: "1080\u00d71080", ratio: "1:1" },
  { id: "twitter",   label: "Twitter/X",  icon: "\ud835\udd4f",  dims: "1200\u00d7675",  ratio: "16:9" },
  { id: "linkedin",  label: "LinkedIn",   icon: "\ud83d\udcbc", dims: "1200\u00d7627",  ratio: "1.91:1" },
  { id: "facebook",  label: "Facebook",   icon: "\ud83d\udc65", dims: "1200\u00d7630",  ratio: "1.91:1" },
];

export const TONES = ["Profesional", "Inspirador", "Urgente", "Divertido", "Minimalista"];
export const FORMATS = ["Producto", "Servicio", "Evento", "Oferta", "Branding"];

export const BRAND_MIN = 20;
export const BRAND_MAX = 500;

// ─── HEX VALIDATOR ───────────────────────────────────────────────────────────
export const isValidHex = (c) => /^#([0-9A-Fa-f]{3}){1,2}$/.test(c);
export const safeHex = (c, fallback) => isValidHex(c) ? c : fallback;
