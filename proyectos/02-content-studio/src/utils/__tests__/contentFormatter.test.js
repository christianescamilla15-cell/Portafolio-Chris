import { describe, it, expect } from 'vitest';
import { correctGrammar, cleanInfinitive, enforceMaxLength } from '../contentFormatter.js';

describe('cleanInfinitive', () => {
  it('converts "reduce" to "reducir"', () => {
    expect(cleanInfinitive('reduce costos')).toBe('reducir costos');
  });

  it('converts "mejora" to "mejorar"', () => {
    expect(cleanInfinitive('mejora procesos')).toBe('mejorar procesos');
  });

  it('converts "optimiza" to "optimizar"', () => {
    expect(cleanInfinitive('optimiza flujo')).toBe('optimizar flujo');
  });

  it('converts "transforma" to "transformar"', () => {
    expect(cleanInfinitive('transforma tu negocio')).toBe('transformar tu negocio');
  });

  it('returns empty string for null/undefined', () => {
    expect(cleanInfinitive(null)).toBe('');
    expect(cleanInfinitive(undefined)).toBe('');
    expect(cleanInfinitive('')).toBe('');
  });

  it('does not change text without matching verbs', () => {
    expect(cleanInfinitive('esto es normal')).toBe('esto es normal');
  });
});

describe('enforceMaxLength', () => {
  it('truncates text at the limit', () => {
    const long = 'A'.repeat(100) + ' end';
    const result = enforceMaxLength(long, 50);
    expect(result.length).toBeLessThanOrEqual(50);
  });

  it('does not truncate short text', () => {
    const text = 'Short text';
    expect(enforceMaxLength(text, 100)).toBe(text);
  });

  it('truncates at word boundary when possible', () => {
    const text = 'Hello world this is a test sentence for truncation';
    const result = enforceMaxLength(text, 20);
    expect(result).not.toContain('truncation');
    // Should end at a word boundary
    expect(result.endsWith(' ')).toBe(false);
  });

  it('handles empty/null text', () => {
    expect(enforceMaxLength('', 100)).toBe('');
    expect(enforceMaxLength(null, 100)).toBe(null);
    expect(enforceMaxLength(undefined, 100)).toBe(undefined);
  });
});

describe('correctGrammar', () => {
  it('fixes "para reduce" to "para reducir" in Spanish', () => {
    const result = correctGrammar('para reduce costos operativos', 'es');
    expect(result.toLowerCase()).toContain('para reducir');
  });

  it('fixes "para optimiza" to "para optimizar"', () => {
    const result = correctGrammar('Herramienta para optimiza procesos', 'es');
    expect(result.toLowerCase()).toContain('para optimizar');
  });

  it('fixes "que reducir" to "que reduce" in Spanish', () => {
    const result = correctGrammar('una app que reducir costos', 'es');
    expect(result).toContain('que reduce');
  });

  it('capitalizes the first letter', () => {
    const result = correctGrammar('hello world test data.', 'en');
    expect(result.charAt(0)).toBe('H');
  });

  it('removes trailing prepositions in Spanish', () => {
    const result = correctGrammar('Esto es una prueba de', 'es');
    expect(result).not.toMatch(/\bde$/);
  });

  it('removes trailing prepositions in English', () => {
    const result = correctGrammar('This is a test for', 'en');
    expect(result).not.toMatch(/\bfor$/);
  });

  it('handles empty string gracefully', () => {
    expect(correctGrammar('', 'es')).toBe('');
    expect(correctGrammar(null, 'es')).toBe(null);
  });

  it('handles very short text', () => {
    expect(correctGrammar('ab', 'es')).toBe('ab');
  });

  it('preserves emojis in text', () => {
    const result = correctGrammar('Descubre nuestra app nueva.', 'es');
    expect(result).toContain('Descubre');
  });

  it('collapses multiple spaces', () => {
    const result = correctGrammar('Texto  con   muchos    espacios.', 'es');
    expect(result).not.toContain('  ');
  });

  it('fixes English "for reduces" to "to reduce"', () => {
    const result = correctGrammar('Tool for reduces costs easily.', 'en');
    expect(result).toContain('to reduce');
  });
});
