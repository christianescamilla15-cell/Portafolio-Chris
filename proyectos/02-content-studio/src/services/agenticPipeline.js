// ─── AGENTIC PIPELINE (local, no API) ────────────────────────────────────────
import { createRng, hashString, pickRandom, shuffled } from '../utils/rng.js';
import { parseBrand, deepParseBrand } from '../utils/brandParser.js';
import { correctGrammar, cleanInfinitive, enforceMaxLength } from '../utils/contentFormatter.js';
import { generateRelevantHashtags } from '../utils/hashtagGenerator.js';
import { buildDallePrompt } from '../utils/contentGenerator.js';
import {
  INDUSTRY_PALETTES, TONE_PALETTE_ADJUSTMENTS, EMOJI_SETS, POSTING_TIMES,
} from '../constants/industryData.js';

// ─── BRAND ANALYSIS ─────────────────────────────────────────────────────────
function analyzeBrand(text, lang) {
  const lower = text.toLowerCase();

  const productTypes = {
    app: /\b(app|aplicaci[oó]n|software|plataforma|platform|tool|herramienta)\b/i,
    service: /\b(servicio|service|consultor[ií]a|consulting|agencia|agency)\b/i,
    product: /\b(producto|product|dispositivo|device|equipo|equipment)\b/i,
    course: /\b(curso|course|programa|program|capacitaci[oó]n|training)\b/i,
    ecommerce: /\b(tienda|store|shop|marketplace|comercio)\b/i,
  };

  let productType = 'general';
  for (const [type, regex] of Object.entries(productTypes)) {
    if (regex.test(text)) { productType = type; break; }
  }

  const valueProps = [];
  const vpPatterns = [
    /(?:que|that|which)\s+(.{10,80}?)(?:\.|,|$)/gi,
    /(?:permite|allows|enables|helps|ayuda)\s+(.{10,60}?)(?:\.|,|$)/gi,
    /(?:con|with)\s+(.{10,60}?)(?:\.|,|$)/gi,
  ];
  vpPatterns.forEach(p => {
    const matches = [...text.matchAll(p)];
    matches.forEach(m => valueProps.push(m[1].trim()));
  });

  const metrics = [];
  const metricPatterns = [
    /(\d+)\s*(%|por\s*ciento|percent)/gi,
    /(\d+)\s*(minutos?|minutes?|horas?|hours?|d[ií]as?|days?|segundos?|seconds?)/gi,
    /(\d+)\s*(usuarios?|users?|clientes?|clients?|empresas?|companies?)/gi,
    /\$\s*([\d,.]+)/gi,
  ];
  metricPatterns.forEach(p => {
    const matches = [...text.matchAll(p)];
    matches.forEach(m => metrics.push(m[0].trim()));
  });

  const emotionalTriggers = {
    es: { urgency: ['rápido','inmediato','ahora','ya','urgente'], trust: ['seguro','confiable','certificado','probado','garantizado'], innovation: ['innovador','revolucionario','único','primero','avanzado'], ease: ['fácil','simple','sencillo','intuitivo','automático'], results: ['resultados','impacto','crecimiento','éxito','mejora'] },
    en: { urgency: ['fast','immediate','now','instant','quick'], trust: ['secure','reliable','certified','proven','guaranteed'], innovation: ['innovative','revolutionary','unique','first','advanced'], ease: ['easy','simple','intuitive','automatic','effortless'], results: ['results','impact','growth','success','improvement'] }
  };

  const triggers = [];
  const triggerWords = emotionalTriggers[lang] || emotionalTriggers.en;
  for (const [category, words] of Object.entries(triggerWords)) {
    if (words.some(w => lower.includes(w))) triggers.push(category);
  }

  const audienceMatch = text.match(/(?:para|for)\s+(.{5,50}?)(?:\s+(?:que|con|with|that)|,|\.|$)/i);
  const audience = audienceMatch ? audienceMatch[1].trim() : '';

  const benefitMatch = text.match(/(?:que|that|which)\s+(.{10,80}?)(?:\.|,|$)/i)
    || text.match(/(?:reduce|reduces|mejora|improves|aumenta|increases|elimina|eliminates|ayuda|helps)\s+(.{5,60}?)(?:\.|,|$)/i);
  const benefit = benefitMatch ? benefitMatch[1].trim() : (valueProps[0] || '');

  return { productType, valueProps, metrics, triggers, audience, benefit, productName: text.split(/[.,\n]/).at(0)?.trim().slice(0, 50) || text.slice(0, 50) };
}

function profileAudience(analysis, lang) {
  const { audience, productType, triggers } = analysis;

  const painPoints = {
    app: { es: ['falta de tiempo', 'procesos manuales', 'desorganización'], en: ['lack of time', 'manual processes', 'disorganization'] },
    service: { es: ['necesidad de expertise', 'resultados lentos', 'costos altos'], en: ['need for expertise', 'slow results', 'high costs'] },
    product: { es: ['baja calidad', 'opciones limitadas', 'precio alto'], en: ['low quality', 'limited options', 'high price'] },
    course: { es: ['falta de conocimiento', 'habilidades desactualizadas', 'competencia'], en: ['lack of knowledge', 'outdated skills', 'competition'] },
    ecommerce: { es: ['experiencia de compra pobre', 'poca variedad', 'precios altos'], en: ['poor shopping experience', 'limited variety', 'high prices'] },
    general: { es: ['ineficiencia', 'falta de soluciones', 'oportunidades perdidas'], en: ['inefficiency', 'lack of solutions', 'missed opportunities'] },
  };

  const desires = {
    urgency: { es: 'resultados inmediatos', en: 'immediate results' },
    trust: { es: 'seguridad y confianza', en: 'security and trust' },
    innovation: { es: 'estar a la vanguardia', en: 'staying ahead' },
    ease: { es: 'simplicidad y ahorro de tiempo', en: 'simplicity and time savings' },
    results: { es: 'impacto medible', en: 'measurable impact' },
  };

  const topDesires = triggers.map(t => desires[t]?.[lang] || desires[t]?.en).filter(Boolean);

  return {
    audience: audience || (lang === 'es' ? 'profesionales y empresas' : 'professionals and businesses'),
    painPoints: painPoints[productType]?.[lang] || painPoints.general[lang],
    desires: topDesires.length ? topDesires : [lang === 'es' ? 'soluciones efectivas' : 'effective solutions'],
    buyingStage: triggers.includes('urgency') ? 'ready-to-buy' : 'consideration',
  };
}

// ─── RELEVANT HEADLINE GENERATOR ────────────────────────────────────────────
function generateRelevantHeadline(brand, tone, platform, lang) {
  const { productName, coreBenefit, audience, metrics, adjectives } = brand;
  const shortProduct = productName.split(' ').slice(0, 4).join(' ');
  const pool = [];

  if (lang === 'es') {
    const infBenefit = coreBenefit ? cleanInfinitive(coreBenefit) : '';
    const capBenefit = coreBenefit ? coreBenefit.charAt(0).toUpperCase() + coreBenefit.slice(1) : '';

    if (coreBenefit && metrics.length > 0) {
      pool.push(
        `${enforceMaxLength(capBenefit, 60)} en solo ${metrics[0]}`,
        `Solo ${metrics[0]} para ${infBenefit}`,
        `${metrics[0]}: todo lo que necesitas para ${infBenefit}`,
      );
    }

    if (coreBenefit && audience) {
      pool.push(
        `${audience.charAt(0).toUpperCase() + audience.slice(1)}: ${coreBenefit}`,
        `Para ${audience} que buscan ${infBenefit}`,
        `${capBenefit}. Hecho para ${audience}`,
      );
    }

    if (coreBenefit) {
      pool.push(
        `${capBenefit}. Así de simple`,
        `¿Y si pudieras ${infBenefit}?`,
        `Imagina ${infBenefit} cada día`,
      );
    }

    if (audience) {
      pool.push(`Hecho para ${audience}`);
    }

    if ((tone === 'Urgente' || tone === 'urgent') && coreBenefit) {
      pool.push(`No esperes más para ${infBenefit}`);
    }

  } else {
    const cleanBenefit = coreBenefit ? coreBenefit.charAt(0).toLowerCase() + coreBenefit.slice(1) : '';
    const capBenefitEn = coreBenefit ? coreBenefit.charAt(0).toUpperCase() + coreBenefit.slice(1) : '';

    if (coreBenefit && metrics.length > 0) {
      pool.push(
        `${shortProduct}: ${coreBenefit}`,
        `${metrics[0]} to ${cleanBenefit}`,
        `${capBenefitEn} in just ${metrics[0]}`,
      );
    }

    if (coreBenefit && audience) {
      pool.push(
        `${audience}: ${coreBenefit}`,
        `For ${audience} who want to ${cleanBenefit}`,
      );
    }

    if (coreBenefit) {
      pool.push(
        `${capBenefitEn}. That simple.`,
        `What if you could ${cleanBenefit}?`,
        `Imagine ${cleanBenefit} every day`,
      );
    }

    if (audience) {
      pool.push(`Made for ${audience}`);
    }

    if ((tone === 'Urgente' || tone === 'urgent') && coreBenefit) {
      pool.push(`Don't wait to ${cleanBenefit}`);
    }
  }

  const valid = pool.filter(h => h.length > 5);
  if (valid.length === 0) return shortProduct;
  const chosen = valid[Math.floor(Math.random() * valid.length)];
  return enforceMaxLength(chosen, 80);
}

// ─── RELEVANT BODY GENERATOR ────────────────────────────────────────────────
function generateRelevantBody(brand, tone, lang) {
  const { productName, coreBenefit, audience, features, metrics, adjectives } = brand;
  const parts = [];

  if (lang === 'es') {
    if (audience) parts.push(`Si eres ${audience}, sabes lo importante que es ${coreBenefit || 'optimizar tu d\u00eda'}.`);
    else if (coreBenefit) parts.push(`${coreBenefit.charAt(0).toUpperCase() + coreBenefit.slice(1)} ya no es un lujo, es una necesidad.`);

    const productDesc = [productName];
    if (adjectives.length > 0) productDesc.push(`con tecnolog\u00eda ${adjectives.slice(0, 2).join(' y ')}`);
    if (features.length > 0) productDesc.push(`que incluye ${features[0]}`);
    parts.push(`${productDesc.join(' ')}.`);

    if (metrics.length > 0) parts.push(`Solo ${metrics[0]} para ver resultados reales.`);
    if (features.length > 1) parts.push(`Adem\u00e1s: ${features.slice(1).join(', ')}.`);
  } else {
    if (audience) parts.push(`If you're ${audience}, you know how important it is to ${coreBenefit || 'optimize your day'}.`);
    else if (coreBenefit) parts.push(`${coreBenefit.charAt(0).toUpperCase() + coreBenefit.slice(1)} is no longer a luxury, it's a necessity.`);

    const productDesc = [productName];
    if (adjectives.length > 0) productDesc.push(`with ${adjectives.slice(0, 2).join(' and ')} technology`);
    if (features.length > 0) productDesc.push(`featuring ${features[0]}`);
    parts.push(`${productDesc.join(' ')}.`);

    if (metrics.length > 0) parts.push(`Just ${metrics[0]} to see real results.`);
    if (features.length > 1) parts.push(`Plus: ${features.slice(1).join(', ')}.`);
  }

  return parts.join(' ');
}

// ─── RELEVANT CTA GENERATOR ────────────────────────────────────────────────
function generateRelevantCTA(brand, format, lang) {
  const { productName, metrics } = brand;
  const short = productName.split(' ').slice(0, 3).join(' ');

  const pool = lang === 'es' ? [
    `Prueba ${short} gratis`,
    metrics[0] ? `Empieza tu prueba de ${metrics[0]}` : `Empieza gratis hoy`,
    `Descubre ${short}`,
    `Conoce ${short} ahora`,
  ] : [
    `Try ${short} free`,
    metrics[0] ? `Start your ${metrics[0]} trial` : `Start free today`,
    `Discover ${short}`,
    `Get ${short} now`,
  ];

  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── MAIN AGENTIC GENERATE FUNCTION ─────────────────────────────────────────
export function agenticGenerate(brandText, platform, tone, format, lang, prevHookType) {
  try {
    // Agent 1: Deep Brand Parser
    const brand = deepParseBrand(brandText, lang);

    // Agent 2: Audience Profiler
    const brandAnalysis = analyzeBrand(brandText, lang);
    const audienceProfile = profileAudience(brandAnalysis, lang);

    // Agent 3: Relevant Headline
    let headline = generateRelevantHeadline(brand, tone, platform, lang);

    // Agent 4: Relevant Body
    let body = generateRelevantBody(brand, tone, lang);

    // Agent 5: Relevant CTA
    let cta = generateRelevantCTA(brand, format, lang);

    // Subheadline from actual content
    let subheadline = '';
    if (brand.audience) {
      subheadline = lang === 'es' ? `Para ${brand.audience}` : `For ${brand.audience}`;
    } else if (brand.features.length > 0) {
      subheadline = lang === 'es' ? `Con ${brand.features[0]}` : `With ${brand.features[0]}`;
    }

    // Agent 6.5: Grammar Correction
    headline = correctGrammar(headline, lang);
    subheadline = correctGrammar(subheadline, lang);
    body = correctGrammar(body, lang);
    cta = correctGrammar(cta, lang);

    // Agent 6: Relevant Hashtags
    const hashtags = generateRelevantHashtags(brand, platform, lang);

    // Visual / timing data using existing generators
    const parsed = parseBrand(brandText);
    const seed = hashString(brandText + platform + tone + format);
    const rng = createRng(seed);

    let palettes;
    if (tone === "Minimalista") {
      palettes = TONE_PALETTE_ADJUSTMENTS.Minimalista;
    } else {
      palettes = INDUSTRY_PALETTES[parsed.detectedIndustry] || INDUSTRY_PALETTES.general;
    }
    const color_palette = pickRandom(shuffled(palettes, rng), rng);
    const emojiOptions = EMOJI_SETS[tone] || EMOJI_SETS.Profesional;
    const emoji_set = pickRandom(shuffled(emojiOptions, rng), rng);
    const dalle_prompt = buildDallePrompt(parsed, platform, tone, color_palette, rng);
    const times = POSTING_TIMES[platform] || POSTING_TIMES.instagram;
    const posting_time = pickRandom(shuffled(times, rng), rng);

    // Build compatible hook structure for UI display
    const mockHook = { type: 'benefit', hook: headline, score: 85 };

    return {
      headline,
      subheadline,
      body,
      cta,
      hashtags,
      emoji_set,
      dalle_prompt,
      color_palette,
      posting_time,
      _source: 'agentic',
      _viralScore: mockHook.score,
      _allHooks: [mockHook],
      _pipeline: [
        { agent: lang === 'es' ? 'Parser Profundo' : 'Deep Parser', output: `Product: ${brand.productName}, Benefit: ${brand.coreBenefit || 'N/A'}, Audience: ${brand.audience || 'N/A'}` },
        { agent: lang === 'es' ? 'Generador de Headline' : 'Headline Generator', output: headline },
        { agent: lang === 'es' ? 'Compositor de Body' : 'Body Composer', output: body.slice(0, 80) + '...' },
        { agent: lang === 'es' ? 'Motor de CTA' : 'CTA Engine', output: cta },
        { agent: lang === 'es' ? 'Extractor de Hashtags' : 'Hashtag Extractor', output: hashtags.join(' ') },
      ],
    };
  } catch (e) {
    console.warn('Agentic pipeline failed, falling back to templates:', e);
    return null;
  }
}
