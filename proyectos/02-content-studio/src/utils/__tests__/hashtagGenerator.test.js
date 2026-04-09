import { describe, it, expect } from 'vitest';
import { generateRelevantHashtags } from '../hashtagGenerator.js';
import { deepParseBrand } from '../brandParser.js';

function makeBrand(text, lang) {
  return deepParseBrand(text, lang);
}

describe('generateRelevantHashtags', () => {
  it('returns an array of hashtags', () => {
    const brand = makeBrand('MiApp plataforma digital para empresas', 'es');
    const tags = generateRelevantHashtags(brand, 'instagram', 'es');
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);
  });

  it('all hashtags start with #', () => {
    const brand = makeBrand('Restaurante gourmet de comida saludable', 'es');
    const tags = generateRelevantHashtags(brand, 'instagram', 'es');
    tags.forEach(tag => {
      expect(tag.startsWith('#')).toBe(true);
    });
  });

  it('includes platform-specific hashtags for instagram', () => {
    const brand = makeBrand('Simple product test', 'en');
    const tags = generateRelevantHashtags(brand, 'instagram', 'en');
    const hasInstaTags = tags.some(t => t === '#InstaPost' || t === '#ContentCreator');
    expect(hasInstaTags).toBe(true);
  });

  it('includes platform-specific hashtags for linkedin', () => {
    const brand = makeBrand('Professional consulting service', 'en');
    const tags = generateRelevantHashtags(brand, 'linkedin', 'en');
    const hasLinkedinTags = tags.some(t => t === '#LinkedInPost' || t === '#Professional');
    expect(hasLinkedinTags).toBe(true);
  });

  it('has no duplicate hashtags', () => {
    const brand = makeBrand('Plataforma innovadora inteligente para profesionales con IA avanzada', 'es');
    const tags = generateRelevantHashtags(brand, 'instagram', 'es');
    const unique = new Set(tags.map(t => t.toLowerCase()));
    expect(unique.size).toBe(tags.length);
  });

  it('returns at most 5 hashtags', () => {
    const brand = makeBrand('Super mega plataforma de tecnología con miles de usuarios', 'es');
    const tags = generateRelevantHashtags(brand, 'instagram', 'es');
    expect(tags.length).toBeLessThanOrEqual(5);
  });

  it('handles brand with no audience or adjectives', () => {
    const brand = makeBrand('Test', 'es');
    const tags = generateRelevantHashtags(brand, 'twitter', 'es');
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);
  });

  it('generates hashtags from product name words', () => {
    const brand = makeBrand('CloudManager platform for teams', 'en');
    const tags = generateRelevantHashtags(brand, 'twitter', 'en');
    const hasProductTag = tags.some(t => t.toLowerCase().includes('cloud'));
    expect(hasProductTag).toBe(true);
  });
});
