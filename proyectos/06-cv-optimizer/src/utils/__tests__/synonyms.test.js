import { describe, it, expect } from 'vitest';
import { SYNONYM_GROUPS, synonymLookup, areSynonyms, findSynonymGroup } from '../synonyms.js';

describe('SYNONYM_GROUPS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(SYNONYM_GROUPS)).toBe(true);
    expect(SYNONYM_GROUPS.length).toBeGreaterThan(0);
  });

  it('each group has at least 2 entries', () => {
    for (const group of SYNONYM_GROUPS) {
      expect(group.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('has no duplicate entries within a single group', () => {
    for (const group of SYNONYM_GROUPS) {
      const lower = group.map((t) => t.toLowerCase());
      const unique = new Set(lower);
      expect(unique.size).toBe(lower.length);
    }
  });

  it('contains expected programming languages', () => {
    const allTerms = SYNONYM_GROUPS.flat().map((t) => t.toLowerCase());
    expect(allTerms).toContain('javascript');
    expect(allTerms).toContain('python');
    expect(allTerms).toContain('typescript');
    expect(allTerms).toContain('java');
    expect(allTerms).toContain('c++');
    expect(allTerms).toContain('c#');
  });

  it('contains expected frameworks', () => {
    const allTerms = SYNONYM_GROUPS.flat().map((t) => t.toLowerCase());
    expect(allTerms).toContain('react');
    expect(allTerms).toContain('vue');
    expect(allTerms).toContain('angular');
    expect(allTerms).toContain('node');
    expect(allTerms).toContain('django');
  });

  it('contains AI/ML terms', () => {
    const allTerms = SYNONYM_GROUPS.flat().map((t) => t.toLowerCase());
    expect(allTerms).toContain('machine learning');
    expect(allTerms).toContain('deep learning');
    expect(allTerms).toContain('artificial intelligence');
  });
});

describe('synonymLookup', () => {
  it('is a Map with entries', () => {
    expect(synonymLookup).toBeInstanceOf(Map);
    expect(synonymLookup.size).toBeGreaterThan(0);
  });

  it('maps terms to group indices', () => {
    const idx = synonymLookup.get('javascript');
    expect(typeof idx).toBe('number');
    expect(synonymLookup.get('js')).toBe(idx);
    expect(synonymLookup.get('es6')).toBe(idx);
  });

  it('is case-insensitive (all keys lowercase)', () => {
    for (const key of synonymLookup.keys()) {
      expect(key).toBe(key.toLowerCase());
    }
  });
});

describe('areSynonyms', () => {
  it('returns true for identical terms', () => {
    expect(areSynonyms('React', 'react')).toBe(true);
  });

  it('returns true for terms in the same synonym group', () => {
    expect(areSynonyms('javascript', 'js')).toBe(true);
    expect(areSynonyms('JS', 'ecmascript')).toBe(true);
    expect(areSynonyms('python', 'py')).toBe(true);
  });

  it('returns false for terms in different groups', () => {
    expect(areSynonyms('javascript', 'python')).toBe(false);
  });

  it('handles partial substring matching', () => {
    // "la.includes(lb) || lb.includes(la)"
    expect(areSynonyms('react native', 'react')).toBe(true);
  });

  it('returns false for completely unrelated terms', () => {
    expect(areSynonyms('banana', 'airplane')).toBe(false);
  });
});

describe('findSynonymGroup', () => {
  it('returns the group array for a known term', () => {
    const group = findSynonymGroup('js');
    expect(Array.isArray(group)).toBe(true);
    expect(group).toContain('javascript');
    expect(group).toContain('js');
  });

  it('returns null for an unknown term', () => {
    expect(findSynonymGroup('unknownxyz123')).toBeNull();
  });

  it('is case insensitive', () => {
    const g1 = findSynonymGroup('Python');
    const g2 = findSynonymGroup('python');
    expect(g1).toEqual(g2);
    expect(g1).not.toBeNull();
  });
});
