import { describe, it, expect } from 'vitest';
import { parseBrand, deepParseBrand } from '../brandParser.js';

describe('parseBrand', () => {
  it('parses a complete brand description', () => {
    const result = parseBrand('MiApp es una plataforma digital para empresas que optimiza procesos con inteligencia artificial');
    expect(result.productName).toBeTruthy();
    expect(result.raw).toContain('MiApp');
    expect(result.detectedIndustry).toBe('tech');
  });

  it('parses minimal brand info', () => {
    const result = parseBrand('MiProducto');
    expect(result.productName).toBe('MiProducto');
    expect(result.raw).toBe('MiProducto');
  });

  it('handles empty string', () => {
    const result = parseBrand('');
    expect(result.raw).toBe('');
    expect(result.benefits).toEqual([]);
  });

  it('detects tech industry from keywords', () => {
    const result = parseBrand('Una app de software digital con inteligencia artificial');
    expect(result.detectedIndustry).toBe('tech');
  });

  it('detects food industry from keywords', () => {
    const result = parseBrand('Restaurante gourmet de comida orgánica y recetas del chef');
    expect(result.detectedIndustry).toBe('food');
  });

  it('detects health industry from keywords', () => {
    const result = parseBrand('Clínica de bienestar con meditación yoga y fitness');
    expect(result.detectedIndustry).toBe('health');
  });

  it('extracts target audience after "para"', () => {
    const result = parseBrand('Plataforma digital para emprendedores que quieren crecer');
    expect(result.audience).toContain('emprendedores');
  });

  it('extracts benefit after "que"', () => {
    const result = parseBrand('Una herramienta que optimiza tu flujo de trabajo diario');
    expect(result.benefit).toBeTruthy();
    expect(result.benefit.length).toBeGreaterThan(5);
  });

  it('extracts descriptors like innovador, inteligente', () => {
    const result = parseBrand('Sistema innovador e inteligente para automatizar procesos');
    expect(result.descriptors).toContain('innovador');
    expect(result.descriptors).toContain('inteligente');
  });

  it('extracts quoted product name', () => {
    const result = parseBrand('"SuperApp" es la mejor plataforma digital');
    expect(result.productName).toBe('SuperApp');
  });

  it('extracts numbers and stats', () => {
    const result = parseBrand('Resultados en 5 minutos con 90% de precisión');
    expect(result.numbers.length).toBeGreaterThanOrEqual(1);
  });

  it('handles special characters', () => {
    const result = parseBrand('Café & Más — tu espacio de coworking #1');
    expect(result.raw).toContain('Café & Más');
  });
});

describe('deepParseBrand', () => {
  it('returns enhanced profile with all fields', () => {
    const result = deepParseBrand('MiApp inteligente para empresas que reduce costos con automatización avanzada', 'es');
    expect(result).toHaveProperty('productName');
    expect(result).toHaveProperty('coreBenefit');
    expect(result).toHaveProperty('audience');
    expect(result).toHaveProperty('features');
    expect(result).toHaveProperty('metrics');
    expect(result).toHaveProperty('adjectives');
    expect(result).toHaveProperty('originalText');
    expect(result).toHaveProperty('firstPhrase');
  });

  it('extracts product name before "para"', () => {
    const result = deepParseBrand('SaaS Platform para developers que automatiza deploys', 'en');
    expect(result.productName).toBe('SaaS Platform');
  });

  it('extracts core benefit after "que"', () => {
    const result = deepParseBrand('Herramienta que reduce el tiempo de entrega en un 50%', 'es');
    expect(result.coreBenefit).toBeTruthy();
  });

  it('extracts adjectives', () => {
    const result = deepParseBrand('Plataforma inteligente y personalizado para profesionales', 'es');
    expect(result.adjectives).toContain('inteligente');
    expect(result.adjectives).toContain('personalizado');
  });

  it('extracts metrics with numbers', () => {
    const result = deepParseBrand('Resultados en 10 minutos para 500 usuarios', 'es');
    expect(result.metrics).toContain('10 minutos');
    expect(result.metrics).toContain('500 usuarios');
  });

  it('extracts features after "con"', () => {
    const result = deepParseBrand('App con dashboard en tiempo real y reportes automáticos', 'es');
    expect(result.features.length).toBeGreaterThanOrEqual(1);
  });

  it('handles English brand descriptions', () => {
    const result = deepParseBrand('Smart platform for developers that automates workflows', 'en');
    expect(result.productName).toBeTruthy();
    expect(result.adjectives).toContain('smart');
  });

  it('preserves original text', () => {
    const text = 'Mi marca especial para todos';
    const result = deepParseBrand(text, 'es');
    expect(result.originalText).toBe(text);
  });
});
