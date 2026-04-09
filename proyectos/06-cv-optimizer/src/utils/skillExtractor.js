import { SYNONYM_GROUPS } from './synonyms.js';

export function extractSkillsFromRawText(text) {
  const found = [];
  const seen = new Set();
  SYNONYM_GROUPS.forEach((group) => {
    for (const term of group) {
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(text)) {
        const canonical = group[0];
        if (!seen.has(canonical)) {
          seen.add(canonical);
          found.push(canonical.charAt(0).toUpperCase() + canonical.slice(1));
        }
        break;
      }
    }
  });
  return found;
}

export function extractExperienceFromRawText(text) {
  const entries = [];
  const datePatterns = [
    /(.{5,60}?)\s*[-\u2013\u2014|]\s*(.{3,60}?)\s*\(?\s*(\d{4})\s*[-\u2013\u2014]\s*(present|actual|actualidad|\d{4})\s*\)?/gi,
    /(.{5,60}?)\s*[-\u2013\u2014|]\s*(.{3,60}?)\s*\|?\s*([A-Z][a-z]{2,8}\s+\d{4})\s*[-\u2013\u2014]\s*(Present|Actual|Actualidad|[A-Z][a-z]{2,8}\s+\d{4})/gi,
  ];
  for (const pattern of datePatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const role = match[1].trim();
      const company = match[2].trim();
      const period = match[3] + ' - ' + match[4];
      if (role.length > 3 && !/^\d+$/.test(role)) {
        entries.push({ role, company, period, bullets: [] });
      }
    }
  }
  return entries;
}

export function extractEducationFromRawText(text) {
  const entries = [];
  const patterns = [
    /(?:licenciatura|bachelor|ingenier\u00eda|master|maestr\u00eda|mba|phd|doctorado|bootcamp|diplomado|t\u00e9cnico|b\.?s\.?|m\.?s\.?)\s+(?:en\s+|in\s+)?(.{3,60}?)\s*[-\u2013\u2014,]\s*(.{3,60}?)\s*\(?\s*(\d{4})\s*[-\u2013\u2014]\s*(\d{4}|present|actual|actualidad)\s*\)?/gi,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      entries.push({
        program: match[0].substring(0, match[0].indexOf(match[3])).replace(/[-\u2013\u2014,]\s*$/, '').trim(),
        institution: '',
        period: match[3] + ' - ' + match[4],
      });
    }
  }
  return entries;
}
