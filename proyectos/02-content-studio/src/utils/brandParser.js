// ─── BRAND PARSER ────────────────────────────────────────────────────────────
import { INDUSTRY_KEYWORDS } from '../constants/industryData.js';

export function parseBrand(brand) {
  const text = brand.trim();
  const lower = text.toLowerCase();
  const words = text.split(/\s+/);

  // Product name: quoted text, or first significant phrase up to 4 words
  const quotedMatch = text.match(/[""\u201C]([^""\u201D]+)[""\u201D]/) || text.match(/"([^"]+)"/);
  const stopwords = new Set(["de", "del", "la", "el", "los", "las", "un", "una", "unos", "unas", "y", "o", "e", "a", "en", "con", "por", "para", "que", "es", "su", "se", "al", "lo", "más", "muy", "sin", "ni", "como", "nos", "te", "mi", "tu", "ser", "está", "son"]);
  const meaningfulWords = words.filter(w => !stopwords.has(w.toLowerCase()) && w.length > 2);
  const productName = quotedMatch ? quotedMatch[1] : words.slice(0, Math.min(4, words.length)).join(" ");

  // Extract benefit (after "que", "that", "which")
  const benefitMatch = text.match(/(?:que|that|which)\s+(.{10,60}?)(?:\.|,|$)/i);
  const benefit = benefitMatch ? benefitMatch[1].trim() : "";

  // Extract audience (after "para", "for")
  const audienceMatch = text.match(/(?:para|for)\s+(.{5,40}?)(?:\s+(?:que|con|with|that)|,|\.|$)/i);
  const audience = audienceMatch ? audienceMatch[1].trim() : "";

  // Extract key descriptors
  const descriptorWords = ["innovador","adaptativa","inteligente","personalizado","profesional","premium","avanzado","automatizado","smart","intelligent","personalized","advanced","automated","innovative","AI","IA","rápido","eficiente","seguro","moderno","único","exclusivo","potente","fácil","simple","completo","escalable","colaborativo","interactivo","dinámico"];
  const descriptors = descriptorWords.filter(d => lower.includes(d.toLowerCase()));

  // Extract numbers/stats
  const numbers = text.match(/\d+\s*(?:minutos?|minutes?|horas?|hours?|días?|days?|%|usuarios?|users?|sesiones?|sessions?)/gi) || [];

  // Benefits: words/phrases after benefit-indicating verbs (keep for compatibility)
  const benefitPatterns = /(?:que|para|con|permite|ayuda a?|logra|ofrece|brinda|genera|mejora|reduce|aumenta|optimiza|facilita|transforma|elimina|garantiza|asegura)\s+([^,.;]+)/gi;
  const benefits = [];
  let m;
  while ((m = benefitPatterns.exec(text)) !== null) {
    const b = m[1].trim();
    if (b.length > 3 && b.split(/\s+/).length <= 10) benefits.push(b);
  }

  // Target audience keywords (keep for compatibility)
  const audiencePatterns = /(?:para|dirigido a|enfocado en|diseñado para|ideal para|orientado a)\s+([^,.;]+)/gi;
  const audiences = [];
  while ((m = audiencePatterns.exec(text)) !== null) {
    audiences.push(m[1].trim());
  }

  // Industry detection
  const lowerText = text.toLowerCase();
  let detectedIndustry = "general";
  let maxScore = 0;
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    const score = keywords.filter(kw => lowerText.includes(kw)).length;
    if (score > maxScore) {
      maxScore = score;
      detectedIndustry = industry;
    }
  }

  // Value proposition: try to extract the core promise
  const valueMatch = text.match(/(?:que\s+)(.{10,60}?)(?:\.|,|$)/i);
  const valueProp = valueMatch ? valueMatch[1].trim() : (benefits[0] || meaningfulWords.filter(w => w.length > 3).slice(0, 4).join(" "));

  return { productName, benefit, audience, descriptors, numbers, benefits, audiences, detectedIndustry, valueProp, meaningfulWords, raw: text };
}

// ─── DEEP BRAND PARSER ──────────────────────────────────────────────────────
// Extracts EVERYTHING meaningful from the brand text so generated content
// traces directly back to the user's own words.
export function deepParseBrand(text, lang) {
  const sentences = text.split(/[.,;!\n]+/).map(s => s.trim()).filter(s => s.length > 3);
  const firstPhrase = sentences[0] || text.slice(0, 60);

  // Product name: text before "para", "que", "con", "for", "that", "with"
  const productMatch = text.match(/^(.+?)(?:\s+(?:para|que|con|for|that|with)\b)/i);
  const productName = productMatch ? productMatch[1].trim() : firstPhrase.split(' ').slice(0, 5).join(' ');

  // Core benefit
  const benefitPatterns = [
    /(?:que|that|which)\s+(.+?)(?:\.|,|$)/i,
    /(?:permite|permite a|allows|enables|helps|ayuda a)\s+(.+?)(?:\.|,|$)/i,
  ];
  let coreBenefit = '';
  for (const p of benefitPatterns) {
    const m = text.match(p);
    if (m) { coreBenefit = m[1].trim(); break; }
  }

  // Target audience
  const audMatch = text.match(/(?:para|for)\s+(.+?)(?:\s+(?:que|con|with|that)|,|\.|$)/i);
  const audience = audMatch ? audMatch[1].trim() : '';

  // Specific features mentioned (after "con" / "with")
  const features = [];
  const featurePatterns = /(?:con|with)\s+(.+?)(?:\s+(?:que|y|and)|,|\.|$)/gi;
  let fm;
  while ((fm = featurePatterns.exec(text)) !== null) {
    features.push(fm[1].trim());
  }

  // Numbers / metrics
  const metrics = text.match(/\d+[\s]?(?:minutos?|minutes?|horas?|hours?|d[ií]as?|days?|%|x|veces|times|segundos?|seconds?|usuarios?|users?)/gi) || [];

  // Key adjectives from input
  const adjectives = text.match(/\b(adaptativa|inteligente|personalizado|profesional|innovador|r[aá]pido|f[aá]cil|autom[aá]tico|avanzado|premium|smart|intelligent|personalized|professional|innovative|fast|easy|automatic|advanced|premium)\b/gi) || [];

  return {
    productName,
    coreBenefit,
    audience,
    features,
    metrics,
    adjectives: [...new Set(adjectives.map(a => a.toLowerCase()))],
    originalText: text,
    firstPhrase,
  };
}
