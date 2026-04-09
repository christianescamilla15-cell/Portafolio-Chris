import { SYNONYM_GROUPS, synonymLookup } from './synonyms.js';

// ─────────────────────────────────────────────
// STOP WORDS
// ─────────────────────────────────────────────
const STOP_WORDS_EN = new Set([
  'the','a','an','and','or','but','is','are','was','were','be','been','being',
  'have','has','had','do','does','did','will','would','shall','should','may',
  'might','can','could','must','need','to','of','in','for','on','with','at',
  'by','from','as','into','through','during','before','after','above','below',
  'between','out','off','over','under','again','further','then','once','here',
  'there','when','where','why','how','all','each','every','both','few','more',
  'most','other','some','such','no','nor','not','only','own','same','so',
  'than','too','very','just','about','also','if','it','its','we','our','you',
  'your','they','their','this','that','these','those','what','which','who',
  'whom','up','down','i','me','my','he','him','his','she','her',
]);
const STOP_WORDS_ES = new Set([
  'el','la','los','las','un','una','unos','unas','y','o','pero','es','son',
  'fue','era','ser','estar','haber','ha','han','hacer','como','para','por',
  'con','en','de','del','al','a','su','sus','se','que','si','no','m\u00e1s',
  'muy','ya','lo','le','les','nos','te','me','mi','tu','yo','\u00e9l','ella',
  'ellos','ellas','este','esta','estos','estas','ese','esa','esos','esas',
  'un','uno','todo','toda','todos','todas','otro','otra','otros','otras',
  'sobre','entre','desde','hasta','sin','hacia','seg\u00fan','durante','contra',
  'tambi\u00e9n','puede','donde','cuando','porque','cada','e','u',
]);

const WEIGHT_MARKERS_HIGH = [
  'required','indispensable','must have','must-have','obligatorio','imprescindible',
  'necesario','essential','mandatory','excluyente',
];
const WEIGHT_MARKERS_LOW = [
  'desirable','nice to have','nice-to-have','preferred','preferible','deseable',
  'valorable','plus','bonus','idealmente','ideally',
];

export function extractKeywords(text) {
  // Normalize
  const normalized = text
    .toLowerCase()
    .replace(/[\u2022\-\u2013\u2014]/g, ' ')
    .replace(/[()[\]{}<>]/g, ' ')
    .replace(/[,;:]/g, ' ')
    .replace(/\s+/g, ' ');

  const keywords = [];
  const seen = new Set();

  // Check each synonym group against the full text
  SYNONYM_GROUPS.forEach((group) => {
    for (const term of group) {
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(normalized)) {
        const canonical = group[0];
        if (!seen.has(canonical)) {
          seen.add(canonical);
          // Determine weight by checking surrounding context
          let weight = 1.5; // default
          const termIdx = normalized.indexOf(term);
          const context = normalized.substring(Math.max(0, termIdx - 80), termIdx + term.length + 80);
          if (WEIGHT_MARKERS_HIGH.some((m) => context.includes(m))) weight = 2;
          else if (WEIGHT_MARKERS_LOW.some((m) => context.includes(m))) weight = 1;
          keywords.push({ term: canonical, weight, matchedAs: term });
        }
        break;
      }
    }
  });

  // Also extract standalone tokens not in synonym groups (2+ chars, not stop words)
  const tokens = normalized.split(/\s+/);
  tokens.forEach((t) => {
    if (t.length < 3) return;
    if (STOP_WORDS_EN.has(t) || STOP_WORDS_ES.has(t)) return;
    if (seen.has(t)) return;
    if (synonymLookup.has(t)) return; // already captured via group
    // skip purely numeric
    if (/^\d+$/.test(t)) return;
  });

  return keywords;
}

// ─────────────────────────────────────────────
// YEARS OF EXPERIENCE EXTRACTION
// ─────────────────────────────────────────────
export function extractYearsRequired(text) {
  const patterns = [
    /(\d+)\+?\s*(?:years?|a\u00f1os?)\s*(?:of\s*)?(?:experience|experiencia)/i,
    /(?:experience|experiencia)\s*(?:of\s*)?(\d+)\+?\s*(?:years?|a\u00f1os?)/i,
    /(\d+)\+?\s*(?:years?|a\u00f1os?)\s*(?:de\s*)?(?:experience|experiencia)/i,
    /m\u00ednimo\s*(\d+)\s*(?:years?|a\u00f1os?)/i,
    /minimum\s*(\d+)\s*(?:years?|a\u00f1os?)/i,
    /at\s*least\s*(\d+)\s*(?:years?|a\u00f1os?)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return parseInt(m[1], 10);
  }
  return null;
}

export function extractYearsFromCV(text) {
  const patterns = [
    /(\d+)\+?\s*(?:years?|a\u00f1os?)\s*(?:of\s*)?(?:experience|experiencia)/i,
    /(\d{4})\s*[-\u2013]\s*(?:present|actual|actualidad|current)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      if (m[1].length === 4) {
        return new Date().getFullYear() - parseInt(m[1], 10);
      }
      return parseInt(m[1], 10);
    }
  }
  // Try to find date ranges and sum
  const rangePattern = /(\d{4})\s*[-\u2013]\s*(\d{4})/g;
  let totalYears = 0;
  let match;
  while ((match = rangePattern.exec(text)) !== null) {
    totalYears += parseInt(match[2], 10) - parseInt(match[1], 10);
  }
  return totalYears > 0 ? totalYears : null;
}

// ─────────────────────────────────────────────
// EDUCATION EXTRACTION
// ─────────────────────────────────────────────
const EDUCATION_LEVELS = {
  phd: 4, doctorado: 4, doctorate: 4,
  master: 3, 'maestr\u00eda': 3, maestria: 3, msc: 3, mba: 3, postgrado: 3, posgrado: 3,
  bachelor: 2, licenciatura: 2, grado: 2, bsc: 2, ba: 2, 't\u00edtulo': 2, titulo: 2, ingeniero: 2, 'ingenier\u00eda': 2, ingenieria: 2,
  bootcamp: 1, diploma: 1, certificado: 1, certification: 1, 'certificaci\u00f3n': 1, associate: 1, 't\u00e9cnico': 1, tecnico: 1,
};

export function extractEducationLevel(text) {
  const lower = text.toLowerCase();
  let maxLevel = 0;
  let label = null;
  for (const [key, level] of Object.entries(EDUCATION_LEVELS)) {
    if (lower.includes(key) && level > maxLevel) {
      maxLevel = level;
      label = key;
    }
  }
  return { level: maxLevel, label };
}
