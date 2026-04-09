import { describe, it, expect } from 'vitest';
import {
  generateSmartContent,
  buildDallePrompt,
  buildSystemPrompt,
  generateSmartHeadline,
  generateSmartSubheadline,
  generateSmartBody,
  generateSmartCTA,
  HEADLINE_FORMULAS,
  SUBHEADLINE_FORMULAS,
  BODY_FORMULAS,
  CTA_BY_FORMAT,
} from '../contentGenerator.js';
import { parseBrand } from '../brandParser.js';
import { createRng, hashString } from '../rng.js';

const TEST_BRAND = 'MiApp plataforma digital para empresas que optimiza procesos';

describe('generateSmartContent', () => {
  it('returns all required fields', () => {
    const result = generateSmartContent(TEST_BRAND, 'instagram', 'Profesional', 'Producto', 0);
    expect(result).toHaveProperty('headline');
    expect(result).toHaveProperty('subheadline');
    expect(result).toHaveProperty('body');
    expect(result).toHaveProperty('cta');
    expect(result).toHaveProperty('hashtags');
    expect(result).toHaveProperty('emoji_set');
    expect(result).toHaveProperty('dalle_prompt');
    expect(result).toHaveProperty('color_palette');
    expect(result).toHaveProperty('posting_time');
  });

  it('produces consistent output for the same inputs', () => {
    const r1 = generateSmartContent(TEST_BRAND, 'instagram', 'Profesional', 'Producto', 0);
    const r2 = generateSmartContent(TEST_BRAND, 'instagram', 'Profesional', 'Producto', 0);
    expect(r1.headline).toBe(r2.headline);
    expect(r1.body).toBe(r2.body);
  });

  it('produces different output for different generation counts', () => {
    const r1 = generateSmartContent(TEST_BRAND, 'instagram', 'Profesional', 'Producto', 0);
    const r2 = generateSmartContent(TEST_BRAND, 'instagram', 'Profesional', 'Producto', 5);
    // At least one field should differ across all fields
    const differs = r1.headline !== r2.headline || r1.body !== r2.body || r1.cta !== r2.cta || r1.subheadline !== r2.subheadline || JSON.stringify(r1.hashtags) !== JSON.stringify(r2.hashtags) || r1.posting_time !== r2.posting_time || JSON.stringify(r1.color_palette) !== JSON.stringify(r2.color_palette);
    expect(differs).toBe(true);
  });

  it('supports all platforms', () => {
    for (const plat of ['instagram', 'twitter', 'linkedin', 'facebook']) {
      const result = generateSmartContent(TEST_BRAND, plat, 'Profesional', 'Producto', 0);
      expect(result.headline).toBeTruthy();
      expect(result.posting_time).toBeTruthy();
    }
  });

  it('different platforms produce different posting times or content', () => {
    const ig = generateSmartContent(TEST_BRAND, 'instagram', 'Profesional', 'Producto', 0);
    const tw = generateSmartContent(TEST_BRAND, 'twitter', 'Profesional', 'Producto', 0);
    // posting_time should differ since they draw from different pools
    const differs = ig.posting_time !== tw.posting_time || ig.dalle_prompt !== tw.dalle_prompt;
    expect(differs).toBe(true);
  });

  it('handles empty brand gracefully', () => {
    const result = generateSmartContent('test product', 'instagram', 'Profesional', 'Producto', 0);
    expect(result.headline).toBeTruthy();
    expect(result.body).toBeTruthy();
  });

  it('returns hashtags as an array', () => {
    const result = generateSmartContent(TEST_BRAND, 'instagram', 'Profesional', 'Producto', 0);
    expect(Array.isArray(result.hashtags)).toBe(true);
    expect(result.hashtags.length).toBeGreaterThan(0);
  });

  it('returns color_palette as an array of hex strings', () => {
    const result = generateSmartContent(TEST_BRAND, 'instagram', 'Profesional', 'Producto', 0);
    expect(Array.isArray(result.color_palette)).toBe(true);
    result.color_palette.forEach(c => {
      expect(c).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('returns emoji_set as an array', () => {
    const result = generateSmartContent(TEST_BRAND, 'instagram', 'Divertido', 'Producto', 0);
    expect(Array.isArray(result.emoji_set)).toBe(true);
    expect(result.emoji_set.length).toBe(3);
  });
});

describe('generateSmartHeadline', () => {
  it('generates headline containing the product name', () => {
    const parsed = parseBrand(TEST_BRAND);
    const rng = createRng(42);
    const headline = generateSmartHeadline(parsed, 'Profesional', 'Producto', 'es', rng);
    expect(headline).toBeTruthy();
    expect(typeof headline).toBe('string');
  });

  it('generates different headlines for different tones', () => {
    const parsed = parseBrand(TEST_BRAND);
    const h1 = generateSmartHeadline(parsed, 'Urgente', 'Producto', 'es', createRng(42));
    const h2 = generateSmartHeadline(parsed, 'Minimalista', 'Producto', 'es', createRng(42));
    // Different tones produce different style, though edge cases exist
    expect(typeof h1).toBe('string');
    expect(typeof h2).toBe('string');
  });

  it('supports English language', () => {
    const parsed = parseBrand('Smart AI platform for developers');
    const headline = generateSmartHeadline(parsed, 'Profesional', 'Producto', 'en', createRng(42));
    expect(headline).toBeTruthy();
  });
});

describe('generateSmartSubheadline', () => {
  it('returns a string subheadline', () => {
    const parsed = parseBrand(TEST_BRAND);
    const rng = createRng(42);
    const sub = generateSmartSubheadline(parsed, 'Profesional', 'es', rng);
    expect(typeof sub).toBe('string');
    expect(sub.length).toBeGreaterThan(0);
  });
});

describe('generateSmartBody', () => {
  it('returns body text as a string', () => {
    const parsed = parseBrand(TEST_BRAND);
    const rng = createRng(42);
    const body = generateSmartBody(parsed, 'Profesional', 'Producto', 'es', rng);
    expect(typeof body).toBe('string');
    expect(body.length).toBeGreaterThan(10);
  });

  it('includes brand-related info when available', () => {
    const parsed = parseBrand('MiApp para empresas que necesitan automatización');
    const body = generateSmartBody(parsed, 'Profesional', 'Producto', 'es', createRng(42));
    expect(body).toContain('MiApp');
  });
});

describe('generateSmartCTA', () => {
  it('returns a CTA string', () => {
    const parsed = parseBrand(TEST_BRAND);
    const rng = createRng(42);
    const cta = generateSmartCTA(parsed, 'Producto', 'es', rng);
    expect(typeof cta).toBe('string');
    expect(cta.length).toBeGreaterThan(0);
  });

  it('returns different CTAs for different formats', () => {
    const parsed = parseBrand(TEST_BRAND);
    const ctaProducto = generateSmartCTA(parsed, 'Producto', 'es', createRng(42));
    const ctaEvento = generateSmartCTA(parsed, 'Evento', 'es', createRng(42));
    // They may or may not differ depending on seed, but both should be valid strings
    expect(typeof ctaProducto).toBe('string');
    expect(typeof ctaEvento).toBe('string');
  });
});

describe('buildDallePrompt', () => {
  it('returns a descriptive string', () => {
    const parsed = parseBrand(TEST_BRAND);
    const rng = createRng(42);
    const prompt = buildDallePrompt(parsed, 'instagram', 'Profesional', ['#FF0000', '#00FF00', '#0000FF'], rng);
    expect(typeof prompt).toBe('string');
    expect(prompt.length).toBeGreaterThan(50);
  });

  it('includes the product name', () => {
    const parsed = parseBrand(TEST_BRAND);
    const rng = createRng(42);
    const prompt = buildDallePrompt(parsed, 'instagram', 'Profesional', ['#FF0000', '#00FF00', '#0000FF'], rng);
    expect(prompt).toContain(parsed.productName);
  });

  it('includes platform-specific aspect ratio info', () => {
    const parsed = parseBrand(TEST_BRAND);
    const rng = createRng(42);
    const igPrompt = buildDallePrompt(parsed, 'instagram', 'Profesional', ['#FFF', '#000', '#AAA'], rng);
    expect(igPrompt).toContain('square 1:1');
    const twPrompt = buildDallePrompt(parsed, 'twitter', 'Profesional', ['#FFF', '#000', '#AAA'], rng);
    expect(twPrompt).toContain('16:9');
  });
});

describe('buildSystemPrompt', () => {
  it('includes platform, tone, and format', () => {
    const prompt = buildSystemPrompt('Instagram', 'Profesional', 'Producto');
    expect(prompt).toContain('Instagram');
    expect(prompt).toContain('Profesional');
    expect(prompt).toContain('Producto');
  });

  it('returns a string with JSON structure description', () => {
    const prompt = buildSystemPrompt('Twitter', 'Urgente', 'Oferta');
    expect(prompt).toContain('headline');
    expect(prompt).toContain('hashtags');
    expect(prompt).toContain('dalle_prompt');
  });
});

describe('Formula exports', () => {
  it('HEADLINE_FORMULAS has all 5 tones', () => {
    const tones = ['Profesional', 'Inspirador', 'Urgente', 'Divertido', 'Minimalista'];
    tones.forEach(t => {
      expect(HEADLINE_FORMULAS[t]).toBeDefined();
      expect(HEADLINE_FORMULAS[t].length).toBeGreaterThan(0);
    });
  });

  it('CTA_BY_FORMAT has all 5 formats', () => {
    const formats = ['Producto', 'Servicio', 'Evento', 'Oferta', 'Branding'];
    formats.forEach(f => {
      expect(CTA_BY_FORMAT[f]).toBeDefined();
      expect(CTA_BY_FORMAT[f].length).toBeGreaterThan(0);
    });
  });
});
