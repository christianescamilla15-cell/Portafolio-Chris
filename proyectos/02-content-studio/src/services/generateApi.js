// ─── AI API SERVICES ────────────────────────────────────────────────────────
import { createRng, hashString, pickRandom, shuffled } from '../utils/rng.js';
import { parseBrand } from '../utils/brandParser.js';
import {
  HEADLINE_FORMULAS, SUBHEADLINE_FORMULAS, BODY_FORMULAS, CTA_BY_FORMAT,
  buildDallePrompt,
} from '../utils/contentGenerator.js';
import {
  INDUSTRY_PALETTES, TONE_PALETTE_ADJUSTMENTS, EMOJI_SETS, POSTING_TIMES,
  INDUSTRY_HASHTAGS, FORMAT_HASHTAGS, PLATFORM_HASHTAGS,
} from '../constants/industryData.js';
import { PLATFORMS } from '../constants/platforms.js';

// ─── FETCH WITH RETRY + TIMEOUT ─────────────────────────────────────────────
const FETCH_TIMEOUT = 15000;

export async function fetchWithRetry(url, options = {}, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        return { data, error: null };
      }
      // Non-retryable client errors (4xx except 429)
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        return { data: null, error: `HTTP ${response.status}` };
      }
      // Retryable server errors — fall through to retry
    } catch (err) {
      if (attempt === retries) {
        return { data: null, error: err.name === "AbortError" ? "Request timed out" : err.message };
      }
    }
    // Exponential backoff: 1s, 2s
    if (attempt < retries) {
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  return { data: null, error: "Max retries exceeded" };
}

// ─── CLAUDE TOOL DEFINITIONS ────────────────────────────────────────────────
const CONTENT_TOOLS = [
  {
    name: "analyze_brand",
    description: "Parse a brand description to extract structured information: product name, industry, benefits, target audience, and key descriptors.",
    input_schema: {
      type: "object",
      properties: {
        brand_description: { type: "string", description: "The raw brand/product description from the user" },
      },
      required: ["brand_description"],
    },
  },
  {
    name: "generate_copy",
    description: "Generate platform-specific marketing copy including headline, subheadline, body text, CTA, and hashtags.",
    input_schema: {
      type: "object",
      properties: {
        product_name: { type: "string" },
        industry: { type: "string" },
        benefits: { type: "array", items: { type: "string" } },
        target_audience: { type: "string" },
        descriptors: { type: "array", items: { type: "string" } },
        platform: { type: "string", enum: ["instagram", "twitter", "linkedin", "facebook"] },
        tone: { type: "string", enum: ["Profesional", "Inspirador", "Urgente", "Divertido", "Minimalista"] },
        format: { type: "string", enum: ["Producto", "Servicio", "Evento", "Oferta", "Branding"] },
      },
      required: ["product_name", "industry", "platform", "tone", "format"],
    },
  },
  {
    name: "suggest_colors",
    description: "Suggest a 3-color hex palette based on the industry and desired tone.",
    input_schema: {
      type: "object",
      properties: {
        industry: { type: "string" },
        tone: { type: "string" },
      },
      required: ["industry", "tone"],
    },
  },
  {
    name: "recommend_timing",
    description: "Recommend the best posting time for a given social media platform.",
    input_schema: {
      type: "object",
      properties: {
        platform: { type: "string", enum: ["instagram", "twitter", "linkedin", "facebook"] },
      },
      required: ["platform"],
    },
  },
  {
    name: "create_dalle_prompt",
    description: "Create a detailed DALL-E 3 image generation prompt based on brand info, platform, and color palette.",
    input_schema: {
      type: "object",
      properties: {
        product_name: { type: "string" },
        industry: { type: "string" },
        descriptors: { type: "array", items: { type: "string" } },
        platform: { type: "string" },
        tone: { type: "string" },
        color_palette: { type: "array", items: { type: "string" } },
      },
      required: ["product_name", "industry", "platform", "tone", "color_palette"],
    },
  },
];

function executeContentTool(toolName, toolInput) {
  const rng = createRng(hashString(JSON.stringify(toolInput)));

  switch (toolName) {
    case "analyze_brand": {
      const parsed = parseBrand(toolInput.brand_description || "");
      return {
        product_name: parsed.productName,
        industry: parsed.detectedIndustry,
        benefits: parsed.benefits.length > 0 ? parsed.benefits : ["mejora resultados", "ahorra tiempo"],
        target_audience: parsed.audiences[0] || "profesionales y empresas",
        descriptors: parsed.descriptors,
        value_proposition: parsed.valueProp,
      };
    }
    case "generate_copy": {
      const { product_name, industry, benefits, target_audience, descriptors, platform, tone, format } = toolInput;
      const seed = hashString(product_name + platform + tone + format);
      const localRng = createRng(seed);
      const formulas = HEADLINE_FORMULAS[tone] || HEADLINE_FORMULAS.Profesional;
      const headline = pickRandom(shuffled(formulas, localRng), localRng)(product_name, benefits?.[0] || "");
      const subFormulas = SUBHEADLINE_FORMULAS[tone] || SUBHEADLINE_FORMULAS.Profesional;
      const subheadline = pickRandom(shuffled(subFormulas, localRng), localRng)(benefits?.[0] || "", target_audience || "");
      const bodyFormulas = BODY_FORMULAS[tone] || BODY_FORMULAS.Profesional;
      const body = pickRandom(shuffled(bodyFormulas, localRng), localRng)(product_name, benefits?.[0] || "", target_audience || "", descriptors || []);
      const ctas = CTA_BY_FORMAT[format] || CTA_BY_FORMAT.Producto;
      const cta = pickRandom(shuffled(ctas, localRng), localRng);
      const industryTags = shuffled(INDUSTRY_HASHTAGS[industry] || INDUSTRY_HASHTAGS.general, localRng);
      const formatTags = shuffled(FORMAT_HASHTAGS[format] || FORMAT_HASHTAGS.Producto, localRng);
      const platTags = shuffled(PLATFORM_HASHTAGS[platform] || PLATFORM_HASHTAGS.instagram, localRng);
      const hashtags = [...new Set([...industryTags.slice(0, 3), ...formatTags.slice(0, 1), ...platTags.slice(0, 1)])].slice(0, 5);
      const emojiOptions = EMOJI_SETS[tone] || EMOJI_SETS.Profesional;
      const emoji_set = pickRandom(shuffled(emojiOptions, localRng), localRng);
      return { headline, subheadline, body, cta, hashtags, emoji_set };
    }
    case "suggest_colors": {
      const { industry, tone } = toolInput;
      let palettes;
      if (tone === "Minimalista") {
        palettes = TONE_PALETTE_ADJUSTMENTS.Minimalista;
      } else {
        palettes = INDUSTRY_PALETTES[industry] || INDUSTRY_PALETTES.general;
      }
      return { color_palette: pickRandom(shuffled(palettes, rng), rng) };
    }
    case "recommend_timing": {
      const times = POSTING_TIMES[toolInput.platform] || POSTING_TIMES.instagram;
      return { posting_time: pickRandom(shuffled(times, rng), rng) };
    }
    case "create_dalle_prompt": {
      const { product_name, industry, descriptors, platform, tone, color_palette } = toolInput;
      const parsed = { productName: product_name, detectedIndustry: industry, descriptors: descriptors || [] };
      return { dalle_prompt: buildDallePrompt(parsed, platform, tone, color_palette || ["#1a1a2e", "#16213e", "#0f3460"], rng) };
    }
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

// ─── CLAUDE TOOL USE ────────────────────────────────────────────────────────
export async function generateWithToolUse(apiKey, brandDesc, platform, tone, format, lang) {
  try {
    const langLabel = lang === "en" ? "English" : "Spanish";
    let messages = [
      {
        role: "user",
        content: `You are a senior social media marketing expert. Generate compelling content for this brand.

Brand description: ${brandDesc}
Platform: ${platform}
Tone: ${tone}
Format: ${format}
Language: ${langLabel}

Use the tools in this order:
1. First call analyze_brand to understand the brand
2. Then call generate_copy with the brand analysis
3. Call suggest_colors for a color palette
4. Call recommend_timing for posting schedule
5. Call create_dalle_prompt for visual generation

After all tools return data, synthesize the results into a final JSON with these exact keys: headline, subheadline, body, cta, hashtags, emoji_set, dalle_prompt, color_palette, posting_time. Improve the copy if you can — make headlines punchier and bodies more persuasive while keeping the tone. Respond with ONLY the final JSON.`,
      },
    ];

    const MAX_ROUNDS = 8;
    for (let round = 0; round < MAX_ROUNDS; round++) {
      const { data, error: fetchErr } = await fetchWithRetry("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          tools: CONTENT_TOOLS,
          messages,
        }),
      }, 1);

      if (fetchErr || !data) return null;

      const toolUseBlocks = (data.content || []).filter(b => b.type === "tool_use");
      const textBlocks = (data.content || []).filter(b => b.type === "text");

      if (data.stop_reason === "end_turn" || toolUseBlocks.length === 0) {
        const text = textBlocks.map(b => b.text).join("");
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.headline && parsed.body) return parsed;
        }
        return null;
      }

      messages.push({ role: "assistant", content: data.content });

      const toolResults = toolUseBlocks.map(block => ({
        type: "tool_result",
        tool_use_id: block.id,
        content: JSON.stringify(executeContentTool(block.name, block.input)),
      }));
      messages.push({ role: "user", content: toolResults });
    }
    return null;
  } catch {
    return null;
  }
}

// ─── HUGGING FACE INFERENCE API ─────────────────────────────────────────────
export async function generateWithHuggingFace(brandText, platform, tone, format, lang, hfToken, setLoadingMsg) {
  const HF_API = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3';

  const systemPrompt = lang === 'en'
    ? `You are a senior social media copywriter. Generate marketing content for ${platform}.`
    : `Eres un copywriter senior de redes sociales. Genera contenido de marketing para ${platform}.`;

  const userPrompt = lang === 'en'
    ? `Brand: ${brandText}
Platform: ${platform}
Tone: ${tone}
Format: ${format}

Generate a JSON with exactly these fields:
{"headline":"max 10 words","subheadline":"max 15 words","body":"2-3 sentences about the brand","cta":"max 5 words call to action","hashtags":["5 relevant hashtags"]}`
    : `Marca: ${brandText}
Plataforma: ${platform}
Tono: ${tone}
Formato: ${format}

Genera un JSON con exactamente estos campos:
{"headline":"max 10 palabras","subheadline":"max 15 palabras","body":"2-3 oraciones sobre la marca","cta":"max 5 palabras call to action","hashtags":["5 hashtags relevantes"]}`;

  const doFetch = () => fetch(HF_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(hfToken ? { 'Authorization': `Bearer ${hfToken}` } : {}),
    },
    body: JSON.stringify({
      inputs: `<s>[INST] ${systemPrompt}\n\n${userPrompt} [/INST]`,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        return_full_text: false,
      },
    }),
  });

  try {
    let response = await doFetch();

    if (response.status === 503) {
      try {
        const body = await response.json();
        if (body.estimated_time && setLoadingMsg) {
          setLoadingMsg(lang === 'en'
            ? `Model loading (~${Math.ceil(body.estimated_time)}s)...`
            : `Cargando modelo (~${Math.ceil(body.estimated_time)}s)...`);
          await new Promise(r => setTimeout(r, body.estimated_time * 1000 + 1000));
          response = await doFetch();
        }
      } catch {
        return null;
      }
    }

    if (!response.ok) return null;

    const data = await response.json();
    const text = data[0]?.generated_text || '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        headline: parsed.headline || '',
        subheadline: parsed.subheadline || '',
        body: parsed.body || '',
        cta: parsed.cta || '',
        hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
        emoji_set: parsed.emoji_set || ['\u2728', '\ud83d\ude80', '\ud83d\udca1'],
        dalle_prompt: parsed.dalle_prompt || `Professional marketing visual for "${brandText}" — modern, clean design for ${platform} social media. Commercial photography quality, 8K resolution.`,
        color_palette: parsed.color_palette || ['#6366F1', '#F59E0B', '#1A1A2E'],
        posting_time: parsed.posting_time || (lang === 'en' ? 'Check platform analytics for optimal timing.' : 'Consulta las analíticas de la plataforma para el horario óptimo.'),
        _source: 'huggingface',
      };
    }
    return null;
  } catch (e) {
    console.warn('HF generation failed:', e);
    return null;
  }
}

// ─── SERVER AI (Cloudflare Workers AI / HF server-side) ─────────────────────
export async function generateWithServerAI(brandText, platform, tone, format, lang) {
  try {
    const { data, error: fetchErr } = await fetchWithRetry('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brandText, platform, tone, format, lang })
    });

    if (fetchErr || !data) return null;
    if (data.error) return null;

    return {
      headline: data.headline || '',
      subheadline: data.subheadline || '',
      body: data.body || '',
      cta: data.cta || '',
      hashtags: Array.isArray(data.hashtags) ? data.hashtags : [],
      emoji_set: data.emoji_set || ['\u2728', '\ud83d\ude80', '\ud83d\udca1'],
      dalle_prompt: data.dalle_prompt || `Professional marketing visual for ${brandText}, modern design, high quality`,
      color_palette: data.color_palette || ['#1a1a2e', '#16213e', '#0f3460'],
      posting_time: data.posting_time || 'Optimal posting time varies by audience',
      _source: data._source || 'server-ai',
      _model: data._model || 'Unknown',
    };
  } catch {
    return null;
  }
}

// ─── GROQ API CALLER (primary — free, fast) ──────────────────────────────────
export async function generateWithGroq(groqKey, brandDesc, platform, tone, format, lang) {
  try {
    const { data, error: fetchErr } = await fetchWithRetry("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1000,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `You are a senior social media copywriter. Generate marketing content in ${lang === "en" ? "English" : "Spanish"}. Respond ONLY with valid JSON: {"headline":"max 10 words","subheadline":"max 15 words","body":"2-3 sentences","cta":"max 5 words","hashtags":["tag1","tag2","tag3","tag4","tag5"],"emoji_set":["e1","e2","e3"],"dalle_prompt":"Detailed DALL-E 3 image prompt in English, 50+ words, professional marketing visual","color_palette":["#hex1","#hex2","#hex3"],"posting_time":"best time recommendation and why"}` },
          { role: "user", content: `Brand: ${brandDesc}\nPlatform: ${platform}\nTone: ${tone}\nFormat: ${format}\n\nGenerate compelling ${platform} content.` },
        ],
      }),
    });
    if (fetchErr || !data) return null;
    const text = data.choices?.[0]?.message?.content || "";
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return null;
  }
}

// ─── CLAUDE API CALLER (fallback) ────────────────────────────────────────────
export async function generateWithClaude(apiKey, brandDesc, platform, tone, format, lang) {
  try {
    const { data, error: fetchErr } = await fetchWithRetry("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are a senior social media copywriter. Generate marketing content in ${lang === "en" ? "English" : "Spanish"}. Respond ONLY with valid JSON: {"headline":"max 10 words","subheadline":"max 15 words","body":"2-3 sentences","cta":"max 5 words","hashtags":["tag1","tag2","tag3","tag4","tag5"],"emoji_set":["e1","e2","e3"],"dalle_prompt":"Detailed DALL-E 3 image prompt in English, 50+ words, professional marketing visual","color_palette":["#hex1","#hex2","#hex3"],"posting_time":"best time recommendation and why"}`,
        messages: [{ role: "user", content: `Brand: ${brandDesc}\nPlatform: ${platform}\nTone: ${tone}\nFormat: ${format}\n\nGenerate compelling ${platform} content.` }],
      }),
    });
    if (fetchErr || !data) return null;
    const text = data.content?.[0]?.text || "";
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return null;
  }
}
